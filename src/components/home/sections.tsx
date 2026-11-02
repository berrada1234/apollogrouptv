import Link from "next/link";
import type { Plan } from "@prisma/client";
import {
  ArrowRight,
  BookOpen,
  Check,
  CreditCard,
  Film,
  Gauge,
  HelpCircle,
  KeyRound,
  LayoutGrid,
  LifeBuoy,
  Lock,
  MessageSquareText,
  Monitor,
  MonitorSmartphone,
  Newspaper,
  Receipt,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Trophy,
  Tv,
  User,
  UserPlus,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container, EmptyState, Stars } from "@/components/ui/misc";
import { PlanCard } from "@/components/marketing/sections";
import { FaqAccordion } from "@/components/marketing/faq-list";
import { Eyebrow } from "@/components/home/hero";
import { ReviewCarousel } from "@/components/home/review-carousel";
import { cn } from "@/lib/utils";

function Heading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  description?: React.ReactNode;
  align?: "center" | "left";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-text sm:text-[2.5rem]">{title}</h2>
      {description && <p className="mt-4 leading-relaxed text-muted sm:text-lg">{description}</p>}
    </div>
  );
}

function IconBox({ icon: Icon, solid }: { icon: typeof Tv; solid?: boolean }) {
  return (
    <span
      className={cn(
        "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
        solid ? "bg-primary text-white shadow-[0_8px_20px_-10px_rgb(59_130_246/0.8)]" : "border border-primary/20 bg-primary/10 text-accent",
      )}
    >
      <Icon className="h-5 w-5" aria-hidden />
    </span>
  );
}

// ─── 2. Social-proof bar ────────────────────────────────────────────────────

function WindowsGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <path fill="currentColor" d="M0 0h7.5v7.5H0zM8.5 0H16v7.5H8.5zM0 8.5h7.5V16H0zM8.5 8.5H16V16H8.5z" />
    </svg>
  );
}

function platformIcon(name: string) {
  const n = name.toLowerCase();
  if (/windows|pc/.test(n)) return WindowsGlyph;
  if (/android|iphone|ios|phone|mobile/.test(n)) return Smartphone;
  if (/mac|laptop|web|browser/.test(n)) return Monitor;
  return Tv;
}

/** Abbreviates real member counts: 1,240 → "1.2K+", 87 → "80+". */
function formatMembers(n: number) {
  if (n >= 1000) return `${(Math.floor(n / 100) / 10).toString().replace(/\.0$/, "")}K+`;
  return `${Math.floor(n / 10) * 10}+`;
}

