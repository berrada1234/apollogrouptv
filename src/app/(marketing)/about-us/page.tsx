import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  Building2,
  FileText,
  Globe,
  LifeBuoy,
  Mail,
  MapPin,
  MonitorSmartphone,
  Receipt,
  ShieldAlert,
} from "lucide-react";
import {
  CtaBand,
  PageHero,
  RelatedLinks,
} from "@/components/marketing/sections";
import {
  afterHeader,
  cardClass,
  IconBox,
  leadClass,
  Section,
  SectionHeader,
} from "@/components/section";
import { getSettings } from "@/lib/settings";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { organizationRef, webPageNode } from "@/lib/schema";
import { shareImage } from "@/lib/share-image";

export const dynamic = "force-dynamic";

const title = "About Apollo Group TV: How We Run the Service";
const description =
  "Who Apollo Group TV is, what the service includes and the practices we follow on pricing, devices, support, reviews and published policies.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/about-us" },
  openGraph: { ...shareImage, title, description, url: "/about-us" },
};

const practices = [
  {
    icon: Receipt,
    t: "Prices you can check before you pay",
    b: "Every pack's full price, length and cost per month are on the Plans page. Packs are one-time payments, so nothing renews without you choosing it.",
  },
  {
    icon: MonitorSmartphone,
    t: "Devices listed only after testing",
    b: "A device appears in our guides once we've confirmed the install method works, with the official download source. If yours isn't listed, we'll tell you before you buy.",
  },
  {
    icon: LifeBuoy,
    t: "Support answered in writing",
    b: "Questions go into a ticket thread that you and our team can both read back. Setup help, billing questions and refund requests all follow the same path.",
  },
  {
    icon: BadgeCheck,
    t: "Reviews from registered customers",
    b: "Only account holders can post reviews. We publish critical ones too, and we never write, buy or edit reviews.",
  },
];

