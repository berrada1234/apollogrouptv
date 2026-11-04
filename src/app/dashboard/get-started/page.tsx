import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowRight, Clock, Download, LifeBuoy, ReceiptText, ShieldCheck, Zap } from "lucide-react";
import { findSelectedPlan } from "@/components/checkout/selected-plan";
import { FireTvCheck } from "@/components/home/fire-tv-check";
import { PageHeader } from "@/components/page-header";
import { ButtonLink } from "@/components/ui/button";
import { db } from "@/lib/db";
import { getOpenInvoice } from "@/lib/checkout/service";
import { PLAN_COOKIE } from "@/lib/plan-cookie";
import { accessLabel, monthlyCents, pricingContext, savingsPct } from "@/lib/pricing";
import { getActivePlans } from "@/lib/queries";
import { requireUser } from "@/lib/session";
import { cn, formatDateTime, formatMoney } from "@/lib/utils";

export const metadata: Metadata = { title: "Finish Setting Up" };

const panel = "rounded-[14px] border border-border bg-card shadow-card";

/** Where a pack button goes: Plans & Billing turns ?plan into an invoice for that pack. */
const choose = (slug: string) => `/dashboard/plan?plan=${encodeURIComponent(slug)}`;

/**
 * Landing page for customers who have an account but have never bought a pack.
 * It picks up where they left off: an unpaid invoice first, then the pack they chose before signing up.
 */
