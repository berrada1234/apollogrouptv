"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { audit, auditData } from "@/lib/audit";
import {
  fail,
  fromZod,
  handleActionError,
  success,
  type ActionState,
} from "@/lib/action";
import { assertRole } from "@/lib/session";
import { sendEmail } from "@/lib/email";
import { settingsSchemas, type SettingsKey } from "@/lib/settings";
import { absoluteUrl } from "@/lib/site";
import { encryptSecret } from "@/lib/crypto";
import {
  categorySchema,
  channelSchema,
  faqSchema,
  planSchema,
  roleSchema,
  ticketStatusSchema,
} from "@/lib/validators";

const id = z.string().min(1).max(64);
const str = (fd: FormData, key: string) => String(fd.get(key) ?? "");

// ─── Users ──────────────────────────────────────────────────────────────────

export async function updateUserName(
  _: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    const actor = await assertRole("ADMIN");
    const parsed = z
      .object({ userId: id, name: z.string().trim().min(2).max(120) })
      .safeParse({ userId: str(fd, "userId"), name: str(fd, "name") });
    if (!parsed.success) return fromZod(parsed.error);
    await db.user.update({
      where: { id: parsed.data.userId },
      data: { name: parsed.data.name },
    });
    await audit({
      actorId: actor.id,
      action: "user.update_name",
      targetType: "User",
      targetId: parsed.data.userId,
    });
    revalidatePath(`/admin/users/${parsed.data.userId}`);
    return success("User updated.");
  } catch (e) {
    return handleActionError(e);
  }
}

export async function setUserRole(
  _: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    const actor = await assertRole("ADMIN");
    const parsed = z
      .object({ userId: id, role: roleSchema })
      .safeParse({ userId: str(fd, "userId"), role: str(fd, "role") });
    if (!parsed.success) return fromZod(parsed.error);
    const { userId, role } = parsed.data;
    if (userId === actor.id) return fail("You cannot change your own role.");
    const target = await db.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    if (!target) return fail("User not found.");
    if (target.role === "ADMIN" && role !== "ADMIN") {
      const admins = await db.user.count({
        where: { role: "ADMIN", status: "ACTIVE" },
      });
      if (admins <= 1)
        return fail("At least one active administrator is required.");
    }
    const log = await auditData({
      actorId: actor.id,
      action: "user.role_change",
      targetType: "User",
      targetId: userId,
      metadata: { from: target.role, to: role },
    });
    await db.$transaction([
      db.user.update({ where: { id: userId }, data: { role } }),
      db.auditLog.create({ data: log }),
    ]);
    revalidatePath(`/admin/users/${userId}`);
    return success(`Role changed to ${role}.`);
  } catch (e) {
    return handleActionError(e);
  }
}

export async function setUserStatus(
  _: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    const actor = await assertRole("ADMIN");
    const parsed = z
      .object({
        userId: id,
        status: z.enum(["ACTIVE", "SUSPENDED"]),
        reason: z.string().trim().max(300).optional(),
      })
      .safeParse({
        userId: str(fd, "userId"),
        status: str(fd, "status"),
        reason: str(fd, "reason") || undefined,
      });
    if (!parsed.success) return fromZod(parsed.error);
    const { userId, status, reason } = parsed.data;
    if (userId === actor.id)
      return fail("You cannot suspend your own account.");
    const log = await auditData({
      actorId: actor.id,
      action: status === "SUSPENDED" ? "user.suspend" : "user.reactivate",
      targetType: "User",
      targetId: userId,
      metadata: reason ? { reason } : undefined,
    });
    await db.$transaction(async (tx) => {
      await tx.user.update({ where: { id: userId }, data: { status } });
      // Suspension takes effect immediately: drop every active session.
      if (status === "SUSPENDED")
        await tx.session.deleteMany({ where: { userId } });
      await tx.auditLog.create({ data: log });
    });
    revalidatePath(`/admin/users/${userId}`);
    return success(
      status === "SUSPENDED"
        ? "Account suspended and signed out."
        : "Account reactivated.",
    );
  } catch (e) {
    return handleActionError(e);
  }
}

// ─── Player credentials ────────────────────────────────────────────────────

const optionalUrl = z.union([
  z.literal(""),
  z.url({ protocol: /^https?$/ }).max(255),
]);

