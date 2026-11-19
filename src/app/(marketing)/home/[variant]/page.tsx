import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FloatingHelp } from "@/components/home/floating-help";
import { assistantProvider } from "@/lib/assistant-providers";
import { HomeQuickNav } from "@/components/home/quick-nav";
import { HomeHero } from "@/components/home/hero";
import { SportsSection } from "@/components/sports-section";
import {
  CompareSection,
  DeviceCheckSection,
  DevicesSection,
  FaqSection,
  FinalCta,
  GuidesSection,
  IntroSection,
  LegalSection,
  OfficialSiteSection,
  PlansSection,
  QuickFactsSection,
  ReviewsSection,
  ServicesSection,
  SocialProofBar,
  StepsSection,
  SupportSection,
} from "@/components/home/sections";
import { generalGuides } from "@/content/guides";
import { getDeviceGuides } from "@/lib/guides";
import { monthlyCents, monthsFor, pricingContext, savingsPct } from "@/lib/pricing";
import Link from "next/link";
import { db } from "@/lib/db";
import { isCheckoutEnabled } from "@/lib/payments";
import { displayName, getActivePlans, getApprovedReviews } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { getPosts } from "@/lib/blog";
import { getCustomerMethods } from "@/lib/checkout/methods";
import { siteConfig } from "@/lib/site";
import { formatDate, formatMoney } from "@/lib/utils";
import { LOGO_URL, ORG_ID, SITE_ID, webPageNode } from "@/lib/schema";

/*
 * The homepage, served at "/" (src/proxy.ts rewrites "/" to /home/index; /home/* itself answers 404).
 *
 * Rendering it takes ~600 ms on the Hostinger server, and every Cloudflare cache miss used to pay that: PageSpeed's
 * mobile Speed Index went from ~1.1-1.3 s (edge copy) to 2.2-2.4 s (origin render), 2026-11-19. So the rendered page
 * is kept in Next's incremental cache: rendered on the first request after a deploy (nothing at build time: the
 * database isn't reachable during the Hostinger build), then served straight from the cache and re-rendered in the
 * background at most every 5 minutes. Admin price and content changes show within ~5 minutes at the origin (plus up to
 * an hour in the Cloudflare copy, see next.config.ts).
 */
export const revalidate = 300;
export const dynamicParams = true;
export function generateStaticParams(): { variant: string }[] {
  return [];
}

// Guides shown on the homepage, in the order a new customer needs them.
const homeGuides = ["how-to-get-apollo-tv", "apollo-tv-downloader-code", "xtream-codes-login", "is-apollo-tv-down", "apollo-group-tv-netflix", "apollo-group-tv-roku"];

// Chosen by the owner (2026-11-18). About 570px: keep it under 580px so search results show it whole.
const homeTitle = "Apollo Group TV - Official Apollo App | Live TV, Sports & Movies";

/** The description quotes the cheapest monthly price from the live price list, so it never goes stale. */
export async function generateMetadata({ params }: PageProps<"/home/[variant]">): Promise<Metadata> {
  if ((await params).variant !== "index") notFound();
  let from: string | null = null;
  try {
    const plans = await getActivePlans();
    const monthlies = plans.map(monthlyCents).filter((m): m is number => m !== null);
    if (monthlies.length) from = formatMoney(Math.min(...monthlies), plans[0]?.currency ?? "USD");
  } catch {
    // Database briefly unavailable: fall back to the wording without a price.
  }
  // Opens with both brand keywords, which Google bolds when they match the search; about 150 characters.
  const description = from
    ? `Apollo Group TV (Apollo TV) is an IPTV service for live TV, sports and movies on Fire TV, Android, iPhone and PC. One-time packs from ${from}/month.`
    : "Apollo Group TV (Apollo TV) is an IPTV service for live TV, sports and movies on Fire TV, Android, iPhone and PC. Pay once for 3 months to 2 years.";
  return {
    title: { absolute: homeTitle },
    description,
    alternates: { canonical: "/" },
    openGraph: {
      title: "Apollo Group TV Official Site: Live TV, Sports & Movies",
      description: from
        ? `Apollo Group TV: live channels, sports and movies on the screens you already own. Pay once from ${from}/month, with a setup guide for every device.`
        : "Apollo Group TV: live channels, sports and movies on the screens you already own. Pay once for 3 months to 2 years, with a setup guide for every device.",
      url: "/",
      type: "website",
      // A page-level openGraph object replaces the inherited one, so the share image must be listed here.
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Apollo Group TV, the official site for live TV, sports and movies" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Apollo Group TV Official Site: Live TV, Sports & Movies",
      description,
      images: ["/opengraph-image"],
    },
  };
}

