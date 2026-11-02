import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/forms/auth-forms";

export const metadata: Metadata = { title: "Forgot Password" };

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-text">Reset your password</h1>
      <p className="mt-2 text-muted">Enter your account email and we’ll send you a secure reset link.</p>
      <div className="mt-8">
        <ForgotPasswordForm />
      </div>
      <p className="mt-8 text-center text-sm text-muted">
        Remembered it?{" "}
        <Link href="/sign-in" className="font-medium text-accent hover:text-light-blue">
          Back to sign in
        </Link>
      </p>
    </>
  );
}
