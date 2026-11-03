import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { sweepPayments } from "@/lib/checkout/service";

export const dynamic = "force-dynamic";

/**
 * Background payment check for a cron job (e.g. every 5 minutes), so Bitcoin
 * payments are confirmed even after the customer closes the page:
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
  return NextResponse.json(await sweepPayments());
}