export default async function GetStartedPage() {
  const user = await requireUser("/dashboard/get-started");
  const [subscriptions, plans, invoice, jar] = await Promise.all([
    db.subscription.count({ where: { userId: user.id } }),
    getActivePlans(),
    getOpenInvoice(user.id),
    cookies(),
  ]);
  // Customers who already have (or had) a pack manage it from the normal dashboard.
  if (subscriptions > 0) redirect("/dashboard");

  const remembered = await findSelectedPlan(jar.get(PLAN_COOKIE)?.value);
  const payable = invoice?.status === "PENDING" ? invoice : null;
  const reported = invoice && invoice.status !== "PENDING" ? invoice : null;
  const { baseMonthly, bestValueId } = pricingContext(plans);
  const allOneTime = plans.length > 0 && plans.every((p) => p.oneTime);
  const firstName = user.name.split(" ")[0];

  return (
    <>
      <PageHeader
        title={`Your account is ready, ${firstName}`}
        description="One step left: choose a pack and pay your invoice. Our team then switches it on and you can install the app."
      />

      {/* Pick up where they left off */}
      {payable ? (
        <section className={cn(panel, "mb-8 border-primary/40 p-6")} aria-labelledby="invoice-title">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[10px] bg-primary/15 text-accent">
                <ReceiptText className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 id="invoice-title" className="font-semibold text-text">
                  Your {payable.plan.name} invoice is waiting
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {formatMoney(payable.amountCents, payable.currency)} for {accessLabel(payable.plan.interval).toLowerCase()}.
                  {payable.expiresAt && <> Your price is held until {formatDateTime(payable.expiresAt)}.</>}
                </p>
              </div>
            </div>
            <ButtonLink href="/dashboard/plan" size="lg" className="shrink-0">
              Continue payment <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
          </div>
        </section>
      ) : reported ? (
        <section className={cn(panel, "mb-8 p-6")}>
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[10px] bg-primary/15 text-accent">
              <Clock className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2 className="font-semibold text-text">We&apos;re checking your payment</h2>
              <p className="mt-1 text-sm text-muted">
                Your {reported.plan.name} payment is being reviewed. You&apos;ll get a notification as soon as the pack is active.{" "}
                <Link href="/dashboard/plan" className="text-accent hover:text-light-blue">
                  See the invoice
                </Link>
              </p>
            </div>
          </div>
        </section>
      ) : remembered ? (
        <section className={cn(panel, "mb-8 border-primary/40 p-6")} aria-labelledby="remembered-title">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">The pack you chose</p>
              <h2 id="remembered-title" className="mt-1 font-display text-xl font-semibold text-text">
                {remembered.name}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {formatMoney(remembered.priceCents, remembered.currency)} · {accessLabel(remembered.interval)}
                {remembered.oneTime && " · one-time payment"}
              </p>
            </div>
            <ButtonLink href={choose(remembered.slug)} size="lg" className="shrink-0">
              Continue with {remembered.name} <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
          </div>
        </section>
      ) : null}

      {/* All packs: hidden while an invoice is waiting, so the pack they chose stays the focus. */}
      {payable || reported ? (
        <p className="text-sm text-muted">
          Want a different pack?{" "}
          <Link href="/dashboard/plan#packs" className="text-accent hover:text-light-blue">
            Change it on the invoice page
          </Link>
          .
        </p>
      ) : (
      <section aria-labelledby="packs-title">
        <h2 id="packs-title" className="font-display text-lg font-semibold text-text">
          {remembered ? "Or pick another pack" : "Choose your pack"}
        </h2>
        <p className="mt-1 text-sm text-muted">Every pack has the same channels, library, devices and support. Only the length changes.</p>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {plans.map((p) => {
            const monthly = monthlyCents(p);
            const save = savingsPct(p, baseMonthly);
            const best = p.id === bestValueId;
            return (
              <li key={p.id} className={cn(panel, "flex flex-col p-5", best && "border-primary/40")}>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-text">{p.name}</p>
                  {best && <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-accent">Best value</span>}
                </div>
                <p className="mt-1 text-sm text-muted">{accessLabel(p.interval)}</p>
                <p className="mt-4 font-display text-3xl font-extrabold text-text">{formatMoney(p.priceCents, p.currency)}</p>
                <p className="mt-1 h-5 text-sm text-muted">
                  {monthly !== null && p.interval !== "MONTHLY" && <>{formatMoney(monthly, p.currency)}/mo</>}
                  {save > 0 && <span className="text-success"> · save {save}%</span>}
                </p>
                <ButtonLink href={choose(p.slug)} variant={best ? "primary" : "secondary"} className="mt-5 w-full">
                  Choose {p.name}
                </ButtonLink>
              </li>
            );
          })}
        </ul>
      </section>
      )}

      {/* What happens next */}
      <section className="mt-10" aria-labelledby="next-title">
        <h2 id="next-title" className="font-display text-lg font-semibold text-text">
          What happens after you choose
        </h2>
        <ol className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            { icon: ReceiptText, t: "Pay your invoice", b: "Pick a payment method on the invoice and press I Have Paid when you're done." },
            { icon: Zap, t: "We switch it on", b: "Our team confirms the payment and activates your pack. You get a notification here." },
            { icon: Download, t: "Install the app", b: "Follow the guide for your device in Apps & Guides and sign in with this account." },
          ].map(({ icon: Icon, t, b }, i) => (
            <li key={t} className={cn(panel, "p-5")}>
              <span className="flex items-center gap-2 text-sm font-semibold text-accent">
                <Icon className="h-4 w-4" aria-hidden /> Step {i + 1}
              </span>
              <p className="mt-2 font-semibold text-text">{t}</p>
              <p className="mt-1 text-sm leading-6 text-muted">{b}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Common hesitations */}
      <section className="mt-10 grid gap-4 lg:grid-cols-2" aria-label="Before you pay">
        <FireTvCheck />
        <div className={cn(panel, "space-y-5 p-6")}>
          {allOneTime && (
            <p className="flex gap-3 text-sm leading-6 text-muted">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
              <span>
                <span className="font-semibold text-text">Pay once, nothing renews.</span> When your pack ends, access stops and you decide whether to add
                another. Refund requests follow our{" "}
                <Link href="/refund-policy" className="text-accent hover:text-light-blue">
                  refund policy
                </Link>
                .
              </span>
            </p>
          )}
          <p className="flex gap-3 text-sm leading-6 text-muted">
            <Download className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
            <span>
              <span className="font-semibold text-text">Not sure about your device?</span> The{" "}
              <Link href="/app" className="text-accent hover:text-light-blue">
                App page
              </Link>{" "}
              lists every supported device with its install guide.
            </span>
          </p>
          <p className="flex gap-3 text-sm leading-6 text-muted">
            <LifeBuoy className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
            <span>
              <span className="font-semibold text-text">Questions before you pay?</span>{" "}
              <Link href="/dashboard/support/new" className="text-accent hover:text-light-blue">
                Open a ticket
              </Link>{" "}
              and our team replies in writing.
            </span>
          </p>
        </div>
      </section>
    </>
  );
}
