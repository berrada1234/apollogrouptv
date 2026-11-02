import type { Metadata } from "next";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  CreditCard,
  Gift,
  Home,
  LayoutDashboard,
  LayoutGrid,
  LifeBuoy,
  Lock,
  MonitorSmartphone,
  Plane,
  Search,
  UserPlus,
} from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/misc";
import { ButtonLink } from "@/components/ui/button";
import { CtaBand, PageHero, RelatedLinks } from "@/components/marketing/sections";

export const metadata: Metadata = {
  title: { absolute: "Apollo Group TV Features — How the Service Works" },
  description:
    "See what Apollo Group TV includes: an organized channel catalog, a self-service account dashboard, ticket support and setup help for verified devices.",
  alternates: { canonical: "/product" },
  openGraph: { title: "Apollo Group TV Features — How the Service Works", description: "See what Apollo Group TV includes: an organized channel catalog, a self-service account dashboard, ticket support and setup help for verified devices.", url: "/product" },
};

const steps = [
  { icon: UserPlus, t: "Create your account", b: "Sign up with your email and verify it to secure your account." },
  { icon: CreditCard, t: "Choose a plan", b: "Compare plans side by side and pick the billing period that suits you." },
  { icon: MonitorSmartphone, t: "Set up your devices", b: "Follow the step-by-step guide for your verified device." },
];

const extras = [
  { icon: Bell, t: "Account notifications", b: "Updates about replies and account changes, right in your dashboard." },
  { icon: Lock, t: "Secure by default", b: "Email verification, strong passwords, session control and rate-limited sign-in." },
  { icon: Gift, t: "Personal referral link", b: "Share your link; sign-ups through it are tracked on your account." },
  { icon: CreditCard, t: "Billing history", b: "Every recorded payment, with provider references, in one list." },
];

const useCases = [
  { icon: Home, t: "Households", b: "One account holder manages the plan, billing and support for the home." },
  { icon: Plane, t: "Frequent travellers", b: "Manage everything from the web dashboard wherever you are." },
  { icon: UserPlus, t: "New customers", b: "Guided onboarding from sign-up to device setup." },
];

