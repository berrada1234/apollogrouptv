import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Baby,
  Clapperboard,
  Earth,
  Film,
  Filter,
  Globe2,
  Leaf,
  type LucideIcon,
  MapPin,
  MessageSquareText,
  MonitorSmartphone,
  Music,
  Newspaper,
  Sparkles,
  Trophy,
  Tv,
  LayoutGrid,
} from "lucide-react";
import { Breadcrumbs, Container } from "@/components/ui/misc";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/home/hero";
import { FaqAccordion } from "@/components/marketing/faq-list";
import { RichText } from "@/components/rich-text";
import { afterHeader, cardClass, cardHover, h2Class, IconBox, leadClass, Section, SectionHeader } from "@/components/section";
import { SportsSection } from "@/components/sports-section";
import { channelCategories, channelFaq, channelGuideSteps, channelRegions, channelsCopy } from "@/content/channels";
import { cn } from "@/lib/utils";

const title = "Apollo Group TV Channels: Live TV Categories & Lineup Guide";
const description =
  "Apollo Group TV channels by category and region: sports, news, movies, series, kids, documentaries, music and international TV, in 4K where available.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/channels" },
  openGraph: { title, description, url: "/channels" },
};

const categoryIcons: Record<string, LucideIcon> = {
  sports: Trophy,
  news: Newspaper,
  movies: Film,
  series: Clapperboard,
  kids: Baby,
  documentary: Leaf,
  music: Music,
  lifestyle: Sparkles,
  international: Globe2,
};
const guideIcons = [LayoutGrid, Filter, Tv, MonitorSmartphone];

