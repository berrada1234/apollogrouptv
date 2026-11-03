import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, Hourglass, KeyRound } from "lucide-react";
import { AutoRefresh } from "@/components/checkout/auto-refresh";
import { StatusBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { db } from "@/lib/db";
import { invoiceStatusLabels } from "@/lib/checkout/labels";
import { accessLabel } from "@/lib/pricing";
import { requireUser } from "@/lib/session";
import { formatDateTime, formatMoney } from "@/lib/utils";

export const metadata: Metadata = { title: "Payment Under Review" };

export default async function PaymentReviewPage({ params }: PageProps<"/dashboard/payment-review/[id]">) {
  const user = await requireUser("/dashboard/plan");
  const { id } = await params;
  // Scoped to the signed-in customer: another customer's invoice is a 404.
  const order = await db.order.findFirst({
    where: { id, userId: user.id },
    include: { plan: true, method: { select: { name: true } }, subscription: { select: { status: true } } },
  });
  if (!order) notFound();

  const activated = order.subscription?.status === "ACTIVE";
  const approved = order.status === "PAID";
  const reviewing = !approved && order.status === "PENDING_CONFIRMATION";
  const status = approved && !activated ? "Paid · Activation in progress" : invoiceStatusLabels[order.status];

  const details: [string, React.ReactNode][] = [
    ["Invoice ID", <span key="n" className="font-mono">{order.number ?? order.id}</span>],
    ["Subscription Plan", `${order.plan.name} · ${accessLabel(order.plan.interval)}`],
    ["Amount", formatMoney(order.amountCents, order.currency)],
    ["Payment Method", order.method?.name ?? "Not specified"],
    ["Submitted Date", order.reportedAt ? formatDateTime(order.reportedAt) : "—"],
    ["Current Status", <StatusBadge key="s" status={approved ? "PAID" : order.status} label={status} />],
  ];

  return (
    <div className="mx-auto max-w-2xl">
      {(reviewing || (approved && !activated)) && <AutoRefresh seconds={30} />}
      <section className="overflow-hidden rounded-[20px] border border-border bg-card shadow-card">
        <div className="relative border-b border-border bg-gradient-to-b from-[#141a4a] to-card px-6 py-10 text-center sm:px-10">
          {activated ? (
            <CheckCircle2 className="mx-auto h-14 w-14 text-success" aria-hidden />
          ) : (
            <span className="relative mx-auto grid h-20 w-20 place-items-center" aria-hidden>
              <span className="absolute inset-0 animate-ping rounded-full bg-primary/15 motion-reduce:animate-none" />
              <span className="absolute inset-2 rounded-full border-2 border-primary/30 border-t-primary animate-spin [animation-duration:2.4s] motion-reduce:animate-none" />
              <Hourglass className="relative h-8 w-8 text-accent" />
            </span>
          )}
          <p className="mt-5 inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-light-blue">
            {activated ? "Subscription active" : approved ? "Payment verified" : "Waiting for Payment Verification"}
          </p>
          <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-text sm:text-3xl">
            {activated ? "Your Account Is Active!" : approved ? "Payment Approved!" : "Your Payment Is Under Review!"}
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted">
            {activated
              ? "Your IPTV account details are ready in My Account."
              : approved
                ? "Your payment has been verified. We're activating your subscription now; your IPTV account details will appear in My Account as soon as it's ready."
                : "Thank you for submitting your payment confirmation. Our team is currently reviewing your payment. Once your payment has been verified and your subscription activated, your IPTV account information will appear automatically in My Account."}
          </p>
        </div>

        <div className="px-6 py-6 sm:px-10">
          <h2 className="text-sm font-semibold text-text">Your subscription details</h2>
          <dl className="mt-4 divide-y divide-border rounded-[14px] border border-border bg-inset">
            {details.map(([k, v]) => (
              <div key={k} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                <dt className="text-muted">{k}</dt>
                <dd className="text-right font-medium text-text">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/dashboard/subscription" className="attention flex-1">
              <KeyRound className="attention-hand h-4 w-4" aria-hidden /> Get Your Login Info
            </ButtonLink>
            {!activated && (
              <ButtonLink href="/dashboard/support/new" variant="secondary" className="flex-1">
                Contact support
              </ButtonLink>
            )}
          </div>
          {!activated && <p className="mt-4 text-center text-xs text-subtle">This page updates automatically. You&apos;ll also get a notification when anything changes.</p>}
        </div>
      </section>
    </div>
  );
}
