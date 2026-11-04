import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { VerifyCodeForm } from "@/components/forms/auth-forms";
import { ButtonLink } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form";
import { OTP_LENGTH } from "@/lib/otp";
import { safeRedirect } from "@/lib/utils";

export const metadata: Metadata = { title: "Verify Email" };

export default async function VerifyEmailPage({ searchParams }: PageProps<"/verify-email">) {
  const sp = await searchParams;
  // ?status and ?error come from verification links sent before codes replaced them.
  const error = typeof sp.error === "string";
  const done = sp.status === "done" && !error;
  const email = typeof sp.email === "string" ? sp.email.trim().slice(0, 254) : undefined;
  const next = typeof sp.next === "string" ? safeRedirect(sp.next) : undefined;

  if (done) {
    return (
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-success" aria-hidden />
        <h1 className="mt-5 font-display text-3xl font-semibold text-text">Email verified</h1>
        <p className="mt-2 text-muted">Your account is active. Welcome to Apollo Group TV.</p>
        <ButtonLink href="/dashboard" size="lg" className="mt-8">
          Go to your dashboard
        </ButtonLink>
      </div>
    );
  }

  return (
    <>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-text">Check your email</h1>
      <p className="mt-2 text-muted">
        {email
          ? `We sent a ${OTP_LENGTH}-digit code to confirm your email. Enter it below to activate your account.`
          : `Enter your email and the ${OTP_LENGTH}-digit code we sent you, or ask for a new one.`}
      </p>
      {error && (
        <div className="mt-6">
          <FormMessage ok={false} message="That verification link is invalid or has expired. Use a code instead." />
        </div>
      )}
      <div className="mt-8">
        <VerifyCodeForm email={email} next={next} />
      </div>
    </>
  );
}
