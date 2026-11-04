import Link from "next/link";
import { ArrowRight, Check, Minus, ThumbsUp } from "lucide-react";
import { FaqAccordion } from "@/components/marketing/faq-list";
import { CtaBand, PageHero } from "@/components/marketing/sections";
import { buttonClasses } from "@/components/ui/button";
import { Container } from "@/components/ui/misc";
import { cardClass } from "@/components/section";
import { CHECKED, comparePages, type Rival } from "@/content/compare";
import type { ApolloCompare } from "@/lib/compare-data";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

/** One comparison page: honest summary, yearly cost, side-by-side table, verdict, FAQ and sources. */
export function CompareView({ rival, apollo }: { rival: Rival; apollo: ApolloCompare }) {
  const m = apollo.money;
  const rivalYear = rival.monthlyCents * 12;
  const keep = apollo.yearlyCents !== null ? rivalYear - apollo.yearlyCents : null;

  const rows: { k: string; them: string; us: string; usOk?: boolean }[] = [
    {
      k: "Regular price",
      them: `${m(rival.monthlyCents)} a month (${rival.planName})¹`,
      us:
        apollo.yearlyCents !== null
          ? `${m(apollo.yearlyCents)} for 12 months${apollo.monthlyCents !== null ? `, or ${m(apollo.monthlyCents)} for one month` : ""}`
          : "Shown on the Plans page",
    },
    { k: "Cost for a full year", them: `${m(rivalYear)}¹`, us: apollo.yearlyCents !== null ? m(apollo.yearlyCents) : "Shown on the Plans page" },
    { k: "How you pay", them: "Billed every month until you cancel", us: apollo.allOneTime ? "One payment per pack; nothing renews automatically" : "Price shown before you pay" },
    { k: "Contract", them: "No contract", us: "No contract" },
    { k: "Screens", them: `${rival.screens}¹`, us: apollo.devices ? `Up to ${apollo.devices} devices per account` : "See plan details" },
    {
      k: "Try before you pay",
      them: `${rival.trial}¹`,
      us: apollo.refundDays ? `No free trial; refund requests within ${apollo.refundDays} days under the Refund Policy` : "No free trial; see the Refund Policy",
      usOk: false,
    },
    { k: "Recording", them: `${rival.dvr}¹`, us: "No recording feature; on-demand library to watch any time", usOk: false },
    { k: "Setup help", them: "Help center and support", us: "A guide for every supported device, plus written ticket support" },
    { k: "Also included", them: rival.extras, us: "Live channels by category and region, on-demand library, HD to 4K where available" },
  ];

  const others = comparePages.filter((p) => p.href !== rival.path);

  return (
    <>
      <PageHero eyebrow="Compare" title={`Apollo Group TV vs ${rival.name}`} description={rival.intro} crumbs={[{ href: "/compare", label: "Compare" }, { href: rival.path, label: `vs ${rival.name}` }]} />

      {/* Honest short version + yearly cost */}
      <section className="section-y">
        <Container className="grid items-start gap-10 lg:grid-cols-12 lg:gap-16 [&>*]:min-w-0">
          <div className="lg:col-span-7">
            <h2 className="font-hero text-2xl font-medium tracking-[-0.035em] text-text sm:text-3xl">The honest short version</h2>
            <div className="mt-5 space-y-4 text-base leading-7 text-muted sm:text-[17px] sm:leading-8">
              {rival.story.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          <aside className="glass edge-spectrum rounded-[24px] p-6 sm:p-7 lg:col-span-5" aria-label="One year of viewing">
            <p className="text-sm text-subtle">One year of viewing</p>
            <dl className="mt-4 space-y-3">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-sm text-muted">{rival.name}</dt>
                <dd className="font-hero text-2xl font-medium tracking-[-0.04em] text-text tabular-nums">{m(rivalYear)}</dd>
              </div>
              {apollo.yearlyCents !== null && (
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-sm font-semibold text-light-blue">Apollo Group TV ({apollo.yearlyName ?? "12 months"})</dt>
                  <dd className="font-hero text-2xl font-medium tracking-[-0.04em] text-text tabular-nums">{m(apollo.yearlyCents)}</dd>
                </div>
              )}
            </dl>
            {keep !== null && keep > 0 && (
              <p className="mt-5 rounded-[14px] bg-success/10 px-4 py-3 text-sm text-text">
                You keep <span className="font-semibold text-success">{m(keep)}</span> a year with Apollo Group TV.
              </p>
            )}
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/plans" className={buttonClasses({ size: "sm" })}>
                See Apollo plans <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
              <Link href="/why-apollo-group-tv" className={buttonClasses({ size: "sm", variant: "secondary" })}>
                Why Apollo Group TV
              </Link>
            </div>
            <p className="mt-4 text-xs leading-5 text-subtle">
              {rival.name} price before taxes, fees and promotions, checked {CHECKED}. Apollo prices are current.
            </p>
          </aside>
        </Container>
      </section>

      {/* Side by side */}
      <section className="section-y relative" aria-labelledby="side-by-side">
        <Container>
          <h2 id="side-by-side" className="font-hero text-2xl font-medium tracking-[-0.035em] text-text sm:text-3xl">
            {rival.name} vs Apollo Group TV, side by side
          </h2>
          <div className="glass relative mt-8 overflow-x-auto rounded-[20px]">
            <table className="w-full min-w-[680px] text-sm">
              <caption className="sr-only">{`${rival.name} compared with Apollo Group TV`}</caption>
              <thead>
                <tr className="text-left">
                  <th scope="col" className="w-[22%] px-5 py-4 font-medium text-subtle">
                    <span className="sr-only">Feature</span>
                  </th>
                  <th scope="col" className="w-[37%] px-5 py-4 font-semibold text-text">
                    {rival.name}
                  </th>
                  <th scope="col" className="w-[41%] bg-[rgb(122_162_255/0.08)] px-5 py-4 font-semibold text-light-blue">
                    Apollo Group TV
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.k} className="border-t border-border">
                    <th scope="row" className="px-5 py-4 text-left font-medium text-muted">
                      {r.k}
                    </th>
                    <td className="px-5 py-4 text-text/85">
                      <span className="flex gap-2.5">
                        <Minus className="mt-0.5 h-4 w-4 shrink-0 text-subtle" aria-hidden />
                        {r.them}
                      </span>
                    </td>
                    <td className="bg-[rgb(122_162_255/0.05)] px-5 py-4 text-text">
                      <span className="flex gap-2.5">
                        {r.usOk === false ? (
                          <Minus className="mt-0.5 h-4 w-4 shrink-0 text-subtle" aria-hidden />
                        ) : (
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2.5} aria-hidden />
                        )}
                        {r.us}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs leading-5 text-subtle">{rival.otherPrices}</p>
        </Container>
      </section>

      {/* Better choice / when they suit you */}
      <section className="section-y-sm">
        <Container>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="glass edge-spectrum rounded-[22px] p-6 sm:p-7">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-text">
                <ThumbsUp className="h-4 w-4 text-accent" aria-hidden /> Why Apollo Group TV is the better choice for most homes
              </h2>
              <ul className="mt-4 space-y-2.5 text-sm leading-6 text-text/90">
                {rival.weWin.map((w) => (
                  <li key={w} className="flex gap-2.5">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-accent" strokeWidth={2.5} aria-hidden /> {w}
                  </li>
                ))}
              </ul>
            </div>
            <div className={cn(cardClass, "rounded-[22px] p-6 sm:p-7")}>
              <h2 className="text-lg font-semibold text-text">When {rival.name} may suit you better</h2>
              <ul className="mt-4 space-y-2.5 text-sm leading-6 text-muted">
                {rival.theyWin.map((w) => (
                  <li key={w} className="flex gap-2.5">
                    <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-subtle" aria-hidden /> {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="glass mx-auto mt-8 max-w-3xl rounded-[22px] p-6 text-center sm:p-8">
            <h2 className="font-hero text-xl font-medium tracking-[-0.03em] text-text sm:text-2xl">Our verdict</h2>
            <p className="mt-3 text-base leading-7 text-muted">{rival.verdict}</p>
            <Link href="/plans" className={buttonClasses({ className: "mt-6" })}>
              Compare Apollo packs <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="section-y">
        <Container className="max-w-3xl">
          <h2 className="text-center font-hero text-2xl font-medium tracking-[-0.035em] text-text sm:text-3xl">{`${rival.name} vs Apollo Group TV: common questions`}</h2>
          <div className="mt-8">
            <FaqAccordion items={rival.faqs.map((f, i) => ({ id: `${rival.slug}-${i}`, category: "Compare", question: f.q, answer: f.a }))} />
          </div>
        </Container>
      </section>

      {/* More comparisons + sources */}
      <section className="section-y-sm">
        <Container>
          <h2 className="text-lg font-semibold text-text">More comparisons</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o) => (
              <li key={o.href}>
                <Link href={o.href} className="glass flex items-center justify-between gap-3 rounded-[14px] px-4 py-3 text-sm text-text transition-colors hover:border-accent/40">
                  {o.label} <ArrowRight className="h-3.5 w-3.5 text-subtle" aria-hidden />
                </Link>
              </li>
            ))}
            <li>
              <Link href="/blog/iptv-vs-cable" className="glass flex items-center justify-between gap-3 rounded-[14px] px-4 py-3 text-sm text-text transition-colors hover:border-accent/40">
                IPTV vs cable TV <ArrowRight className="h-3.5 w-3.5 text-subtle" aria-hidden />
              </Link>
            </li>
          </ul>

          <div className="mt-10 border-t border-border pt-6 text-xs leading-5 text-subtle">
            <p className="font-semibold text-muted">Source</p>
            <p className="mt-1">
              ¹{" "}
              <a href={rival.source.href} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:text-muted hover:underline">
                {rival.source.label}
              </a>
              . Checked {CHECKED}. Prices and features change; check {rival.name}&apos;s website for today&apos;s details.
            </p>
            <p className="mt-2">
              {rival.name} is a trademark of its owner. {siteConfig.name} isn&apos;t affiliated with or endorsed by {rival.name}. This comparison is our own, based on the public information above. See our{" "}
              <Link href="/disclaimer" className="underline-offset-2 hover:text-muted hover:underline">
                Disclaimer
              </Link>
              .
            </p>
          </div>
        </Container>
      </section>

      <CtaBand title="Ready to cut the bill?" description="Choose a pack, pay once and watch on the screens you already own. Nothing renews by itself." />
    </>
  );
}
