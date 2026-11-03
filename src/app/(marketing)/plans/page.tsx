import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheck, CreditCard, KeyRound, LifeBuoy, Lock, MonitorSmartphone, Receipt, RotateCcw, ShieldCheck, Ticket } from "lucide-react";
import { Breadcrumbs, Container, EmptyState } from "@/components/ui/misc";
import { CtaBand } from "@/components/marketing/sections";
import { FaqAccordion } from "@/components/marketing/faq-list";
import { DrawnCheck, PricingExplorer, type PricingPlan } from "@/components/pricing/pricing-explorer";
import { afterHeader, cardClass, Section, SectionHeader } from "@/components/section";
import { homeCopy } from "@/content/home";
import { getCustomerMethods } from "@/lib/checkout/methods";
import { db } from "@/lib/db";
import { getActivePlans } from "@/lib/queries";
import { isCheckoutEnabled } from "@/lib/payments";
import { accessLabel, monthlyCents, monthsFor, perDayCents, pricingContext, savingsPct } from "@/lib/pricing";
import { getSettings } from "@/lib/settings";
import { siteConfig } from "@/lib/site";
import { cn, formatMoney, parseFeatures } from "@/lib/utils";

export const dynamic = "force-dynamic";

const title = "Apollo Group TV Plans & Pricing: One-Time Packs Compared";
const description =
  "Compare Apollo Group TV packs by total price, cost per month and per day. One-time payments, no auto-renewal and the same lineup on every pack.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/plans" },
  openGraph: { title, description, url: "/plans" },
};

const periodLabels = { MONTHLY: "Monthly", QUARTERLY: "Quarterly", SEMIANNUAL: "Semi-Annual", YEARLY: "Annual", ONE_TIME: "One-time" } as const;

/** "Most popular" is only claimed when paid orders show a clear leader. */
const POPULAR_MIN_ORDERS = 5;

