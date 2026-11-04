import type { Metadata } from "next";
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

// Rendered per request: the database isn't reachable during the Hostinger build, so the page can't be prerendered.
export const dynamic = "force-dynamic";

// Guides shown on the homepage, in the order a new customer needs them.
const homeGuides = ["how-to-get-apollo-tv", "apollo-tv-downloader-code", "xtream-codes-login", "is-apollo-tv-down", "apollo-group-tv-netflix", "apollo-group-tv-roku"];

export const metadata: Metadata = {
  title: {
    absolute: "Apollo Group TV (Apollo TV): Live TV & On-Demand Streaming",
  },
  description:
    "Apollo Group TV (Apollo TV) streams live channels and on-demand shows to Fire TV, Android, iPhone, Windows and Mac. One-time packs, no auto-renewal.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Apollo Group TV (Apollo TV): Live TV and On-Demand Streaming",
    description:
      "Live channels and an on-demand library on the screens you already own. Pay once for one to twelve months, with a setup guide for every device.",
    url: "/",
  },
};

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

export default async function HomePage() {
  const [
    plans,
    { reviews, total: reviewTotal, average },
    settings,
    members,
    deviceGuides,
    faqCount,
  ] = await Promise.all([
    getActivePlans(),
    getApprovedReviews({ take: 8 }),
    getSettings(),
    db.user.count({ where: { emailVerified: true, status: "ACTIVE" } }),
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

  // Hero stats: catalog sizes are set in Admin → Settings → Homepage highlights; the rating is the real review average.
  const { highlights } = settings;
  const stats = [
    highlights.liveChannels && {
      label: "Live Channels",
      value: highlights.liveChannels,
    },
    highlights.moviesShows && {
      label: "Movies & Shows",
      value: highlights.moviesShows,
    },
    reviewTotal > 0 &&
      average !== null && {
        label: `Rating · ${reviewTotal} review${reviewTotal === 1 ? "" : "s"}`,
        value: `${average.toFixed(1)}/5`,
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
        members={members}
        rating={{ average, total: reviewTotal }}
        overrides={{ rating: highlights.rating, reviewCount: highlights.reviewCount, members: highlights.members }}
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
