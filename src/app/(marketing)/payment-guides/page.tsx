import type { Metadata } from "next";
import Link from "next/link";
import { GuideCard } from "@/components/payment-guides";
import { CtaBand, PageHero } from "@/components/marketing/sections";
import { Section, SectionHeader } from "@/components/section";
import { paymentGuides } from "@/content/payment-guides";
import { siteConfig } from "@/lib/site";

const title = "Apollo Group TV Payment Guides: Cash App, Venmo, MoonPay & More";
const description =
  "Step-by-step guides to paying for Apollo Group TV with Cash App, Venmo, Shakepay, MoonPay, a card, a crypto wallet or Zelle, plus fees and troubleshooting.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/payment-guides" },
  openGraph: { title, description, url: "/payment-guides" },
};

const methodSlugs = ["cash-app", "venmo", "shakepay", "moonpay", "credit-card", "crypto-wallet", "zelle"];

export default function PaymentGuidesPage() {
  const methods = paymentGuides.filter((g) => methodSlugs.includes(g.slug));
  const help = paymentGuides.filter((g) => !methodSlugs.includes(g.slug));
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Apollo Group TV payment guides",
    itemListElement: paymentGuides.map((g, i) => ({ "@type": "ListItem", position: i + 1, name: g.title, url: `${siteConfig.url}/payment-guides/${g.slug}` })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList).replace(/</g, "\\u003c") }} />
      <PageHero
        eyebrow="Payment guides"
        title="How to Pay for Apollo Group TV"
        description="Pick the app or card you already have and follow its guide from start to finish. Each one ends with your login details in My Account."
        crumbs={[{ href: "/payment-guides", label: "Payment Guides" }]}
      />
      <Section>
        <SectionHeader eyebrow="By payment method" title="Choose How You Want to Pay" description="Not sure? MoonPay is the quickest with a card; Cash App is the easiest if it's already on your phone." />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {methods.map((g) => (
            <li key={g.slug}>
              <GuideCard guide={g} />
            </li>
          ))}
        </ul>
      </Section>
      <Section className="border-t border-border">
        <SectionHeader eyebrow="Before and after you pay" title="Understand Checkout and Fix Problems" />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {help.map((g) => (
            <li key={g.slug}>
              <GuideCard guide={g} />
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-muted">
          See every accepted method on the{" "}
          <Link href="/payment-methods" className="text-accent hover:text-light-blue">
            payment methods page
          </Link>
          , and pack prices on the{" "}
          <Link href="/plans" className="text-accent hover:text-light-blue">
            Plans page
          </Link>
          .
        </p>
      </Section>
      <CtaBand title="Choose a pack, then pay your way" description="Choose a pack, then follow the guide for your payment method." />
    </>
  );
}
