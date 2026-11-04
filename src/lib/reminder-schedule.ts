import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * The "finish your purchase" sequence for verified customers who have never bought a pack.
 * Each step goes out at most once, at least MIN_GAP_HOURS after the previous one, and only inside its window,
 * so accounts older than two weeks (or anyone who joined before the sequence existed) are never emailed in bulk.
 */
export type ReminderKind = "invoice" | "day1" | "day3" | "day7";

export const MIN_GAP_HOURS = 20;

/** [kind, earliest age in hours, latest age in hours]. "invoice" is measured from the unpaid invoice, the rest from sign-up. */
const WINDOWS: [ReminderKind, number, number][] = [
  ["invoice", 1, 48],
  ["day1", 24, 72],
  ["day3", 72, 168],
  ["day7", 168, 336],
];

export function nextReminder(input: {
  /** Hours since the account was created. */
  accountAgeHours: number;
  /** Hours since the latest unpaid invoice was created, if there is one. */
  invoiceAgeHours: number | null;
  sent: ReadonlySet<string>;
  /** Hours since the last reminder of any kind, or null if none was sent. */
  hoursSinceLastReminder: number | null;
}): ReminderKind | null {
  if (input.hoursSinceLastReminder !== null && input.hoursSinceLastReminder < MIN_GAP_HOURS) return null;
  for (const [kind, from, to] of WINDOWS) {
    if (input.sent.has(kind)) continue;
    const age = kind === "invoice" ? input.invoiceAgeHours : input.accountAgeHours;
    if (age !== null && age >= from && age <= to) return kind;
  }
  return null;
}

/**
 * Win-back after a pack expires: one email a day after, one a week after. Keyed per subscription,
 * so a customer who renews and lapses again gets the pair again for the new pack.
 */
export type WinBackKind = "winback1" | "winback7";

const WINBACK_WINDOWS: [WinBackKind, number, number][] = [
  ["winback1", 24, 96],
  ["winback7", 168, 336],
];

export function nextWinBack(input: { hoursSinceEnd: number; sent: ReadonlySet<string> }): WinBackKind | null {
  for (const [kind, from, to] of WINBACK_WINDOWS) {
    if (!input.sent.has(kind) && input.hoursSinceEnd >= from && input.hoursSinceEnd <= to) return kind;
  }
  return null;
}

/** Signs a user id so an unsubscribe link works without signing in but can't be forged for someone else. */
export function signReminderToken(userId: string, secret: string) {
  return createHmac("sha256", secret).update(`reminders:${userId}`).digest("base64url").slice(0, 32);
}

export function verifyReminderToken(userId: string, token: string, secret: string) {
  if (!userId || !token || !secret) return false;
  const expected = Buffer.from(signReminderToken(userId, secret));
  const given = Buffer.from(token);
  return expected.length === given.length && timingSafeEqual(expected, given);
}
