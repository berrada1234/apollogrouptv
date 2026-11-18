import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { isValidReferralCode, REFERRAL_COOKIE } from "@/lib/referral";
import { makeStaffToken, readStaffToken, STAFF_COOKIE, staffCookieOptions } from "@/lib/staff-step-up";

const PROTECTED = ["/dashboard", "/admin", "/staff-verify"];
const NOINDEX = [...PROTECTED, "/sign-in", "/create-account", "/forgot-password", "/reset-password", "/verify-email"];

const matches = (path: string, prefixes: string[]) => prefixes.some((p) => path === p || path.startsWith(`${p}/`));

/**
 * Optimistic gate only: redirects visitors without a session cookie away from
 * private areas. Real authentication and role checks happen on the server in
 * every protected layout, page and action.
 */
export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (matches(pathname, PROTECTED) && !getSessionCookie(request, { cookiePrefix: "agtv" })) {
    const url = new URL("/sign-in", request.url);
    // Keep the query (e.g. ?plan=elite) so a chosen pack survives the sign-in.
    url.searchParams.set("next", pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();

  if (matches(pathname, NOINDEX)) response.headers.set("X-Robots-Tag", "noindex, nofollow");

  // Each admin page load restarts the idle timer of a passed staff code check (see staff-step-up.ts).
  if (matches(pathname, ["/admin"])) {
    const passed = readStaffToken(request.cookies.get(STAFF_COOKIE)?.value);
    if (passed) response.cookies.set(STAFF_COOKIE, makeStaffToken(passed.sessionId), staffCookieOptions);
  }

  // Remember a referral code for 30 days so it survives the sign-up flow.
  const ref = searchParams.get("ref")?.toUpperCase();
  if (pathname === "/create-account" && ref && isValidReferralCode(ref)) {
    response.cookies.set(REFERRAL_COOKIE, ref, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|icon.png|apple-icon.png|brand/|opengraph-image|robots.txt|sitemap.xml).*)"],
};
