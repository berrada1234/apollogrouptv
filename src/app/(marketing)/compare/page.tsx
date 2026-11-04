import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { YearlyCostTable } from "@/components/compare/yearly-cost-table";
import { CtaBand, PageHero } from "@/components/marketing/sections";
import { cardClass, cardHover, Section, SectionHeader } from "@/components/section";
import { Container } from "@/components/ui/misc";
import { CHECKED, rivals } from "@/content/compare";
import { getApolloCompareData } from "@/lib/compare-data";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const title = "Compare Apollo Group TV with YouTube TV, Sling, Hulu and More";
const description =
  "Side-by-side comparisons of Apollo Group TV with YouTube TV, Sling TV, Hulu + Live TV, DIRECTV STREAM and Philo: yearly cost, billing, screens and more.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/compare" },
  openGraph: { title, description, url: "/compare" },
};

export default async function ComparePage() {
  const apollo = await getApolloCompareData();
  const m = apollo.money;
  return (
    <>
      <PageHero
        eyebrow="Compare"
        title="Compare Apollo Group TV with Other Live TV Services"
        description="Honest, sourced comparisons with the best-known live TV services: what a year costs, how billing works, how many screens you get, and when another service may suit you better."
        crumbs={[{ href: "/compare", label: "Compare" }]}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16 [&>*]:min-w-0">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="One year of live TV"
              title="What a Year Costs on Each Service"
              description="Each competitor at its regular published price, next to Apollo Group TV's twelve-month pack from our current price list."
            />
          </div>
          <div className="lg:col-span-7">
            <YearlyCostTable apollo={apollo} />
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Side by side" title="Choose a Comparison" description="Each page covers price, billing, screens, trials, recording and setup, with the official source for every competitor figure." />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rivals.map((r) => (
            <li key={r.slug}>
              <Link href={r.path} className={cn(cardClass, cardHover, "group flex h-full flex-col p-6")}>
                <h3 className="text-lg font-semibold text-text">Apollo Group TV vs {r.name}</h3>
                <p className="mt-2 text-sm text-muted">
                  {r.name}: {m(r.monthlyCents)} a month, {m(r.monthlyCents * 12)} a year
                  {apollo.yearlyCents !== null ? `. Apollo Group TV: ${m(apollo.yearlyCents)} a year.` : "."}
                </p>
                <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-accent">
                  Read the comparison <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
          <li>
            <Link href="/blog/iptv-vs-cable" className={cn(cardClass, cardHover, "group flex h-full flex-col p-6")}>
              <h3 className="text-lg font-semibold text-text">IPTV vs cable TV</h3>
              <p className="mt-2 text-sm text-muted">How internet TV and cable differ on cost, equipment, reliability and contracts.</p>
              <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-accent">
                Read the guide <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          </li>
        </ul>
      </Section>

      <Section>
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/why-apollo-group-tv" className={cn(cardClass, cardHover, "edge-spectrum group p-7")}>
            <h2 className="font-hero text-xl font-medium tracking-[-0.03em] text-text">Why Apollo Group TV</h2>
            <p className="mt-2 text-sm leading-6 text-muted">One-time packs, no auto-renewal, a guide for every device, and an honest look at when another service is a better fit.</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">
              Read why <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </span>
          </Link>
          <Link href="/choosing-an-iptv-service" className={cn(cardClass, cardHover, "group p-7")}>
            <h2 className="font-hero text-xl font-medium tracking-[-0.03em] text-text">Choosing an IPTV service</h2>
            <p className="mt-2 text-sm leading-6 text-muted">Ten checks to run on any provider before you pay, plus the red flags that mean walk away.</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">
              Open the checklist <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </span>
          </Link>
        </div>
        <Container className="mt-8 px-0 text-xs leading-5 text-subtle">
          <p>
            Competitor prices checked {CHECKED}; each comparison lists its source. YouTube TV, Sling TV, Hulu, DIRECTV and Philo are trademarks of their owners; Apollo Group TV isn&apos;t affiliated with them. See our{" "}
            <Link href="/disclaimer" className="underline-offset-2 hover:text-muted hover:underline">
              Disclaimer
            </Link>
            .
          </p>
        </Container>
      </Section>

      <CtaBand title="Ready to cut the bill?" description="Choose a pack, pay once and watch on the screens you already own." />
    </>
  );
}
