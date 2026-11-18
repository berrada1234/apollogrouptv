import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Staff step-up check: the admin area asks for a fresh authenticator code on every visit, on top of the
 * code asked at sign-in. A passed check is a signed cookie bound to the session; it lapses after
 * STAFF_IDLE_MINUTES without an admin page load (proxy.ts renews it on each one) or when the browser closes.
 * No database reads, so proxy.ts can renew it too.
 */
export const STAFF_COOKIE = "agtv_staff_ok";
export const STAFF_IDLE_MINUTES = 15;

const idleMs = STAFF_IDLE_MINUTES * 60 * 1000;

export const staffCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  // No maxAge: a browser-session cookie, gone when the browser closes.
};

function sign(payload: string) {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) return null;
  return createHmac("sha256", `staff-step-up:${secret}`).update(payload).digest("base64url");
}

export function makeStaffToken(sessionId: string, now = Date.now()) {
  const payload = `${sessionId}.${now}`;
  const sig = sign(payload);
  if (!sig) throw new Error("BETTER_AUTH_SECRET is not set");
  return `${payload}.${sig}`;
}

/** The session the check was passed for, or null when the cookie is missing, forged or idle too long. */
export function readStaffToken(value: string | undefined | null, now = Date.now()) {
  if (!value) return null;
  const parts = value.split(".");
  if (parts.length !== 3) return null;
  const [sessionId, ts, sig] = parts;
  const expected = sign(`${sessionId}.${ts}`);
  if (!expected || sig.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  const at = Number(ts);
  if (!Number.isFinite(at) || at > now + 60_000 || now - at > idleMs) return null;
  return { sessionId, at };
}
