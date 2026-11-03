import { describe, expect, it } from "vitest";
import { formatUsDate, parseUsDate, subscriptionDisplay } from "@/lib/subscription-status";

const now = new Date("2026-11-03T12:00:00Z");

describe("MM/DD/YYYY dates", () => {
  it("parses valid dates at midday UTC and formats them back", () => {
    const d = parseUsDate("11/03/2026")!;
    expect(d.toISOString()).toBe("2026-11-03T12:00:00.000Z");
    expect(formatUsDate(d)).toBe("11/03/2026");
    expect(formatUsDate(parseUsDate("2/9/2027"))).toBe("02/09/2027");
  });

  it("rejects impossible or badly formatted dates", () => {
    expect(parseUsDate("02/30/2026")).toBeNull();
    expect(parseUsDate("13/01/2026")).toBeNull();
    expect(parseUsDate("2026-11-03")).toBeNull();
    expect(parseUsDate("")).toBeNull();
  });
});

describe("subscription status labels", () => {
  it("describes invoices that have no subscription yet", () => {
    expect(subscriptionDisplay(null, "PENDING", now).label).toBe("Pending Payment");
    expect(subscriptionDisplay(null, "PENDING_CONFIRMATION", now).label).toBe("Pending Review");
    expect(subscriptionDisplay(null, "CANCELED", now).label).toBe("Cancelled");
  });

  it("describes subscriptions", () => {
    expect(subscriptionDisplay({ status: "PENDING", currentPeriodEnd: null }, "PAID", now).label).toBe("Pending Review");
    expect(subscriptionDisplay({ status: "ACTIVE", currentPeriodEnd: new Date("2027-01-01") }, "PAID", now).label).toBe("Active");
    expect(subscriptionDisplay({ status: "CANCELED", currentPeriodEnd: null }, null, now).label).toBe("Cancelled");
  });

  it("treats an active subscription past its end date as expired", () => {
    expect(subscriptionDisplay({ status: "ACTIVE", currentPeriodEnd: new Date("2026-10-01") }, "PAID", now).label).toBe("Expired");
  });
});
