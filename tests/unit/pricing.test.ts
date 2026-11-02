import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { accessLabel, monthlyCents, perDayCents, pricingContext, savingsPct } from "@/lib/pricing";

const packs = [
  { id: "starter", priceCents: 2499, interval: "MONTHLY" as const },
  { id: "silver", priceCents: 5499, interval: "QUARTERLY" as const },
  { id: "elite", priceCents: 9999, interval: "SEMIANNUAL" as const },
  { id: "platinum", priceCents: 14999, interval: "YEARLY" as const },
];

describe("pricing", () => {
  const { baseMonthly, bestValueId } = pricingContext(packs);

  it("uses the 1-month pack as the reference rate", () => {
    expect(baseMonthly).toBe(2499);
  });
  it("computes savings that match the published packs", () => {
    expect(packs.map((p) => savingsPct(p, baseMonthly))).toEqual([0, 27, 33, 50]);
  });
  it("computes monthly equivalents", () => {
    expect(packs.map(monthlyCents)).toEqual([2499, 1833, 1667, 1250]);
  });
  it("picks the lowest monthly cost as best value", () => {
    expect(bestValueId).toBe("platinum");
  });
  it("labels access periods", () => {
    expect(packs.map((p) => accessLabel(p.interval))).toEqual(["1 Month Access", "3 Months Access", "6 Months Access", "12 Months Access"]);
  });
  it("estimates a daily cost", () => {
    expect(Math.round(perDayCents(packs[3])!)).toBe(41);
  });
  it("shows no best value or savings when only one plan exists", () => {
    const one = pricingContext([packs[0]]);
    expect(one.bestValueId).toBeNull();
    expect(savingsPct(packs[0], one.baseMonthly)).toBe(0);
  });
});

describe("sports section copy", () => {
  it("does not name leagues, events or broadcasters (trademarks / rights)", () => {
    const src = fs.readFileSync("src/components/sports-section.tsx", "utf8");
    expect(src).not.toMatch(/\b(NFL|NBA|MLB|NHL|CFL|UFC|ATP|WTA|PGA|MotoGP|Formula 1|F1|Premier League|Champions League|La Liga|Serie A)\b/);
  });
});