/** Issue or update a customer's third-party player login. A blank password keeps the stored one. */
export async function savePlayerCredentials(
  _: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    const actor = await assertRole("ADMIN");
    const parsed = z
      .object({
        userId: id,
        username: z.string().trim().min(1, "Enter a username.").max(120),
        password: z.string().trim().max(200),
        serverUrl: optionalUrl,
        // M3U links can be long (query strings), so they get their own length limit.
        m3uUrl: z.union([
          z.literal(""),
          z.url({ protocol: /^https?$/ }).max(1000),
        ]),
      })
      .safeParse({
        userId: str(fd, "userId"),
        username: str(fd, "username"),
        password: str(fd, "password"),
        serverUrl: str(fd, "serverUrl").trim(),
        m3uUrl: str(fd, "m3uUrl").trim(),
      });
    if (!parsed.success) return fromZod(parsed.error);
    const { userId, username, password, serverUrl, m3uUrl } = parsed.data;
    const [target, existing] = await Promise.all([
      db.user.findUnique({ where: { id: userId }, select: { id: true } }),
      db.playerCredential.findUnique({ where: { userId } }),
    ]);
    if (!target) return fail("User not found.");
    if (!existing && !password)
      return fail("Enter a password for the new login.");

    const data = {
      username,
      serverUrl: serverUrl || null,
      m3uUrlEnc: m3uUrl ? encryptSecret(m3uUrl) : null,
      updatedById: actor.id,
      ...(password ? { passwordEnc: encryptSecret(password) } : {}),
    };
    // Secrets never reach the audit log — only which fields changed.
    const log = await auditData({
      actorId: actor.id,
      action: existing
        ? "player_credentials.update"
        : "player_credentials.create",
      targetType: "User",
      targetId: userId,
      metadata: {
        username,
        serverUrl: serverUrl || null,
        m3uLink: Boolean(m3uUrl),
        passwordChanged: Boolean(password),
      },
    });
    await db.$transaction([
      db.playerCredential.upsert({
        where: { userId },
        create: {
          userId,
          ...data,
          passwordEnc: data.passwordEnc ?? encryptSecret(password),
        },
        update: data,
      }),
      db.notification.create({
        data: {
          userId,
          title: "Your player login is ready",
          body: "Your username, password and server details are in My Accounts.",
          href: "/dashboard/profile",
        },
      }),
      db.auditLog.create({ data: log }),
    ]);
    revalidatePath(`/admin/users/${userId}`);
    return success(existing ? "Player login updated." : "Player login issued.");
  } catch (e) {
    return handleActionError(e);
  }
}

export async function clearPlayerCredentials(
  _: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    const actor = await assertRole("ADMIN");
    const parsed = z
      .object({ userId: id })
      .safeParse({ userId: str(fd, "userId") });
    if (!parsed.success) return fromZod(parsed.error);
    const log = await auditData({
      actorId: actor.id,
      action: "player_credentials.remove",
      targetType: "User",
      targetId: parsed.data.userId,
    });
    await db.$transaction([
      db.playerCredential.deleteMany({ where: { userId: parsed.data.userId } }),
      db.auditLog.create({ data: log }),
    ]);
    revalidatePath(`/admin/users/${parsed.data.userId}`);
    return success("Player login removed.");
  } catch (e) {
    return handleActionError(e);
  }
}

// ─── Plans ──────────────────────────────────────────────────────────────────

export async function savePlan(
  _: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    const actor = await assertRole("ADMIN");
    const parsed = planSchema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) return fromZod(parsed.error);
    const { id: planId, price, features, ...rest } = parsed.data;
    const data = {
      ...rest,
      priceCents: Math.round(price * 100),
      features: features as Prisma.InputJsonValue,
    };
    const plan = planId
      ? await db.plan.update({ where: { id: planId }, data })
      : await db.plan.create({ data });
    await audit({
      actorId: actor.id,
      action: planId ? "plan.update" : "plan.create",
      targetType: "Plan",
      targetId: plan.id,
      metadata: {
        name: plan.name,
        priceCents: plan.priceCents,
        isActive: plan.isActive,
      },
    });
    revalidatePath("/admin/plans");
    revalidatePath("/plans");
    return success(planId ? "Plan saved." : "Plan created.");
  } catch (e) {
    return handleActionError(e);
  }
}

