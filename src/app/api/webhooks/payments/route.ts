import { NextResponse } from "next/server";
import { getPaymentProvider, isCheckoutEnabled } from "@/lib/payments";

/**
 * Payment provider webhook endpoint (placeholder).
 *
 * When a provider is integrated, this handler must:
 *  1. Read the raw body and verify the provider's signature header with
 *     PAYMENT_WEBHOOK_SECRET (reject anything unsigned or stale).
 *  2. De-duplicate events by provider event ID.
 *  3. Upsert Payment rows keyed by `providerReference` and update the related
 *     Subscription status/period inside a single database transaction.
 * Until then it refuses every request, so no payment state can be forged.
 */
export async function POST() {
  if (!isCheckoutEnabled() || !getPaymentProvider()) {
    return NextResponse.json({ error: "Payment provider not configured" }, { status: 501 });
  }
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
