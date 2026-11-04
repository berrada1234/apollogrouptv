import "server-only";
import { db } from "@/lib/db";

/** Work waiting on staff, shown as sidebar badges and polled by the admin pages. */
export async function adminAttention(isAdmin: boolean) {
  const [openTickets, pendingReviews, newMessages, paymentsToReview, toActivate] = await Promise.all([
    db.supportTicket.count({ where: { status: { in: ["OPEN", "IN_PROGRESS"] } } }),
    db.review.count({ where: { status: "PENDING" } }),
    db.contactMessage.count({ where: { status: "NEW" } }),
    // "I Have Paid" pressed, or a crypto payment that came in short: an admin has to look.
    isAdmin ? db.order.count({ where: { status: { in: ["PENDING_CONFIRMATION", "UNDERPAID"] } } }) : 0,
    // Paid packs waiting for their IPTV login and activation.
    isAdmin ? db.subscription.count({ where: { status: "PENDING" } }) : 0,
  ]);
  return { openTickets, pendingReviews, newMessages, paymentsToReview, toActivate };
}

export type AdminAttention = Awaited<ReturnType<typeof adminAttention>>;