export default async function AboutPage() {
  const settings = await getSettings();
  const { entityName, entityAddress, officialDomain } = settings.legal;
  const { supportEmail } = settings.general;

  const jsonLd = webPageNode({
    path: "/about-us",
    name: title,
    type: "AboutPage",
    extra: {
      about: {
        ...organizationRef,
        alternateName: "Apollo TV",
        ...(entityName ? { legalName: entityName } : {}),
        ...(entityAddress ? { address: entityAddress } : {}),
      },
    },
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <PageHero
        pageSchema={false}
        eyebrow="About us"
        title="About Apollo Group TV"
        description="Apollo Group TV (often called Apollo TV) is an internet TV service run on a simple rule: tell people exactly what they are buying, then make it easy to set up and easy to get help."
        crumbs={[{ href: "/about-us", label: "About" }]}
      />

      {/* What we do */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16 [&>*]:min-w-0">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="What we do"
              title="An Internet TV Service You Manage Yourself"
            />
          </div>
          <div className={cn(leadClass, "space-y-4 lg:col-span-7")}>
            <p>
              We provide live channels and an on-demand library through the
              Apollo TV app, on TVs, streaming sticks, phones and computers.
              Instead of a cable contract, customers buy a pack for a fixed
              period, from three months to two years, and pay once.
            </p>
            <p>
              Everything after sign-up happens in one account: the pack and its
              dates, payments, install guides for each device, player logins for
              third-party apps and every support conversation. Our team
              activates packs, answers tickets and keeps the setup guides
              current.
            </p>
            <p>
              See the full picture on the{" "}
              <Link
                href="/product"
                className="text-accent hover:text-light-blue"
              >
                features page
              </Link>
              , or go straight to{" "}
              <Link href="/plans" className="text-accent hover:text-light-blue">
                plans and pricing
              </Link>
              .
            </p>
          </div>
        </div>
      </Section>

      {/* Practices */}
      <section
        className="section-y border-y border-border bg-bg-secondary"
        aria-labelledby="practices-heading"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div id="practices-heading">
            <SectionHeader
              eyebrow="How we work"
              title="Four Practices We Hold Ourselves To"
              description="Each one is something you can check on this website, not a slogan."
            />
          </div>
          <ul className={cn(afterHeader, "grid gap-4 sm:grid-cols-2")}>
            {practices.map((p) => (
              <li key={p.t} className={cn(cardClass, "flex gap-4 p-6")}>
                <IconBox icon={p.icon} />
                <div>
                  <h3 className="font-display text-base font-bold text-text">
                    {p.t}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{p.b}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Transparency */}
      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className={cn(cardClass, "p-6 sm:p-8")}>
            <IconBox icon={FileText} />
            <h2 className="mt-5 font-display text-xl font-bold text-text">
              Policies in Writing, With Dates
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Our{" "}
              <Link
                href="/terms-and-conditions"
                className="text-accent hover:text-light-blue"
              >
                terms
              </Link>
              ,{" "}
              <Link
                href="/privacy-policy"
                className="text-accent hover:text-light-blue"
              >
                privacy policy
              </Link>
              ,{" "}
              <Link
                href="/refund-policy"
                className="text-accent hover:text-light-blue"
              >
                refund policy
              </Link>{" "}
              and{" "}
              <Link href="/dmca" className="text-accent hover:text-light-blue">
                copyright process
              </Link>{" "}
              are public and show when they were last updated. Refund rules live
              on one page only, so there is never a second version to argue
              about. Our policy is to list only authorized, properly licensed
              content; the{" "}
              <Link
                href="/is-apollo-group-tv-legal"
                className="text-accent hover:text-light-blue"
              >
                legal explainer
              </Link>{" "}
              sets out how that works.
            </p>
          </div>
          <div className={cn(cardClass, "p-6 sm:p-8")}>
            <IconBox icon={ShieldAlert} />
            <h2 className="mt-5 font-display text-xl font-bold text-text">
              Watch Out for Lookalike Sites
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Several websites use names similar to ours. Official messages
              about your account come from this website and appear in your
              dashboard. We will never ask for your password, and we only take
              payment through your account or a ticket from our team.
              {officialDomain ? (
                <>
                  {" "}
                  Our official domain is{" "}
                  <span className="font-semibold text-text">
                    {officialDomain}
                  </span>
                  .
                </>
              ) : null}
            </p>
          </div>
        </div>
      </Section>

      {/* Business details */}
      <section
        className="section-y-sm border-t border-border"
        aria-labelledby="business-heading"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2
            id="business-heading"
            className="font-display text-xl font-bold text-text"
          >
            Business details
          </h2>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Building2,
                k: "Operated by",
                v:
                  entityName ||
                  "Published once confirmed by the business owner.",
              },
              ...(entityAddress
                ? [{ icon: MapPin, k: "Address", v: entityAddress }]
                : []),
              {
                icon: Globe,
                k: "Official website",
                v: officialDomain || siteConfig.url.replace(/^https?:\/\//, ""),
              },
              {
                icon: Mail,
                k: "Contact",
                v:
                  supportEmail ||
                  "Use the contact form or open a ticket from your dashboard.",
              },
            ].map((x) => (
              <div key={x.k} className={cn(cardClass, "flex gap-3 p-5")}>
                <x.icon
                  className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                  aria-hidden
                />
                <div className="min-w-0">
                  <dt className="text-xs uppercase tracking-[0.12em] text-subtle">
                    {x.k}
                  </dt>
                  <dd className="mt-1 break-words text-sm text-text">{x.v}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Section>
        <h2 className="mb-6 font-display text-xl font-bold text-text">
          Learn more
        </h2>
        <RelatedLinks
          links={[
            {
              href: "/product",
              label: "Features",
              description: "The app, the dashboard and support.",
            },
            {
              href: "/app",
              label: "Apps and devices",
              description: "Where the app runs and how to install it.",
            },
            {
              href: "/reviews",
              label: "Customer reviews",
              description: "What registered customers say.",
            },
            {
              href: "/contact",
              label: "Contact us",
              description: "Questions before or after you sign up.",
            },
          ]}
        />
      </Section>

      <CtaBand
        title="Take a closer look"
        description="Explore the features, compare the packs, and create an account when you're ready."
      />
    </>
  );
}