export async function togglePlan(
  _: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    const actor = await assertRole("ADMIN");
    const planId = id.parse(str(fd, "id"));
    const plan = await db.plan.findUniqueOrThrow({ where: { id: planId } });
    await db.plan.update({
      where: { id: planId },
      data: { isActive: !plan.isActive },
    });
    await audit({
      actorId: actor.id,
      action: plan.isActive ? "plan.deactivate" : "plan.activate",
      targetType: "Plan",
      targetId: planId,
    });
    revalidatePath("/admin/plans");
    return success(plan.isActive ? "Plan deactivated." : "Plan activated.");
  } catch (e) {
    return handleActionError(e);
  }
}

// ─── Subscriptions (manual activation while no payment provider is wired) ───

export async function grantSubscription(
  _: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    const actor = await assertRole("ADMIN");
    const parsed = z
      .object({
        userId: id,
        planId: id,
        start: z.coerce.date(),
        end: z.coerce.date(),
      })
      .refine((d) => d.end > d.start, {
        path: ["end"],
        message: "End date must be after the start date.",
      })
      .safeParse({
        userId: str(fd, "userId"),
        planId: str(fd, "planId"),
        start: str(fd, "start"),
        end: str(fd, "end"),
      });
    if (!parsed.success) return fromZod(parsed.error);
    const { userId, planId, start, end } = parsed.data;
    const sub = await db.subscription.create({
      data: {
        userId,
        planId,
        status: "ACTIVE",
        currentPeriodStart: start,
        currentPeriodEnd: end,
      },
      include: { plan: { select: { name: true } } },
    });
    await db.notification.create({
      data: {
        userId,
        title: `${sub.plan.name} is now active`,
        body: `Your subscription runs until ${end.toDateString()}.`,
        href: "/dashboard/subscription",
      },
    });
    await audit({
      actorId: actor.id,
      action: "subscription.grant",
      targetType: "Subscription",
      targetId: sub.id,
      metadata: { userId, planId, start, end },
    });
    revalidatePath(`/admin/users/${userId}`);
    return success("Subscription activated.");
  } catch (e) {
    return handleActionError(e);
  }
}

export async function setSubscriptionStatus(
  _: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    const actor = await assertRole("ADMIN");
    const parsed = z
      .object({
        subscriptionId: id,
        status: z.enum([
          "PENDING",
          "ACTIVE",
          "PAST_DUE",
          "CANCELED",
          "EXPIRED",
        ]),
      })
      .safeParse({
        subscriptionId: str(fd, "subscriptionId"),
        status: str(fd, "status"),
      });
    if (!parsed.success) return fromZod(parsed.error);
    const sub = await db.subscription.findUniqueOrThrow({
      where: { id: parsed.data.subscriptionId },
    });
    // Provider-managed subscriptions may only change through verified webhooks.
    if (sub.providerSubscriptionId)
      return fail(
        "This subscription is managed by the payment provider and can't be edited here.",
      );
    await db.subscription.update({
      where: { id: sub.id },
      data: { status: parsed.data.status },
    });
    await audit({
      actorId: actor.id,
      action: "subscription.status_change",
      targetType: "Subscription",
      targetId: sub.id,
      metadata: { from: sub.status, to: parsed.data.status },
    });
    revalidatePath("/admin/subscriptions");
    revalidatePath(`/admin/users/${sub.userId}`);
    return success("Subscription updated.");
  } catch (e) {
    return handleActionError(e);
  }
}

// ─── Channels ───────────────────────────────────────────────────────────────

export async function saveChannel(
  _: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    const actor = await assertRole("ADMIN");
    const parsed = channelSchema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) return fromZod(parsed.error);
    const {
      id: channelId,
      logoUrl,
      description,
      country,
      language,
      ...rest
    } = parsed.data;
    const data = {
      ...rest,
      logoUrl: logoUrl || null,
      description: description || null,
      country: country || null,
      language: language || null,
    };
    const ch = channelId
      ? await db.channel.update({ where: { id: channelId }, data })
      : await db.channel.create({ data });
    await audit({
      actorId: actor.id,
      action: channelId ? "channel.update" : "channel.create",
      targetType: "Channel",
      targetId: ch.id,
      metadata: { name: ch.name },
    });
    revalidatePath("/admin/channels");
    revalidatePath("/channels");
    return success(channelId ? "Channel saved." : "Channel added.");
  } catch (e) {
    return handleActionError(e);
  }
}

