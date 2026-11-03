import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheck, Check, CreditCard, KeyRound, LayoutDashboard, LifeBuoy, Lock, MonitorSmartphone, Ticket } from "lucide-react";
import { Container, EmptyState } from "@/components/ui/misc";
import { CtaBand, PageHero, PlanCard } from "@/components/marketing/sections";
import { FaqAccordion } from "@/components/marketing/faq-list";
import { afterHeader, cardClass, Section, SectionHeader } from "@/components/section";
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

const everyPlan = [
  { icon: LayoutDashboard, t: "Customer dashboard" },
  { icon: LifeBuoy, t: "Ticket-based support" },
  { icon: Lock, t: "Secure, verified account" },
  { icon: CreditCard, t: "Full billing history" },
];

export default async function PlansPage() {
  const [plans, settings] = await Promise.all([getActivePlans(), getSettings()]);
  const checkout = isCheckoutEnabled();
  const pricing = pricingContext(plans);
  const allOneTime = plans.length > 0 && plans.every((p) => p.oneTime);
  const shared = plans[0] ? parseFeatures(plans[0].features) : [];
  const sorted = [...plans].sort((a, b) => monthsFor(a.interval) - monthsFor(b.interval));
  const shortest = sorted[0];
  const longest = sorted[sorted.length - 1];
  const best = plans.find((p) => p.id === pricing.bestValueId);
  const middle = sorted.find((p) => p.id !== shortest?.id && p.id !== best?.id);

  // Worked example from real prices: a year on the shortest pack vs the longest pack.
  const example =
    shortest && longest && shortest.id !== longest.id && pricing.baseMonthly
      ? (() => {
          const months = monthsFor(longest.interval);
          const viaShort = pricing.baseMonthly * months;
          return { months, viaShort, long: longest.priceCents, diff: viaShort - longest.priceCents, currency: longest.currency };
        })()
      : null;

  const guide = [
    shortest && { who: "Trying it for the first time", why: "One month is enough to set up your devices and see how the lineup fits your routine.", plan: shortest },
    middle && { who: "Watching every week", why: "A mid-length pack lowers the monthly cost without committing to a whole year.", plan: middle },
    best && { who: "Settled in for the long run", why: "The lowest cost per month of any pack, and nothing to remember to renew.", plan: best },
  ].filter(Boolean) as { who: string; why: string; plan: (typeof plans)[number] }[];

  const steps = [
    { icon: Ticket, t: "Choose a pack", b: "Pick it from your dashboard. We open an activation request with the pack already filled in." },
    { icon: CreditCard, t: "Confirm and pay", b: checkout ? "Pay on the secure checkout page. Nothing renews afterwards." : "Our team confirms the amount and payment options with you in that request — nothing is charged before you agree." },
    { icon: CalendarCheck, t: "Get activated", b: "Your pack shows as active with its start and end dates under Plans & Billing in your dashboard." },
    { icon: MonitorSmartphone, t: "Install and watch", b: "Follow the guide for your device in Apps & Guides and sign in." },
  ];

  const planFaq = [
    {
      q: "Is the price for one month or for the whole period?",
      a: "For the whole period. Each pack is a single payment that covers its full access time — the monthly figure underneath is only there to make packs easy to compare.",
    },
    {
      q: "What happens when my pack runs out?",
      a: "Access simply stops. Nothing is charged automatically; when you're ready, choose a new pack from your dashboard and our team activates it.",
    },
    {
      q: "Can I add a pack before my current one ends?",
      a: "Yes. Choose “Add this pack” in Plans & Billing while your pack is active, and our team confirms how the extra time is added before you pay.",
    },
    {
      q: "Do longer packs get more channels or better quality?",
      a: "No. Every pack includes the same live lineup, on-demand library, device allowance and support. Only the length and the price change.",
    },
    {
      q: "Are there setup fees or extras?",
      a: "There are no setup or activation fees. The amount you pay is confirmed with you before payment; any tax that applies where you live is shown at that point.",
    },
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
      <PageHero
        align="center"
        eyebrow="Plans"
        title="Apollo Group TV Plans and Pricing"
        description={
          allOneTime
            ? "Four one-time packs, from one month to a full year. Every pack has the same channels and features — the longer you choose, the less you pay per month, and nothing ever renews on its own."
            : "Compare packs by price and length. Every pack has the same channels and features."
        }
        crumbs={[{ href: "/plans", label: "Plans" }]}
      >
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted">
          {everyPlan.map((e) => (
            <li key={e.t} className="inline-flex items-center gap-2">
              <e.icon className="h-4 w-4 text-accent" aria-hidden /> {e.t}
            </li>
          ))}
        </ul>
      </PageHero>

      {/* Packs */}
      <Section>
        {!checkout && (
          <div className="mx-auto mb-10 flex max-w-3xl items-start gap-3 rounded-[14px] border border-primary/25 bg-primary/[0.05] px-5 py-4 text-sm">
            <KeyRound className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
            <p className="text-muted">
              <span className="font-semibold text-text">How buying works right now:</span> create a free account, choose your pack in the dashboard, and our team confirms
              the payment options with you before activating it. You never pay before you&apos;ve agreed the amount.
            </p>
          </div>
        )}
        <h2 className="sr-only">Available packs</h2>
        {plans.length > 0 ? (
          <div className={cn("grid items-stretch gap-5 pt-3 md:grid-cols-2", plans.length >= 4 ? "xl:grid-cols-4" : "lg:grid-cols-3")}>
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} baseMonthly={pricing.baseMonthly} bestValue={plan.id === pricing.bestValueId} />
            ))}
          </div>
        ) : (
          <EmptyState icon={CreditCard} title="Plans will be published soon" description="Pricing is being finalized. Please check back shortly." />
        )}
      </Section>

      {/* Cost comparison */}
      {plans.length > 1 && (
        <section className="section-y border-y border-border bg-bg-secondary" aria-labelledby="cost-heading">
          <Container>
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16 [&>*]:min-w-0">
              <div className="lg:col-span-4">
                <SectionHeader
                  eyebrow="Compare the cost"
                  title="What Each Pack Really Costs"
                  description="Same service on every pack, so the only real comparison is price over time. These figures are calculated from the current prices."
                />
                {example && example.diff > 0 && (
                  <p className="mt-6 rounded-[14px] border border-primary/25 bg-primary/[0.06] p-4 text-sm leading-6 text-muted">
                    <span className="font-semibold text-text">Example:</span> {example.months} months of month-by-month packs would cost{" "}
                    {formatMoney(example.viaShort, example.currency)}. The {longest.name} covers the same time for {formatMoney(example.long, example.currency)} —{" "}
                    <span className="font-semibold text-success">{formatMoney(example.diff, example.currency)} less</span>.
                  </p>
                )}
              </div>
              <div className="lg:col-span-8">
                <div className={cn(cardClass, "relative overflow-x-auto")}>
                  <table className="w-full min-w-[560px] text-sm">
                    <caption className="sr-only">Price, cost per month and per day for each pack</caption>
                    <thead className="text-left text-[11px] uppercase tracking-[0.1em] text-subtle">
                      <tr className="border-b border-border">
                        <th scope="col" className="px-5 py-4 font-semibold">Pack</th>
                        <th scope="col" className="px-5 py-4 font-semibold">Access</th>
                        <th scope="col" className="px-5 py-4 font-semibold">You pay</th>
                        <th scope="col" className="px-5 py-4 font-semibold">Per month</th>
                        <th scope="col" className="px-5 py-4 font-semibold">Per day</th>
                        <th scope="col" className="px-5 py-4 font-semibold">Saving</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sorted.map((p) => {
                        const m = monthlyCents(p);
                        const d = perDayCents(p);
                        const s = savingsPct(p, pricing.baseMonthly);
                        return (
                          <tr key={p.id} className={cn("border-b border-border last:border-0", p.id === pricing.bestValueId && "bg-primary/[0.05]")}>
                            <th scope="row" className="px-5 py-3.5 text-left font-semibold text-text">{p.name}</th>
                            <td className="px-5 py-3.5 text-muted">{accessLabel(p.interval)}</td>
                            <td className="px-5 py-3.5 font-semibold text-text tabular-nums">{formatMoney(p.priceCents, p.currency)}</td>
                            <td className="px-5 py-3.5 text-muted tabular-nums">{m ? formatMoney(m, p.currency) : "—"}</td>
                            <td className="px-5 py-3.5 text-muted tabular-nums">{d ? formatMoney(Math.round(d), p.currency) : "—"}</td>
                            <td className="px-5 py-3.5 tabular-nums">{s > 0 ? <span className="font-semibold text-success">{s}%</span> : <span className="text-subtle">—</span>}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-xs text-subtle">Saving compares each pack with buying the 1-month pack repeatedly for the same length of time.</p>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Which pack */}
      {guide.length > 1 && (
        <Section>
          <SectionHeader align="center" eyebrow="Choosing" title="Which Pack Fits How You Watch?" />
          <ul className={cn(afterHeader, "grid gap-4 md:grid-cols-3")}>
            {guide.map((g) => (
              <li key={g.who} className={cn(cardClass, "flex flex-col p-6")}>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{g.who}</p>
                <p className="mt-2 font-display text-xl font-bold text-text">{g.plan.name}</p>
                <p className="text-sm text-subtle">
                  {accessLabel(g.plan.interval)} · {formatMoney(g.plan.priceCents, g.plan.currency)}
                </p>
                <p className="mt-3 flex-1 text-sm leading-6 text-muted">{g.why}</p>
              </li>
            ))}
          </ul>
          {shared.length > 0 && (
            <div className={cn(cardClass, "mt-6 p-6")}>
              <p className="font-semibold text-text">Every pack includes</p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {shared.map((f) => (
                  <li key={f} className="flex gap-2.5 text-sm text-text/90">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2.5} aria-hidden /> {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Section>
      )}

      {/* After you choose */}
      <section className="section-y border-y border-border bg-bg-secondary" aria-labelledby="after-heading">
        <Container>
          <SectionHeader eyebrow="After you choose" title="From Choosing a Pack to Watching" />
          <ol className={cn(afterHeader, "grid gap-4 sm:grid-cols-2 lg:grid-cols-4")}>
            {steps.map((s, i) => (
              <li key={s.t} className={cn(cardClass, "p-6")}>
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-primary/40 font-display text-sm font-bold text-accent">{i + 1}</span>
                  <s.icon className="h-5 w-5 text-subtle" aria-hidden />
                </div>
                <h3 className="mt-5 font-display text-base font-bold text-text">{s.t}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{s.b}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm text-muted">
            Refund requests follow our{" "}
            <Link href="/refund-policy" className="text-accent hover:text-light-blue">
              Refund Policy
            </Link>
            {settings.highlights.moneyBackDays ? ` (${settings.highlights.moneyBackDays}-day window)` : ""} — read it before you buy.
          </p>
        </Container>
      </section>

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