const quickNav = [
  { id: "overview", label: "Overview" },
  { id: "plans", label: "Pricing" },
  { id: "services", label: "Services" },
  { id: "sports", label: "Live sports" },
  { id: "devices", label: "Devices" },
  { id: "how-it-works", label: "How it works" },
  { id: "reviews", label: "Reviews" },
  { id: "guides", label: "Guides" },
  { id: "faq", label: "FAQ" },
  { id: "support", label: "Support" },
];

/** One homepage band: anchor target for the quick nav; alternating tint comes from .home-band in globals.css. */
function Band({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div id={id} className="home-band">
      {children}
    </div>
  );
}

export default async function HomePage({ params }: PageProps<"/home/[variant]">) {
  if ((await params).variant !== "index") notFound();
  const [
    plans,
    { reviews },
    settings,
    deviceGuides,
    faqCount,
  ] = await Promise.all([
    getActivePlans(),
    getApprovedReviews({ take: 8 }),
    getSettings(),
    getDeviceGuides(),
    db.faq.count({ where: { isPublished: true } }),
  ]);

  const methods = (await getCustomerMethods(settings)).map((m) => ({ id: m.id, name: m.name, logoUrl: m.logoUrl, glyph: m.glyph, accent: m.accent }));

  // Price hooks computed from the real price list.
  const pricing = pricingContext(plans);
  const monthlies = plans
    .map(monthlyCents)
    .filter((m): m is number => m !== null);
  const fromMonthly = monthlies.length
    ? formatMoney(Math.min(...monthlies), plans[0]?.currency ?? "USD")
    : null;
  const maxSave = Math.max(
    0,
    ...plans.map((p) => savingsPct(p, pricing.baseMonthly)),
  );

  // Hero stats: catalog sizes are set in Admin → Settings → Homepage highlights. No star rating or review count is
  // shown on the homepage.
  const { highlights } = settings;
  // Device limit read from the packs' own feature lists ("Up to 5 devices per account"); shown only when every
  // active pack states it, using the lowest figure, so the hero never promises more than the cheapest pack gives.
  const deviceLimits = plans.map((p) => {
    const line = (Array.isArray(p.features) ? p.features.map(String) : []).find((f) => /up to \d+ devices/i.test(f));
    return line ? Number(line.match(/up to (\d+) devices/i)![1]) : null;
  });
  const deviceLimit = deviceLimits.length && deviceLimits.every((n) => n !== null) ? Math.min(...(deviceLimits as number[])) : null;
  const stats = [
    highlights.liveChannels && {
      label: "Live Channels",
      value: highlights.liveChannels,
    },
    highlights.moviesShows && {
      label: "Movies & Shows",
      value: highlights.moviesShows,
    },
    deviceLimit && {
      label: "Devices per account",
      value: String(deviceLimit),
    },
  ].filter((s): s is { label: string; value: string } => Boolean(s));
  const badges = [
    highlights.moneyBackDays && `${highlights.moneyBackDays}-day money-back`,
    "No contracts",
    "Cancel anytime",
  ].filter((b): b is string => Boolean(b));

  // Key facts: every value comes from settings, the price list or verified site behaviour.
  const sortedPlans = [...plans].sort((a, b) => (monthlyCents(a) ?? Infinity) - (monthlyCents(b) ?? Infinity));
  const lowest = sortedPlans[0];
  const allOneTime = plans.length > 0 && plans.every((p) => p.oneTime);
  const officialDomain = settings.legal.officialDomain || new URL(siteConfig.url).host;
  const facts = [
    { k: "Official website", v: officialDomain },
    { k: "Also known as", v: "Apollo TV" },
    { k: "What it is", v: "An internet TV (IPTV) service: live channels sorted by category and region, plus an on-demand library, watched in an app on your own device." },
    ...(plans.length
      ? [
          {
            k: "Price",
            v: (
              <>
                {plans.length} packs lasting {Math.min(...plans.map((p) => monthsFor(p.interval)))} to {Math.max(...plans.map((p) => monthsFor(p.interval)))} months
                {fromMonthly && lowest ? `, from ${fromMonthly} a month on the ${lowest.name}` : ""}.{" "}
                <Link href="/plans" className="font-semibold text-accent hover:text-light-blue">
                  Compare packs
                </Link>
              </>
            ),
          },
        ]
      : []),
    ...(allOneTime ? [{ k: "Billing", v: "One payment per pack. Nothing renews automatically." }] : []),
    { k: "Devices", v: deviceGuides.length ? deviceGuides.map((d) => d.name).join(", ") : "See the app page" },
    { k: "Activation", v: "Our team activates your pack once payment is confirmed. Your login details then appear in My Account." },
    ...(highlights.moneyBackDays
      ? [
          {
            k: "Refunds",
            v: (
              <>
                Requests within {highlights.moneyBackDays} days, under the{" "}
                <Link href="/refund-policy" className="font-semibold text-accent hover:text-light-blue">
                  Refund Policy
                </Link>
                .
              </>
            ),
          },
        ]
      : []),
    { k: "Support", v: "Written replies in a support ticket from your dashboard, or through the contact page." },
    { k: "Not included", v: "Netflix and other streaming services. Their accounts and apps are separate." },
  ];

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    alternateName: "Apollo TV",
    url: siteConfig.url,
    description: siteConfig.description,
    knowsAbout: ["IPTV", "Internet television"],
    // Only profiles the owner has entered in Admin → Settings → Social; never invented.
    ...(Object.values(settings.social).some(Boolean) ? { sameAs: Object.values(settings.social).filter(Boolean) } : {}),
    logo: { "@type": "ImageObject", url: LOGO_URL, width: 512, height: 512 },
    image: LOGO_URL,
    ...(settings.legal.entityAddress
      ? { address: settings.legal.entityAddress }
      : {}),
    ...(settings.general.supportEmail
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: settings.general.supportEmail,
            url: `${siteConfig.url}/contact`,
            availableLanguage: "English",
          },
        }
      : {}),
  };

  const siteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    name: siteConfig.name,
    inLanguage: "en",
    alternateName: "Apollo TV",
    url: siteConfig.url,
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([orgJsonLd, siteJsonLd, webPageNode({ path: "/", name: siteConfig.name, description: siteConfig.description, extra: { about: { "@id": ORG_ID } } })]).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />
      <HomeHero
        stats={stats}
        badges={badges}
      />
      <SocialProofBar
        fromMonthly={fromMonthly}
        oneTime={allOneTime}
        moneyBackDays={highlights.moneyBackDays}
      />
      <HomeQuickNav items={quickNav} />
      {/* Buyer journey: what it is → price → what you get → why switch → price → how to start → trust → answers → help. */}
      <Band id="overview">
        <IntroSection />
      </Band>
      <Band id="facts">
        <QuickFactsSection facts={facts} domain={settings.legal.officialDomain || new URL(siteConfig.url).host} />
      </Band>
      <Band id="plans">
        <PlansSection
          plans={plans.slice(0, 4)}
          checkout={isCheckoutEnabled()}
          methods={methods}
        />
      </Band>
      <Band id="services">
        <ServicesSection />
      </Band>
      <Band id="sports">
        <SportsSection limit={6} />
      </Band>
      <Band id="devices">
        <DevicesSection />
      </Band>
      <Band id="your-device">
        <DeviceCheckSection devices={deviceGuides.map((d) => ({ name: d.name, slug: d.slug }))} />
      </Band>
      <Band id="compare">
        <CompareSection
          fromMonthly={fromMonthly}
          liveChannels={highlights.liveChannels}
          moviesShows={highlights.moviesShows}
        />
      </Band>
      <Band id="how-it-works">
        <StepsSection />
      </Band>
      <Band id="reviews">
        <ReviewsSection
          reviews={reviews.map((r) => ({
            id: r.id,
            rating: r.rating,
            title: r.title,
            body: r.body,
            isVerified: r.isVerified,
            author: displayName(r.user.name),
            date: formatDate(r.createdAt),
          }))}
        />
      </Band>
      <Band id="safety">
        <LegalSection />
      </Band>
      <Band id="official-site">
        <OfficialSiteSection domain={settings.legal.officialDomain || new URL(siteConfig.url).host} />
      </Band>
      <Band id="guides">
        <GuidesSection posts={homeGuides.map((slug) => getPosts().find((p) => p.slug === slug)).filter((p) => p !== undefined)} />
      </Band>
      <Band id="faq">
        <FaqSection />
      </Band>
      <Band id="support">
        <SupportSection
          guideCount={generalGuides.length + deviceGuides.length}
          faqCount={faqCount}
        />
      </Band>
      <FinalCta fromMonthly={fromMonthly} maxSave={maxSave} />
      {/* The chat assistant (in the layout) takes this corner when it's switched on. */}
      {!assistantProvider() && <FloatingHelp whatsapp={settings.general.whatsapp} />}
    </>
  );
}