export default async function PlansPage() {
  const [plans, settings, paidByPlan] = await Promise.all([
    getActivePlans(),
    getSettings(),
    db.order.groupBy({ by: ["planId"], where: { status: "PAID" }, _count: { _all: true } }),
  ]);
  const methods = await getCustomerMethods(settings);
  const checkout = isCheckoutEnabled();
  const pricing = pricingContext(plans);
  const allOneTime = plans.length > 0 && plans.every((p) => p.oneTime);
  const sorted = [...plans].sort((a, b) => monthsFor(a.interval) - monthsFor(b.interval));

  const counts = paidByPlan.map((r) => ({ id: r.planId, n: r._count._all })).sort((a, b) => b.n - a.n);
  const popularId = counts[0] && counts[0].n >= POPULAR_MIN_ORDERS && (!counts[1] || counts[0].n > counts[1].n) ? counts[0].id : null;

  const view: PricingPlan[] = sorted.map((p) => {
    const months = monthsFor(p.interval);
    const save = savingsPct(p, pricing.baseMonthly);
    const features = parseFeatures(p.features);
    const deviceMatch = features.join(" ").match(/up to (\d+) devices?/i);
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      description: p.description,
      priceCents: p.priceCents,
      currency: p.currency,
      months,
      periodLabel: periodLabels[p.interval],
      accessLabel: accessLabel(p.interval),
      oneTime: p.oneTime,
      features,
      devices: deviceMatch ? Number(deviceMatch[1]) : null,
      monthlyCents: monthlyCents(p),
      savingsPct: save,
      fullPriceCents: pricing.baseMonthly && months > 1 ? pricing.baseMonthly * months : null,
      badge: p.id === popularId ? "popular" : p.id === pricing.bestValueId ? "best" : p.highlighted ? "recommended" : null,
    };
  });
  const defaultId = popularId ?? pricing.bestValueId ?? view.find((p) => p.badge)?.id ?? view[0]?.id;
  const featuredId = defaultId;

  // Comparison rows: price figures per pack, then what every pack includes (same service on each).
  const shared = view[0]?.features ?? [];
  const sameEverywhere = view.every((p) => p.features.join("|") === shared.join("|"));
  const deviceNames = homeCopy.devices.logos.map((d) => d.name).join(", ");

  const priceRows: { k: string; v: (p: PricingPlan) => React.ReactNode }[] = [
    { k: "Subscription length", v: (p) => p.accessLabel },
    { k: "You pay", v: (p) => <span className="font-semibold text-text">{formatMoney(p.priceCents, p.currency)}</span> },
    { k: "Cost per month", v: (p) => (p.monthlyCents ? formatMoney(p.monthlyCents, p.currency) : "—") },
    {
      k: "Cost per day",
      v: (p) => {
        const d = perDayCents(sorted.find((s) => s.id === p.id)!);
        return d ? formatMoney(Math.round(d), p.currency) : "—";
      },
    },
    { k: "Saving", v: (p) => (p.savingsPct > 0 ? <span className="font-semibold text-success">{p.savingsPct}%</span> : "—") },
    { k: "Supported devices", v: (p) => (p.devices ? `Up to ${p.devices} devices` : "See plan details") },
    { k: "Renewal", v: (p) => (p.oneTime ? "None, pay once" : `Renews ${p.periodLabel.toLowerCase()}`) },
  ];
  const includedRows = [
    ...(sameEverywhere ? shared.filter((f) => !/^up to \d+ devices?/i.test(f)) : []),
    "Compatible with " + deviceNames,
    "Setup assistance in your support ticket",
    "Refund requests under the Refund Policy",
  ];

  const example = (() => {
    const shortest = sorted[0];
    const longest = sorted[sorted.length - 1];
    if (!shortest || !longest || shortest.id === longest.id || !pricing.baseMonthly) return null;
    const months = monthsFor(longest.interval);
    const viaShort = pricing.baseMonthly * months;
    return viaShort > longest.priceCents ? { months, viaShort, long: longest, diff: viaShort - longest.priceCents } : null;
  })();

  const trust = [
    {
      icon: Lock,
      t: "Payment",
      b: methods.length
        ? `Pay with ${methods.map((m) => m.name).join(", ")}. Each invoice has its own number and amount, and a payment only counts once our team or the blockchain confirms it.`
        : "Our team confirms the amount and payment options with you before anything is charged.",
      link: { href: "/payment-methods", label: "Payment methods" },
    },
    {
      icon: Receipt,
      t: "Subscription terms",
      b: allOneTime
        ? "Each pack is one payment for a fixed number of days. There is no automatic renewal and no setup or activation fee."
        : "The price, length and renewal of each pack are shown before you pay.",
      link: { href: "/terms-and-conditions", label: "Terms of Service" },
    },
    {
      icon: RotateCcw,
      t: "Ending or cancelling",
      b: allOneTime
        ? "Nothing to cancel: access stops when the pack ends. To keep watching, choose a new pack, which starts when the current one ends."
        : "You can stop renewal at any time from your dashboard.",
      link: {
        href: "/refund-policy",
        label: settings.highlights.moneyBackDays ? `Refund Policy (${settings.highlights.moneyBackDays}-day window)` : "Refund Policy",
      },
    },
    {
      icon: LifeBuoy,
      t: "Support",
      b: `Questions before or after you buy get a written reply in one ticket thread${settings.general.supportEmail ? `, or email ${settings.general.supportEmail}` : ""}.`,
      link: { href: "/contact", label: "Contact support" },
    },
  ];

  const steps = [
    { icon: Ticket, t: "Choose a pack", b: "Pick a period above, create your account and your invoice is waiting in Plans & Billing." },
    { icon: CreditCard, t: "Pay your invoice", b: checkout ? "Choose a payment method, send the exact amount and press I Have Paid." : "Our team confirms the amount and payment options with you before anything is charged." },
    { icon: CalendarCheck, t: "Get activated", b: "Once payment is confirmed, our team activates your pack and adds your login details to My Account." },
    { icon: MonitorSmartphone, t: "Install and watch", b: "Follow the guide for your device and sign in with the details from My Account." },
  ];

  const planFaq = [
    { q: "Is the price for one month or for the whole period?", a: "For the whole period. Each pack is a single payment that covers its full access time. The monthly figure is there to make packs easy to compare." },
    { q: "Does my pack renew automatically?", a: "No. Access simply stops when the pack ends, and nothing is charged. When you're ready, choose a new pack from your dashboard." },
    { q: "Can I add a pack before my current one ends?", a: "Yes. Buy a new pack while yours is active and the new period normally starts when the current one ends, so you don't lose any days." },
    { q: "Do longer packs get more channels or better quality?", a: "No. Every pack includes the same live lineup, on-demand library, device allowance and support. Only the length and the price change." },
    { q: "Are there setup fees or extras?", a: "There are no setup or activation fees. The amount on your invoice is the amount you pay." },
    { q: "How do refunds work?", a: "Refund requests follow our [Refund Policy](/refund-policy), which lists the conditions and the time window. Read it before you buy." },
  ];

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Apollo Group TV subscription",
    serviceType: "Internet TV streaming",
    provider: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    url: `${siteConfig.url}/plans`,
    offers: plans.map((p) => ({
      "@type": "Offer",
      name: p.name,
      price: (p.priceCents / 100).toFixed(2),
      priceCurrency: p.currency,
      description: `${accessLabel(p.interval)}, one-time payment`,
      url: `${siteConfig.url}/plans`,
    })),
  };

  return (
    <>
      {plans.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd).replace(/</g, "\\u003c") }} />}

      {/* Pricing hero */}
      <section className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(80%_70%_at_50%_0%,var(--midnight),transparent_70%)]" aria-hidden />
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
          <div className="starfield" />
          <span className="orb left-[8%] top-[10%] h-64 w-64 bg-[rgb(70_224_255/0.18)]" />
          <span className="orb right-[6%] top-[30%] h-72 w-72 bg-[rgb(157_123_255/0.22)] [animation-delay:-6s]" />
          <span className="orb bottom-[-10%] left-[40%] h-56 w-56 bg-[rgb(122_162_255/0.16)] [animation-delay:-12s]" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-b from-transparent to-bg" aria-hidden />
        <Container className="relative pb-10 pt-12 text-center sm:pb-14 sm:pt-16 lg:pt-20">
          <div className="flex justify-center [&_nav_ol]:justify-center">
            <Breadcrumbs items={[{ href: "/plans", label: "Plans" }]} />
          </div>
          <div className="relative mx-auto max-w-4xl">
            <div className="headline-light pointer-events-none absolute inset-x-[10%] -inset-y-10 -z-10 rounded-full blur-2xl" aria-hidden />
            <h1 className="font-hero font-medium tracking-[-0.045em] text-text">
              <span className="rise block text-base font-normal tracking-[-0.01em] text-light-blue sm:text-lg" style={{ "--d": 0 } as React.CSSProperties}>
                Apollo Group TV Plans &amp; Pricing
              </span>
              <span className="rise mt-4 block text-[2.5rem] leading-[1.05] sm:text-[3.5rem] lg:text-[4.25rem]" style={{ "--d": 1 } as React.CSSProperties}>
                Choose Your Perfect Plan
              </span>
            </h1>
            <p className="rise mx-auto mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8" style={{ "--d": 2 } as React.CSSProperties}>
              Flexible plans. Premium entertainment. An experience designed around you.
            </p>
            <ul className="rise mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted" style={{ "--d": 3 } as React.CSSProperties}>
              {allOneTime && (
                <li className="inline-flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-accent" aria-hidden /> One-time payment, no auto-renewal
                </li>
              )}
              <li className="inline-flex items-center gap-2">
                <MonitorSmartphone className="h-4 w-4 text-accent" aria-hidden /> Same channels on every pack
              </li>
              <li className="inline-flex items-center gap-2">
                <LifeBuoy className="h-4 w-4 text-accent" aria-hidden /> Setup help included
              </li>
            </ul>
          </div>
        </Container>
      </section>

      {/* Period switch + packs */}
      <section className="relative pb-20 sm:pb-24">
        <Container>
          {!checkout && (
            <div className="mx-auto mb-10 flex max-w-3xl items-start gap-3 rounded-[16px] border border-primary/25 bg-primary/[0.05] px-5 py-4 text-sm">
              <KeyRound className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
              <p className="text-muted">
                <span className="font-semibold text-text">How buying works right now:</span> create a free account, choose your pack in the dashboard, and our team confirms
                the payment options with you before activating it. You never pay before you&apos;ve agreed the amount.
              </p>
            </div>
          )}
          {view.length > 0 && defaultId ? (
            <PricingExplorer plans={view} defaultId={defaultId} />
          ) : (
            <EmptyState icon={CreditCard} title="Plans will be published soon" description="Pricing is being finalized. Please check back shortly." />
          )}
        </Container>
      </section>

      {/* Comparison table */}
      {view.length > 1 && (
        <section className="section-y relative" aria-labelledby="compare-heading">
          <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(72rem,90%)] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgb(122_162_255/0.22),transparent)]" aria-hidden />
          <Container>
            <div className="reveal mx-auto max-w-2xl text-center">
              <h2 id="compare-heading" className="font-hero text-[1.75rem] font-medium leading-[1.12] tracking-[-0.035em] text-text sm:text-[2.25rem] lg:text-[2.75rem]">
                Compare Every Apollo Group TV Pack
              </h2>
              <p className="mt-4 text-base leading-7 text-muted sm:text-[17px] sm:leading-8">
                The service is the same on every pack, so the real difference is length and price. Figures are calculated from the current prices.
              </p>
            </div>

            <p className={cn(afterHeader, "mb-3 text-center text-xs text-subtle md:hidden")} aria-hidden>
              Swipe the table to see every pack
            </p>
            <div className="glass relative mt-0 overflow-x-auto rounded-[24px] md:mt-12 lg:overflow-visible">
              <table className="w-full min-w-[760px] text-sm">
                <caption className="sr-only">Apollo Group TV packs compared by length, price, devices and what is included</caption>
                <thead>
                  <tr>
                    <th scope="col" className="w-[24%] rounded-tl-[24px] px-6 pb-5 pt-7 text-left text-sm font-medium text-subtle lg:sticky lg:top-[4.5rem] lg:z-10 lg:bg-[#0b0f26]/95 lg:backdrop-blur">
                      Pack
                    </th>
                    {view.map((p, i) => (
                      <th
                        key={p.id}
                        scope="col"
                        className={cn(
                          "px-5 pb-5 pt-7 text-left align-bottom lg:sticky lg:top-[4.5rem] lg:z-10 lg:bg-[#0b0f26]/95 lg:backdrop-blur",
                          p.id === featuredId && "bg-[rgb(122_162_255/0.08)] lg:bg-[#131845]/95",
                          i === view.length - 1 && "rounded-tr-[24px]",
                        )}
                      >
                        {p.badge && <span className="mb-2 block text-xs font-semibold text-light-blue">{p.badge === "popular" ? "Most popular" : p.badge === "best" ? "Best value" : "Recommended"}</span>}
                        <span className="block text-base font-semibold text-text">{p.name}</span>
                        <span className="mt-0.5 block font-hero text-xl font-medium tracking-[-0.04em] text-text">{formatMoney(p.priceCents, p.currency)}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {priceRows.map((r) => (
                    <tr key={r.k} className="border-t border-border transition-colors hover:bg-white/[0.02]">
                      <th scope="row" className="px-6 py-4 text-left font-medium text-muted">
                        {r.k}
                      </th>
                      {view.map((p) => (
                        <td key={p.id} className={cn("px-5 py-4 text-text/90 tabular-nums", p.id === featuredId && "bg-[rgb(122_162_255/0.06)]")}>
                          {r.v(p)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="border-t border-border-strong">
                    <th scope="colgroup" colSpan={view.length + 1} className="px-6 pb-2 pt-6 text-left text-sm font-semibold text-text">
                      Included in every pack
                    </th>
                  </tr>
                  {includedRows.map((f) => (
                    <tr key={f} className="border-t border-border transition-colors hover:bg-white/[0.02]">
                      <th scope="row" className="px-6 py-4 text-left font-normal text-muted">
                        {f}
                      </th>
                      {view.map((p) => (
                        <td key={p.id} className={cn("px-5 py-4", p.id === featuredId && "bg-[rgb(122_162_255/0.06)]")}>
                          <DrawnCheck />
                          <span className="sr-only">Included</span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-center text-xs text-subtle">
              Saving compares each pack with buying the 1-month pack repeatedly for the same length of time.
              {example && (
                <>
                  {" "}
                  For example, {example.months} months of monthly packs cost {formatMoney(example.viaShort, example.long.currency)}; the {example.long.name} costs{" "}
                  {formatMoney(example.long.priceCents, example.long.currency)}.
                </>
              )}
            </p>
          </Container>
        </section>
      )}

      {/* Trust and conversion */}
      <Section>
        <SectionHeader align="center" eyebrow="Before you buy" title="Clear Terms, Real Support" description="What you pay, how it ends and who helps you, in plain words." />
        <ul className={cn(afterHeader, "grid gap-4 sm:grid-cols-2 lg:grid-cols-4")}>
          {trust.map((t) => (
            <li key={t.t} className={cn(cardClass, "group flex flex-col p-6")}>
              <span className="icon-lift grid h-11 w-11 place-items-center rounded-[12px] border border-[rgb(122_162_255/0.25)] bg-[linear-gradient(140deg,rgb(70_224_255/0.16),rgb(157_123_255/0.12))] text-accent">
                <t.icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-text">{t.t}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-muted">{t.b}</p>
              <Link href={t.link.href} className="mt-5 text-sm font-semibold text-accent hover:text-light-blue">
                {t.link.label}
              </Link>
            </li>
          ))}
        </ul>

        <ol className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.t} className="relative rounded-[16px] border border-border p-6">
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-[rgb(122_162_255/0.45)] font-hero text-sm font-medium text-light-blue">{i + 1}</span>
                <s.icon className="h-5 w-5 text-subtle" aria-hidden />
              </div>
              <h3 className="mt-5 text-base font-semibold text-text">{s.t}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{s.b}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Pricing questions */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16 [&>*]:min-w-0">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="Pricing questions"
              title="Questions About Packs and Payment"
              description={
                <>
                  Billing, accounts and devices are covered in the{" "}
                  <Link href="/faq#plans-billing" className="text-accent hover:text-light-blue">
                    full FAQ
                  </Link>
                  .
                </>
              }
            />
            <p className="mt-6 flex items-start gap-2.5 text-sm text-muted">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
              Only pay through the payment window linked to your own invoice. We never ask for payment by email or chat.
            </p>
          </div>
          <div className="lg:col-span-7">
            <FaqAccordion items={planFaq.map((f, i) => ({ id: `plans-${i}`, category: "Plans", question: f.q, answer: f.a }))} />
          </div>
        </div>
      </Section>

      <CtaBand title="Ready to pick your pack?" description="Create a free account, choose a pack and our team gets you watching." />
    </>
  );
}
