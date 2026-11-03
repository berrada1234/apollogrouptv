import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertTriangle, Check, CreditCard, ExternalLink, Gift, Lock, Package, ShieldCheck, Sparkles, Tag, UserPlus, Zap } from "lucide-react";
import { InvoiceActions, ReservationTimer, SubscribeButton } from "@/components/checkout/checkout-client";
import { CheckoutSection } from "@/components/checkout/checkout-section";
import { findSelectedPlan } from "@/components/checkout/selected-plan";
import { planTabs, SectionTabs } from "@/components/dashboard/section-tabs";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/misc";
import { getCurrentSubscription } from "@/components/dashboard/overview";
import { ReferralClaimForm } from "@/components/dashboard/referral-claim";
import { db } from "@/lib/db";
import { invoiceStatusLabels } from "@/lib/checkout/labels";
import { getCustomerMethods } from "@/lib/checkout/methods";
import { CheckoutError, createInvoice, getOpenInvoice } from "@/lib/checkout/service";
import { rateLimit } from "@/lib/rate-limit";
import { accessLabel, monthlyCents, pricingContext, savingsPct } from "@/lib/pricing";
import { getActivePlans } from "@/lib/queries";
import { requireUser } from "@/lib/session";
import { getSettings } from "@/lib/settings";
import { cn, formatDate, formatMoney, parseFeatures } from "@/lib/utils";

export const metadata: Metadata = { title: "Plans & Billing" };

const panel = "rounded-[14px] border border-border bg-card shadow-card";

/** "$149.99" → ["$149", ".99"] so the cents can be styled smaller. */
function splitPrice(text: string) {
  const m = /^(.*?)([.,]\d{2})$/.exec(text);
  return m ? [m[1], m[2]] : [text, ""];
}

