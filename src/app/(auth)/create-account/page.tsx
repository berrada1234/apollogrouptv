import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  checkoutPath,
  findSelectedPlan,
  SelectedPlanCard,
} from "@/components/checkout/selected-plan";
import { RememberPlan } from "@/components/checkout/remember-plan";
import { CreateAccountForm } from "@/components/forms/auth-forms";
import { skipEmailVerification } from "@/lib/auth";
import { isValidReferralCode } from "@/lib/referral";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your Apollo Group TV account.",
  alternates: { canonical: "/create-account" },
};

export default async function CreateAccountPage({
  searchParams,
}: PageProps<"/create-account">) {
  const sp = await searchParams;
  const plan = await findSelectedPlan(sp.plan);
  const next = plan ? checkoutPath(plan.slug) : undefined;
  if (await getCurrentUser()) redirect(next ?? "/dashboard");
  const ref = typeof sp.ref === "string" ? sp.ref.toUpperCase() : undefined;

  return (
    <>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-text">
        Create your account
      </h1>
      <p className="mt-2 text-muted">
        {skipEmailVerification
          ? "Local testing mode: email verification is off, so you'll go straight to your dashboard."
          : "It takes less than a minute. We’ll email you a 6-digit code to confirm your address."}
      </p>
      {plan && <SelectedPlanCard plan={plan} />}
      {plan && <RememberPlan slug={plan.slug} />}
      <div className="mt-8">
        <CreateAccountForm
          referralCode={ref && isValidReferralCode(ref) ? ref : undefined}
          verifyEmail={!skipEmailVerification}
          next={next}
        />
      </div>
      <p className="mt-8 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link
          href={next ? `/sign-in?next=${encodeURIComponent(next)}` : "/sign-in"}
          className="font-medium text-accent hover:text-light-blue"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