export async function toggleChannel(
  _: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    await assertRole("ADMIN");
    const channelId = id.parse(str(fd, "id"));
    const ch = await db.channel.findUniqueOrThrow({ where: { id: channelId } });
    await db.channel.update({
      where: { id: channelId },
      data: { isActive: !ch.isActive },
    });
    revalidatePath("/admin/channels");
    return success(
      ch.isActive ? "Channel hidden from the catalog." : "Channel published.",
    );
  } catch (e) {
    return handleActionError(e);
  }
}

export async function saveCategory(
  _: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    await assertRole("ADMIN");
    const parsed = categorySchema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) return fromZod(parsed.error);
    const { id: catId, ...data } = parsed.data;
    if (catId) await db.channelCategory.update({ where: { id: catId }, data });
    else await db.channelCategory.create({ data });
    revalidatePath("/admin/channels/categories");
    return success(catId ? "Category saved." : "Category created.");
  } catch (e) {
    return handleActionError(e);
  }
}

export async function deleteCategory(
  _: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    await assertRole("ADMIN");
    const catId = id.parse(str(fd, "id"));
    const count = await db.channel.count({ where: { categoryId: catId } });
    if (count > 0)
      return fail("Move or delete this category's channels first.");
    await db.channelCategory.delete({ where: { id: catId } });
    revalidatePath("/admin/channels/categories");
    return success("Category deleted.");
  } catch (e) {
    return handleActionError(e);
  }
}

// ─── Reviews ────────────────────────────────────────────────────────────────

export async function moderateReview(
  _: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    const actor = await assertRole("SUPPORT");
    const parsed = z
      .object({
        reviewId: id,
        decision: z.enum(["APPROVED", "REJECTED", "PENDING"]),
      })
      .safeParse({
        reviewId: str(fd, "reviewId"),
        decision: str(fd, "decision"),
      });
    if (!parsed.success) return fromZod(parsed.error);
    await db.review.update({
      where: { id: parsed.data.reviewId },
      data: { status: parsed.data.decision, moderatedAt: new Date() },
    });
    await audit({
      actorId: actor.id,
      action: `review.${parsed.data.decision.toLowerCase()}`,
      targetType: "Review",
      targetId: parsed.data.reviewId,
    });
    revalidatePath("/admin/reviews");
    revalidatePath("/reviews");
    return success("Review updated.");
  } catch (e) {
    return handleActionError(e);
  }
}

export async function setReviewVerified(
  _: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    const actor = await assertRole("SUPPORT");
    const reviewId = id.parse(str(fd, "reviewId"));
    const verified = str(fd, "verified") === "true";
    const review = await db.review.findUniqueOrThrow({
      where: { id: reviewId },
    });
    if (verified) {
      // Verification criterion: the reviewer has (or had) a subscription on record.
      const subs = await db.subscription.count({
        where: { userId: review.userId, status: { not: "PENDING" } },
      });
      if (subs === 0)
        return fail(
          "This reviewer has no subscription on record, so the review can't be marked verified.",
        );
    }
    await db.review.update({
      where: { id: reviewId },
      data: { isVerified: verified },
    });
    await audit({
      actorId: actor.id,
      action: verified ? "review.verify" : "review.unverify",
      targetType: "Review",
      targetId: reviewId,
    });
    revalidatePath("/admin/reviews");
    return success(verified ? "Marked as verified." : "Verification removed.");
  } catch (e) {
    return handleActionError(e);
  }
}

// ─── FAQ ────────────────────────────────────────────────────────────────────

export async function saveFaq(
  _: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    await assertRole("ADMIN");
    const parsed = faqSchema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) return fromZod(parsed.error);
    const { id: faqId, ...data } = parsed.data;
    if (faqId) await db.faq.update({ where: { id: faqId }, data });
    else await db.faq.create({ data });
    revalidatePath("/admin/faq");
    revalidatePath("/faq");
    return success(faqId ? "FAQ saved." : "FAQ added.");
  } catch (e) {
    return handleActionError(e);
  }
}