function MockCatalog() {
  return (
    <div className="rounded-lg border border-border bg-inset p-4 shadow-card" aria-hidden>
      <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs text-subtle">
        <Search className="h-3.5 w-3.5" /> Search channels…
      </div>
      <div className="mt-3 flex gap-1.5">
        {["All", "News", "Sports", "Movies"].map((c, i) => (
          <span key={c} className={`rounded-full border px-2.5 py-1 text-[11px] ${i === 2 ? "border-primary/50 bg-primary/15 text-light-blue" : "border-border text-muted"}`}>
            {c}
          </span>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2.5 rounded-lg border border-border bg-card p-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-[#0891b2] to-[#2fd9f0] text-[10px] font-semibold text-on-primary">
              S{i + 1}
            </span>
            <span className="space-y-1">
              <span className="block h-1.5 w-14 rounded bg-muted/50" />
              <span className="block h-1.5 w-8 rounded bg-border-strong" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockDashboard() {
  return (
    <div className="rounded-lg border border-border bg-inset p-4 shadow-card" aria-hidden>
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-subtle">Current plan</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] text-success">
            <span className="h-1 w-1 rounded-full bg-success" /> Active
          </span>
        </div>
        <p className="mt-1 font-display text-lg font-semibold text-text">Quarterly</p>
        <div className="mt-3 h-1.5 rounded-full bg-inset">
          <div className="h-1.5 w-3/5 rounded-full bg-accent" />
        </div>
        <p className="mt-1.5 text-[11px] text-subtle">Renews in 54 days</p>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {["Billing", "Referrals", "Support"].map((l) => (
          <div key={l} className="rounded-lg border border-border bg-card p-2.5 text-center text-[11px] text-muted">
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

function MockSupport() {
  return (
    <div className="space-y-2 rounded-lg border border-border bg-inset p-4 shadow-card" aria-hidden>
      <div className="max-w-[80%] rounded-xl border border-border bg-card p-3 text-[11px] text-muted">
        <span className="font-medium text-text">You</span> · The app asks me to sign in again on my TV.
      </div>
      <div className="ml-auto max-w-[80%] rounded-xl border border-primary/40 bg-primary/10 p-3 text-[11px] text-muted">
        <span className="font-medium text-text">Support</span> · Thanks — please update to the latest version from the App page.
      </div>
      <div className="flex items-center gap-2 pt-1 text-[11px] text-success">
        <CheckCircle2 className="h-3.5 w-3.5" /> Marked as resolved
      </div>
    </div>
  );
}

const deepDives = [
  {
    icon: LayoutGrid,
    eyebrow: "Catalog",
    t: "Browse by category, or just search",
    b: "Channels are grouped into clear categories with an instant search, so finding what you want takes seconds — on desktop or phone.",
    mock: <MockCatalog />,
  },
  {
    icon: LayoutDashboard,
    eyebrow: "Dashboard",
    t: "Always know where your account stands",
    b: "Plan, subscription status, renewal dates, billing history and referrals live in one dashboard — no inbox archaeology.",
    mock: <MockDashboard />,
  },
  {
    icon: LifeBuoy,
    eyebrow: "Support",
    t: "One thread per question, start to finish",
    b: "Open a ticket from your dashboard, get notified when we reply, and keep the full history of every conversation.",
    mock: <MockSupport />,
  },
];

export default function ProductPage() {
  return (
    <>
      <PageHero
        eyebrow="Features"
        title="Apollo Group TV features, explained"
        description="A closer look at what you get with Apollo Group TV (often searched as Apollo TV): how the catalog is organized, what your dashboard shows, and how support works."
        crumbs={[{ href: "/product", label: "Product" }]}
        aside={<MockDashboard />}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/plans" size="lg">
            See plans
          </ButtonLink>
          <ButtonLink href="/app" variant="secondary" size="lg">
            App setup
          </ButtonLink>
        </div>
      </PageHero>

      {/* Timeline */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Overview" title="How it works" />
          <ol className="relative mx-auto mt-14 grid max-w-5xl gap-8 md:grid-cols-3 md:gap-6">
            <span className="absolute left-[16.6%] right-[16.6%] top-6 hidden h-px bg-gradient-to-r from-primary/10 via-primary/50 to-primary/10 md:block" aria-hidden />
            {steps.map((s, i) => (
              <li key={s.t} className="relative flex gap-4 md:flex-col md:items-center md:text-center">
                <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full border border-primary/40 bg-bg text-accent shadow-sm">
                  <s.icon className="h-5 w-5" aria-hidden />
                  <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] font-semibold text-on-primary">
                    {i + 1}
                  </span>
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-text md:mt-5">{s.t}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.b}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Deep dives */}
      <section className="border-y border-border bg-bg-secondary/50 py-20 sm:py-28">
        <Container className="space-y-20 sm:space-y-28">
          {deepDives.map((d, i) => (
            <div key={d.t} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div className={i % 2 === 1 ? "lg:order-2" : undefined}>
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  <d.icon className="h-4 w-4" aria-hidden /> {d.eyebrow}
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-text">{d.t}</h2>
                <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted">{d.b}</p>
              </div>
              <div className="mx-auto w-full max-w-md">{d.mock}</div>
            </div>
          ))}
        </Container>
      </section>

      {/* Extras */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Also included" title="The details that matter" />
          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {extras.map((f) => (
              <article key={f.t} className="bg-card p-6">
                <f.icon className="h-5 w-5 text-accent" aria-hidden />
                <h3 className="mt-4 font-semibold text-text">{f.t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.b}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* Use cases */}
      <section className="pb-20 sm:pb-24">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <SectionHeading align="left" eyebrow="Use cases" title="Who it's for" description="Designed for people who want their entertainment set up once and simple to manage after that." />
          <ul className="divide-y divide-border rounded-lg border border-border bg-card shadow-card">
            {useCases.map((u) => (
              <li key={u.t} className="flex gap-4 p-5 sm:p-6">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-accent">
                  <u.icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h3 className="font-semibold text-text">{u.t}</h3>
                  <p className="mt-1 text-sm text-muted">{u.b}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-t border-border pt-16">
        <Container>
          <div className="mb-14 grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-6 shadow-card">
              <h2 className="font-display text-xl font-semibold text-text">How to evaluate the plans</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Every plan includes the same account tools — the dashboard, ticket support and setup guides. Plans differ by billing period and by the
                features listed on each one. Compare the inclusions you care about, check the monthly equivalent on longer periods, and read the refund
                policy before you commit.
              </p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <Link href="/plans" className="font-medium text-accent hover:text-light-blue">Compare plans →</Link>
                <Link href="/refund-policy" className="font-medium text-accent hover:text-light-blue">Refund policy →</Link>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-6 shadow-card">
              <h2 className="font-display text-xl font-semibold text-text">Product questions</h2>
              <dl className="mt-3 space-y-4 text-sm">
                <div>
                  <dt className="font-medium text-text">Do I need special equipment?</dt>
                  <dd className="mt-1 text-muted">A verified device and an internet connection. The App page lists supported devices.</dd>
                </div>
                <div>
                  <dt className="font-medium text-text">Can I manage my plan without contacting anyone?</dt>
                  <dd className="mt-1 text-muted">You can see your plan, renewal dates and payments yourself. Plan changes are requested through a ticket.</dd>
                </div>
                <div>
                  <dt className="font-medium text-text">Is the catalog the same on every plan?</dt>
                  <dd className="mt-1 text-muted">Each plan&apos;s inclusions are listed on its card on the Plans page.</dd>
                </div>
              </dl>
            </div>
          </div>
          <h2 className="mb-6 font-display text-xl font-semibold text-text">Keep exploring</h2>
          <RelatedLinks
            links={[
              { href: "/app", label: "Apps and verified devices", description: "Where the app runs and how to install it." },
              { href: "/plans", label: "Compare plans", description: "Prices, billing periods and inclusions." },
              { href: "/channels", label: "Browse the channel guide", description: "Search the catalog by name or category." },
              { href: "/faq", label: "Read the FAQ", description: "Accounts, billing, devices and privacy." },
              { href: "/guides", label: "Setup guides", description: "Step-by-step help for getting started." },
              { href: "/is-apollo-group-tv-legal", label: "Technology and content rights", description: "How IPTV delivery differs from distribution rights." },
            ]}
          />
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
