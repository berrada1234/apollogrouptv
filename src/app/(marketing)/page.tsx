import type { Metadata } from "next";
import { FloatingHelp } from "@/components/home/floating-help";
import { HomeQuickNav } from "@/components/home/quick-nav";
import { HomeHero } from "@/components/home/hero";
import { SportsSection } from "@/components/sports-section";
import {
  CompareSection,
  DevicesSection,
  FaqSection,
  FinalCta,
  IntroSection,
  LegalSection,
  PlansSection,
  ReviewsSection,
  ServicesSection,
  SocialProofBar,
  StepsSection,
  SupportSection,
} from "@/components/home/sections";
import { generalGuides } from "@/content/guides";
import { getDeviceGuides } from "@/lib/guides";
import { monthlyCents, pricingContext, savingsPct } from "@/lib/pricing";
import { db } from "@/lib/db";
import { isCheckoutEnabled } from "@/lib/payments";
import { displayName, getActivePlans, getApprovedReviews } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { siteConfig } from "@/lib/site";
import { formatDate, formatMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

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

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/brand/apollo-mark.png`,
    ...(settings.legal.entityAddress
      ? { address: settings.legal.entityAddress }
      : {}),
    ...(settings.general.supportEmail
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: settings.general.supportEmail,
          },
        }
      : {}),
  };

  const siteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    alternateName: "Apollo TV",
    url: siteConfig.url,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([orgJsonLd, siteJsonLd]).replace(
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
      <Band id="plans">
        <PlansSection
          plans={plans.slice(0, 4)}
          checkout={isCheckoutEnabled()}
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
      <FloatingHelp whatsapp={settings.general.whatsapp} />
    </>
  );
}
