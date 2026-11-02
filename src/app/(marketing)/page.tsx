import type { Metadata } from "next";
import { FloatingHelp } from "@/components/home/floating-help";
import { HomeHero } from "@/components/home/hero";
import { SportsSection } from "@/components/sports-section";
import {
  ChannelsShowcase,
  CompareSection,
  DevicesSection,
  FaqSection,
  FeaturesSection,
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
import { displayName, getActivePlans, getApprovedReviews, getChannelCategories } from "@/lib/queries";
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
  const [plans, { reviews, total: reviewTotal, average }, categories, settings, members, sampleChannels, deviceGuides, faqCount] = await Promise.all([
    getActivePlans(),
    getApprovedReviews({ take: 8 }),
    getChannelCategories(),
    getSettings(),
    db.user.count({ where: { emailVerified: true, status: "ACTIVE" } }),
    db.channel.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      take: 24,
      select: { id: true, name: true, logoUrl: true, category: { select: { name: true } } },
    }),
    getDeviceGuides(),
    db.faq.count({ where: { isPublished: true } }),
  ]);

  // Price hooks computed from the real price list.
  const pricing = pricingContext(plans);
  const monthlies = plans.map(monthlyCents).filter((m): m is number => m !== null);
  const fromMonthly = monthlies.length ? formatMoney(Math.min(...monthlies), plans[0]?.currency ?? "USD") : null;
  const maxSave = Math.max(0, ...plans.map((p) => savingsPct(p, pricing.baseMonthly)));

  const visibleCategories = categories.filter((c) => c._count.channels > 0).map((c) => ({ id: c.id, slug: c.slug, name: c.name, count: c._count.channels }));
  const totalChannels = visibleCategories.reduce((n, c) => n + c.count, 0);
  const platforms = settings.apps.platforms.filter((p) => p.verified);

  // Hero stats come straight from the database — nothing is hard-coded.
  const stats = [
    { label: "Channels listed", value: totalChannels > 0 ? String(totalChannels) : "Soon" },
    { label: "Plans", value: plans.length > 0 ? String(plans.length) : "Soon" },
    { label: "Support", value: "Tickets" },
  ];

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
      <HomeHero tagline={settings.general.tagline} stats={stats} />
      <SocialProofBar members={members} platforms={platforms} rating={{ average, total: reviewTotal }} />
      <IntroSection />
      <FeaturesSection />
      <StepsSection />
      <ChannelsShowcase
        channels={sampleChannels.map((c) => ({ id: c.id, name: c.name, logoUrl: c.logoUrl, category: c.category.name }))}
        categories={visibleCategories}
      />
      <PlansSection plans={plans.slice(0, 4)} checkout={isCheckoutEnabled()} />
      <CompareSection fromMonthly={fromMonthly} />
      <SportsSection />
      <DevicesSection platforms={platforms} />
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
