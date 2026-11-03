import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { sweepPayments } from "@/lib/checkout/service";
import { sweepSubscriptions } from "@/lib/subscriptions";

export const dynamic = "force-dynamic";

/**
 * Background job for a cron (e.g. every 5 minutes): confirms Bitcoin payments even
 * after the customer closes the page, expires lapsed subscriptions and sends
 * "expiring soon" reminders:
 *   curl -H "Authorization: Bearer $CRON_SECRET" https://your-domain/api/cron/payments
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET ?? "";
  const given =
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const valid =
    secret.length >= 16 &&
    given.length === secret.length &&
    timingSafeEqual(Buffer.from(given), Buffer.from(secret));
  if (!valid)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payments = await sweepPayments();
  const subscriptions = await sweepSubscriptions();
  return NextResponse.json({ payments, subscriptions });
}
