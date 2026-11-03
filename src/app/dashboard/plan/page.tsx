import type { Metadata } from "next";
import { Package } from "lucide-react";
import { planTabs, SectionTabs } from "@/components/dashboard/section-tabs";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState, Notice } from "@/components/ui/misc";
import { PlanCard } from "@/components/marketing/sections";
import { getCurrentSubscription } from "@/components/dashboard/overview";
import { isCheckoutEnabled } from "@/lib/payments";
import { getActivePlans } from "@/lib/queries";
import { requireUser } from "@/lib/session";
import { formatDate, formatMoney, intervalLabels, parseFeatures } from "@/lib/utils";

export const metadata: Metadata = { title: "My Plan" };

export default async function MyPlanPage({ searchParams }: PageProps<"/dashboard/plan">) {
  const user = await requireUser("/dashboard/plan");
  const sp = await searchParams;
  const [subscription, plans] = await Promise.all([getCurrentSubscription(user.id), getActivePlans()]);
  const selected = typeof sp.plan === "string" ? plans.find((p) => p.slug === sp.plan) : undefined;
  const checkout = isCheckoutEnabled();

  return (
    <>
      <PageHeader title="Plans & Billing" description="Your current plan, the packs you can choose and your subscription records." />
      <SectionTabs tabs={planTabs} current="/dashboard/plan" />
      {subscription ? (
        <Card className="mb-8">
          <CardHeader title={subscription.plan.name} description={subscription.plan.description} action={<StatusBadge status={subscription.status} />} />
          <CardBody className="grid gap-6 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted">Price</p>
              <p className="mt-1 font-display text-xl font-semibold text-text">{formatMoney(subscription.plan.priceCents, subscription.plan.currency)}</p>
              <p className="text-xs text-muted">{intervalLabels[subscription.plan.interval]}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Current period</p>
              <p className="mt-1 text-sm text-text">
                {formatDate(subscription.currentPeriodStart)} – {formatDate(subscription.currentPeriodEnd)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">Included</p>
              <ul className="mt-1 space-y-1 text-sm text-text">
                {parseFeatures(subscription.plan.features).slice(0, 4).map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
            </div>
          </CardBody>
        </Card>
      ) : (
        <EmptyState
          icon={Package}
          title="You don't have a plan yet"
          description="Compare the plans below and choose the one that fits you."
          className="mb-8"
        />
      )}

      {!checkout && (
        <div className="mb-6">
          <Notice title="Online checkout is not enabled yet">
            {selected ? (
              <>
                You selected <strong>{selected.name}</strong>. Open a support ticket and our team will help you activate it.
              </>
            ) : (
              "To start or change a plan, open a support ticket and our team will help you activate it."
            )}
          </Notice>
          <ButtonLink href={`/dashboard/support/new${selected ? `?plan=${selected.slug}` : ""}`} className="mt-4" size="sm">
            Request plan activation
          </ButtonLink>
        </div>
      )}

      <h2 className="mb-4 font-display text-lg font-semibold text-text">Available plans</h2>
      {plans.length === 0 ? (
        <EmptyState icon={Package} title="No plans available right now" />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              cta={
                subscription?.planId === plan.id ? (
                  <ButtonLink href="/dashboard/subscription" variant="secondary" className="w-full">
                    Current plan
                  </ButtonLink>
                ) : (
                  <ButtonLink href={`/dashboard/support/new?plan=${plan.slug}`} variant={plan.highlighted ? "primary" : "secondary"} className="w-full">
                    {subscription ? "Switch to this plan" : "Choose this plan"}
                  </ButtonLink>
                )
              }
            />
          ))}
        </div>
      )}
    </>
  );
}
