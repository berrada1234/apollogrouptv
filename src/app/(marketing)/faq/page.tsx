import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, HelpCircle, LifeBuoy, MessageSquareText, Tv } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Breadcrumbs, Container, EmptyState } from "@/components/ui/misc";
import { Eyebrow } from "@/components/home/hero";
import { FaqExplorer } from "@/components/marketing/faq-list";
import { stripRich } from "@/components/rich-text";
import { cardClass, leadClass } from "@/components/section";
import { FAQ_TOPICS } from "@/content/faqs";
import { accessLabel, monthlyCents } from "@/lib/pricing";
import { getActivePlans, getPublishedFaqs } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { siteConfig } from "@/lib/site";
import { cn, formatMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

const title = "Apollo Group TV FAQ: Plans, Setup, Channels & Support Answers";
const description =
  "Answers about Apollo Group TV pricing and billing, installing the app, channels, playback, account security, refunds and troubleshooting.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/faq" },
  openGraph: { title, description, url: "/faq" },
};

export default async function FaqPage() {
  const [faqs, plans, settings] = await Promise.all([getPublishedFaqs(), getActivePlans(), getSettings()]);
  const items = faqs.map(({ id, category, question, answer }) => ({ id, category, question, answer }));
  const presentTopics = FAQ_TOPICS.filter((t) => items.some((i) => i.category === t.name));

  // Live facts so answers never go stale: prices, renewal and device allowance come from the database.
  const deviceLimit = plans
    .flatMap((p) => (Array.isArray(p.features) ? p.features.map(String) : []))
    .map((f) => /up to (\d+) devices/i.exec(f)?.[1])
    .find(Boolean);
  const allOneTime = plans.length > 0 && plans.every((p) => p.oneTime);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: `${siteConfig.url}/faq`,
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: stripRich(f.answer) },
    })),
  };

  return (
    <>
      {items.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />}

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_70%_at_80%_20%,rgb(70_224_255/0.1),transparent_70%)]" aria-hidden />
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <Container className="relative pb-10 pt-8 sm:pb-14 sm:pt-12">
          <Breadcrumbs items={[{ href: "/faq", label: "FAQ" }]} />
          <div className="max-w-3xl">
            <Eyebrow>Answers</Eyebrow>
            <h1 className="mt-4 font-display text-[2.25rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-text sm:text-5xl">
              Apollo Group TV FAQ: Every Common Question, Answered by Topic
            </h1>
            <p className={cn(leadClass, "mt-5")}>
              The questions people actually ask before and after signing up — what it costs, how to install the app, what you can watch and what to do when
              something isn&apos;t working. Search below, or jump to a topic. Can&apos;t find your answer?{" "}
              <Link href="/contact" className="font-medium text-accent hover:text-light-blue">
                Ask our team
              </Link>
              .
            </p>
          </div>
          {presentTopics.length > 0 && (
            <nav aria-label="Jump to a topic" className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-subtle">Jump to</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {presentTopics.map((t) => (
                  <li key={t.slug}>
                    <a
                      href={`#${t.slug}`}
                      className="block rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-muted transition-colors hover:border-primary/40 hover:text-text"
                    >
                      {t.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </Container>
      </section>

      {/* At a glance — rendered from live data */}
      {plans.length > 0 && (
        <section aria-labelledby="glance-heading" className="border-b border-border bg-bg-secondary">
          <Container className="section-y-sm">
            <h2 id="glance-heading" className="font-display text-lg font-bold text-text">
              Apollo Group TV at a glance
            </h2>
            <div className="mt-5 grid gap-4 lg:grid-cols-12">
              <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-[14px] border border-border bg-border sm:grid-cols-4 lg:col-span-8">
                {plans.slice(0, 4).map((p) => {
                  const m = monthlyCents(p);
                  return (
                    <li key={p.id} className="bg-card px-4 py-4">
                      <p className="text-sm font-semibold text-text">{p.name}</p>
                      <p className="text-xs text-subtle">{accessLabel(p.interval)}</p>
                      <p className="mt-2 font-display text-xl font-bold text-text">{formatMoney(p.priceCents, p.currency)}</p>
                      {m && <p className="text-xs text-muted">{formatMoney(m, p.currency)}/mo equivalent</p>}
                    </li>
                  );
                })}
              </ul>
              <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-[14px] border border-border bg-border lg:col-span-4">
                {[
                  { k: "Auto-renewal", v: allOneTime ? "None" : "See plans" },
                  { k: "Devices per pack", v: deviceLimit ? `Up to ${deviceLimit}` : "See plans" },
                  { k: "Refunds", v: settings.highlights.moneyBackDays ? `${settings.highlights.moneyBackDays}-day policy` : "See policy" },
                ].map((x) => (
                  <div key={x.k} className="flex flex-col-reverse bg-card px-3 py-4 text-center">
                    <dt className="mt-1 text-[11px] text-subtle">{x.k}</dt>
                    <dd className="text-sm font-semibold text-text">{x.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <p className="mt-3 text-xs text-subtle">
              Prices are one-time payments for the period shown. Full details on the{" "}
              <Link href="/plans" className="text-accent hover:text-light-blue">
                Plans page
              </Link>{" "}
              and in the{" "}
              <Link href="/refund-policy" className="text-accent hover:text-light-blue">
                Refund Policy
              </Link>
              .
            </p>
          </Container>
        </section>
      )}

      {/* Questions */}
      <section className="section-y">
        <Container>
          {items.length > 0 ? (
            <FaqExplorer
              items={items}
              topics={FAQ_TOPICS}
              aside={
                <div className={cn(cardClass, "p-5")}>
                  <LifeBuoy className="h-6 w-6 text-accent" aria-hidden />
                  <p className="mt-3 font-semibold text-text">Didn&apos;t find it?</p>
                  <p className="mt-1 text-sm leading-6 text-muted">Our team replies in writing, so you can come back to the answer any time.</p>
                  <ButtonLink href="/contact" size="sm" className="mt-4 w-full">
                    Contact support
                  </ButtonLink>
                </div>
              }
            />
          ) : (
            <EmptyState icon={HelpCircle} title="No questions published yet" description="Our team is preparing answers. Please contact support in the meantime." />
          )}
        </Container>
      </section>

      {/* Still stuck */}
      <section className="page-cta section-y-sm border-t border-border">
        <Container>
          <div className="relative overflow-hidden rounded-[20px] border border-primary/25 bg-[#0d1238] px-6 py-10 sm:px-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_100%_at_100%_0%,rgb(70_224_255/0.2),transparent_70%)]" aria-hidden />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <h2 className="font-display text-2xl font-bold tracking-tight text-text sm:text-3xl">Still have a question about Apollo Group TV?</h2>
                <p className="mt-2 text-muted">
                  Customers can open a ticket from the dashboard; anyone can reach us through the contact form. Every reply is saved in one thread.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-3">
                <ButtonLink href="/contact" size="lg">
                  <MessageSquareText className="h-4 w-4" aria-hidden /> Contact support
                </ButtonLink>
                <ButtonLink href="/plans" variant="secondary" size="lg">
                  See plans <ArrowRight className="h-4 w-4" aria-hidden />
                </ButtonLink>
                <ButtonLink href="/channels" variant="ghost" size="lg">
                  <Tv className="h-4 w-4" aria-hidden /> Browse channels
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
