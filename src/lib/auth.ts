import "server-only";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { emailOTP, twoFactor } from "better-auth/plugins";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { notifyAdmins, notifyUser } from "@/lib/notify";
import { generateReferralCode, REFERRAL_COOKIE } from "@/lib/referral";
import { OTP_LENGTH, OTP_MINUTES } from "@/lib/otp";
import { isLocalUrl, siteConfig } from "@/lib/site";

function readCookie(header: string | null | undefined, name: string) {
  if (!header) return null;
  const match = header.split(/;\s*/).find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

async function assignReferralCode(userId: string) {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      await db.user.update({ where: { id: userId }, data: { referralCode: generateReferralCode() } });
      return;
    } catch {
      // Unique collision — retry with a fresh code.
    }
  }
}

/**
 * Local testing switch: AUTH_SKIP_EMAIL_VERIFICATION="true" lets new accounts sign in straight away.
 * It only takes effect when the site runs on localhost, so it can never weaken a deployed site.
 */
/** Welcome note for the customer and a "new registration" alert for admins. */
async function notifyNewAccount(user: { id: string; name: string; email: string; createdAt: Date }) {
  await notifyUser(user.id, {
    title: "Account Successfully Created",
    body: "Welcome to Apollo Group TV. Choose a pack in Plans & Billing whenever you're ready.",
    href: "/dashboard/plan",
  });
  await notifyAdmins({
    title: "New Customer Registration",
    body: `${user.name} · ${user.email} · Registered ${user.createdAt.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })} · Status: Active`,
    href: `/admin/users/${user.id}`,
  });
}

async function recordStaffSignIn(session: { userId: string; ipAddress?: string | null; userAgent?: string | null }) {
  const user = await db.user.findUnique({ where: { id: session.userId }, select: { role: true, twoFactorEnabled: true } });
  if (!user || user.role === "USER") return;
  const ip = session.ipAddress || "unknown IP";
  const device = (session.userAgent ?? "").slice(0, 160) || "unknown device";
  await db.auditLog.create({
    data: {
      actorId: session.userId,
      action: "auth.staff_sign_in",
      targetType: "user",
      targetId: session.userId,
      ipAddress: session.ipAddress ?? null,
      metadata: { device, twoFactor: user.twoFactorEnabled },
    },
  });
  await db.notification.create({
    data: {
      userId: session.userId,
      audience: user.role === "ADMIN" ? "ADMIN" : "USER",
      title: "New sign-in to your staff account",
      body: `${ip} · ${device}. If this wasn't you, change your password and sign out other sessions in Security.`,
      href: "/dashboard/security",
    },
  });
}

export const skipEmailVerification =
  process.env.AUTH_SKIP_EMAIL_VERIFICATION === "true" && isLocalUrl(process.env.BETTER_AUTH_URL ?? siteConfig.url);

export const auth = betterAuth({
  appName: siteConfig.name,
  baseURL: process.env.BETTER_AUTH_URL ?? siteConfig.url,
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(db, { provider: "mysql", transaction: true }),
  trustedOrigins: [siteConfig.url],

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: !skipEmailVerification,
    minPasswordLength: 10,
    maxPasswordLength: 128,
    autoSignIn: skipEmailVerification,
    revokeSessionsOnPasswordReset: true,
    resetPasswordTokenExpiresIn: 60 * 30,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: `Reset your ${siteConfig.name} password`,
        heading: "Reset your password",
        body: "We received a request to reset your password. This link expires in 30 minutes. If you did not request it, you can ignore this email.",
        cta: { label: "Choose a new password", url },
      });
    },
  },

  // Verification uses a 6-digit code (the emailOTP plugin below supplies the sender), so it can be typed on any device.
  emailVerification: {
    sendOnSignUp: !skipEmailVerification,
    sendOnSignIn: !skipEmailVerification,
    autoSignInAfterVerification: true,
  },

  user: {
    additionalFields: {
      role: { type: "string", input: false, defaultValue: "USER" },
      status: { type: "string", input: false, defaultValue: "ACTIVE" },
      referralCode: { type: "string", input: false, required: false },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
    freshAge: 60 * 60 * 24,
  },

  rateLimit: {
    enabled: process.env.NODE_ENV === "production" || process.env.AUTH_RATE_LIMIT === "true",
    storage: "database",
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
      "/sign-up/email": { window: 300, max: 5 },
      "/request-password-reset": { window: 300, max: 3 },
      "/send-verification-email": { window: 300, max: 3 },
      "/change-password": { window: 300, max: 5 },
      // Authenticator codes: the plugin also locks the second step after 5 wrong codes.
      "/two-factor/verify-totp": { window: 60, max: 5 },
      "/two-factor/verify-backup-code": { window: 300, max: 5 },
    },
  },

  advanced: {
    // Hostinger's proxy overwrites x-real-ip with the visitor's address; x-forwarded-for repeats hops and
    // passes client-supplied values through, so it can't be trusted for rate limiting.
    ipAddress: { ipAddressHeaders: ["x-real-ip"] },
    useSecureCookies: process.env.NODE_ENV === "production",
    cookiePrefix: "agtv",
  },

  databaseHooks: {
    user: {
      create: {
        // In local testing mode accounts start verified, so dashboards and admin promotion work without email.
        before: async (user) => (skipEmailVerification ? { data: { ...user, emailVerified: true } } : undefined),
        after: async (user, ctx) => {
          await assignReferralCode(user.id);
          await notifyNewAccount(user).catch((e) => console.error("[auth] signup notifications", e instanceof Error ? e.message : e));
          const code = readCookie(ctx?.headers?.get("cookie"), REFERRAL_COOKIE);
          if (!code) return;
          const referrer = await db.user.findUnique({ where: { referralCode: code }, select: { id: true } });
          if (referrer && referrer.id !== user.id) {
            await db.referral.create({ data: { referrerId: referrer.id, refereeId: user.id } }).catch(() => undefined);
          }
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          const user = await db.user.findUnique({ where: { id: session.userId }, select: { status: true } });
          if (user?.status === "SUSPENDED") {
            throw new APIError("FORBIDDEN", { message: "This account is suspended. Please contact support." });
          }
        },
        // Staff sign-ins are logged and shown in the bell, so an unexpected one is noticed quickly.
        after: async (session) => {
          await recordStaffSignIn(session).catch((e) => console.error("[auth] staff sign-in log", e instanceof Error ? e.message : e));
        },
      },
    },
  },

  plugins: [
    emailOTP({
      overrideDefaultEmailVerification: true,
      otpLength: OTP_LENGTH,
      expiresIn: OTP_MINUTES * 60,
      allowedAttempts: 5,
      storeOTP: "hashed",
      rateLimit: { window: 60, max: 5 },
      sendVerificationOTP: async ({ email, otp, type }) => {
        if (type !== "email-verification") return;
        await sendEmail({
          to: email,
          subject: `${otp} is your ${siteConfig.name} verification code`,
          heading: "Confirm your email",
          body: `Enter this code on the verification page to activate your account. It expires in ${OTP_MINUTES} minutes. If you didn't create an account, you can ignore this email.`,
          code: otp,
        });
      },
    }),
    twoFactor({
      issuer: siteConfig.name,
      // "Trust this device" skips the code on that browser for 30 days.
      trustDeviceMaxAge: 60 * 60 * 24 * 30,
      backupCodeOptions: { amount: 10, length: 10 },
    }),
    nextCookies(),
  ],
});

export type AuthSession = typeof auth.$Infer.Session;
