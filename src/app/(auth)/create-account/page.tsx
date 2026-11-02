import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CreateAccountForm } from "@/components/forms/auth-forms";
import { isValidReferralCode } from "@/lib/referral";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your Apollo Group TV account.",
  alternates: { canonical: "/create-account" },
};

export default async function CreateAccountPage({ searchParams }: PageProps<"/create-account">) {
  if (await getCurrentUser()) redirect("/dashboard");
  const sp = await searchParams;
  const ref = typeof sp.ref === "string" ? sp.ref.toUpperCase() : undefined;

  return (
    <>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-text">Create your account</h1>
      <p className="mt-2 text-muted">It takes less than a minute. We’ll ask you to verify your email.</p>
      <div className="mt-8">
        <CreateAccountForm referralCode={ref && isValidReferralCode(ref) ? ref : undefined} />
      </div>
      <p className="mt-8 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-accent hover:text-light-blue">
          Sign in
        </Link>
      </p>
    </>
  );
}