export async function moveFaq(
  _: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    await assertRole("ADMIN");
    const faqId = id.parse(str(fd, "id"));
    const direction = str(fd, "direction") === "up" ? "up" : "down";
    const faq = await db.faq.findUniqueOrThrow({ where: { id: faqId } });
    const siblings = await db.faq.findMany({
      where: { category: faq.category },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    const index = siblings.findIndex((f) => f.id === faqId);
    const swapWith = siblings[direction === "up" ? index - 1 : index + 1];
    if (!swapWith) return success("Already at the edge.");
    // Re-number the whole category so ordering stays stable even with duplicate sortOrder values.
    const reordered = [...siblings];
    [reordered[index], reordered[direction === "up" ? index - 1 : index + 1]] =
      [swapWith, faq];
    await db.$transaction(
      reordered.map((f, i) =>
        db.faq.update({ where: { id: f.id }, data: { sortOrder: i } }),
      ),
    );
    revalidatePath("/admin/faq");
    return success("Order updated.");
  } catch (e) {
    return handleActionError(e);
  }
}

export async function toggleFaq(
  _: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    await assertRole("ADMIN");
    const faqId = id.parse(str(fd, "id"));
    const faq = await db.faq.findUniqueOrThrow({ where: { id: faqId } });
    await db.faq.update({
      where: { id: faqId },
      data: { isPublished: !faq.isPublished },
    });
    revalidatePath("/admin/faq");
    return success(faq.isPublished ? "Unpublished." : "Published.");
  } catch (e) {
    return handleActionError(e);
  }
}

export async function deleteFaq(
  _: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    const actor = await assertRole("ADMIN");
    const faqId = id.parse(str(fd, "id"));
    await db.faq.delete({ where: { id: faqId } });
    await audit({
      actorId: actor.id,
      action: "faq.delete",
      targetType: "Faq",
      targetId: faqId,
    });
    revalidatePath("/admin/faq");
    return success("FAQ deleted.");
  } catch (e) {
    return handleActionError(e);
  }
}

// ─── Referrals ──────────────────────────────────────────────────────────────

export async function setReferralStatus(
  _: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    const actor = await assertRole("ADMIN");
    const parsed = z
      .object({
        referralId: id,
        status: z.enum(["PENDING", "QUALIFIED", "REJECTED"]),
      })
      .safeParse({
        referralId: str(fd, "referralId"),
        status: str(fd, "status"),
      });
    if (!parsed.success) return fromZod(parsed.error);
    const referral = await db.referral.findUniqueOrThrow({
      where: { id: parsed.data.referralId },
    });
    if (parsed.data.status === "QUALIFIED") {
      // Eligibility is checked on the server: the referred friend must have a live subscription.
      const active = await db.subscription.count({
        where: { userId: referral.refereeId, status: "ACTIVE" },
      });
      if (active === 0)
        return fail(
          "The referred user has no active subscription yet, so the referral can't qualify.",
        );
    }
    await db.referral.update({
      where: { id: referral.id },
      data: {
        status: parsed.data.status,
        qualifiedAt: parsed.data.status === "QUALIFIED" ? new Date() : null,
      },
    });
    await audit({
      actorId: actor.id,
      action: "referral.status_change",
      targetType: "Referral",
      targetId: referral.id,
      metadata: { to: parsed.data.status },
    });
    revalidatePath("/admin/referrals");
    return success("Referral updated.");
  } catch (e) {
    return handleActionError(e);
  }
}

export async function issueReferralReward(
  _: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    const actor = await assertRole("ADMIN");
    const parsed = z
      .object({
        referralId: id,
        description: z.string().trim().min(3).max(255),
      })
      .safeParse({
        referralId: str(fd, "referralId"),
        description: str(fd, "description"),
      });
    if (!parsed.success) return fromZod(parsed.error);
    const settings = await db.siteSetting.findUnique({
      where: { key: "referral" },
    });
    if (!(settings?.value as { enabled?: boolean } | null)?.enabled) {
      return fail(
        "Enable the referral program in Settings before issuing rewards.",
      );
    }
    const referral = await db.referral.findUniqueOrThrow({
      where: { id: parsed.data.referralId },
    });
    if (referral.status !== "QUALIFIED")
      return fail("Only qualified referrals can receive a reward.");
    await db.$transaction([
      db.referralReward.create({
        data: {
          referralId: referral.id,
          userId: referral.referrerId,
          description: parsed.data.description,
          status: "APPROVED",
        },
      }),
      db.referral.update({
        where: { id: referral.id },
        data: { status: "REWARDED" },
      }),
      db.notification.create({
        data: {
          userId: referral.referrerId,
          title: "You earned a referral reward",
          body: parsed.data.description,
          href: "/dashboard/referrals",
        },
      }),
    ]);
    await audit({
      actorId: actor.id,
      action: "referral.reward",
      targetType: "Referral",
      targetId: referral.id,
      metadata: { description: parsed.data.description },
    });
    revalidatePath("/admin/referrals");
    return success("Reward recorded.");
  } catch (e) {
    return handleActionError(e);
  }
}

