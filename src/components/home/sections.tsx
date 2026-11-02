import Image from "next/image";
import Link from "next/link";
import type { Plan } from "@prisma/client";
import {
  ArrowRight,
  Mail,
  BookOpen,
  Check,
  CreditCard,
  Gauge,
  HelpCircle,
  KeyRound,
  LifeBuoy,
  MessageSquareText,
  Monitor,
  MonitorSmartphone,
  Receipt,
  ShieldCheck,
  Smartphone,
  Sparkles,
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
import { monthsFor, pricingContext, savingsPct } from "@/lib/pricing";
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

const highlightIcons = [Tv, Receipt, MonitorSmartphone, KeyRound];

export function IntroSection() {
  const c = homeCopy.intro;
  return (
    <section className="py-20 sm:py-24">
      <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16 [&>*]:min-w-0">
        <div>
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-text sm:text-[2.5rem]">{c.h2}</h2>
          <div className="mt-5 space-y-4 leading-relaxed text-muted sm:text-lg">
            {c.paragraphs.map((p, i) => (
              <p key={i}>
                <RichText text={p} />
              </p>
            ))}
          </div>
          <p className="mt-6 font-display text-lg font-semibold text-light-blue">{c.tagline}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/plans" size="lg">
              Choose your pack <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href="#how-it-works" variant="secondary" size="lg">
              See how it works
            </ButtonLink>
          </div>
        </div>
        <SectionImage image={c.image} className="mx-auto max-w-lg lg:max-w-none" />
      </Container>
      <Container className="mt-12">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.highlights.map((h, i) => {
            const Icon = highlightIcons[i % highlightIcons.length];
            return (
              <li key={h.title} className="rounded-lg border border-border bg-card p-5 shadow-card">
                <IconBox icon={Icon} />
                <h3 className="mt-4 font-semibold text-text">{h.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{h.body}</p>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

// ─── How it works ───────────────────────────────────────────────────────────

export function StepsSection() {
  const c = homeCopy.howItWorks;
  const steps = [
    { icon: UserPlus, t: "Create your account", b: "Sign up with your email and confirm it with one click." },
    { icon: CreditCard, t: "Choose your pack", b: "Pick the access period that suits you and request activation." },
    { icon: KeyRound, t: "Get activated", b: "We confirm your pack and it shows as active in your dashboard." },
    { icon: Tv, t: "Start watching", b: "Install the Apollo TV app on your verified device and sign in." },
  ];
  return (
    <section id="how-it-works" className="scroll-mt-20 py-20 sm:py-24">
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
      </Container>
    </section>
  );
}

// ─── Plans & pricing ────────────────────────────────────────────────────────

export function PlansSection({ plans, checkout }: { plans: Plan[]; checkout: boolean }) {
  const c = homeCopy.plans;
  const { baseMonthly, bestValueId } = pricingContext(plans);
  const maxSave = Math.max(0, ...plans.map((p) => savingsPct(p, baseMonthly)));
  const allOneTime = plans.length > 0 && plans.every((p) => p.oneTime);
  const shortest = [...plans].sort((x, y) => monthsFor(x.interval) - monthsFor(y.interval))[0];
  const best = plans.find((p) => p.id === bestValueId);
  const middle = plans.find((p) => p.id !== shortest?.id && p.id !== bestValueId);

  const hooks = [
    allOneTime ? { icon: Receipt, t: "Pay once", b: "No automatic renewals or surprise charges" } : { icon: Receipt, t: "Clear billing", b: "Price and period shown before you pay" },
    maxSave > 0 ? { icon: Sparkles, t: `Save up to ${maxSave}%`, b: "The longer the pack, the lower the monthly cost" } : null,
    { icon: KeyRound, t: "Fast activation", b: "Our team confirms your pack and you're ready to watch" },
    { icon: LifeBuoy, t: "Real support", b: "Help with setup on every pack" },
  ].filter((h): h is { icon: typeof Receipt; t: string; b: string } => h !== null);

  const guide = [
    shortest && { who: "Trying it out", why: "Start with one month and see how it fits your routine.", plan: shortest },
    middle && { who: "Watching every week", why: "A longer pack lowers your monthly cost without a big commitment.", plan: middle },
    best && { who: "Want the best price", why: "The lowest cost per month of any pack.", plan: best },
  ].filter(Boolean) as { who: string; why: string; plan: Plan }[];

  return (
    <section id="plans" className="relative overflow-hidden border-t border-border bg-bg-secondary/50 py-20 sm:py-24">
      <div className="bg-spotlight pointer-events-none absolute inset-0" aria-hidden />
      <Container className="relative">
        <Heading eyebrow={c.eyebrow} title={c.h2} description={<RichText text={c.description} />} />

        <ul className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-3 lg:grid-cols-4">
          {hooks.map((h) => (
            <li key={h.t} className="flex items-start gap-3 rounded-xl border border-border bg-card/80 p-4">
              <h.icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
              <span>
                <span className="block text-sm font-semibold text-text">{h.t}</span>
                <span className="block text-xs leading-relaxed text-muted">{h.b}</span>
              </span>
            </li>
          ))}
        </ul>

        <h3 className="sr-only">Available Apollo Group TV packs</h3>
        {plans.length > 0 ? (
          <div className={cn("mt-14 grid items-stretch gap-5 sm:grid-cols-2", plans.length >= 4 ? "xl:grid-cols-4" : "lg:grid-cols-3")}>
            {plans.map((p) => (
              <PlanCard key={p.id} plan={p} baseMonthly={baseMonthly} bestValue={p.id === bestValueId} />
            ))}
          </div>
        ) : (
          <EmptyState icon={CreditCard} title="Plans are being finalized" description="Pricing will be published here soon." className="mt-12" />
        )}

        {guide.length > 1 && (
          <div className="mt-14">
            <h3 className="text-center font-display text-xl font-semibold text-text">Which pack is right for you?</h3>
            <ul className="mx-auto mt-6 grid max-w-5xl gap-3 md:grid-cols-3">
              {guide.map((g) => (
                <li key={g.who}>
                  <Link
                    href={`/create-account?plan=${g.plan.slug}`}
                    className="group flex h-full flex-col rounded-lg border border-border bg-card p-5 shadow-card transition-colors hover:border-accent/40"
                  >
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{g.who}</span>
                    <span className="mt-2 font-display text-lg font-semibold text-text">{g.plan.name}</span>
                    <span className="mt-1 flex-1 text-sm text-muted">{g.why}</span>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
                      Get {g.plan.name.replace(/\s+(pack|plan)$/i, "")} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mx-auto mt-10 flex max-w-5xl flex-col items-center justify-between gap-4 rounded-lg border border-primary/25 bg-card px-6 py-5 shadow-card md:flex-row">
          <p className="text-center text-sm text-muted md:text-left">
            <span className="font-semibold text-text">Questions before you buy?</span>{" "}
            {checkout ? "Our team is happy to help you choose." : "No card needed to start — our team confirms activation and payment options with you."}
          </p>
          <div className="flex shrink-0 flex-wrap justify-center gap-2">
            <ButtonLink href="/plans" variant="secondary" size="sm">
              Compare all packs
            </ButtonLink>
            <ButtonLink href="/contact" variant="ghost" size="sm">
              Ask support
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}

// ─── Apps & devices ─────────────────────────────────────────────────────────

export function DevicesSection() {
  const c = homeCopy.devices;
  return (
    <section className="border-t border-border bg-bg-secondary/50 py-20 sm:py-24">
      <Container className="grid gap-10 lg:grid-cols-2 lg:gap-16 [&>*]:min-w-0">
        <div>
          <Heading align="left" eyebrow={c.eyebrow} title={c.h2} description={c.description} />
          <SectionImage image={c.image} className="mt-8" />
        </div>
        <div className="lg:pt-24">
          <h3 className="font-display text-lg font-semibold text-text">{c.supportedTitle}</h3>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {c.logos.map((d, i) => (
              <li
                key={d.name}
                className={cn(
                  "flex flex-col items-center justify-between gap-3 rounded-lg border border-border bg-card p-4 shadow-card transition-colors hover:border-border-strong",
                  i === 0 && "col-span-2 sm:col-span-1",
                )}
              >
                <span className="flex h-14 w-full items-center justify-center">
                  <Image src={d.src} alt={d.alt} width={d.width} height={d.height} className="max-h-14 w-auto object-contain" />
                </span>
                <span className="text-sm font-medium text-text">{d.name}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-subtle">{c.trademarks}</p>
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
        <Heading eyebrow={c.eyebrow} title={c.h2} description={c.description} />
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

// ─── Apollo vs cable ────────────────────────────────────────────────────────

export function CompareSection({ fromMonthly }: { fromMonthly: string | null }) {
  const c = homeCopy.compare;
  const rows = [
    { k: "Price", apollo: fromMonthly ? `Shown before you buy — from ${fromMonthly}/mo equivalent` : "Shown before you buy", cable: "Monthly bill; add-on fees are common" },
    { k: "Commitment", apollo: "Pay once per pack, no automatic renewal", cable: "Long-term contracts are common" },
    { k: "Equipment", apollo: "The app on a verified device", cable: "Set-top box, often rented" },
    { k: "Where you watch", apollo: "TV, streaming stick or phone (verified devices)", cable: "Mostly the TV connected to the box" },
    { k: "Setup", apollo: "Self-install with step-by-step guides", cable: "May need an installation appointment" },
    { k: "Managing your plan", apollo: "Self-service dashboard", cable: "Many changes need a phone call" },
    { k: "Support record", apollo: "Every reply saved in a ticket thread", cable: "Varies by provider" },
    { k: "Stopping service", apollo: "Nothing to cancel — packs simply end", cable: "Early cancellation fees are common" },
  ];
  return (
    <section className="border-t border-border bg-bg-secondary/50 py-20 sm:py-24">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-14 [&>*]:min-w-0">
        <div>
          <Heading align="left" eyebrow={c.eyebrow} title={c.h2} description={c.description} />
          <SectionImage image={c.image} className="mt-8 hidden lg:block" />
        </div>
        <div className="self-center">
          <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-card">
            <table className="w-full min-w-[520px] text-sm">
              <caption className="sr-only">Apollo Group TV compared with a typical cable TV package</caption>
              <thead className="border-b border-border bg-inset/60 text-left text-[11px] uppercase tracking-[0.08em] text-subtle">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Feature</th>
                  <th scope="col" className="bg-primary/10 px-4 py-3 font-semibold text-light-blue">Apollo Group TV</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Typical cable TV</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.k} className="border-b border-border last:border-0">
                    <th scope="row" className="px-4 py-3.5 text-left font-medium text-text">{r.k}</th>
                    <td className="bg-primary/5 px-4 py-3.5 text-text/90">
                      <span className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden /> {r.apollo}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-muted">{r.cable}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-subtle">{c.footnote}</p>
        </div>
      </Container>
    </section>
  );
}

// ─── Legal & safety ─────────────────────────────────────────────────────────

export function LegalSection() {
  return <ContentSection copy={homeCopy.legal} />;
}

// ─── Support ────────────────────────────────────────────────────────────────

export function SupportSection({ guideCount, faqCount }: { guideCount: number; faqCount: number }) {
  const c = homeCopy.support;
  const routes = [
    { icon: LifeBuoy, t: "Support tickets", meta: "For customers", b: "Open a ticket from your dashboard. Every reply stays in one thread, and you're notified when we answer.", href: "/dashboard/support/new", cta: "Open a ticket" },
    { icon: Gauge, t: "Client portal", meta: "Plan & billing", b: "Check your pack, payments and referrals, and jump into the full dashboard.", href: "/client-portal", cta: "Go to the portal" },
    { icon: Mail, t: "Contact form", meta: "Anyone", b: "Not a customer yet? Send us a message and we'll reply by email.", href: "/contact", cta: "Send a message" },
    { icon: BookOpen, t: "Help center", meta: `${guideCount} guides · ${faqCount} answers`, b: "Step-by-step setup guides, troubleshooting and the full FAQ.", href: "/guides", cta: "Browse guides" },
  ];
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SplitHeader eyebrow={c.eyebrow} title={c.h2} description={c.description} image={c.image} imageFirst />
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {routes.map((r) => (
            <li key={r.t}>
              <Link href={r.href} className="group flex h-full flex-col rounded-lg border border-border bg-card p-5 shadow-card transition-colors hover:border-accent/40">
                <div className="flex items-center justify-between gap-3">
                  <IconBox icon={r.icon} />
                  <span className="text-xs text-subtle">{r.meta}</span>
                </div>
                <h3 className="mt-4 font-semibold text-text group-hover:text-light-blue">{r.t}</h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">{r.b}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
                  {r.cta} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted">
          Can&apos;t sign in? Reset your password from the <Link href="/sign-in" className="text-accent hover:text-light-blue">Sign in</Link> page — the link is
          valid for 30 minutes.
        </p>
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

export function FinalCta({ fromMonthly, maxSave }: { fromMonthly: string | null; maxSave: number }) {
  const c = homeCopy.cta;
  const badges = ["One-time payment", "No automatic renewal", "No contracts", "Activation by our team"];
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="relative overflow-hidden rounded-[22px] border border-primary/30 bg-card px-6 py-14 text-center shadow-lg sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_0%,rgb(59_130_246/0.28),transparent_70%)]" aria-hidden />
          <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
          <div className="relative">
            <Eyebrow>{c.eyebrow}</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl">{c.h2}</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted">
              {c.body}
              {fromMonthly && (
                <>
                  {" "}
                  Packs start from <span className="font-semibold text-text">{fromMonthly}/mo</span>
                  {maxSave > 0 && <> — save up to {maxSave}% on longer packs</>}.
                </>
              )}
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href="/plans" size="lg">
                Choose your pack <ArrowRight className="h-4 w-4" aria-hidden />
              </ButtonLink>
              <ButtonLink href="/create-account" variant="secondary" size="lg">
                Create account
              </ButtonLink>
            </div>
            <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted">
              {badges.map((b) => (
                <li key={b} className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-success" aria-hidden /> {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
