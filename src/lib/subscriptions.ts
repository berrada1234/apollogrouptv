import "server-only";
import { db } from "@/lib/db";
import { notifyAdmins, notifyUser } from "@/lib/notify";

const EXPIRING_WINDOW_MS = 3 * 24 * 60 * 60 * 1000;

/**
 * Housekeeping for active subscriptions: marks lapsed ones Expired and sends one
 * "expiring soon" reminder (customer and admins) three days before the end.
 * Database-only, so it is cheap to run from the cron job and admin pages.
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
    include: { user: { select: { name: true, email: true } }, plan: { select: { name: true } } },
  });
  for (const s of soon) {
    const { count } = await db.subscription.updateMany({ where: { id: s.id, expiryNotifiedAt: null }, data: { expiryNotifiedAt: now } });
    if (!count) continue;
    const end = s.currentPeriodEnd!.toDateString();
    await notifyUser(s.userId, { title: "Subscription Expiring Soon", body: `Your ${s.plan.name} ends on ${end}. Add a pack to keep watching without interruption.`, href: "/dashboard/plan" });
    await notifyAdmins({ title: "Subscription Expiring Soon", body: `${s.user.name} (${s.user.email}) · ${s.plan.name} ends ${end}.`, href: `/admin/subscriptions/${s.id}` });
  }
  return { expired: lapsed.length, reminded: soon.length };
}