// ─── Support ────────────────────────────────────────────────────────────────

export async function staffReply(
  _: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    const actor = await assertRole("SUPPORT");
    const parsed = z
      .object({
        ticketId: id,
        message: z.string().trim().min(2).max(5000),
        status: ticketStatusSchema,
      })
      .safeParse({
        ticketId: str(fd, "ticketId"),
        message: str(fd, "message"),
        status: str(fd, "status") || "WAITING_ON_CUSTOMER",
      });
    if (!parsed.success) return fromZod(parsed.error);
    const ticket = await db.supportTicket.findUnique({
      where: { id: parsed.data.ticketId },
      include: { user: { select: { email: true } } },
    });
    if (!ticket) return fail("Ticket not found.");
    const log = await auditData({
      actorId: actor.id,
      action: "ticket.reply",
      targetType: "SupportTicket",
      targetId: ticket.id,
      metadata: { status: { from: ticket.status, to: parsed.data.status } },
    });
    await db.$transaction([
      db.supportMessage.create({
        data: {
          ticketId: ticket.id,
          authorId: actor.id,
          body: parsed.data.message,
          isStaff: true,
        },
      }),
      db.supportTicket.update({
        where: { id: ticket.id },
        data: {
          status: parsed.data.status,
          assigneeId: ticket.assigneeId ?? actor.id,
          resolvedAt: parsed.data.status === "RESOLVED" ? new Date() : null,
        },
      }),
      db.notification.create({
        data: {
          userId: ticket.userId,
          title: `New reply: ${ticket.subject}`,
          body: "Our support team replied to your ticket.",
          href: `/dashboard/support/${ticket.id}`,
        },
      }),
      db.auditLog.create({ data: log }),
    ]);
    await sendEmail({
      to: ticket.user.email,
      subject: `Re: ${ticket.subject}`,
      heading: "Support replied to your ticket",
      body: "There's a new reply on your support ticket. Sign in to read it and respond.",
      cta: {
        label: "View ticket",
        url: absoluteUrl(`/dashboard/support/${ticket.id}`),
      },
    }).catch((err) => console.error("[email]", err.message));
    revalidatePath(`/admin/support/${ticket.id}`);
    return success("Reply sent.");
  } catch (e) {
    return handleActionError(e);
  }
}

export async function updateTicket(
  _: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    const actor = await assertRole("SUPPORT");
    const parsed = z
      .object({
        ticketId: id,
        status: ticketStatusSchema,
        priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]),
        assigneeId: z.string().max(64),
      })
      .safeParse({
        ticketId: str(fd, "ticketId"),
        status: str(fd, "status"),
        priority: str(fd, "priority"),
        assigneeId: str(fd, "assigneeId"),
      });
    if (!parsed.success) return fromZod(parsed.error);
    const { ticketId, status, priority, assigneeId } = parsed.data;
    if (assigneeId) {
      const assignee = await db.user.findUnique({
        where: { id: assigneeId },
        select: { role: true },
      });
      if (!assignee || assignee.role === "USER")
        return fail("Tickets can only be assigned to staff members.");
    }
    const before = await db.supportTicket.findUnique({
      where: { id: ticketId },
      select: { status: true, priority: true, assigneeId: true },
    });
    if (!before) return fail("Ticket not found.");
    const changes: Record<string, { from: string | null; to: string | null }> =
      {};
    if (before.status !== status)
      changes.status = { from: before.status, to: status };
    if (before.priority !== priority)
      changes.priority = { from: before.priority, to: priority };
    if ((before.assigneeId ?? null) !== (assigneeId || null))
      changes.assignee = { from: before.assigneeId, to: assigneeId || null };
    if (Object.keys(changes).length === 0) return success("Nothing to update.");
    const log = await auditData({
      actorId: actor.id,
      action: "ticket.update",
      targetType: "SupportTicket",
      targetId: ticketId,
      metadata: changes,
    });
    await db.$transaction([
      db.supportTicket.update({
        where: { id: ticketId },
        data: {
          status,
          priority,
          assigneeId: assigneeId || null,
          resolvedAt:
            status === "RESOLVED" || status === "CLOSED" ? new Date() : null,
        },
      }),
      db.auditLog.create({ data: log }),
    ]);
    revalidatePath(`/admin/support/${ticketId}`);
    return success("Ticket updated.");
  } catch (e) {
    return handleActionError(e);
  }
}

