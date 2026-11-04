import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, LifeBuoy, MessageSquare } from "lucide-react";
import { HelpSearch } from "@/components/help-search";
import { CtaBand, PageHero } from "@/components/marketing/sections";
import { cardClass, Section } from "@/components/section";
import { ButtonLink } from "@/components/ui/button";
import { getHelpIndex } from "@/lib/help-index";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const title = "Apollo Group TV Help Center: Setup, Payments and Troubleshooting";
const description =
  "Search Apollo Group TV help: device setup, payments and billing, player logins, troubleshooting and account security, all in one place.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/help" },
  openGraph: { title, description, url: "/help" },
};

export default async function HelpCenterPage() {
  const { topics, searchable, popular } = await getHelpIndex();

  return (
    <>
      <PageHero
        pageType="CollectionPage"
        eyebrow="Help Center"
        title="How Can We Help?"
        description="Search our guides, articles and answers, or browse by topic. Still stuck? Our support team answers every ticket."
        crumbs={[{ href: "/help", label: "Help Center" }]}
      >
        <HelpSearch entries={searchable} />
      </PageHero>

      <Section>
        <h2 className="font-display text-2xl font-bold text-text">Browse by topic</h2>
        <nav aria-label="Help topics" className="mt-4 flex flex-wrap gap-2">
          {topics.map((t) => (
            <a key={t.slug} href={`#${t.slug}`} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-sm text-muted hover:border-primary/40 hover:text-text">
              <span aria-hidden>{t.icon}</span> {t.title}
            </a>
          ))}
        </nav>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {topics.map((t) => (
            <section key={t.slug} id={t.slug} aria-labelledby={`${t.slug}-h`} className={cn(cardClass, "scroll-mt-24 p-6")}>
              <h3 id={`${t.slug}-h`} className="flex items-center gap-2 font-display text-lg font-bold text-text">
                <span aria-hidden>{t.icon}</span> {t.title}
              </h3>
              <p className="mt-1 text-sm text-muted">{t.blurb}</p>
              <ul className="mt-4 space-y-2.5">
                {t.entries.map((e) => (
                  <li key={`${e.href}|${e.title}`}>
                    <Link href={e.href} className="group flex items-start gap-2 text-sm text-text/90 hover:text-light-blue">
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-subtle group-hover:text-accent" aria-hidden />
                      <span>{e.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Section>

      {popular.length > 0 && (
        <Section className="border-t border-border">
          <h2 className="font-display text-2xl font-bold text-text">Popular questions</h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {popular.map((p) => (
              <li key={p.q}>
                <Link href={p.href} className={cn(cardClass, "flex items-center justify-between gap-3 px-5 py-4 text-sm font-medium text-text hover:border-primary/40")}>
                  {p.q}
                  <ArrowRight className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-muted">
            See every answer on the{" "}
            <Link href="/faq" className="text-accent hover:text-light-blue">
              FAQ page
            </Link>
            , or browse all{" "}
            <Link href="/blog" className="text-accent hover:text-light-blue">
              blog articles
            </Link>{" "}
            and{" "}
            <Link href="/payment-guides" className="text-accent hover:text-light-blue">
              payment guides
            </Link>
            .
          </p>
        </Section>
      )}

      <Section className="border-t border-border">
        <div className="grid gap-5 md:grid-cols-2">
          <div className={cn(cardClass, "p-6")}>
            <LifeBuoy className="h-6 w-6 text-accent" aria-hidden />
            <h2 className="mt-3 font-display text-lg font-bold text-text">Already a customer?</h2>
            <p className="mt-1 text-sm leading-6 text-muted">Open a ticket from your dashboard. You and our team can read the whole conversation, and you&apos;re notified when we reply.</p>
            <ButtonLink href="/dashboard/support/new" className="mt-4">
              Open a ticket
            </ButtonLink>
          </div>
          <div className={cn(cardClass, "p-6")}>
            <MessageSquare className="h-6 w-6 text-accent" aria-hidden />
            <h2 className="mt-3 font-display text-lg font-bold text-text">Questions before you buy?</h2>
            <p className="mt-1 text-sm leading-6 text-muted">Send us a message about devices, payments or packs and we&apos;ll get back to you by email.</p>
            <ButtonLink href="/contact" variant="secondary" className="mt-4">
              Contact us
            </ButtonLink>
          </div>
        </div>
        <p className="mt-6 text-sm text-muted">
          Looking for a specific page?{" "}
          <Link href="/site-index" className="text-accent hover:text-light-blue">
            See the site index
          </Link>
          .
        </p>
      </Section>
      <CtaBand title="Ready when you are" description="Compare the packs and follow the setup guide for your device." />
    </>
  );
}
