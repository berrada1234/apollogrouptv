import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { planTabs, SectionTabs } from "@/components/dashboard/section-tabs";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/misc";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { formatDate, formatMoney, intervalLabels } from "@/lib/utils";

export const metadata: Metadata = { title: "Subscription Details" };

export default async function SubscriptionPage() {
  const user = await requireUser("/dashboard/subscription");
  const subscriptions = await db.subscription.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { plan: true },
  });

  return (
    <>
      <PageHeader title="Plans & Billing" description="Your current plan, the packs you can choose and your subscription records." />
      <SectionTabs tabs={planTabs} current="/dashboard/subscription" />
      {subscriptions.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No subscriptions yet"
          description="Once a plan is activated on your account, its details will appear here."
          action={<ButtonLink href="/dashboard/plan">Choose a plan</ButtonLink>}
        />
      ) : (
        <div className="space-y-5">
          {subscriptions.map((s) => (
            <Card key={s.id}>
              <CardHeader title={s.plan.name} description={`Subscription ID: ${s.id}`} action={<StatusBadge status={s.status} />} />
              <CardBody>
                <dl className="grid gap-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <dt className="text-muted">Price</dt>
                    <dd className="mt-1 text-text">
                      {formatMoney(s.plan.priceCents, s.plan.currency)} · {intervalLabels[s.plan.interval]}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted">Period start</dt>
                    <dd className="mt-1 text-text">{formatDate(s.currentPeriodStart)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">{s.cancelAtPeriodEnd ? "Ends on" : "Renews on"}</dt>
                    <dd className="mt-1 text-text">{formatDate(s.currentPeriodEnd)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Auto-renew</dt>
                    <dd className="mt-1 text-text">{s.cancelAtPeriodEnd ? "Off" : s.status === "ACTIVE" ? "On" : "—"}</dd>
                  </div>
                </dl>
              </CardBody>
            </Card>
          ))}
          <p className="text-sm text-muted">
            Need to change or cancel your subscription?{" "}
            <Link href="/dashboard/support/new" className="text-accent hover:text-light-blue">
              Open a support ticket
            </Link>
            .
          </p>
        </div>
      )}
    </>
  );
}
