import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CircleHelp,
  Download,
  Gauge,
  LayoutGrid,
  LifeBuoy,
  MonitorSmartphone,
  Play,
  Smartphone,
  Tv,
  UserCheck,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { Breadcrumbs, Container } from "@/components/ui/misc";
import { Badge } from "@/components/ui/badge";
import { ButtonLink, buttonClasses } from "@/components/ui/button";
import { Eyebrow } from "@/components/home/hero";
import { FaqAccordion } from "@/components/marketing/faq-list";
import { RichText } from "@/components/rich-text";
import { afterHeader, cardClass, cardHover, IconBox, leadClass, Section, SectionHeader } from "@/components/section";
import { appCopy, appFaq } from "@/content/app";
import { channelCategories } from "@/content/channels";
import { homeCopy } from "@/content/home";
import { profileFor } from "@/content/device-guides";
import { monthlyCents } from "@/lib/pricing";
import { getActivePlans } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { siteConfig } from "@/lib/site";
import { cn, formatMoney, slugify } from "@/lib/utils";
import { ldJson, organizationRef, pageId, webPageNode } from "@/lib/schema";
import { shareImage } from "@/lib/share-image";

export const dynamic = "force-dynamic";

const title = "Apollo Group TV App: Devices, Install Guide & Features";
const description =
  "The Apollo TV app on Fire TV, Android, Windows and Mac, plus UHF on iPhone, iPad and Apple TV. One account, official downloads and a guide per device.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/app" },
  openGraph: { ...shareImage, title, description, url: "/app" },
};

const whyIcons: LucideIcon[] = [LayoutGrid, Tv, UserCheck, LifeBuoy];
const reqIcons: LucideIcon[] = [Wifi, MonitorSmartphone, UserCheck];
const posterTones = [
  "from-[#46e0ff] via-[#1b1f5e] to-[#05060f]",
  "from-[#334155] via-[#1b2430] to-[#05060f]",
  "from-[#0f766e] via-[#0c3532] to-[#05060f]",
  "from-[#155e75] via-[#0f2f3a] to-[#05060f]",
];


