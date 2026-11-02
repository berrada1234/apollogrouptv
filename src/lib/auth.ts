import "server-only";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { generateReferralCode, REFERRAL_COOKIE } from "@/lib/referral";
import { siteConfig } from "@/lib/site";

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

export const auth = betterAuth({
  appName: siteConfig.name,
  baseURL: process.env.BETTER_AUTH_URL ?? siteConfig.url,
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(db, { provider: "mysql", transaction: true }),
  trustedOrigins: [siteConfig.url],

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 10,
    maxPasswordLength: 128,
    autoSignIn: false,
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

  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60 * 24,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: `Verify your ${siteConfig.name} email`,
        heading: `Welcome, ${user.name}`,
        body: "Please confirm your email address to activate your account. This link expires in 24 hours.",
        cta: { label: "Verify email", url },
      });
    },
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
    },
  },

  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    cookiePrefix: "agtv",
  },

  databaseHooks: {
    user: {
      create: {
        after: async (user, ctx) => {
          await assignReferralCode(user.id);
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
      },
    },
  },

  plugins: [nextCookies()],
});

export type AuthSession = typeof auth.$Infer.Session;