// ─── Settings ───────────────────────────────────────────────────────────────

function settingsInput(key: SettingsKey, fd: FormData): unknown {
  const bool = (k: string) => fd.get(k) === "on";
  switch (key) {
    case "referral":
      return {
        enabled: bool("enabled"),
        rewardDescription: str(fd, "rewardDescription"),
        qualifyingRule: str(fd, "qualifyingRule"),
      };
    case "notifications":
      return {
        adminEmail: str(fd, "adminEmail"),
        notifyOnNewTicket: bool("notifyOnNewTicket"),
        notifyOnNewReview: bool("notifyOnNewReview"),
      };
    case "legal":
      return {
        approved: bool("approved"),
        ...Object.fromEntries(
          [
            "lastUpdated",
            "entityName",
            "entityAddress",
            "governingLaw",
            "officialDomain",
            "refundTerms",
            "dmcaAgentName",
            "dmcaAgentEmail",
            "dmcaAgentAddress",
            "appDataPractices",
            "hostingRegion",
          ].map((k) => [k, str(fd, k).trim()]),
        ),
      };
    case "apps": {
      const names = fd.getAll("name").map(String);
      const at = (k: string, i: number) => String(fd.getAll(k)[i] ?? "").trim();
      return {
        appVersion: str(fd, "appVersion").trim(),
        appTagline: str(fd, "appTagline").trim(),
        releaseNotes: str(fd, "releaseNotes").trim(),
        stats: str(fd, "stats").trim(),
        qrUrl: str(fd, "qrUrl").trim(),
        players: str(fd, "players").trim(),
        playersNote: str(fd, "playersNote").trim(),
        platforms: names
          .map((name, i) => ({
            name: name.trim(),
            verified: fd.getAll("verified").map(String).includes(String(i)),
            downloadUrl: at("downloadUrl", i),
            instructions: String(fd.getAll("instructions")[i] ?? ""),
            method: at("method", i),
            downloadLabel: at("downloadLabel", i),
            copyItems: String(fd.getAll("copyItems")[i] ?? "").trim(),
          }))
          .filter((p) => p.name),
      };
    }
    default: {
      const entries = Object.fromEntries(
        [...fd.entries()].filter(
          ([k]) => !k.startsWith("$") && k !== "settingsKey",
        ),
      );
      return Object.fromEntries(
        Object.entries(entries).map(([k, v]) => [k, String(v).trim()]),
      );
    }
  }
}

export async function saveSettings(
  _: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    const actor = await assertRole("ADMIN");
    const key = str(fd, "settingsKey") as SettingsKey;
    if (!(key in settingsSchemas)) return fail("Unknown settings section.");
    const parsed = settingsSchemas[key].safeParse(settingsInput(key, fd));
    if (!parsed.success) return fromZod(parsed.error);
    const value = parsed.data as Prisma.InputJsonValue;
    await db.siteSetting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
    await audit({
      actorId: actor.id,
      action: "settings.update",
      targetType: "SiteSetting",
      targetId: key,
      metadata: { section: key },
    });
    revalidatePath("/", "layout");
    return success("Settings saved.");
  } catch (e) {
    return handleActionError(e);
  }
}

// ─── Contact messages ───────────────────────────────────────────────────────

export async function setContactStatus(
  _: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    await assertRole("SUPPORT");
    const parsed = z
      .object({ messageId: id, status: z.enum(["NEW", "READ", "ARCHIVED"]) })
      .safeParse({
        messageId: str(fd, "messageId"),
        status: str(fd, "status"),
      });
    if (!parsed.success) return fromZod(parsed.error);
    await db.contactMessage.update({
      where: { id: parsed.data.messageId },
      data: { status: parsed.data.status },
    });
    revalidatePath("/admin/messages");
    return success(
      parsed.data.status === "ARCHIVED"
        ? "Archived."
        : parsed.data.status === "READ"
          ? "Marked as read."
          : "Marked as new.",
    );
  } catch (e) {
    return handleActionError(e);
  }
}
