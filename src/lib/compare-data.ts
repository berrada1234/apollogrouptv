import "server-only";
import { getActivePlans } from "@/lib/queries";
import { monthsFor } from "@/lib/pricing";
import { getSettings } from "@/lib/settings";
import { formatMoney, parseFeatures } from "@/lib/utils";

/** Apollo's side of every comparison, read from the live price list and settings so it never goes stale. */
export async function getApolloCompareData() {
  const [plans, settings] = await Promise.all([getActivePlans(), getSettings()]);
  const byMonths = (m: number) => plans.find((p) => monthsFor(p.interval) === m);
  const yearly = byMonths(12);
  const monthly = byMonths(1);
  const devices = plans.flatMap((p) => parseFeatures(p.features)).join(" ").match(/up to (\d+) devices?/i)?.[1] ?? null;
  const currency = yearly?.currency ?? monthly?.currency ?? "USD";
  return {
    yearlyCents: yearly?.priceCents ?? null,
    yearlyName: yearly?.name ?? null,
    monthlyCents: monthly?.priceCents ?? null,
    currency,
    money: (cents: number) => formatMoney(cents, currency),
    devices: devices ? Number(devices) : null,
    allOneTime: plans.length > 0 && plans.every((p) => p.oneTime),
    refundDays: settings.highlights.moneyBackDays,
  };
}

export type ApolloCompare = Awaited<ReturnType<typeof getApolloCompareData>>;
