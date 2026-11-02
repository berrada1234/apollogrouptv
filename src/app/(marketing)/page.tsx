import type { Metadata } from "next";
import { FloatingHelp } from "@/components/home/floating-help";
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
  title: { absolute: "Apollo Group TV — Live TV & On-Demand Streaming Plans" },
  description:
    "Apollo Group TV (Apollo TV) brings live channels and on-demand viewing together: clear subscription plans and pricing, verified device setup and real support.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Apollo Group TV — Live TV & On-Demand Streaming",
    description: "Live channels and on-demand viewing with clear plans, verified device guides and trackable support.",
    url: "/",
  },
};


export default async function HomePage() {
  const [plans, { reviews, total: reviewTotal, average }, settings, members, deviceGuides, faqCount] = await Promise.all([
    getActivePlans(),
    getApprovedReviews({ take: 8 }),
    getSettings(),
    db.user.count({ where: { emailVerified: true, status: "ACTIVE" } }),
    getDeviceGuides(),
    db.faq.count({ where: { isPublished: true } }),
  ]);

  // Price hooks computed from the real price list.
  const pricing = pricingContext(plans);
  const monthlies = plans.map(monthlyCents).filter((m): m is number => m !== null);
  const fromMonthly = monthlies.length ? formatMoney(Math.min(...monthlies), plans[0]?.currency ?? "USD") : null;
  const maxSave = Math.max(0, ...plans.map((p) => savingsPct(p, pricing.baseMonthly)));

  const platforms = settings.apps.platforms.filter((p) => p.verified);

  // Hero stats: catalog sizes are set in Admin → Settings → Homepage highlights; the rating is the real review average.
  const { highlights } = settings;
  const stats = [
    highlights.liveChannels && { label: "Live Channels", value: highlights.liveChannels },
    highlights.moviesShows && { label: "Movies & Shows", value: highlights.moviesShows },
    reviewTotal > 0 && average !== null && { label: `Rating · ${reviewTotal} review${reviewTotal === 1 ? "" : "s"}`, value: `${average.toFixed(1)}/5` },
  ].filter((s): s is { label: string; value: string } => Boolean(s));
  const badges = [highlights.moneyBackDays && `${highlights.moneyBackDays}-day money-back`, "No contracts", "Cancel anytime"].filter(
    (b): b is string => Boolean(b),
  );

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/brand/apollo-mark.png`,
    ...(settings.general.supportEmail
      ? { contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: settings.general.supportEmail } }
      : {}),
  };

  const siteJsonLd = { "@context": "https://schema.org", "@type": "WebSite", name: siteConfig.name, alternateName: "Apollo TV", url: siteConfig.url };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([orgJsonLd, siteJsonLd]).replace(/</g, "\\u003c") }} />
      <HomeHero tagline={settings.general.tagline} stats={stats} badges={badges} />
      <SocialProofBar members={members} platforms={platforms} rating={{ average, total: reviewTotal }} />
      <IntroSection />
      <StepsSection />
      <PlansSection plans={plans.slice(0, 4)} checkout={isCheckoutEnabled()} />
      <CompareSection fromMonthly={fromMonthly} />
      <SportsSection />
      <DevicesSection />
      <LegalSection />
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
      <SupportSection guideCount={generalGuides.length + deviceGuides.length} faqCount={faqCount} />
      <FaqSection />
      <FinalCta fromMonthly={fromMonthly} maxSave={maxSave} />
      <FloatingHelp whatsapp={settings.general.whatsapp} />
    </>
  );
}
