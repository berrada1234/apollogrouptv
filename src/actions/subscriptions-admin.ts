"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { auditData } from "@/lib/audit";
import { encryptSecret } from "@/lib/crypto";
import { sendEmail } from "@/lib/email";
import { fail, fromZod, handleActionError, success, type ActionState } from "@/lib/action";
import { accessFields, accessSchema, hasUsableLogin, openAccess, sealAccess, type IptvAccess } from "@/lib/iptv-access";
import { notifyUser } from "@/lib/notify";
import { assertRole } from "@/lib/session";
import { absoluteUrl } from "@/lib/site";
import { parseUsDate } from "@/lib/subscription-status";

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "");

const formSchema = z.object({
  subscriptionId: z.string().min(1).max(64),
  status: z.enum(["ACTIVE", "CANCELED", "EXPIRED", "PENDING"]),
  start: z.string().trim().max(10),
  end: z.string().trim().max(10),
  connectionLimit: z.coerce.number().int().min(1, "At least 1").max(20, "At most 20"),
});

/**
 * Edit Subscription → Save Changes. Activation needs a verified payment (for
 * invoice-based subscriptions), a usable IPTV login and valid dates. The login
 * is stored encrypted and mirrored to the customer's player login.
 */
export async function saveSubscription(_: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const actor = await assertRole("ADMIN");
    const parsed = formSchema.safeParse({
      subscriptionId: str(fd, "subscriptionId"),
      status: str(fd, "status"),
      start: str(fd, "start"),
      end: str(fd, "end"),
      connectionLimit: str(fd, "connectionLimit") || "1",
    });
    if (!parsed.success) return fromZod(parsed.error);
    const accessParsed = accessSchema.safeParse(Object.fromEntries(accessFields.map((k) => [k, str(fd, k)])));
    if (!accessParsed.success) return fromZod(accessParsed.error);
    const access: IptvAccess = accessParsed.data;
    const { subscriptionId, status, connectionLimit } = parsed.data;

    const sub = await db.subscription.findUnique({
      where: { id: subscriptionId },
      include: { order: { select: { status: true, number: true } }, user: { select: { id: true, email: true, name: true } }, plan: { select: { name: true } } },
    });
    if (!sub) return fail("Subscription not found.");

    const start = parsed.data.start ? parseUsDate(parsed.data.start) : null;
    const end = parsed.data.end ? parseUsDate(parsed.data.end) : null;
    const errors: Record<string, string[]> = {};
    if (parsed.data.start && !start) errors.start = ["Use MM/DD/YYYY"];
    if (parsed.data.end && !end) errors.end = ["Use MM/DD/YYYY"];
    if (start && end && end <= start) errors.end = ["Expiry must be after the start date"];

    if (status === "ACTIVE") {
      if (sub.order && sub.order.status !== "PAID") return fail("This subscription's invoice isn't paid yet. Confirm the payment in Orders & Payments before activating.");
      if (!parsed.data.start) errors.start = ["Required to activate"];
      if (!parsed.data.end) errors.end = ["Required to activate"];
      else if (end && end < new Date()) errors.end = ["An active subscription can't already be expired"];
      if (!hasUsableLogin(access)) {
        return fail("Add the customer's IPTV login before activating: an Xtream server, username and password, an M3U or MAG URL, or an IPTV username and password.", {
          xtreamServer: ["Add at least one complete login"],
        });
      }
    }
    if (Object.keys(errors).length) return fail("Please correct the highlighted fields.", errors);

    const hasAccess = accessFields.some((k) => access[k]);
    const previous = openAccess(sub.accessEnc);
    const becameActive = status === "ACTIVE" && sub.status !== "ACTIVE";
    const endChanged = (end?.getTime() ?? null) !== (sub.currentPeriodEnd?.getTime() ?? null);

    await db.$transaction(async (tx) => {
      await tx.subscription.update({
        where: { id: sub.id },
        data: {
          status,
          currentPeriodStart: start,
          currentPeriodEnd: end,
          connectionLimit,
          accessEnc: hasAccess ? sealAccess(access) : null,
          ...(becameActive ? { activatedAt: new Date() } : {}),
          ...(endChanged ? { expiryNotifiedAt: null } : {}),
        },
      });
      // The player login on My Accounts and Apps & Guides follows the active subscription.
      if (status === "ACTIVE" && access.xtreamUsername && access.xtreamPassword) {
        const data = {
          username: access.xtreamUsername,
          passwordEnc: encryptSecret(access.xtreamPassword),
          serverUrl: access.xtreamServer || null,
          m3uUrlEnc: access.m3uUrl ? encryptSecret(access.m3uUrl) : null,
          updatedById: actor.id,
        };
        await tx.playerCredential.upsert({ where: { userId: sub.userId }, create: { userId: sub.userId, ...data }, update: data });
      }
      await tx.auditLog.create({
        data: await auditData({
          actorId: actor.id,
          action: becameActive ? "subscription.activate" : "subscription.update",
          targetType: "Subscription",
          targetId: sub.id,
          metadata: {
            invoice: sub.order?.number ?? null,
            from: sub.status,
            to: status,
            start: start?.toISOString() ?? null,
            end: end?.toISOString() ?? null,
            connectionLimit,
            // Which login fields changed, never their values.
            accessChanged: accessFields.filter((k) => (previous?.[k] ?? "") !== access[k]),
          },
        }),
      });
      if (becameActive) {
        await notifyUser(
          sub.userId,
          {
            title: "🎉 Congratulations! Your Apollo Group TV Account Is Activated!",
            body: "Your subscription has been successfully activated. Your account details are now available in your dashboard.",
            href: "/dashboard/subscription",
          },
          tx,
        );
      } else if (status !== sub.status && status === "CANCELED") {
        await notifyUser(sub.userId, { title: "Subscription Cancelled", body: `Your ${sub.plan.name} has been cancelled. Contact support if you have questions.`, href: "/dashboard/subscription" }, tx);
      } else if (status !== sub.status && status === "EXPIRED") {
        await notifyUser(sub.userId, { title: "Subscription expired", body: `Your ${sub.plan.name} has ended. Choose a pack to continue watching.`, href: "/dashboard/plan" }, tx);
      }
    });

    if (becameActive) {
      // The email only points to the dashboard; login details are never sent by email.
      await sendEmail({
        to: sub.user.email,
        subject: "Your Apollo Group TV account is activated",
        heading: "Congratulations! Your account is activated",
        body: "Your subscription has been successfully activated. Sign in to your dashboard to see your account details.",
        cta: { label: "Open My Subscription", url: absoluteUrl("/dashboard/subscription") },
      }).catch((e) => console.error("[subscriptions] activation email", e instanceof Error ? e.message : e));
    }

    revalidatePath("/admin/subscriptions");
    revalidatePath(`/admin/subscriptions/${sub.id}`);
    revalidatePath("/dashboard", "layout");
    return success(becameActive ? "Subscription activated. The customer has been notified." : "Changes saved.");
  } catch (e) {
    return handleActionError(e);
  }
}

/** Admin bell: mark admin notifications read. */
export async function markAdminNotificationsRead(): Promise<ActionState> {
  try {
    const actor = await assertRole("ADMIN");
    await db.notification.updateMany({ where: { userId: actor.id, audience: "ADMIN", readAt: null }, data: { readAt: new Date() } });
    revalidatePath("/admin", "layout");
    return success("All notifications marked as read.");
  } catch (e) {
    return handleActionError(e);
  }
}
