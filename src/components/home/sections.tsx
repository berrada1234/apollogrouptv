import Image from "next/image";
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
import { RichText } from "@/components/rich-text";
import { homeCopy, homeFaq, type HomeImage } from "@/content/home";
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

// ─── Shared building blocks ─────────────────────────────────────────────────

/** Section illustration: original SVG art with descriptive, keyword-aware alt text. */
function SectionImage({ image, className }: { image: HomeImage; className?: string }) {
  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={640}
      height={440}
      unoptimized
      loading="lazy"
      className={cn("h-auto w-full rounded-[22px] shadow-lg", className)}
    />
  );
}

/** Heading + description beside an illustration. */
function SplitHeader({
  eyebrow,
  title,
  description,
  image,
  imageFirst,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  image: HomeImage;
  imageFirst?: boolean;
}) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className={cn(imageFirst && "lg:order-2")}>
        <Heading align="left" eyebrow={eyebrow} title={title} description={description ? <RichText text={description} /> : undefined} />
      </div>
      <SectionImage image={image} className="mx-auto max-w-lg lg:max-w-none" />
    </div>
  );
}

/** Text-led section: heading, paragraphs and optional item grid beside an illustration. */
function ContentSection({
  copy,
  imageFirst,
  tinted,
  itemCols = 1,
  children,
}: {
  copy: { eyebrow: string; h2: string; paragraphs: string[]; items?: { title: string; body: string }[]; image: HomeImage; more?: string };
  imageFirst?: boolean;
  tinted?: boolean;
  itemCols?: 1 | 2;
  children?: React.ReactNode;
}) {
  return (
    <section className={cn("py-20 sm:py-24", tinted && "border-t border-border bg-bg-secondary/50")}>
      <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16 [&>*]:min-w-0">
        <div className={cn(imageFirst && "lg:order-2")}>
          <Eyebrow>{copy.eyebrow}</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-text sm:text-[2.5rem]">{copy.h2}</h2>
          <div className="mt-5 space-y-4 leading-relaxed text-muted sm:text-lg">
            {copy.paragraphs.map((p, i) => (
              <p key={i}>
                <RichText text={p} />
              </p>
            ))}
          </div>
          {copy.items && (
            <ul className={cn("mt-7 grid gap-3", itemCols === 2 && "sm:grid-cols-2")}>
              {copy.items.map((it) => (
                <li key={it.title} className="flex gap-3 rounded-lg border border-border bg-card p-4 shadow-card">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/15 text-accent">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                  </span>
                  <span>
                    <span className="block font-semibold text-text">{it.title}</span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-muted">
                      <RichText text={it.body} />
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
          {copy.more && (
            <p className="mt-6 text-sm text-subtle">
              <RichText text={copy.more} />
            </p>
          )}
          {children}
        </div>
        <SectionImage image={copy.image} className="mx-auto max-w-lg lg:max-w-none" />
      </Container>
    </section>
  );
}

// ─── What is Apollo Group TV ────────────────────────────────────────────────

export function IntroSection() {
  const c = homeCopy.intro;
  const paths = [
    { icon: LayoutGrid, t: "See what's included", href: "/product" },
    { icon: CreditCard, t: "Compare plans", href: "/plans" },
    { icon: MonitorSmartphone, t: "Check your device", href: "/app" },
  ];
  return (
    <ContentSection copy={c}>
      <ul className="mt-8 flex flex-wrap gap-2.5">
        {paths.map((p) => (
          <li key={p.href}>
            <Link href={p.href} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-text transition-colors hover:border-accent/40">
              <p.icon className="h-4 w-4 text-accent" aria-hidden /> {p.t}
            </Link>
          </li>
        ))}
      </ul>
    </ContentSection>
  );
}

// ─── Features ───────────────────────────────────────────────────────────────

const features = [
  { icon: Search, t: "A catalog you can search", b: "Find a channel by name or narrow the list by category in seconds.", href: "/channels" },
  { icon: Receipt, t: "Prices without fine print", b: "Each plan states its price, billing period and inclusions before you commit.", href: "/plans" },
  { icon: MonitorSmartphone, t: "Device guides you can trust", b: "Numbered setup steps and official downloads for every verified device.", href: "/guides" },
  { icon: LifeBuoy, t: "Support that keeps a record", b: "Tickets hold every reply in one thread, and you're notified when we answer.", href: "/contact" },
  { icon: Gauge, t: "A dashboard that answers questions", b: "Plan status, renewal dates, payments and referrals — no emails to dig through.", href: "/product" },
  { icon: Lock, t: "Security built in", b: "Email verification, rate-limited sign-in and control over signed-in devices.", href: "/faq" },
];

export function FeaturesSection() {
  const c = homeCopy.features;
  return (
    <section className="border-t border-border bg-bg-secondary/50 py-20 sm:py-24">
      <Container>
        <SplitHeader eyebrow={c.eyebrow} title={c.h2} description={c.description} image={c.image} imageFirst />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
      </Container>
    </section>
  );
}

// ─── How it works ───────────────────────────────────────────────────────────

export function StepsSection() {
  const c = homeCopy.howItWorks;
  const steps = [
    { icon: UserPlus, t: "Create your account", b: "Sign up with your email and confirm it with one click." },
    { icon: CreditCard, t: "Choose your plan", b: "Pick the billing period that suits you and request activation." },
    { icon: KeyRound, t: "Get activated", b: "We confirm your plan and it shows as active in your dashboard." },
    { icon: Tv, t: "Start watching", b: "Install the Apollo TV app on your verified device and sign in." },
  ];
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SplitHeader eyebrow={c.eyebrow} title={c.h2} description={c.description} image={c.image} />
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
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/create-account">
            Create your account <ArrowRight className="h-4 w-4" aria-hidden />
          </ButtonLink>
          <ButtonLink href="/guides/account-setup" variant="ghost">
            Read the account setup guide
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

// ─── Plans & pricing ────────────────────────────────────────────────────────

export function PlansSection({ plans, checkout }: { plans: Plan[]; checkout: boolean }) {
  const c = homeCopy.plans;
  return (
    <section id="plans" className="relative border-t border-border bg-bg-secondary/50 py-20 sm:py-24">
      <Container className="relative">
        <SplitHeader eyebrow={c.eyebrow} title={c.h2} description={c.description} image={c.image} imageFirst />
        <h3 className="sr-only">Available Apollo Group TV plans</h3>
        {plans.length > 0 ? (
          <div className={cn("mt-14 grid items-stretch gap-5 sm:grid-cols-2", plans.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
            {plans.map((p) => (
              <PlanCard key={p.id} plan={p} />
            ))}
          </div>
        ) : (
          <EmptyState icon={CreditCard} title="Plans are being finalized" description="Pricing will be published here soon." className="mt-12" />
        )}
        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {!checkout && (
            <div className="flex items-start gap-3 rounded-lg border border-success/30 bg-success/5 px-5 py-4 text-sm">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden />
              <p className="text-muted">
                <span className="font-semibold text-text">No card needed to start.</span> Our team confirms activation and payment options with you.
              </p>
            </div>
          )}
          <Link href="/plans" className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-5 py-4 text-sm font-medium text-text transition-colors hover:border-accent/40">
            Compare every plan side by side <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
          </Link>
          <Link href="/refund-policy" className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-5 py-4 text-sm font-medium text-text transition-colors hover:border-accent/40">
            Read the refund policy <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
          </Link>
        </div>
      </Container>
    </section>
  );
}

// ─── Catalog ────────────────────────────────────────────────────────────────

const categoryIcons = [Newspaper, Trophy, Film, Sparkles, BookOpen, Tv, LayoutGrid];

export function CategoriesSection({ categories }: { categories: { id: string; slug: string; name: string; count: number }[] }) {
  const c = homeCopy.catalog;
  const total = categories.reduce((n, x) => n + x.count, 0);
  return (
    <>
      <ContentSection copy={c}>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/channels">
            <Search className="h-4 w-4" aria-hidden /> Open the channel guide
          </ButtonLink>
        </div>
      </ContentSection>
      <section aria-label="Channel categories" className="pb-20 sm:pb-24">
        <Container>
          {categories.length > 0 ? (
            <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {categories.map((cat, i) => {
                const Icon = categoryIcons[i % categoryIcons.length];
                const featured = i === 0;
                const last = i === categories.length - 1 && i > 0;
                // First tile spans two columns; the last tile stretches so no row is left with a gap.
                const mdRemainder = (categories.length + 1) % 4;
                const mobileOdd = (categories.length - 1) % 2 === 1;
                return (
                  <li
                    key={cat.id}
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
                      href={`/channels?category=${cat.slug}`}
                      className={cn(
                        "group flex h-full items-center gap-4 rounded-lg border p-4 shadow-card transition-colors",
                        featured ? "border-primary/40 bg-gradient-to-br from-[#12294a] to-card hover:border-primary/70" : "border-border bg-card hover:border-accent/40 hover:bg-card-hover",
                      )}
                    >
                      <IconBox icon={Icon} solid={featured} />
                      <span className="min-w-0">
                        <span className="block truncate font-semibold text-text">{cat.name}</span>
                        <span className="text-xs text-muted tabular-nums">
                          {cat.count} {cat.count === 1 ? "channel" : "channels"}
                        </span>
                      </span>
                      <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-subtle opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState icon={Tv} title="Catalog coming soon" description="Channel listings will be published here." />
          )}
          {total > 0 && (
            <p className="mt-6 text-sm text-subtle tabular-nums">
              {total} channels across {categories.length} categories · availability may change as licensing changes
            </p>
          )}
        </Container>
      </section>
    </>
  );
}

// ─── Apps & devices ─────────────────────────────────────────────────────────

export function DevicesSection({ platforms }: { platforms: { name: string }[] }) {
  const c = homeCopy.devices;
  return (
    <section className="border-t border-border bg-bg-secondary/50 py-20 sm:py-24">
      <Container className="grid gap-10 lg:grid-cols-2 lg:gap-16 [&>*]:min-w-0">
        <div>
          <Heading align="left" eyebrow={c.eyebrow} title={c.h2} description={c.description} />
          <SectionImage image={c.image} className="mt-8" />
        </div>
        <div className="lg:pt-24">
          <h3 className="font-display text-lg font-semibold text-text">Verified devices</h3>
          {platforms.length > 0 ? (
            <ul className="mt-4 grid grid-cols-2 gap-3">
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
            <EmptyState icon={MonitorSmartphone} title="Supported devices coming soon" description="Devices appear here as soon as compatibility is verified." className="mt-4" />
          )}
          <div className="mt-4 rounded-lg border border-border bg-card p-5 shadow-card">
            <div className="flex items-start gap-4">
              <IconBox icon={HelpCircle} />
              <div>
                <p className="font-semibold text-text">Is your device supported?</p>
                <p className="mt-1 text-sm text-muted">If it isn&apos;t listed yet, ask us before subscribing — we&apos;ll tell you honestly whether it works.</p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/app">
              Apollo TV app details <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href="/guides" variant="ghost">
              Installation guides
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}

// ─── Requirements / legal / support / referral ─────────────────────────────

export function RequirementsSection() {
  return <ContentSection copy={homeCopy.requirements} imageFirst itemCols={2} />;
}

export function LegalSection() {
  return <ContentSection copy={homeCopy.legal} tinted />;
}

export function SupportSection() {
  return <ContentSection copy={homeCopy.support} imageFirst itemCols={2} />;
}

export function ReferralSection({ rewardText }: { rewardText?: string }) {
  const c = homeCopy.referral;
  return (
    <ContentSection
      tinted
      copy={{
        ...c,
        paragraphs: [
          ...c.paragraphs,
          rewardText || "Referral rewards aren't active yet — the rules will be published on the referral page before any reward is offered.",
        ],
      }}
    >
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/refer-a-friend">
          How referrals work <ArrowRight className="h-4 w-4" aria-hidden />
        </ButtonLink>
        <ButtonLink href="/create-account" variant="ghost">
          Create an account
        </ButtonLink>
      </div>
    </ContentSection>
  );
}

// ─── Reviews ────────────────────────────────────────────────────────────────

export function ReviewsSection({
  reviews,
}: {
  reviews: { id: string; rating: number; title: string; body: string; isVerified: boolean; author: string; date: string }[];
}) {
  const c = homeCopy.reviews;
  return (
    <section className="border-t border-border bg-bg-secondary/50 py-20 sm:py-24">
      <Container>
        <SplitHeader eyebrow={c.eyebrow} title={c.h2} description={c.description} image={c.image} imageFirst />
        <div className="mt-12">
          {reviews.length > 0 ? (
            <ReviewCarousel reviews={reviews} />
          ) : (
            <EmptyState
              icon={MessageSquareText}
              title="No reviews published yet"
              description="Reviews appear here once registered customers share them and they pass moderation."
              className="mx-auto max-w-xl"
            />
          )}
        </div>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/reviews">Read all Apollo Group TV reviews</ButtonLink>
          <ButtonLink href="/reviews#write" variant="ghost">
            Write a review
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

// ─── Why choose ─────────────────────────────────────────────────────────────

const compareRows = [
  { k: "Published prices", v: "Every plan lists price, period and inclusions" },
  { k: "Device compatibility", v: "Verified list with official downloads" },
  { k: "Support", v: "Tickets with full history and notifications" },
  { k: "Account control", v: "Self-service dashboard and session management" },
  { k: "Reviews", v: "Moderated; “verified” only with a subscription on record" },
  { k: "Content", v: "Authorized, properly licensed catalog only" },
];

export function CompareSection() {
  const c = homeCopy.why;
  return (
    <section className="py-20 sm:py-24">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-14 [&>*]:min-w-0">
        <div>
          <Heading align="left" eyebrow={c.eyebrow} title={c.h2} description={c.description} />
          <SectionImage image={c.image} className="mt-8 hidden lg:block" />
        </div>
        <div className="self-center overflow-hidden rounded-lg border border-border bg-card shadow-card">
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

// ─── FAQ ────────────────────────────────────────────────────────────────────

export function FaqSection() {
  const c = homeCopy.faq;
  const items = homeFaq.map((f, i) => ({ id: `home-${i}`, category: "Home", question: f.q, answer: f.a }));
  return (
    <section className="border-t border-border bg-bg-secondary/50 py-20 sm:py-24">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-14 [&>*]:min-w-0">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Heading align="left" eyebrow={c.eyebrow} title={c.h2} description={<RichText text={c.description} />} />
          <SectionImage image={c.image} className="mt-8 hidden lg:block" />
          <ButtonLink href="/faq" variant="secondary" className="mt-8">
            See the full FAQ
          </ButtonLink>
        </div>
        <FaqAccordion items={items} />
      </Container>
    </section>
  );
}

// ─── Final CTA ──────────────────────────────────────────────────────────────

export function FinalCta() {
  const c = homeCopy.cta;
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="relative overflow-hidden rounded-[22px] border border-primary/30 bg-card px-6 py-14 text-center shadow-lg sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_0%,rgb(59_130_246/0.28),transparent_70%)]" aria-hidden />
          <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
          <h2 className="relative font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl">{c.h2}</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-muted">{c.body}</p>
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
