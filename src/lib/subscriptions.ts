import "server-only";
import { db } from "@/lib/db";
import { sendExpiringEmail } from "@/lib/lifecycle-emails";
import { notifyAdmins, notifyUser } from "@/lib/notify";

const EXPIRING_WINDOW_MS = 3 * 24 * 60 * 60 * 1000;

/**
 * Housekeeping for active subscriptions: marks lapsed ones Expired and sends one
 * "expiring soon" reminder (customer and admins, plus an email to the customer) three days before the end.
 * Each reminder is claimed once (expiryNotifiedAt), so running it from the cron job and admin pages is safe.
 */
export async function sweepSubscriptions() {
  const now = new Date();
  const lapsed = await db.subscription.findMany({ where: { status: "ACTIVE", currentPeriodEnd: { lt: now } }, select: { id: true, userId: true } });
  for (const s of lapsed) {
    const { count } = await db.subscription.updateMany({ where: { id: s.id, status: "ACTIVE" }, data: { status: "EXPIRED" } });
    if (count) {
      await notifyUser(s.userId, { title: "Subscription expired", body: "Your Apollo Group TV access has ended. Choose a pack to continue watching.", href: "/dashboard/plan" });
      await db.auditLog.create({ data: { actorId: null, action: "subscription.expire", targetType: "Subscription", targetId: s.id } });
    }
  }

  const soon = await db.subscription.findMany({
    where: { status: "ACTIVE", expiryNotifiedAt: null, currentPeriodEnd: { gte: now, lte: new Date(now.getTime() + EXPIRING_WINDOW_MS) } },
    include: { user: { select: { name: true, email: true } }, plan: { select: { name: true, slug: true, isActive: true } } },
  });
  for (const s of soon) {
    const { count } = await db.subscription.updateMany({ where: { id: s.id, expiryNotifiedAt: null }, data: { expiryNotifiedAt: now } });
    if (!count) continue;
    const end = s.currentPeriodEnd!.toDateString();
    await notifyUser(s.userId, { title: "Subscription Expiring Soon", body: `Your ${s.plan.name} ends on ${end}. Add a pack to keep watching without interruption.`, href: "/dashboard/plan" });
    await notifyAdmins({ title: "Subscription Expiring Soon", body: `${s.user.name} (${s.user.email}) · ${s.plan.name} ends ${end}.`, href: `/admin/subscriptions/${s.id}` });
    // Most customers never open the dashboard before their pack ends, so the reminder also goes by email,
    // unless they've already added time (another pack running past this one, or a payment in progress).
    const extended =
      (await db.subscription.count({ where: { userId: s.userId, id: { not: s.id }, currentPeriodEnd: { gt: s.currentPeriodEnd! } } })) +
      (await db.order.count({ where: { userId: s.userId, createdAt: { gt: s.createdAt }, status: { in: ["PAID", "PENDING_CONFIRMATION"] }, subscriptionId: { not: s.id } } }));
    if (!extended) {
      await sendExpiringEmail({ to: s.user.email, name: s.user.name, planName: s.plan.name, planSlug: s.plan.isActive ? s.plan.slug : null, end: s.currentPeriodEnd! }).catch((e) =>
        console.error("[subscriptions] expiring email", e instanceof Error ? e.message : e),
      );
    }
  }
  return { expired: lapsed.length, reminded: soon.length };
}
