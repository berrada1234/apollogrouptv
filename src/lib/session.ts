import "server-only";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { readStaffToken, STAFF_COOKIE } from "@/lib/staff-step-up";

/**
 * Resolves the current session and re-reads role/status from the database,
 * so a role change or suspension takes effect immediately.
 */
export const getCurrentUser = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      role: true,
      status: true,
      referralCode: true,
      marketingOptIn: true,
      productUpdatesOptIn: true,
      createdAt: true,
      twoFactorEnabled: true,
    },
  });
  if (!user || user.status !== "ACTIVE") return null;
  return { ...user, sessionId: session.session.id };
});

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

export async function requireUser(next?: string): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect(next ? `/sign-in?next=${encodeURIComponent(next)}` : "/sign-in");
  return user;
}

const rank: Record<Role, number> = { USER: 0, SUPPORT: 1, ADMIN: 2 };

export function hasRole(user: Pick<CurrentUser, "role">, minimum: Role) {
  return rank[user.role] >= rank[minimum];
}

/** True when this session passed the staff code check recently (see staff-step-up.ts). */
export async function isStaffVerified(user: Pick<CurrentUser, "sessionId">) {
  const token = readStaffToken((await cookies()).get(STAFF_COOKIE)?.value);
  return token?.sessionId === user.sessionId;
}

/**
 * For admin pages: unauthenticated → sign in; insufficient role → dashboard. Staff pages also need two-step
 * sign-in turned on and a fresh authenticator code for this visit.
 */
export async function requireRole(minimum: Role, next = "/admin"): Promise<CurrentUser> {
  const user = await requireUser(next);
  if (!hasRole(user, minimum)) redirect("/dashboard");
  if (rank[minimum] >= rank.SUPPORT && !(await isStaffVerified(user))) {
    if (!user.twoFactorEnabled) redirect("/dashboard/security?staff=1#two-step");
    redirect(`/staff-verify?next=${encodeURIComponent(next)}`);
  }
  return user;
}

export class AuthorizationError extends Error {}

/** For server actions: throws instead of redirecting. */
export async function assertRole(minimum: Role): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user || !hasRole(user, minimum)) throw new AuthorizationError("Not authorized");
  if (rank[minimum] >= rank.SUPPORT && !(await isStaffVerified(user))) {
    throw new AuthorizationError("Enter your authenticator code again to continue in the admin area.");
  }
  return user;
}

export async function assertUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) throw new AuthorizationError("Not signed in");
  return user;
}
