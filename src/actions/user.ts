"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { fail, fromZod, handleActionError, success, type ActionState } from "@/lib/action";
import { rateLimit } from "@/lib/rate-limit";
import { assertUser } from "@/lib/session";
import { getSettings } from "@/lib/settings";
import { sendEmail } from "@/lib/email";
import { isValidReferralCode } from "@/lib/referral";
import { preferencesSchema, profileSchema, reviewSchema, ticketReplySchema, ticketSchema } from "@/lib/validators";

export async function submitReview(input: z.input<typeof reviewSchema>): Promise<ActionState> {
  try {
    const user = await assertUser();
    const parsed = reviewSchema.safeParse(input);
    if (!parsed.success) return fromZod(parsed.error);
    if (!(await rateLimit(`review:${user.id}`, 3, 60 * 60 * 24)).ok) {
      return fail("You've reached the daily limit for reviews. Please try again tomorrow.");
    }
    const pending = await db.review.count({ where: { userId: user.id, status: "PENDING" } });
    if (pending > 0) return fail("You already have a review awaiting moderation.");

    // "Verified customer" is derived on the server from real subscription records.
    const hasSubscription = await db.subscription.count({
      where: { userId: user.id, status: { in: ["ACTIVE", "PAST_DUE", "CANCELED", "EXPIRED"] } },
    });
    await db.review.create({ data: { ...parsed.data, userId: user.id, isVerified: hasSubscription > 0 } });

    const settings = await getSettings();
    if (settings.notifications.notifyOnNewReview && settings.notifications.adminEmail) {
      await sendEmail({
        to: settings.notifications.adminEmail,
        subject: "New review awaiting moderation",
        heading: "A new review was submitted",
        body: `Rating: ${parsed.data.rating}/5 — "${parsed.data.title}". Review it in the admin dashboard.`,
      }).catch((e) => console.error("[email]", e.message));
    }
    return success("Thanks! Your review has been submitted and will appear once it's approved.");
  } catch (error) {
    return handleActionError(error);
  }
}

export async function updateProfile(input: z.input<typeof profileSchema>): Promise<ActionState> {
  try {
    const user = await assertUser();
    const parsed = profileSchema.safeParse(input);
    if (!parsed.success) return fromZod(parsed.error);
    await db.user.update({ where: { id: user.id }, data: { name: parsed.data.name } });
    revalidatePath("/dashboard", "layout");
    return success("Profile updated.");
  } catch (error) {
    return handleActionError(error);
  }
}

export async function updatePreferences(input: z.input<typeof preferencesSchema>): Promise<ActionState> {
  try {
    const user = await assertUser();
    const parsed = preferencesSchema.safeParse(input);
    if (!parsed.success) return fromZod(parsed.error);
    await db.user.update({ where: { id: user.id }, data: parsed.data });
    return success("Preferences saved.");
  } catch (error) {
    return handleActionError(error);
  }
}

export async function createTicket(input: z.input<typeof ticketSchema>): Promise<ActionState & { ticketId?: string }> {
  try {
    const user = await assertUser();
    const parsed = ticketSchema.safeParse(input);
    if (!parsed.success) return fromZod(parsed.error);
    if (!(await rateLimit(`ticket:${user.id}`, 5, 60 * 60)).ok) {
      return fail("Too many requests. Please wait a while before opening another ticket.");
    }
    const ticket = await db.supportTicket.create({
      data: {
        userId: user.id,
        subject: parsed.data.subject,
        priority: parsed.data.priority,
        messages: { create: { authorId: user.id, body: parsed.data.message } },
      },
    });
    const settings = await getSettings();
    if (settings.notifications.notifyOnNewTicket && settings.notifications.adminEmail) {
      await sendEmail({
        to: settings.notifications.adminEmail,
        subject: `New support ticket: ${parsed.data.subject}`,
        heading: "A new support ticket was opened",
        body: `Priority: ${parsed.data.priority}. Open the admin dashboard to respond.`,
      }).catch((e) => console.error("[email]", e.message));
    }
    revalidatePath("/dashboard/support");
    return { ...success("Your ticket has been created."), ticketId: ticket.id };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function replyToTicket(input: z.input<typeof ticketReplySchema>): Promise<ActionState> {
  try {
    const user = await assertUser();
    const parsed = ticketReplySchema.safeParse(input);
    if (!parsed.success) return fromZod(parsed.error);
    // Ownership is enforced in the query itself.
    const ticket = await db.supportTicket.findFirst({ where: { id: parsed.data.ticketId, userId: user.id } });
    if (!ticket) return fail("Ticket not found.");
    if (ticket.status === "CLOSED") return fail("This ticket is closed. Please open a new one.");
    if (!(await rateLimit(`reply:${user.id}`, 30, 60 * 60)).ok) return fail("Too many replies. Please slow down.");
    await db.$transaction([
      db.supportMessage.create({ data: { ticketId: ticket.id, authorId: user.id, body: parsed.data.message } }),
      db.supportTicket.update({
        where: { id: ticket.id },
        data: { status: ticket.status === "RESOLVED" || ticket.status === "WAITING_ON_CUSTOMER" ? "OPEN" : ticket.status },
      }),
    ]);
    revalidatePath(`/dashboard/support/${ticket.id}`);
    return success("Reply sent.");
  } catch (error) {
    return handleActionError(error);
  }
}

export async function markNotificationsRead(ids?: string[]): Promise<ActionState> {
  try {
    const user = await assertUser();
    await db.notification.updateMany({
      where: { userId: user.id, readAt: null, ...(ids ? { id: { in: ids.slice(0, 100) } } : {}) },
      data: { readAt: new Date() },
    });
    revalidatePath("/dashboard", "layout");
    return success("Notifications marked as read.");
  } catch (error) {
    return handleActionError(error);
  }
}

/** Lets a new customer record who referred them, if they didn't sign up through the link. */
export async function claimReferralCode(input: { code: string }): Promise<ActionState> {
  try {
    const user = await assertUser();
    const code = String(input?.code ?? "").trim().toUpperCase();
    if (!isValidReferralCode(code)) return fail("That doesn't look like a referral code. Check it and try again.");
    if (!(await rateLimit(`refclaim:${user.id}`, 5, 60 * 60)).ok) return fail("Too many attempts. Please try again later.");
    const [existing, history, referrer] = await Promise.all([
      db.referral.findUnique({ where: { refereeId: user.id } }),
      db.subscription.count({ where: { userId: user.id } }),
      db.user.findUnique({ where: { referralCode: code }, select: { id: true, name: true } }),
    ]);
    if (existing) return fail("A referral is already recorded on your account.");
    // Referrals are for new customers: once a pack has been requested, it's too late to add one.
    if (history > 0) return fail("Referral codes can only be added before your first pack.");
    if (!referrer) return fail("We couldn't find that referral code.");
    if (referrer.id === user.id) return fail("You can't use your own referral code.");
    await db.referral.create({ data: { referrerId: referrer.id, refereeId: user.id } });
    revalidatePath("/dashboard/plan");
    return success(`Thanks! ${referrer.name.split(" ")[0]} is recorded as the friend who referred you.`);
  } catch (error) {
    return handleActionError(error);
  }
}
