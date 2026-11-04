import { describe, expect, it } from "vitest";
import { nextReminder, signReminderToken, verifyReminderToken } from "@/lib/reminder-schedule";

const base = { accountAgeHours: 0, invoiceAgeHours: null, sent: new Set<string>(), hoursSinceLastReminder: null };

describe("nextReminder", () => {
  it("sends nothing to a brand-new account", () => {
    expect(nextReminder(base)).toBeNull();
  });
  it("chases an unpaid invoice after an hour", () => {
    expect(nextReminder({ ...base, accountAgeHours: 2, invoiceAgeHours: 1.5 })).toBe("invoice");
  });
  it("follows the day 1, day 3 and day 7 windows", () => {
    expect(nextReminder({ ...base, accountAgeHours: 30 })).toBe("day1");
    expect(nextReminder({ ...base, accountAgeHours: 80, sent: new Set(["day1"]), hoursSinceLastReminder: 50 })).toBe("day3");
    expect(nextReminder({ ...base, accountAgeHours: 200, sent: new Set(["day1", "day3"]), hoursSinceLastReminder: 100 })).toBe("day7");
  });
  it("never sends the same step twice", () => {
    expect(nextReminder({ ...base, accountAgeHours: 30, sent: new Set(["day1"]), hoursSinceLastReminder: 25 })).toBeNull();
  });
  it("waits at least 20 hours between reminders", () => {
    expect(nextReminder({ ...base, accountAgeHours: 30, sent: new Set(["invoice"]), hoursSinceLastReminder: 5 })).toBeNull();
  });
  it("skips steps whose window has passed and stops after two weeks", () => {
    expect(nextReminder({ ...base, accountAgeHours: 100 })).toBe("day3");
    expect(nextReminder({ ...base, accountAgeHours: 400 })).toBeNull();
  });
});

describe("reminder tokens", () => {
  it("verifies its own token and rejects others", () => {
    const t = signReminderToken("user_1", "secret-value-123456");
    expect(verifyReminderToken("user_1", t, "secret-value-123456")).toBe(true);
    expect(verifyReminderToken("user_2", t, "secret-value-123456")).toBe(false);
    expect(verifyReminderToken("user_1", t, "another-secret-0000")).toBe(false);
    expect(verifyReminderToken("user_1", "", "secret-value-123456")).toBe(false);
  });
});