export default async function PlansBillingPage({ searchParams }: PageProps<"/dashboard/plan">) {
  const user = await requireUser("/dashboard/plan");
  const sp = await searchParams;
  const [subscription, plans, settings, referral, history, invoice, selected] = await Promise.all([
    getCurrentSubscription(user.id),
    getActivePlans(),
    getSettings(),
    db.referral.findUnique({ where: { refereeId: user.id }, include: { referrer: { select: { name: true } } } }),
    db.subscription.count({ where: { userId: user.id } }),
    getOpenInvoice(user.id),
    findSelectedPlan(sp.plan),
  ]);
  const methods = await getCustomerMethods(settings);
  // Self-serve checkout needs at least one usable payment method; otherwise packs go through an activation ticket.
  const checkout = methods.length > 0;
  // A pack chosen on the Plans page (carried through sign-up or sign-in) becomes the unpaid invoice straight away.
  // The redirect drops ?plan, so refreshing the page never creates another one.
  if (selected) {
    if (checkout && invoice?.planId !== selected.id && (await rateLimit(`invoice:${user.id}`, 10, 60 * 10)).ok) {
      try {
        await createInvoice(user.id, selected.slug);
      } catch (e) {
        if (!(e instanceof CheckoutError)) throw e;
      }
    }
    redirect("/dashboard/plan");
  }
  const payable = invoice?.status === "PENDING" ? invoice : null;
  const live = subscription && (subscription.status === "ACTIVE" || subscription.status === "PAST_DUE");
  const { baseMonthly, bestValueId } = pricingContext(plans);
  const included = plans[0] ? parseFeatures(plans[0].features) : [];
  const { liveChannels, moviesShows } = settings.highlights;
  const catalog = [liveChannels && `${liveChannels} live channels`, moviesShows && `${moviesShows} movies & shows`, "HD, Full HD and 4K where available"].filter(Boolean);
  const methodLabels = settings.payments.methods.split("\n").map((m) => m.trim()).filter(Boolean);
  const guides = settings.payments.guides
    .split("\n")
    .map((l) => l.split("|").map((x) => x.trim()))
    .filter(([label, href]) => label && /^https?:\/\//.test(href ?? ""))
    .map(([label, href]) => ({ label, href }));
  const mode = live ? "extend" : "new";

  return (
    <>
      <PageHeader title="Plans & Billing" description="Choose the pack that fits how you watch — pay once, no renewals." />
      <SectionTabs tabs={planTabs} current="/dashboard/plan" />

      {/* Purchase type */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[14px] border border-primary/25 bg-primary/[0.06] px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-primary/15 text-accent">
            {live ? <Zap className="h-5 w-5" aria-hidden /> : <UserPlus className="h-5 w-5" aria-hidden />}
          </span>
          <div>
            <p className="font-semibold text-text">{live ? "Extend your access" : "New account"}</p>
            <p className="text-sm text-muted">
              {live
                ? `Add time to your ${subscription.plan.name}${subscription.currentPeriodEnd ? ` — currently active until ${formatDate(subscription.currentPeriodEnd)}` : ""}.`
                : "First-time streaming setup — our team activates your pack and helps you install the app."}
            </p>
          </div>
        </div>
        {subscription && <StatusBadge status={subscription.status} />}
      </div>

      {invoice && (
        <section id="invoice" aria-labelledby="invoice-heading" className={cn(panel, "mb-6 scroll-mt-24 p-5 sm:p-6")}>
          <div className="flex items-start gap-4">
            <span
              className={cn(
                "grid h-12 w-12 shrink-0 place-items-center rounded-[12px]",
                invoice.status === "PENDING_CONFIRMATION" ? "bg-primary/15 text-accent" : "bg-warning/15 text-warning",
              )}
            >
              {invoice.status === "PENDING_CONFIRMATION" ? <ShieldCheck className="h-6 w-6" aria-hidden /> : <AlertTriangle className="h-6 w-6" aria-hidden />}
            </span>
            <div className="min-w-0 flex-1">
              <h2 id="invoice-heading" className="font-display text-lg font-bold text-text">
                {invoice.status === "PENDING"
                  ? "You have an unpaid invoice"
                  : invoice.status === "UNDERPAID"
                    ? "Your payment was short"
                    : "Your payment is under review"}
              </h2>
              <p className="mt-0.5 text-sm text-muted">
                {invoice.plan.name} · {accessLabel(invoice.plan.interval)} — <span className="font-semibold text-text">{formatMoney(invoice.amountCents, invoice.currency)}</span>
                <span className="ml-2 font-mono text-xs text-subtle">{invoice.number}</span>
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <StatusBadge status={invoice.status} label={invoiceStatusLabels[invoice.status]} />
                {invoice.status === "PENDING" && invoice.expiresAt && <ReservationTimer expiresAt={invoice.expiresAt.toISOString()} />}
              </div>
              {invoice.status === "PENDING" ? (
                <InvoiceActions orderId={invoice.id} cancellable />
              ) : (
                <p className="mt-3 text-sm leading-6 text-muted">
                  {invoice.status === "UNDERPAID"
                    ? "We received less than the invoice amount. Our team has been notified and will contact you to complete or refund it."
                    : "Our team is reviewing your payment. Your IPTV login details will appear in My Account once it's verified and activated."}{" "}
                  <Link href={`/dashboard/payment-review/${invoice.id}`} className="font-medium text-accent hover:text-light-blue">
                    View status
                  </Link>
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Packs */}
      <h2 className="sr-only">Available packs</h2>
      {plans.length === 0 ? (
        <EmptyState icon={Package} title="No packs available right now" description="Please check back soon or contact support." />
      ) : (
        <ul id="packs" className="grid scroll-mt-24 gap-4 pt-3 sm:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => {
            const best = plan.id === bestValueId;
            const save = savingsPct(plan, baseMonthly);
            const monthly = monthlyCents(plan);
            const [whole, cents] = splitPrice(formatMoney(plan.priceCents, plan.currency));
            const current = subscription?.planId === plan.id && live;
            return (
              <li
                key={plan.id}
                className={cn(
                  "relative flex flex-col rounded-[16px] border p-6 text-center",
                  best ? "border-primary/60 bg-gradient-to-b from-[#0b2a30] to-card shadow-glow" : "border-border bg-card shadow-card",
                )}
              >
                {best && (
                  <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-on-primary">
                    <Sparkles className="h-3 w-3" aria-hidden /> Best value
                  </span>
                )}
                <h3 className="font-display text-lg font-bold text-text">{plan.name}</h3>
                <p className="mt-0.5 text-sm font-medium text-accent">{accessLabel(plan.interval)}</p>
                <p className="mt-5 font-display font-extrabold tracking-tight text-text">
                  <span className="text-[2.75rem] leading-none">{whole}</span>
                  <span className="align-top text-xl">{cents}</span>
                </p>
                <p className="mt-2 min-h-5 text-sm text-muted">
                  {save > 0 ? (
                    <>
                      <span className="font-semibold text-success">Save {save}%</span>
                      {monthly && <> — {formatMoney(monthly, plan.currency)}/mo</>}
                    </>
                  ) : (
                    monthly && <>{formatMoney(monthly, plan.currency)}/mo</>
                  )}
                </p>
                <div className="mt-6 flex-1" />
                {current ? (
                  <ButtonLink href="/dashboard/subscription" variant="secondary" className="w-full">
                    Current pack
                  </ButtonLink>
                ) : checkout ? (
                  invoice?.planId === plan.id ? (
                    <ButtonLink href="#checkout" variant="primary" className="w-full">
                      Pay this invoice
                    </ButtonLink>
                  ) : (
                    <SubscribeButton plan={plan.slug} label={live ? "Add this pack" : "Subscribe"} primary={best} />
                  )
                ) : (
                  <ButtonLink href={`/dashboard/support/new?plan=${plan.slug}&mode=${mode}`} variant={best ? "primary" : "secondary"} className="w-full">
                    {live ? "Add this pack" : "Subscribe"}
                  </ButtonLink>
                )}
                <p className="mt-3 text-xs text-subtle">{plan.oneTime ? "One-time payment · No auto-renewal" : "Renews each period"}</p>
              </li>
            );
          })}
        </ul>
      )}

      {/* Promo + referral */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <details className={cn(panel, "group p-5")}>
          <summary className="flex cursor-pointer list-none items-center gap-3 font-semibold text-text [&::-webkit-details-marker]:hidden">
            <Tag className="h-5 w-5 text-accent" aria-hidden /> Have a promo code?
          </summary>
          <p className="mt-3 text-sm leading-6 text-muted">
            Add it to your activation request when you choose a pack. Our team checks it and applies any valid discount before you pay — nothing is charged until you&apos;ve
            agreed the final amount.
          </p>
        </details>
        <details className={cn(panel, "group p-5")} open={Boolean(referral)}>
          <summary className="flex cursor-pointer list-none items-center gap-3 font-semibold text-text [&::-webkit-details-marker]:hidden">
            <Gift className="h-5 w-5 text-accent" aria-hidden /> Were you referred by someone?
          </summary>
          <div className="mt-3 text-sm text-muted">
            {referral ? (
              <p className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success" aria-hidden /> Referred by <span className="font-semibold text-text">{referral.referrer.name}</span>.
              </p>
            ) : history > 0 ? (
              <p>Referral codes can only be added before your first pack.</p>
            ) : (
              <>
                <p className="mb-3 leading-6">Enter your friend&apos;s code so they get credit for inviting you.</p>
                <ReferralClaimForm />
              </>
            )}
          </div>
        </details>
      </div>

      {/* Included */}
      {(included.length > 0 || catalog.length > 0) && (
        <section aria-labelledby="included-heading" className={cn(panel, "mt-6 p-6")}>
          <h2 id="included-heading" className="font-display text-lg font-bold text-text">
            Included with every pack
          </h2>
          <p className="mt-1 text-sm text-muted">{catalog.join(" · ")}</p>
          {included.length > 0 && (
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {included.map((f) => (
                <li key={f} className="flex gap-2.5 text-sm text-text/90">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2.5} aria-hidden /> {f}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {checkout && (
        <div className={cn(panel, "mt-6 p-5 sm:p-6")}>
          <CheckoutSection methods={methods} orderId={payable?.id ?? null} supportHours={settings.general.supportHours} />
          {!payable && (
            <p className="mt-4 text-sm text-muted">
              {invoice ? "Your payment is being confirmed." : "Choose a pack above to create your invoice, then pay with any method here."}
            </p>
          )}
        </div>
      )}

      {/* Payment */}
      <section aria-labelledby="payment-heading" className={cn(panel, "mt-6 p-6", checkout && guides.length === 0 && "hidden")}>
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-primary/10 text-accent">
            <Lock className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h2 id="payment-heading" className="font-display text-lg font-bold text-text">
              {checkout ? "Secure payment" : "How payment works"}
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted">
              {settings.payments.intro ||
                (checkout
                  ? "You'll be taken to a secure payment page. Your pack activates once payment is confirmed — no recurring charges."
                  : "Choose a pack and we'll open an activation ticket. Our team confirms the amount and the payment options with you there, then activates your pack as soon as payment is confirmed. Pay once — nothing renews.")}
            </p>
            {methodLabels.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Accepted payment methods">
                {methodLabels.map((m) => (
                  <li key={m} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-inset px-3 py-1 text-xs font-medium text-text">
                    <CreditCard className="h-3.5 w-3.5 text-accent" aria-hidden /> {m}
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-4 text-xs text-subtle">Only pay through your Apollo Group TV account or a ticket from our team — never to details sent to you by email or message.</p>
          </div>
        </div>

        {guides.length > 0 && (
          <div className="mt-6 border-t border-border pt-5">
            <h3 className="text-sm font-semibold text-text">Payment guides</h3>
            <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {guides.map((g) => (
                <li key={g.label}>
                  <a
                    href={g.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-full flex-col items-center gap-1 rounded-xl border border-border bg-inset px-3 py-4 text-center transition-colors hover:border-primary/40"
                  >
                    <span className="text-sm font-semibold text-text">{g.label}</span>
                    <span className="inline-flex items-center gap-1 text-xs text-accent">
                      Guide <ExternalLink className="h-3 w-3" aria-hidden />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </>
  );
}