/** Small decorative screen used in the in-app tour. Illustration only. */
function ScreenSketch({ variant }: { variant: number }) {
  return (
    <div className="aspect-[16/10] overflow-hidden rounded-lg border border-white/5 bg-[#07090b] p-2.5" aria-hidden>
      <div className="mb-2 flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        <span className="h-1 w-8 rounded bg-white/20" />
        <span className="ml-auto h-1 w-5 rounded bg-white/10" />
      </div>
      {variant === 0 && (
        <>
          <div className="h-[46%] rounded-md bg-[linear-gradient(115deg,#05060f_10%,#0b3a46_60%,#22d3ee_150%)]" />
          <div className="mt-2 grid grid-cols-4 gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`aspect-video rounded bg-gradient-to-br ${posterTones[i]}`} />
            ))}
          </div>
        </>
      )}
      {variant === 1 && (
        <div className="space-y-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="h-4 w-6 shrink-0 rounded bg-white/[0.07]" />
              <span className={cn("h-4 rounded", i === 1 ? "w-1/2 bg-primary/40" : "w-1/3 bg-white/[0.07]")} />
              <span className="h-4 flex-1 rounded bg-white/[0.04]" />
            </div>
          ))}
        </div>
      )}
      {variant === 2 && (
        <div className="grid grid-cols-5 gap-1.5">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className={`aspect-[2/3] rounded bg-gradient-to-br ${posterTones[i % 4]}`} />
          ))}
        </div>
      )}
      {variant === 3 && (
        <div className="space-y-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between rounded-md bg-white/[0.05] px-2 py-1.5">
              <span className="flex items-center gap-1">
                {i === 0 && <span className="rounded bg-red-500 px-1 text-[6px] font-bold text-white">LIVE</span>}
                <span className="h-1 w-10 rounded bg-white/30" />
              </span>
              <span className="h-1 w-6 rounded bg-white/15" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default async function AppPage() {
  const [settings, plans] = await Promise.all([getSettings(), getActivePlans()]);
  const c = appCopy;
  const platforms = settings.apps.platforms.filter((p) => p.verified);
  const logos = homeCopy.devices.logos;

  // Facts for the "at a glance" panel — computed from real data only.
  const monthlies = plans.map(monthlyCents).filter((m): m is number => m !== null);
  const fromMonthly = monthlies.length ? formatMoney(Math.min(...monthlies), plans[0]?.currency ?? "USD") : null;
  const deviceLimit = plans
    .flatMap((p) => (Array.isArray(p.features) ? p.features.map(String) : []))
    .map((f) => /up to (\d+) devices/i.exec(f)?.[1])
    .find(Boolean);
  const glance = [
    { label: "Works on", value: platforms.length ? `${platforms.length} device types` : "Verified devices" },
    { label: "Sign-in", value: "One account" },
    { label: "Picture", value: "HD · FHD · 4K*" },
    deviceLimit ? { label: "Devices per pack", value: `Up to ${deviceLimit}` } : null,
    fromMonthly ? { label: "Packs from", value: `${fromMonthly}/mo` } : null,
    { label: "Setup", value: "Step-by-step guides" },
  ].filter((g): g is { label: string; value: string } => g !== null);

  const faqItems = appFaq.map((f, i) => ({ id: `app-${i}`, category: "App", question: f.q, answer: f.a }));

  const appLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${siteConfig.url}/app#software`,
    mainEntityOfPage: { "@id": pageId("/app") },
    name: "Apollo TV",
    alternateName: "Apollo Group TV app",
    applicationCategory: "EntertainmentApplication",
    operatingSystem: platforms.map((p) => p.name).join(", ") || undefined,
    ...(settings.apps.appVersion ? { softwareVersion: settings.apps.appVersion } : {}),
    publisher: organizationRef,
    url: `${siteConfig.url}/app`,
    image: `${siteConfig.url}/images/app/apollo-group-tv-app-home.webp`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLd).replace(/</g, "\\u003c") }} />
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_70%_at_80%_25%,rgb(70_224_255/0.12),transparent_70%)]" aria-hidden />
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <Container className="relative pb-12 pt-8 sm:pb-16 sm:pt-12">
          <Breadcrumbs items={[{ href: "/app", label: "App" }]} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(webPageNode({ path: "/app", name: title, description, type: "WebPage" })) }} />
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Eyebrow>{c.hero.eyebrow}</Eyebrow>
              <h1 className="mt-4 font-display text-[2.25rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-text sm:text-5xl">{c.hero.h1}</h1>
              <p className={cn(leadClass, "mt-5 max-w-2xl")}>{c.hero.lead}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="#install" size="lg">
                  <Download className="h-4 w-4" aria-hidden /> Install the app
                </ButtonLink>
                <ButtonLink href="/plans" variant="secondary" size="lg">
                  View plans
                </ButtonLink>
              </div>
              <div className="mt-8 border-t border-border pt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-subtle">Compatible with</p>
                <ul className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-4">
                  {logos.map((d) => (
                    <li key={d.name}>
                      <Image src={d.src} alt={d.alt} width={d.width} height={d.height} title={d.name} className="h-7 w-auto object-contain opacity-85" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <aside className={cn(cardClass, "p-6 lg:col-span-5")} aria-label="Apollo TV app at a glance">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-on-primary shadow-[0_10px_30px_-10px_rgb(70_224_255/0.8)]">
                  <Play className="ml-0.5 h-5 w-5 fill-current" aria-hidden />
                </span>
                <div>
                  <p className="font-display text-lg font-bold text-text">Apollo TV</p>
                  <p className="text-sm text-muted">The Apollo Group TV app</p>
                </div>
              </div>
              <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border">
                {glance.map((g) => (
                  <div key={g.label} className="flex flex-col-reverse bg-inset px-4 py-3.5">
                    <dt className="mt-0.5 text-xs text-subtle">{g.label}</dt>
                    <dd className="font-semibold text-text">{g.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-xs text-subtle">*4K where the broadcast, your device and your connection support it.</p>
            </aside>
          </div>
        </Container>
      </section>

      {/* Why the app */}
      <Section>
        <SectionHeader eyebrow={c.why.eyebrow} title={c.why.h2} description={c.why.description} />
        <ul className={cn(afterHeader, "grid gap-4 sm:grid-cols-2 lg:grid-cols-4")}>
          {c.why.items.map((it, i) => (
            <li key={it.title} className={cn(cardClass, "p-6")}>
              <IconBox icon={whyIcons[i % whyIcons.length]} />
              <h3 className="mt-5 font-display text-base font-bold text-text">{it.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{it.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* On-demand library + channels */}
      <section className="section-y border-y border-border bg-bg-secondary">
        <Container>
          <SectionHeader
            eyebrow={c.library.eyebrow}
            title={c.library.h2}
            description={c.library.description}
            action={
              settings.highlights.moviesShows ? (
                <p className="rounded-[14px] border border-border bg-card px-5 py-3 text-right">
                  <span className="block font-display text-2xl font-bold text-text">{settings.highlights.moviesShows}</span>
                  <span className="text-xs text-subtle">Movies &amp; shows</span>
                </p>
              ) : undefined
            }
          />
          <ul className={cn(afterHeader, "grid grid-cols-2 gap-4 sm:grid-cols-4")}>
            {c.library.genres.map((g, i) => (
              <li key={g} className={`relative flex aspect-[16/10] items-end overflow-hidden rounded-[14px] border border-white/5 bg-gradient-to-br p-4 ${posterTones[i % posterTones.length]}`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgb(255_255_255/0.14),transparent_55%)]" aria-hidden />
                <span className="relative font-display text-sm font-bold text-text sm:text-base">{g}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-subtle">{c.library.note}</p>

          <div className={cn(cardClass, "mt-10 flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between")}>
            <div className="min-w-0">
              <p className="font-display text-lg font-bold text-text">
                Live TV across {channelCategories.length} categories{settings.highlights.liveChannels ? ` · ${settings.highlights.liveChannels} live channels` : ""}
              </p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {channelCategories.map((cat) => (
                  <li key={cat.key}>
                    <Link href={`/channels#${cat.key}`} className="block rounded-full border border-border bg-inset px-3 py-1 text-xs text-muted transition-colors hover:border-primary/40 hover:text-text">
                      {cat.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <ButtonLink href="/channels" variant="secondary" className="shrink-0">
              Explore the channel guide <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* Phone */}
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16 [&>*]:min-w-0">
          <div className="order-2 flex justify-center lg:order-1 lg:col-span-5" aria-hidden>
            <div className="relative w-[230px] rounded-[34px] border border-white/10 bg-[#0a0d22] p-2 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9)]">
              <div className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(circle,rgb(70_224_255/0.18),transparent_65%)] blur-2xl" />
              <div className="overflow-hidden rounded-[27px] bg-[#07090b] p-3">
                <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-white/15" />
                <div className="aspect-video rounded-lg bg-[linear-gradient(115deg,#05060f_10%,#0b3a46_60%,#22d3ee_150%)]" />
                <div className="mt-3 h-2 w-24 rounded bg-white/70" />
                <div className="mt-1.5 h-1.5 w-32 rounded bg-white/25" />
                <div className="mt-4 flex gap-1.5">
                  {["Live", "Movies", "Series"].map((t, i) => (
                    <span key={t} className={cn("rounded-full px-2 py-0.5 text-[9px] font-medium", i === 0 ? "bg-primary text-on-primary" : "bg-white/10 text-muted")}>
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-3 space-y-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className={`h-8 w-12 shrink-0 rounded bg-gradient-to-br ${posterTones[i]}`} />
                      <span className="flex-1 space-y-1">
                        <span className="block h-1.5 w-3/4 rounded bg-white/40" />
                        <span className="block h-1 w-1/2 rounded bg-white/15" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 lg:col-span-7">
            <SectionHeader eyebrow={c.phone.eyebrow} title={c.phone.h2} description={c.phone.description} />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {c.phone.points.map((p) => (
                <li key={p} className="flex items-center gap-3 rounded-[12px] border border-border bg-card px-4 py-3 text-sm text-text">
                  <Smartphone className="h-4 w-4 shrink-0 text-accent" aria-hidden /> {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Inside the app */}
      <section className="section-y border-y border-border bg-bg-secondary">
        <Container>
          <SectionHeader align="center" eyebrow={c.inside.eyebrow} title={c.inside.h2} description={c.inside.description} />
          <ul className={cn(afterHeader, "grid gap-4 sm:grid-cols-2 lg:grid-cols-4")}>
            {c.inside.screens.map((s, i) => (
              <li key={s.title} className={cn(cardClass, "p-4")}>
                <ScreenSketch variant={i} />
                <h3 className="mt-4 font-display text-base font-bold text-text">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-muted">{s.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Install */}
      <section id="install" className="section-y scroll-mt-20">
        <Container>
          <SectionHeader eyebrow={c.install.eyebrow} title={c.install.h2} description={c.install.description} />
          {platforms.length > 0 ? (
            <>
              <ul className={cn(afterHeader, "grid gap-4 sm:grid-cols-2 lg:grid-cols-3")}>
                {platforms.map((p) => {
                  const prof = profileFor(p.name);
                  return (
                    <li key={p.name} id={slugify(p.name)} className={cn(cardClass, "flex scroll-mt-28 flex-col p-6")}>
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display text-lg font-bold text-text">{p.name}</h3>
                        <Badge tone="success" dot>
                          Verified
                        </Badge>
                      </div>
                      {p.method && <p className="mt-1 text-sm font-medium text-accent">{p.method}</p>}
                      <p className="mt-3 flex-1 text-sm leading-6 text-muted">{prof.summary}</p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        <ButtonLink href={`/guides/${slugify(p.name)}`} size="sm">
                          Read the setup guide
                        </ButtonLink>
                        {p.downloadUrl && (
                          <a href={p.downloadUrl} rel="noopener noreferrer" target="_blank" className={buttonClasses({ variant: "secondary", size: "sm" })}>
                            <Download className="h-4 w-4" aria-hidden /> {p.downloadLabel || "Download"}
                          </a>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-5 text-sm text-muted">
                <RichText text={c.install.notListed} /> Customers also find codes, server details and step-by-step help in their dashboard under Apps &amp; Guides.
              </p>
            </>
          ) : (
            <div className={cn(cardClass, "mt-10 flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between")}>
              <div className="flex gap-4">
                <IconBox icon={CircleHelp} />
                <div>
                  <p className="font-semibold text-text">Setup guides are being published</p>
                  <p className="mt-1 text-sm leading-6 text-muted">
                    Official download links and numbered steps appear here for each device once it&apos;s verified. Until then, our team will walk you through setup.
                  </p>
                </div>
              </div>
              <ButtonLink href="/contact" variant="secondary" className="shrink-0">
                Contact support
              </ButtonLink>
            </div>
          )}
        </Container>
      </section>

      {/* Requirements */}
      <section className="section-y border-y border-border bg-bg-secondary">
        <Container>
          <SectionHeader eyebrow={c.requirements.eyebrow} title={c.requirements.h2} description={c.requirements.description} />
          <div className={cn(afterHeader, "grid gap-4 md:grid-cols-3")}>
            {c.requirements.groups.map((g, i) => (
              <div key={g.title} className={cn(cardClass, "p-6")}>
                <div className="flex items-center gap-3">
                  <IconBox icon={reqIcons[i % reqIcons.length]} size="sm" />
                  <h3 className="font-display text-base font-bold text-text">{g.title}</h3>
                </div>
                <ul className="mt-5 space-y-3">
                  {g.items.map((it) => (
                    <li key={it} className="flex gap-2.5 text-sm leading-6 text-muted">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-accent" strokeWidth={2.5} aria-hidden /> {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-5 flex items-center gap-2 text-sm text-muted">
            <Gauge className="h-4 w-4 text-accent" aria-hidden /> Playback trouble? Work through the{" "}
            <Link href="/guides/troubleshooting" className="font-medium text-accent hover:text-light-blue">
              troubleshooting guide
            </Link>.
          </p>
        </Container>
      </section>

      {/* Get started */}
      <Section>
        <SectionHeader align="center" eyebrow={c.start.eyebrow} title={c.start.h2} />
        <ol className={cn(afterHeader, "grid gap-4 md:grid-cols-3")}>
          {c.start.steps.map((s, i) => (
            <li key={s.title}>
              <Link href={s.href} className={cn(cardClass, cardHover, "group flex h-full flex-col p-6")}>
                <span className="grid h-10 w-10 place-items-center rounded-full border border-primary/40 font-display text-sm font-bold text-accent">{i + 1}</span>
                <h3 className="mt-5 font-display text-lg font-bold text-text">{s.title}</h3>
                <p className="mt-1.5 flex-1 text-sm leading-6 text-muted">{s.body}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                  {s.cta} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </Section>

      {/* FAQ */}
      <section className="section-y border-t border-border bg-bg-secondary">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16 [&>*]:min-w-0">
            <div className="lg:col-span-5">
              <SectionHeader eyebrow={c.faq.eyebrow} title={c.faq.h2} description={<RichText text={c.faq.description} />} />
            </div>
            <div className="lg:col-span-7">
              <FaqAccordion items={faqItems} />
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="page-cta section-y-sm border-t border-border">
        <Container>
          <div className="relative overflow-hidden rounded-[20px] border border-primary/25 bg-[#0d1238] px-6 py-10 sm:px-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_100%_at_100%_0%,rgb(70_224_255/0.2),transparent_70%)]" aria-hidden />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <h2 className="font-display text-2xl font-bold tracking-tight text-text sm:text-3xl">{c.cta.h2}</h2>
                <p className="mt-2 text-muted">
                  {c.cta.body}
                  {settings.highlights.moneyBackDays && (
                    <>
                      {" "}
                      Covered by our{" "}
                      <Link href="/refund-policy" className="font-medium text-text underline-offset-4 hover:underline">
                        {settings.highlights.moneyBackDays}-day money-back policy
                      </Link>.
                    </>
                  )}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-3">
                <ButtonLink href="/plans" size="lg">
                  See plans <ArrowRight className="h-4 w-4" aria-hidden />
                </ButtonLink>
                <ButtonLink href="/contact" variant="secondary" size="lg">
                  Talk to support
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