export function SocialProofBar({
  members,
  platforms,
  rating,
}: {
  members: number;
  platforms: { name: string }[];
  rating: { average: number | null; total: number };
}) {
  // Below this, a member count reads as noise rather than proof — show an honest invitation instead.
  const showMembers = members >= 50;
  return (
    <section aria-label="At a glance" className="relative border-y border-border bg-gradient-to-r from-bg-secondary via-[#0d1d33] to-bg-secondary">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" aria-hidden />
      <Container>
        <div className="grid divide-y divide-border lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {/* Members */}
          <div className="flex items-center justify-center gap-4 py-6 lg:justify-start lg:py-7">
            <div className="flex -space-x-2.5" aria-hidden>
              {["from-[#60a5fa] to-[#1d4ed8]", "from-[#93c5fd] to-[#3b82f6]", "from-[#38bdf8] to-[#0369a1]", "from-[#818cf8] to-[#4338ca]", "from-[#7dd3fc] to-[#2563eb]"].map((g) => (
                <span key={g} className={`grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br ${g} text-white ring-2 ring-bg-secondary`}>
                  <User className="h-4 w-4" />
                </span>
              ))}
            </div>
            <div>
              <p className="font-display text-base font-semibold text-text">
                {showMembers ? <>Joined by <span className="tabular-nums">{formatMembers(members)}</span> members</> : "Be one of our first members"}
              </p>
              <p className="text-xs text-subtle">Every account is email-verified</p>
            </div>
          </div>

          {/* Devices */}
          <div className="flex flex-col items-center justify-center gap-2.5 py-6 lg:py-7">
            {platforms.length > 0 ? (
              <>
                <ul className="flex flex-wrap items-center justify-center gap-2">
                  {platforms.slice(0, 5).map((p) => {
                    const Icon = platformIcon(p.name);
                    return (
                      <li key={p.name} className="inline-flex items-center gap-1.5 rounded-lg border border-border-strong bg-card/80 px-2.5 py-1.5 text-xs font-medium text-text">
                        <Icon className="h-3.5 w-3.5 text-accent" /> {p.name}
                      </li>
                    );
                  })}
                  {platforms.length > 5 && <li className="text-xs text-subtle">+{platforms.length - 5} more</li>}
                </ul>
                <p className="text-xs text-subtle">Verified devices with setup guides</p>
              </>
            ) : (
              <Link href="/app" className="group flex items-center gap-3">
                <span className="flex gap-1.5 text-accent" aria-hidden>
                  <Tv className="h-5 w-5" />
                  <Smartphone className="h-5 w-5" />
                  <Monitor className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-text group-hover:text-light-blue">Step-by-step device guides</span>
                  <span className="block text-xs text-subtle">Supported devices are listed once verified</span>
                </span>
              </Link>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center justify-center gap-3 py-6 lg:justify-end lg:py-7">
            {rating.total > 0 && rating.average != null ? (
              <Link href="/reviews" className="flex items-center gap-3 hover:opacity-90">
                <Stars rating={Math.round(rating.average)} size="h-4 w-4" />
                <span className="text-sm">
                  <span className="font-semibold text-text tabular-nums">{rating.average.toFixed(1)}/5</span>{" "}
                  <span className="text-subtle tabular-nums">
                    ({rating.total} {rating.total === 1 ? "review" : "reviews"})
                  </span>
                </span>
              </Link>
            ) : (
              <Link href="/reviews" className="group flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-accent" aria-hidden />
                <span>
                  <span className="block text-sm font-semibold text-text group-hover:text-light-blue">Moderated reviews only</span>
                  <span className="block text-xs text-subtle">From registered customers</span>
                </span>
              </Link>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

// ─── Introduction ───────────────────────────────────────────────────────────

export function IntroSection() {
  const paths = [
    { icon: LayoutGrid, t: "See what's included", b: "Features, the catalog and the account dashboard.", href: "/product", cta: "Features" },
    { icon: CreditCard, t: "Compare plans", b: "Prices, billing periods and inclusions side by side.", href: "/plans", cta: "Plans" },
    { icon: MonitorSmartphone, t: "Check your device", b: "Verified devices with official downloads.", href: "/app", cta: "App & devices" },
  ];
  return (
    <section className="py-20 sm:py-24">
      <Container className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <Eyebrow>Start here</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-text sm:text-[2.5rem]">What is Apollo Group TV?</h2>
          <div className="mt-5 space-y-4 leading-relaxed text-muted sm:text-lg">
            <p>
              Apollo Group TV is a streaming service that puts live channels and on-demand viewing behind a single account. You pick a plan, install
              the app on a supported device, and manage everything else — renewal dates, payments, support — from your own dashboard.
            </p>
            <p>
              You may also see it called <strong className="font-semibold text-text">Apollo TV</strong>. Because several unrelated sites use similar
              names, this website keeps every price, policy and supported device in one place, so you can check the facts before you sign up.
            </p>
          </div>
        </div>
        <ul className="space-y-3 self-center">
          {paths.map((p) => (
            <li key={p.href}>
              <Link href={p.href} className="group flex items-center gap-4 rounded-lg border border-border bg-card p-5 shadow-card transition-colors hover:border-accent/40">
                <IconBox icon={p.icon} />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-text group-hover:text-light-blue">{p.t}</span>
                  <span className="block text-sm text-muted">{p.b}</span>
                </span>
                <span className="hidden text-sm font-medium text-accent sm:inline">{p.cta} →</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

// ─── 3. Plans ───────────────────────────────────────────────────────────────

export function PlansSection({ plans, checkout }: { plans: Plan[]; checkout: boolean }) {
  return (
    <section id="plans" className="relative py-20 sm:py-28">
      <div className="bg-spotlight pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <Container className="relative">
        <Heading
          eyebrow="Pricing"
          title="Subscription plans and pricing"
          description="Every plan shows its price, billing period and exactly what's included. Longer billing periods show their monthly equivalent."
        />
        {plans.length > 0 ? (
          <div className={cn("mt-14 grid items-stretch gap-5 sm:grid-cols-2", plans.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3 lg:mx-auto lg:max-w-5xl")}>
            {plans.map((p) => (
              <PlanCard key={p.id} plan={p} />
            ))}
          </div>
        ) : (
          <EmptyState icon={CreditCard} title="Plans are being finalized" description="Pricing will be published here soon." className="mx-auto mt-12 max-w-xl" />
        )}
        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {!checkout && (
            <div className="flex items-start gap-3 rounded-lg border border-success/30 bg-success/5 px-5 py-4 text-sm">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden />
              <p className="text-muted">
                <span className="font-semibold text-text">No card needed to get started.</span> Create an account and choose a plan — our
                team confirms activation and payment options with you through the client portal.
              </p>
            </div>
          )}
          <Link href="/plans" className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-5 py-3.5 text-sm font-medium text-text transition-colors hover:border-accent/40">
            Compare plans and features side by side <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <div className="flex flex-col gap-3 rounded-lg border border-border bg-card px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-text">Not sure which plan fits?</p>
              <p className="text-sm text-muted">Ask us — we&apos;ll help you choose.</p>
            </div>
            <ButtonLink href="/dashboard/support/new" variant="secondary" size="sm">
              Ask support
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}

// ─── 4. How it works ────────────────────────────────────────────────────────

export function StepsSection() {
  const steps = [
    { icon: UserPlus, t: "Create your account", b: "Sign up with your email and verify it in one click." },
    { icon: CreditCard, t: "Choose your plan", b: "Pick the billing period that suits you and request activation." },
    { icon: KeyRound, t: "Get activated", b: "We confirm your plan and you'll see it live in your dashboard." },
    { icon: Tv, t: "Start watching", b: "Install the app on your verified device and sign in." },
  ];
  return (
    <section className="border-t border-border bg-bg-secondary/50 py-20 sm:py-24">
      <Container>
        <Heading
          eyebrow="Product experience"
          title="From sign-up to screen in four steps"
          description="Here's what using Apollo Group TV actually looks like, start to finish."
        />
        <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.t} className="relative rounded-lg border border-border bg-card p-6 shadow-card">
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary font-display text-sm font-semibold text-white shadow-[0_8px_20px_-10px_rgb(59_130_246/0.8)]">
                  {i + 1}
                </span>
                <s.icon className="h-5 w-5 text-subtle" aria-hidden />
              </div>
              <h3 className="mt-5 font-display text-base font-semibold text-text">{s.t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.b}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/create-account">
            Create your account <ArrowRight className="h-4 w-4" aria-hidden />
          </ButtonLink>
          <ButtonLink href="/guides" variant="ghost">
            Browse setup guides
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

// ─── 5. Devices ─────────────────────────────────────────────────────────────

export function DevicesSection({ platforms }: { platforms: { name: string }[] }) {
  return (
    <section className="py-20 sm:py-28">
      <Container className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <Heading
            align="left"
            eyebrow="Devices"
            title="Watch on the devices you already own"
            description="We list a device only after its compatibility is verified, each with an official download link and step-by-step instructions."
          />
          <div className="mt-8 rounded-lg border border-border bg-card p-6 shadow-card">
            <div className="flex items-start gap-4">
              <IconBox icon={HelpCircle} />
              <div>
                <p className="font-semibold text-text">Is your device supported?</p>
                <p className="mt-1 text-sm text-muted">
                  If it&apos;s not on the list yet, ask us before subscribing — we&apos;ll tell you honestly whether it works.
                </p>
                <ButtonLink href="/dashboard/support/new" variant="secondary" size="sm" className="mt-4">
                  Ask about my device
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
        <div>
          {platforms.length > 0 ? (
            <ul className="grid grid-cols-2 gap-3">
              {platforms.map((p) => (
                <li key={p.name} className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-card">
                  <IconBox icon={MonitorSmartphone} />
                  <span>
                    <span className="block text-sm font-semibold text-text">{p.name}</span>
                    <span className="text-xs text-success">Verified</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={MonitorSmartphone} title="Supported devices coming soon" description="Devices appear here as soon as compatibility is verified." />
          )}
          <div className="mt-4 rounded-lg border border-border bg-inset/60 p-5">
            <p className="text-sm font-semibold text-text">Before you install</p>
            <ul className="mt-3 grid gap-2 text-sm text-muted sm:grid-cols-2">
              {["Use the official download link", "Keep the app up to date", "Sign in with your verified email", "Use a stable internet connection"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-accent" aria-hidden /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/app">
              App &amp; device support <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href="/guides" variant="ghost">
              Setup guides
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}

// ─── 6. Categories ──────────────────────────────────────────────────────────

const categoryIcons = [Newspaper, Trophy, Film, Sparkles, BookOpen, Tv, LayoutGrid];

export function CategoriesSection({ categories }: { categories: { id: string; slug: string; name: string; count: number }[] }) {
  const total = categories.reduce((n, c) => n + c.count, 0);
  return (
    <section className="border-t border-border bg-bg-secondary/50 py-20 sm:py-24">
      <Container>
        <Heading
          eyebrow="Catalog"
          title="Live TV and on-demand categories"
          description="Our catalog is organized by category so you can find what you want quickly. Only authorized, properly licensed content is listed."
        />
        {categories.length > 0 ? (
          <ul className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4">
            {categories.map((c, i) => {
              const Icon = categoryIcons[i % categoryIcons.length];
              const featured = i === 0;
              const last = i === categories.length - 1 && i > 0;
              // First tile spans two columns; the last tile stretches so no row is left with a gap.
              const mdRemainder = (categories.length + 1) % 4;
              const mobileOdd = (categories.length - 1) % 2 === 1;
              return (
                <li
                  key={c.id}
                  className={cn(
                    featured && "col-span-2",
                    last && mobileOdd && "col-span-2",
                    last && mdRemainder === 0 && "md:col-span-1",
                    last && mdRemainder === 1 && "md:col-span-4",
                    last && mdRemainder === 2 && "md:col-span-3",
                    last && mdRemainder === 3 && "md:col-span-2",
                  )}
                >
                  <Link
                    href={`/channels?category=${c.slug}`}
                    className={cn(
                      "group flex h-full items-center gap-4 rounded-lg border p-4 shadow-card transition-colors",
                      featured ? "border-primary/40 bg-gradient-to-br from-[#12294a] to-card hover:border-primary/70" : "border-border bg-card hover:border-accent/40 hover:bg-card-hover",
                    )}
                  >
                    <IconBox icon={Icon} solid={featured} />
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-text">{c.name}</span>
                      <span className="text-xs text-muted tabular-nums">
                        {c.count} {c.count === 1 ? "channel" : "channels"}
                      </span>
                    </span>
                    <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-subtle opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyState icon={Tv} title="Catalog coming soon" description="Channel listings will be published here." className="mx-auto mt-12 max-w-xl" />
        )}
        {total > 0 && (
          <p className="mt-6 text-center text-sm text-subtle tabular-nums">
            {total} channels across {categories.length} categories · availability may change as licensing changes
          </p>
        )}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/channels">
            <Search className="h-4 w-4" aria-hidden /> Search the catalog
          </ButtonLink>
          <ButtonLink href="/plans" variant="ghost">
            See plans
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

// ─── 8. Reviews ─────────────────────────────────────────────────────────────

export function ReviewsSection({
  reviews,
}: {
  reviews: { id: string; rating: number; title: string; body: string; isVerified: boolean; author: string; date: string }[];
}) {
  return (
    <section className="border-t border-border bg-bg-secondary/50 py-20 sm:py-24">
      <Container>
        <Heading eyebrow="Reviews" title="Customer experiences" description="Written by registered customers and moderated before they appear." />
        <div className="mt-12">
          {reviews.length > 0 ? (
            <ReviewCarousel reviews={reviews} />
          ) : (
            <EmptyState icon={MessageSquareText} title="No reviews published yet" description="Customers can share their experience once signed in." className="mx-auto max-w-xl" />
          )}
        </div>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/reviews">Read all reviews</ButtonLink>
          <ButtonLink href="/reviews#write" variant="ghost">
            Write a review
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

// ─── 10. Compare ────────────────────────────────────────────────────────────

const compareRows = [
  { k: "Published prices", v: "Every plan lists price, period and inclusions" },
  { k: "Device compatibility", v: "Verified list with official downloads" },
  { k: "Support", v: "Tickets with full history and notifications" },
  { k: "Account control", v: "Self-service dashboard and session management" },
  { k: "Reviews", v: "Moderated; “verified” only with a subscription on record" },
  { k: "Content", v: "Authorized, properly licensed catalog only" },
];

export function CompareSection() {
  return (
    <section className="border-t border-border bg-bg-secondary/50 py-20 sm:py-24">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-14">
        <Heading
          align="left"
          eyebrow="Why Apollo"
          title="Why choose Apollo Group TV?"
          description="Not bigger numbers — clearer answers. These are the standards we hold ourselves to, and each one can be checked on this site."
        />
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
          <table className="w-full text-sm">
            <caption className="sr-only">What Apollo Group TV offers for each buying criterion</caption>
            <thead className="border-b border-border bg-inset/60 text-left text-[11px] uppercase tracking-[0.08em] text-subtle">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">What to check</th>
                <th scope="col" className="px-5 py-3 font-semibold">Apollo Group TV</th>
              </tr>
            </thead>
            <tbody>
              {compareRows.map((r) => (
                <tr key={r.k} className="border-b border-border last:border-0">
                  <th scope="row" className="px-5 py-4 text-left font-medium text-text">{r.k}</th>
                  <td className="px-5 py-4 text-muted">
                    <span className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden /> {r.v}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}

// ─── 11. FAQ ────────────────────────────────────────────────────────────────

export function FaqSection({ faqs }: { faqs: { id: string; category: string; question: string; answer: string }[] }) {
  if (faqs.length === 0) return null;
  return (
    <section className="py-20 sm:py-28">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-14">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Heading align="left" eyebrow="FAQ" title="Questions before you start" description="Short answers to what new visitors ask most. The full FAQ covers billing, privacy and troubleshooting." />
          <ButtonLink href="/faq" variant="secondary" className="mt-8">
            See all questions
          </ButtonLink>
        </div>
        <FaqAccordion items={faqs} />
      </Container>
    </section>
  );
}

// ─── 13. Features ───────────────────────────────────────────────────────────

const features = [
  { icon: Search, t: "A catalog you can search", b: "Find a channel by name or narrow the list by category in seconds.", href: "/channels" },
  { icon: Receipt, t: "Prices without fine print", b: "Each plan states its price, billing period and inclusions before you commit.", href: "/plans" },
  { icon: MonitorSmartphone, t: "Device guides you can trust", b: "Numbered setup steps and official downloads for every verified device.", href: "/guides" },
  { icon: LifeBuoy, t: "Support that keeps a record", b: "Tickets hold every reply in one thread, and you're notified when we answer.", href: "/contact" },
  { icon: Gauge, t: "A dashboard that answers questions", b: "Plan status, renewal dates, payments and referrals — no emails to dig through.", href: "/product" },
  { icon: Lock, t: "Security built in", b: "Email verification, rate-limited sign-in and control over signed-in devices.", href: "/faq" },
];

export function FeaturesSection() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Heading
          align="left"
          eyebrow="Key features"
          title="Built around clarity and control"
          description="The parts of Apollo Group TV you'll use every week, and where to learn more about each."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <article key={f.t} className="rounded-lg border border-border bg-card p-6 shadow-card transition-colors hover:border-border-strong">
              <IconBox icon={f.icon} />
              <h3 className="mt-5 font-semibold text-text">{f.t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.b}</p>
              <Link href={f.href} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-light-blue">
                Learn more <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </article>
          ))}
        </div>
        <Link href="/product" className="mt-8 inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-light-blue">
          Explore all features <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </Container>
    </section>
  );
}

// ─── 16. Final CTA ──────────────────────────────────────────────────────────

export function FinalCta() {
  return (
    <section className="pb-20 sm:pb-28">
      <Container>
        <div className="relative overflow-hidden rounded-[22px] border border-primary/30 bg-card px-6 py-14 text-center shadow-lg sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_0%,rgb(59_130_246/0.28),transparent_70%)]" aria-hidden />
          <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
          <h2 className="relative font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl">Ready to take the next step?</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-muted">Compare plans, look closer at the features, or sign in to manage your account.</p>
          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/plans" size="lg">
              Compare plans <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href="/product" variant="secondary" size="lg">
              Explore features
            </ButtonLink>
            <ButtonLink href="/sign-in" variant="ghost" size="lg">
              Sign in
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
