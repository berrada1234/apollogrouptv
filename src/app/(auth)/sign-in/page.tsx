import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignInForm } from "@/components/forms/auth-forms";
import { getCurrentUser } from "@/lib/session";
import { safeRedirect } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Apollo Group TV account.",
  alternates: { canonical: "/sign-in" },
};

export default async function SignInPage({ searchParams }: PageProps<"/sign-in">) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? safeRedirect(sp.next) : undefined;
  if (await getCurrentUser()) redirect(next ?? "/dashboard");

  return (
    <>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-text">Welcome back</h1>
      <p className="mt-2 text-muted">Sign in to manage your plan, billing and support.</p>
      <div className="mt-8">
        <SignInForm next={next} />
      </div>
      <p className="mt-8 text-center text-sm text-muted">
        New to Apollo Group TV?{" "}
        <Link href="/create-account" className="font-medium text-accent hover:text-light-blue">
          Create an account
        </Link>
      </p>
    </>
  );
}
