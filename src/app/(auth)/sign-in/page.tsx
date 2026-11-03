import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  findSelectedPlan,
  SelectedPlanCard,
} from "@/components/checkout/selected-plan";
import { SignInForm } from "@/components/forms/auth-forms";
import { getCurrentUser } from "@/lib/session";
import { safeRedirect } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Apollo Group TV account.",
  alternates: { canonical: "/sign-in" },
};

export default async function SignInPage({
  searchParams,
}: PageProps<"/sign-in">) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? safeRedirect(sp.next) : undefined;
  if (await getCurrentUser()) redirect(next ?? "/dashboard");
  // A pack chosen on the Plans page travels in `next` (/dashboard/plan?plan=…).
  const plan = next
    ? await findSelectedPlan(new URL(next, "http://x").searchParams.get("plan"))
    : null;

  return (
    <>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-text">
        Welcome back
      </h1>
      <p className="mt-2 text-muted">
        {plan
          ? "Sign in to continue to payment."
          : "Sign in to manage your plan, billing and support."}
      </p>
      {plan && <SelectedPlanCard plan={plan} />}
      <div className="mt-8">
        <SignInForm next={next} />
      </div>
      <p className="mt-8 text-center text-sm text-muted">
        New to Apollo Group TV?{" "}
        <Link
          href={
            plan
              ? `/create-account?plan=${encodeURIComponent(plan.slug)}`
              : "/create-account"
          }
          className="font-medium text-accent hover:text-light-blue"
        >
          Create an account
        </Link>
      </p>
    </>
  );
}
