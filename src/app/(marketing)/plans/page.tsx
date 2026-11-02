import type { Metadata } from "next";
import Link from "next/link";
import { Check, CreditCard, LayoutDashboard, LifeBuoy, Lock, Minus } from "lucide-react";
import { Container, EmptyState, SectionHeading } from "@/components/ui/misc";
import { CtaBand, PageHero, PlanCard } from "@/components/marketing/sections";
import { FaqAccordion } from "@/components/marketing/faq-list";
import { getActivePlans, getPublishedFaqs } from "@/lib/queries";
import { isCheckoutEnabled } from "@/lib/payments";
import { pricingContext, savingsPct } from "@/lib/pricing";
import { cn, formatMoney, intervalLabels, parseFeatures } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Apollo Group TV Plans & Pricing" },
  description: "Compare Apollo Group TV plans side by side: price, billing period and what each includes. See how activation and billing work before you sign up.",
  alternates: { canonical: "/plans" },
  openGraph: { title: "Apollo Group TV Plans & Pricing", description: "Compare Apollo Group TV plans side by side: price, billing period and what each includes. See how activation and billing work before you sign up.", url: "/plans" },
};

const fallbackFaqs = [
  { id: "billing-1", category: "Billing", question: "Can I change my plan later?", answer: "Yes. Open a support request from your dashboard and our team will help you move to a different plan." },
  { id: "billing-2", category: "Billing", question: "Where can I see my invoices?", answer: "Your billing history is available under Dashboard → Billing History once payments have been recorded." },
  { id: "billing-3", category: "Billing", question: "Do you store my card details?", answer: "No. Card payments are handled by our payment provider; we only store a reference to each transaction." },
];

const everyPlan = [
  { icon: LayoutDashboard, t: "Customer dashboard" },
  { icon: LifeBuoy, t: "Ticket-based support" },
  { icon: Lock, t: "Secure, verified account" },
  { icon: CreditCard, t: "Full billing history" },
];

export default async function PlansPage() {
  const [plans, faqs] = await Promise.all([getActivePlans(), getPublishedFaqs()]);
  const billingFaqs = faqs.filter((f) => /billing|payment|plan|pricing/i.test(f.category));
  const checkout = isCheckoutEnabled();
  const allFeatures = [...new Set(plans.flatMap((p) => parseFeatures(p.features)))];
  const pricing = pricingContext(plans);
  const maxSave = Math.max(0, ...plans.map((p) => savingsPct(p, pricing.baseMonthly)));

  return (
    <>
      <PageHero
        align="center"
        eyebrow="Plans"
        title="Apollo Group TV plans and pricing"
        description="Every Apollo TV plan lists its price, billing period and inclusions up front. Pick the period that suits you — the account tools are the same on all of them."
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

      <section className="py-16 sm:py-20">
        <Container>
          {!checkout && (
            <div className="mx-auto mb-12 flex max-w-3xl items-start gap-3 rounded-lg border border-primary/30 bg-primary/5 px-5 py-4 text-sm">
              <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
              <p className="text-muted">
                <span className="font-semibold text-text">Online checkout isn&apos;t open yet.</span> Create an account and choose a plan
                today — our team confirms activation and payment options with you through the client portal.
              </p>
            </div>
          )}
          <h2 className="sr-only">Available plans</h2>
          {maxSave > 0 && plans.every((p) => p.oneTime) && (
            <p className="mb-10 text-center text-sm text-muted">
              Every pack is a <span className="font-semibold text-text">one-time payment</span> for the period shown — no automatic renewals. Longer packs save up to{" "}
              <span className="font-semibold text-success">{maxSave}%</span> compared with paying month by month.
            </p>
          )}
          {plans.length > 0 ? (
            <div className={cn("mx-auto grid items-stretch gap-6 md:grid-cols-2", plans.length >= 4 ? "xl:grid-cols-4" : plans.length === 3 ? "lg:grid-cols-3" : "max-w-3xl")}>
              {plans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} baseMonthly={pricing.baseMonthly} bestValue={plan.id === pricing.bestValueId} />
              ))}
            </div>
          ) : (
            <EmptyState icon={CreditCard} title="Plans will be published soon" description="Pricing is being finalized. Please check back shortly." />
          )}
          <p className="mt-8 text-center text-xs text-subtle">Prices are shown in the listed currency. Applicable taxes may be added at checkout.</p>
        </Container>
      </section>

      {plans.length > 1 && allFeatures.length > 0 && (
        <section className="border-t border-border pb-20 pt-16" aria-labelledby="compare">
          <Container>
            <h2 id="compare" className="mb-8 text-center font-display text-2xl font-semibold text-text">
              Compare plans
            </h2>
            <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-card">
              <table className="w-full min-w-[560px] text-sm">
                <caption className="sr-only">Features included in each plan</caption>
                <thead>
                  <tr className="border-b border-border">
                    <th scope="col" className="w-1/3 p-4 text-left font-medium text-muted sm:p-5">Feature</th>
                    {plans.map((p) => (
                      <th key={p.id} scope="col" className={cn("p-4 text-left sm:p-5", p.highlighted && "bg-primary/5")}>
                        <span className="block font-display font-semibold text-text">{p.name}</span>
                        <span className="text-xs font-normal text-muted">
                          {formatMoney(p.priceCents, p.currency)} · {intervalLabels[p.interval]}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allFeatures.map((f) => (
                    <tr key={f} className="border-b border-border last:border-0">
                      <th scope="row" className="p-4 text-left font-normal text-text/90 sm:px-5">{f}</th>
                      {plans.map((p) => {
                        const has = parseFeatures(p.features).includes(f);
                        return (
                          <td key={p.id} className={cn("p-4 sm:px-5", p.highlighted && "bg-primary/5")}>
                            {has ? (
                              <Check className="h-4 w-4 text-accent" aria-label="Included" />
                            ) : (
                              <Minus className="h-4 w-4 text-border-strong" aria-label="Not included" />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Container>
        </section>
      )}

      <section className="border-t border-border py-16" aria-labelledby="billing-terms">
        <Container className="grid gap-6 lg:grid-cols-3">
          <h2 id="billing-terms" className="sr-only">How billing works</h2>
          {[
            { t: "Activation", b: "Choose a plan from your dashboard. While online checkout is being set up, our team confirms activation and payment options with you in a support ticket." },
            { t: "Billing period", b: "Your plan runs for the period shown on its card. Start and end dates appear under Subscription Details in your dashboard." },
            { t: "Refunds", b: "Refund rules are published only on the Refund Policy page, so you always have one reliable source." },
          ].map((x) => (
            <div key={x.t} className="rounded-lg border border-border bg-card p-6 shadow-card">
              <h3 className="font-semibold text-text">{x.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{x.b}</p>
            </div>
          ))}
          <p className="text-sm text-muted lg:col-span-3">
            Read the <Link href="/refund-policy" className="text-accent hover:text-light-blue">refund policy</Link>, see{" "}
            <Link href="/product" className="text-accent hover:text-light-blue">what the service includes</Link>, or{" "}
            <Link href="/create-account" className="text-accent hover:text-light-blue">create your account</Link> to get started.
          </p>
        </Container>
      </section>

      <section className="border-t border-border bg-bg-secondary/50 py-20">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading align="left" eyebrow="Pricing FAQ" title="Questions about plans" description="Can't find your answer? Ask us from the client portal." />
          <FaqAccordion items={billingFaqs.length > 0 ? billingFaqs : fallbackFaqs} />
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
