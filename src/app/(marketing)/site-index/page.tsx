import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand, PageHero } from "@/components/marketing/sections";
import { cardClass, Section } from "@/components/section";
import { generalGuides } from "@/content/guides";
import { paymentGuides } from "@/content/payment-guides";
import { getPosts } from "@/lib/blog";
import { getDeviceGuides } from "@/lib/guides";
import { getHelpIndex } from "@/lib/help-index";
import { accessLabel } from "@/lib/pricing";
import { getActivePlans } from "@/lib/queries";
import { cn, formatMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

const title = "Apollo Group TV Site Index: Every Page in One Place";
const description =
  "Every Apollo Group TV page grouped by topic: plans, setup guides, payment guides, help topics, blog articles, company information and policies.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/site-index" },
  openGraph: { title, description, url: "/site-index" },
};

type Group = { title: string; blurb: string; links: { href: string; label: string; note?: string }[] };

export default async function SiteIndexPage() {
  const [plans, devices, help] = await Promise.all([getActivePlans(), getDeviceGuides(), getHelpIndex()]);
  const posts = getPosts();

  const groups: Group[] = [
    {
      title: "Getting started",
      blurb: "What Apollo Group TV offers and how to choose.",
      links: [
        { href: "/", label: "Home" },
        { href: "/product", label: "Features" },
        { href: "/app", label: "Apps & supported devices" },
        { href: "/channels", label: "Channel categories" },
        { href: "/reviews", label: "Customer reviews" },
        { href: "/faq", label: "Frequently asked questions" },
      ],
    },
    {
      title: "Plans",
      blurb: "Every pack is a one-time payment with no automatic renewal.",
      links: [
        { href: "/plans", label: "Plans & pricing" },
        ...plans.map((p) => ({ href: "/plans", label: p.name, note: `${formatMoney(p.priceCents, p.currency)} · ${accessLabel(p.interval)}` })),
        { href: "/apollo-group-tv-renewal", label: "Renew your subscription" },
      ],
    },
    {
      title: "Setup guides",
      blurb: "Step-by-step instructions for each device.",
      links: [
        { href: "/guides", label: "All setup guides" },
        ...generalGuides.map((g) => ({ href: `/guides/${g.slug}`, label: g.title })),
        ...devices.map((d) => ({ href: `/guides/${d.slug}`, label: d.title })),
      ],
    },
    {
      title: "Help Center",
      blurb: "Answers about payments, devices, logins and troubleshooting.",
      links: [{ href: "/help", label: "Help Center home" }, ...help.topics.map((t) => ({ href: `/help#${t.slug}`, label: t.title }))],
    },
    {
      title: "Payments",
      blurb: "How to pay, and what to do if something goes wrong.",
      links: [
        { href: "/payment-methods", label: "Payment methods" },
        { href: "/payment-guides", label: "All payment guides" },
        ...paymentGuides.map((g) => ({ href: `/payment-guides/${g.slug}`, label: g.title })),
      ],
    },
    {
      title: "Blog",
      blurb: "Guides and explainers about streaming.",
      links: [{ href: "/blog", label: "All articles" }, ...posts.map((p) => ({ href: `/blog/${p.slug}`, label: p.title }))],
    },
    {
      title: "Company",
      blurb: "Who we are and how to reach us.",
      links: [
        { href: "/about-us", label: "About Apollo Group TV" },
        { href: "/contact", label: "Contact & support" },
        { href: "/refer-a-friend", label: "Refer a friend" },
        { href: "/is-apollo-group-tv-legal", label: "Is Apollo Group TV legal?" },
      ],
    },
    {
      title: "Legal",
      blurb: "The policies that apply when you use Apollo Group TV.",
      links: [
        { href: "/terms-and-conditions", label: "Terms and Conditions" },
        { href: "/privacy-policy", label: "Privacy Policy" },
        { href: "/refund-policy", label: "Refund Policy" },
        { href: "/dmca", label: "Copyright and DMCA Policy" },
      ],
    },
    {
      title: "Your account",
      blurb: "Sign in to manage your pack, invoices and support.",
      links: [
        { href: "/sign-in", label: "Sign in" },
        { href: "/create-account", label: "Create an account" },
        { href: "/forgot-password", label: "Reset your password" },
        { href: "/dashboard/subscription", label: "My Account (login details)" },
      ],
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Site index"
        title="Site Index"
        description="Every page on Apollo Group TV, grouped by topic: plans, setup guides, payment guides, help topics, articles and our policies. Can't find something? Try the Help Center search or contact us."
        crumbs={[{ href: "/site-index", label: "Site Index" }]}
      />
      <Section>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((g) => (
            <section key={g.title} aria-labelledby={`si-${g.title}`} className={cn(cardClass, "p-6")}>
              <h2 id={`si-${g.title}`} className="font-display text-lg font-bold text-text">
                {g.title}
              </h2>
              <p className="mt-1 text-sm text-muted">{g.blurb}</p>
              <ul className="mt-4 space-y-2">
                {g.links.map((l, i) => (
                  <li key={`${l.href}-${i}`} className="text-sm">
                    <Link href={l.href} className="text-text/90 hover:text-light-blue">
                      {l.label}
                    </Link>
                    {l.note && <span className="ml-2 text-xs text-subtle">{l.note}</span>}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Section>
      <CtaBand title="Ready when you are" description="Compare the packs, create your account and set up on your device." />
    </>
  );
}