export default function ChannelsPage() {
  const c = channelsCopy;
  const faqItems = channelFaq.map((f, i) => ({ id: `channels-${i}`, category: "Channels", question: f.q, answer: f.a }));

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_70%_at_80%_20%,rgb(70_224_255/0.12),transparent_70%)]" aria-hidden />
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <Container className="relative pb-12 pt-8 sm:pb-16 sm:pt-12">
          <Breadcrumbs items={[{ href: "/channels", label: "Channels" }]} />
          <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Eyebrow>{c.hero.eyebrow}</Eyebrow>
              <h1 className="mt-4 font-display text-[2.25rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-text sm:text-5xl">{c.hero.h1}</h1>
              <p className={cn(leadClass, "mt-5 max-w-2xl")}>{c.hero.lead}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/plans" size="lg">
                  View plans <ArrowRight className="h-4 w-4" aria-hidden />
                </ButtonLink>
                <ButtonLink href="/contact" variant="secondary" size="lg">
                  Ask about a channel
                </ButtonLink>
              </div>
            </div>
            <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-[14px] border border-border bg-border lg:col-span-5">
              {[
                { v: String(channelCategories.length), l: "Categories" },
                { v: String(channelRegions.length), l: "Regions" },
                { v: "4K", l: "Where available" },
              ].map((s) => (
                <div key={s.l} className="flex flex-col-reverse bg-card px-4 py-5 text-center">
                  <dt className="mt-1 text-xs text-subtle">{s.l}</dt>
                  <dd className="font-display text-2xl font-bold tracking-tight text-text">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      {/* Categories */}
      <Section>
        <SectionHeader eyebrow={c.categories.eyebrow} title={c.categories.h2} description={c.categories.description} />
        <ul className={cn(afterHeader, "grid gap-4 sm:grid-cols-2 lg:grid-cols-3")}>
          {channelCategories.map((cat) => (
            <li key={cat.key} id={cat.key} className={cn(cardClass, cardHover, "flex scroll-mt-28 flex-col p-6")}>
              <div className="flex items-center gap-4">
                <IconBox icon={categoryIcons[cat.key] ?? Tv} />
                <h3 className="font-display text-lg font-bold text-text">{cat.title}</h3>
              </div>
              <p className="mt-4 text-sm leading-6 text-muted">{cat.summary}</p>
              <ul className="mt-5 flex flex-wrap gap-1.5 border-t border-border pt-5" aria-label={`${cat.title} covers`}>
                {cat.covers.map((x) => (
                  <li key={x} className="rounded-full border border-border bg-inset px-2.5 py-1 text-xs text-muted">
                    {x}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Section>

      {/* Regions */}
      <section className="section-y border-y border-border bg-bg-secondary">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16 [&>*]:min-w-0">
            <div className="lg:col-span-5">
              <SectionHeader eyebrow={c.regions.eyebrow} title={c.regions.h2} description={c.regions.description} />
              <p className="mt-6 flex gap-3 text-sm leading-6 text-subtle">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                {c.regions.note}
              </p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
              {channelRegions.map((r) => (
                <li key={r.name} className={cn(cardClass, "flex items-center gap-4 p-4")}>
                  <IconBox icon={Earth} size="sm" />
                  <div className="min-w-0">
                    <p className="font-semibold text-text">{r.name}</p>
                    <p className="text-sm text-muted">{r.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* How the guide works */}
      <Section>
        <SectionHeader align="center" eyebrow={c.guide.eyebrow} title={c.guide.h2} />
        <ol className={cn(afterHeader, "grid gap-4 sm:grid-cols-2 lg:grid-cols-4")}>
          {channelGuideSteps.map((s, i) => {
            const Icon = guideIcons[i % guideIcons.length];
            return (
              <li key={s.title} className={cn(cardClass, "p-6")}>
                <div className="flex items-center justify-between">
                  <IconBox icon={Icon} />
                  <span className="font-display text-sm font-bold text-subtle">0{i + 1}</span>
                </div>
                <h3 className="mt-5 font-display text-base font-bold text-text">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{s.body}</p>
              </li>
            );
          })}
        </ol>
      </Section>

      <SportsSection
        copy={{
          title: "Sports Channels on Apollo Group TV, by Sport and Region",
          tagline: "Every sport and region category in the lineup",
          intro:
            "Here is the full list of sports categories. Inside the app, each one opens a filtered list of channels, so you can go straight to football, combat sports or motorsport — or narrow it to one country's coverage. What a category contains depends on the rights available where you live, and individual events move between channels from season to season.",
        }}
      />

      {/* Why categories, not names */}
      <section className="section-y border-t border-border bg-bg-secondary">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16 [&>*]:min-w-0">
            <div className="lg:col-span-7">
              <Eyebrow>{c.names.eyebrow}</Eyebrow>
              <h2 className={cn(h2Class, "mt-3")}>{c.names.h2}</h2>
              <div className={cn(leadClass, "mt-5 space-y-4")}>
                {c.names.paragraphs.map((p, i) => (
                  <p key={i}>
                    <RichText text={p} />
                  </p>
                ))}
              </div>
              <p className="mt-6 text-sm leading-6 text-subtle">
                <RichText text={c.names.more} />
              </p>
            </div>
            <div className={cn(cardClass, "p-6 lg:col-span-5")}>
              <IconBox icon={MessageSquareText} />
              <p className="mt-5 font-display text-lg font-bold text-text">Looking for a specific channel?</p>
              <p className="mt-2 text-sm leading-6 text-muted">Tell us the channel and your region. We&apos;ll confirm whether it&apos;s in the current lineup before you buy.</p>
              <ButtonLink href="/contact" className="mt-6">
                Ask our team <ArrowRight className="h-4 w-4" aria-hidden />
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16 [&>*]:min-w-0">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow={c.faq.eyebrow}
              title={c.faq.h2}
              description={
                <>
                  More answers about billing, devices and setup are in the{" "}
                  <Link href="/faq" className="text-accent hover:text-light-blue">
                    full FAQ
                  </Link>.
                </>
              }
            />
          </div>
          <div className="lg:col-span-7">
            <FaqAccordion items={faqItems} />
          </div>
        </div>
      </Section>

      {/* CTA */}
      <section className="page-cta section-y-sm border-t border-border">
        <Container>
          <div className="relative overflow-hidden rounded-[20px] border border-primary/25 bg-[#0d1238] px-6 py-10 sm:px-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_100%_at_100%_0%,rgb(70_224_255/0.2),transparent_70%)]" aria-hidden />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <h2 className="font-display text-2xl font-bold tracking-tight text-text sm:text-3xl">{c.cta.h2}</h2>
                <p className="mt-2 text-muted">{c.cta.body}</p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-3">
                <ButtonLink href="/plans" size="lg">
                  Choose your pack <ArrowRight className="h-4 w-4" aria-hidden />
                </ButtonLink>
                <ButtonLink href="/app" variant="secondary" size="lg">
                  Supported devices
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
