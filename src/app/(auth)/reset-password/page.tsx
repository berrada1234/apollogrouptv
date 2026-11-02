import type { Metadata } from "next";
import Link from "next/link";
import { ResetPasswordForm } from "@/components/forms/auth-forms";
import { FormMessage } from "@/components/ui/form";

export const metadata: Metadata = { title: "Choose a New Password" };

export default async function ResetPasswordPage({ searchParams }: PageProps<"/reset-password">) {
  const sp = await searchParams;
  const token = typeof sp.token === "string" ? sp.token : null;
  const invalid = !token || typeof sp.error === "string";

  return (
    <>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-text">Choose a new password</h1>
      <div className="mt-8">
        {invalid ? (
          <div className="space-y-5">
            <FormMessage ok={false} message="This reset link is invalid or has expired." />
            <Link href="/forgot-password" className="text-sm font-medium text-accent hover:text-light-blue">
              Request a new reset link →
            </Link>
          </div>
        ) : (
          <ResetPasswordForm token={token} />
        )}
      </div>
    </>
  );
}
