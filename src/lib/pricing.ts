import type { BillingInterval } from "@prisma/client";

type PlanLike = { id: string; priceCents: number; interval: BillingInterval };

const MONTHS: Record<BillingInterval, number> = { MONTHLY: 1, QUARTERLY: 3, SEMIANNUAL: 6, YEARLY: 12, BIENNIAL: 24, ONE_TIME: 0 };

export function monthsFor(interval: BillingInterval) {
  return MONTHS[interval];
}

/** "1 Month", "3 Months", … — the access period a plan buys. */
export function accessLabel(interval: BillingInterval) {
  const m = MONTHS[interval];
  return m === 0 ? "Lifetime access" : `${m} ${m === 1 ? "Month" : "Months"} Access`;
}

export function monthlyCents(plan: PlanLike) {
  const m = MONTHS[plan.interval];
  return m > 0 ? Math.round(plan.priceCents / m) : null;
}

export function perDayCents(plan: PlanLike) {
  const m = MONTHS[plan.interval];
  return m > 0 ? plan.priceCents / (m * 30.4375) : null;
}

/**
 * Savings versus paying the shortest plan's monthly rate for the same period.
 * Computed from real prices only, so the badge can never drift from the price list.
 */
export function savingsPct(plan: PlanLike, baseMonthly: number | null) {
  const m = MONTHS[plan.interval];
  if (!baseMonthly || m <= 1) return 0;
  const full = baseMonthly * m;
  return Math.max(0, Math.round(((full - plan.priceCents) / full) * 100));
}

/** Reference monthly price (the 1-month plan, or the highest monthly rate) and the best-value plan. */
export function pricingContext(plans: PlanLike[]) {
  const withMonthly = plans.map((p) => ({ p, m: monthlyCents(p) })).filter((x): x is { p: PlanLike; m: number } => x.m !== null);
  const monthlyPlan = plans.find((p) => p.interval === "MONTHLY");
  const baseMonthly = monthlyPlan ? monthlyPlan.priceCents : withMonthly.length ? Math.max(...withMonthly.map((x) => x.m)) : null;
  const best = withMonthly.length > 1 ? withMonthly.reduce((a, b) => (b.m < a.m ? b : a)) : null;
  return { baseMonthly, bestValueId: best && savingsPct(best.p, baseMonthly) > 0 ? best.p.id : null };
}
