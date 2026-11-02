/**
 * Payment provider integration point.
 *
 * No provider is wired up yet. Checkout stays disabled until
 * PAYMENT_PROVIDER and its credentials are set AND a provider adapter is
 * implemented (see HOSTINGER_DEPLOYMENT.md → "Enabling payments").
 * Payment and subscription status must only ever change from a verified
 * provider webhook — never from the browser or an admin form.
 */
export const SUPPORTED_PROVIDERS = ["stripe", "paddle", "paypal"] as const;
export type PaymentProvider = (typeof SUPPORTED_PROVIDERS)[number];

export function getPaymentProvider(): PaymentProvider | null {
  const value = process.env.PAYMENT_PROVIDER?.toLowerCase();
  return (SUPPORTED_PROVIDERS as readonly string[]).includes(value ?? "") ? (value as PaymentProvider) : null;
}

/** True only when a provider is selected and an adapter has been implemented. */
export function isCheckoutEnabled() {
  // Flip to `getPaymentProvider() !== null` once an adapter exists in src/lib/payments/.
  return false;
}
