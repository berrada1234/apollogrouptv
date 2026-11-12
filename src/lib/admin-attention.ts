import "server-only";
import { db } from "@/lib/db";

export const SIGNUP_ALERT_TITLE = "New Customer Registration";

/** Work waiting on staff, shown as sidebar badges and polled by the admin pages. */
export async function adminAttention(userId: string, isAdmin: boolean) {
  const [openTickets, pendingReviews, newMessages, paymentsToReview, toActivate, newSignups, latestSignup] = await Promise.all([
    db.supportTicket.count({ where: { status: { in: ["OPEN", "IN_PROGRESS"] } } }),
    db.review.count({ where: { status: "PENDING" } }),
    db.contactMessage.count({ where: { status: "NEW" } }),
    // "I Have Paid" pressed, or a crypto payment that came in short: an admin has to look.
    isAdmin ? db.order.count({ where: { status: { in: ["PENDING_CONFIRMATION", "UNDERPAID"] } } }) : 0,
    // Paid packs waiting for their IPTV login and activation.
    isAdmin ? db.subscription.count({ where: { status: "PENDING" } }) : 0,
    // Sign-ups this admin hasn't seen yet (cleared by opening "Not purchased").
    isAdmin ? db.notification.count({ where: { userId, audience: "ADMIN", readAt: null, title: SIGNUP_ALERT_TITLE } }) : 0,
    isAdmin
      ? db.user.findFirst({ where: { role: "USER" }, orderBy: { createdAt: "desc" }, select: { id: true, name: true, email: true, phone: true, createdAt: true } })
      : null,
  ]);
  return {
    openTickets,
    pendingReviews,
    newMessages,
    paymentsToReview,
    toActivate,
    newSignups,
    latestSignup: latestSignup ? { ...latestSignup, createdAt: latestSignup.createdAt.toISOString() } : null,
  };
}
