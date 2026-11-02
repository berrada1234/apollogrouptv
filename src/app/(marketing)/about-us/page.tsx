import type { Metadata } from "next";
import { Building2, Eye, FileText, HeartHandshake, KeyRound, LifeBuoy, ListChecks, ShieldCheck } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/misc";
import { ButtonLink } from "@/components/ui/button";
import { CtaBand, PageHero, RelatedLinks } from "@/components/marketing/sections";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "About Apollo Group TV" },
  description:
    "Who Apollo Group TV is for, how the service approaches transparency and support, and where to find plans, policies and help.",
  alternates: { canonical: "/about-us" },
  openGraph: { url: "/about-us" },
};

const principles = [
  { icon: Eye, t: "Say what's true, show where it comes from", b: "Prices come from our plan list, counts come from our catalog, and reviews come from registered customers. If we can't back something up, we don't publish it." },
  { icon: ListChecks, t: "Verify before we recommend", b: "Devices are listed only after we've confirmed them, each with an official download link. No guesswork, no unofficial files." },
  { icon: HeartHandshake, t: "Support with a paper trail", b: "Every support conversation lives in a ticket you can come back to, so nothing depends on remembering who said what." },
  { icon: KeyRound, t: "Your account, your controls", b: "See your plan, payments and signed-in devices yourself — and change what you need without waiting on anyone." },
];

const expect = [
  { t: "Understand the service", href: "/product", label: "Explore the features" },
  { t: "Compare plans honestly", href: "/plans", label: "See plans and pricing" },
  { t: "Check device support", href: "/app", label: "Review the app page" },
  { t: "Find answers fast", href: "/faq", label: "Read the FAQ" },
];

export default async function AboutPage() {
  const settings = await getSettings();
  const { entityName, entityAddress, officialDomain } = settings.legal;

  return (
    <>
      <PageHero
        eyebrow="About us"
        title="About Apollo Group TV"
        description="Apollo Group TV is a streaming service for live channels and on-demand viewing, built around one idea: you should be able to understand exactly what you're getting, and get help when you need it."
        crumbs={[{ href: "/about-us", label: "About" }]}
      />

      <section className="py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-text">Our purpose</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Streaming should be simple to set up and simple to manage. We bring the catalog, your plan, your billing and your support history into
              one account so you spend less time figuring things out and more time watching.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-text">Who it&apos;s for</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Households that want live TV and on-demand viewing without a complicated setup, people who prefer managing their account themselves,
              and anyone who values clear information over sales pitches. People often search for us as “Apollo TV” — it&apos;s the same service.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-bg-secondary/50 py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Our approach" title="Our approach to digital entertainment" description="Four principles shape how we build and run the service." />
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {principles.map((p) => (
              <article key={p.t} className="flex gap-4 rounded-lg border border-border bg-card p-6 shadow-card">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-accent">
                  <p.icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h3 className="font-semibold text-text">{p.t}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.b}</p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <SectionHeading align="left" eyebrow="This website" title="What visitors can expect" description="Each part of the site answers one question, so you can get to the point quickly." />
          <ul className="grid gap-3 sm:grid-cols-2">
            {expect.map((e) => (
              <li key={e.t} className="rounded-lg border border-border bg-card p-5 shadow-card">
                <p className="font-semibold text-text">{e.t}</p>
                <ButtonLink href={e.href} variant="ghost" size="sm" className="-ml-3 mt-2">
                  {e.label} →
                </ButtonLink>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-t border-border bg-bg-secondary/50 py-16 sm:py-20">
        <Container className="grid gap-6 lg:grid-cols-3">
          <article className="rounded-lg border border-border bg-card p-6 shadow-card">
            <FileText className="h-6 w-6 text-accent" aria-hidden />
            <h2 className="mt-4 font-display text-lg font-semibold text-text">Our commitment to transparency</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Plan prices and inclusions are published in one place. Refund rules live only on the refund policy page. Policies carry the date they
              were last updated, and our catalog lists only authorized, properly licensed content.
            </p>
          </article>
          <article className="rounded-lg border border-border bg-card p-6 shadow-card">
            <LifeBuoy className="h-6 w-6 text-accent" aria-hidden />
            <h2 className="mt-4 font-display text-lg font-semibold text-text">Customer support and resources</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Customers can open tickets from their dashboard; anyone can write to us through the contact page. Setup guides and the FAQ cover the
              most common questions.
            </p>
          </article>
          <article className="rounded-lg border border-border bg-card p-6 shadow-card">
            <ShieldCheck className="h-6 w-6 text-accent" aria-hidden />
            <h2 className="mt-4 font-display text-lg font-semibold text-text">Privacy and security</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Passwords are stored as hashes, email verification is required, sign-in is rate-limited, and you can sign out of other devices at any
              time. No system is perfectly secure, but we take protecting your account seriously.
            </p>
          </article>
        </Container>
      </section>

      <section className="py-16">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="rounded-lg border border-border bg-card p-6 shadow-card">
            <Building2 className="h-6 w-6 text-accent" aria-hidden />
            <h2 className="mt-4 font-display text-lg font-semibold text-text">Business details</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-subtle">Operated by</dt>
                <dd className="text-text">{entityName || <span className="text-muted">Published once confirmed by the site owner.</span>}</dd>
              </div>
              {entityAddress && (
                <div>
                  <dt className="text-subtle">Address</dt>
                  <dd className="text-text">{entityAddress}</dd>
                </div>
              )}
              {officialDomain && (
                <div>
                  <dt className="text-subtle">Official website</dt>
                  <dd className="text-text">{officialDomain}</dd>
                </div>
              )}
            </dl>
            <p className="mt-4 text-xs leading-relaxed text-subtle">
              Several websites use similar names. Official communication about your account comes from this website and your dashboard.
            </p>
          </div>
          <div>
            <h2 className="mb-6 font-display text-xl font-semibold text-text">Learn more about Apollo Group TV</h2>
            <RelatedLinks
              links={[
                { href: "/product", label: "Features", description: "What the service includes." },
                { href: "/app", label: "App & devices", description: "Verified devices and setup." },
                { href: "/plans", label: "Plans", description: "Prices and billing periods." },
                { href: "/faq", label: "FAQ", description: "Answers to common questions." },
                { href: "/contact", label: "Contact", description: "Reach our team." },
                { href: "/is-apollo-group-tv-legal", label: "Is it legal?", description: "Technology vs. content rights." },
              ]}
            />
          </div>
        </Container>
      </section>

      <CtaBand title="Take a closer look" description="Explore the features, compare plans, and create an account when you're ready." />
    </>
  );
}
