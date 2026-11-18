"use server";

import { cookies, headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getCurrentUser, hasRole } from "@/lib/session";
import { makeStaffToken, STAFF_COOKIE, staffCookieOptions } from "@/lib/staff-step-up";

const MAX_FAILS = 5;
const FAIL_WINDOW_MS = 15 * 60 * 1000;

type Result = { ok: true } | { ok: false; message: string; signedOut?: boolean };

/**
 * Admin-area check: confirms a code from the authenticator app (or a backup code) for the signed-in staff
 * member, then marks this session as verified for the admin area. Five wrong codes in 15 minutes end the session.
 */
export async function verifyStaffCode(input: { code: string; backup?: boolean }): Promise<Result> {
  const user = await getCurrentUser();
  if (!user || !hasRole(user, "SUPPORT")) return { ok: false, message: "Sign in with a staff account first.", signedOut: true };
  if (!user.twoFactorEnabled) return { ok: false, message: "Turn on two-step sign-in in Security first." };

  const code = input.code.trim();
  if (!input.backup && !/^\d{6}$/.test(code)) return { ok: false, message: "Enter the 6-digit code from your authenticator app." };
  if (input.backup && code.length < 8) return { ok: false, message: "Enter one of your backup codes." };

  const h = await headers();
  const ipAddress = h.get("x-real-ip")?.slice(0, 64) ?? null;
  const fails = await db.auditLog.count({
    where: { action: "auth.staff_2fa_failed", targetId: user.sessionId, createdAt: { gte: new Date(Date.now() - FAIL_WINDOW_MS) } },
  });
  if (fails >= MAX_FAILS) {
    await db.session.deleteMany({ where: { id: user.sessionId } });
    return { ok: false, message: "Too many wrong codes. You've been signed out; sign in again.", signedOut: true };
  }

  try {
    if (input.backup) await auth.api.verifyBackupCode({ body: { code }, headers: h });
    else await auth.api.verifyTOTP({ body: { code }, headers: h });
  } catch {
    await db.auditLog.create({
      data: { actorId: user.id, action: "auth.staff_2fa_failed", targetType: "session", targetId: user.sessionId, ipAddress },
    });
    const left = MAX_FAILS - fails - 1;
    if (left <= 0) {
      await db.session.deleteMany({ where: { id: user.sessionId } });
      return { ok: false, message: "Too many wrong codes. You've been signed out; sign in again.", signedOut: true };
    }
    return {
      ok: false,
      message: input.backup
        ? `That backup code didn't work, or it was already used. ${left} ${left === 1 ? "try" : "tries"} left.`
        : `That code didn't work. Codes change every 30 seconds, so use the current one. ${left} ${left === 1 ? "try" : "tries"} left.`,
    };
  }

  (await cookies()).set(STAFF_COOKIE, makeStaffToken(user.sessionId), staffCookieOptions);
  await db.auditLog.create({
    data: {
      actorId: user.id,
      action: "auth.staff_2fa_verified",
      targetType: "session",
      targetId: user.sessionId,
      ipAddress,
      metadata: { method: input.backup ? "backup-code" : "authenticator" },
    },
  });
  return { ok: true };
}
