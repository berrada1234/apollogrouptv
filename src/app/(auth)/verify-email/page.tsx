import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { ResendVerificationForm } from "@/components/forms/auth-forms";
import { ButtonLink } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form";

export const metadata: Metadata = { title: "Verify Email" };

export default async function VerifyEmailPage({ searchParams }: PageProps<"/verify-email">) {
  const sp = await searchParams;
  const error = typeof sp.error === "string";
  const done = sp.status === "done" && !error;

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
      <h1 className="font-display text-3xl font-semibold tracking-tight text-text">Verify your email</h1>
      <p className="mt-2 text-muted">Didn’t receive the link, or did it expire? Request a new one below.</p>
      {error && (
        <div className="mt-6">
          <FormMessage ok={false} message="That verification link is invalid or has expired." />
        </div>
      )}
      <div className="mt-8">
        <ResendVerificationForm />
      </div>
    </>
  );
}
