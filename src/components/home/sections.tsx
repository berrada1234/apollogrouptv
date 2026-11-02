import Image from "next/image";
import Link from "next/link";
import type { Plan } from "@prisma/client";
import {
  ArrowRight,
  BookOpen,
  Check,
  CreditCard,
  FileText,
  Gauge,
  KeyRound,
  LifeBuoy,
  Lock,
  Mail,
  MessageSquareText,
  Minus,
  MonitorSmartphone,
  Receipt,
  ShieldCheck,
  Sparkles,
  Tv,
  User,
  UserPlus,
  X,
  BadgeCheck,
  Download,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container, EmptyState, Stars } from "@/components/ui/misc";
import { PlanCard } from "@/components/marketing/sections";
import { FaqAccordion } from "@/components/marketing/faq-list";
import { Eyebrow } from "@/components/home/hero";
import { ReviewCarousel } from "@/components/home/review-carousel";
import { RichText } from "@/components/rich-text";
import { homeCopy, homeFaq } from "@/content/home";
import { pricingContext, savingsPct } from "@/lib/pricing";
import { afterHeader, cardClass, cardHover, h2Class, IconBox, leadClass, Section, SectionHeader } from "@/components/section";
import { cn } from "@/lib/utils";

// ─── Highlights bar (directly under the hero) ───────────────────────────────

/** Abbreviates real member counts: 1,240 → "1.2K+", 87 → "80+". */
function formatMembers(n: number) {
  if (n >= 1000) return `${(Math.floor(n / 100) / 10).toString().replace(/\.0$/, "")}K+`;
  return `${Math.floor(n / 10) * 10}+`;
}

export function SocialProofBar({ members, rating }: { members: number; rating: { average: number | null; total: number } }) {
  // Below this, a member count reads as noise rather than proof — show an honest invitation instead.
  const showMembers = members >= 50;
  return (
    <section aria-label="At a glance" className="relative border-y border-border bg-bg-secondary">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" aria-hidden />
      <Container>
        <div className="grid divide-y divide-border lg:grid-cols-[1fr_1.3fr_1fr] lg:divide-x lg:divide-y-0">
          <div className="flex items-center justify-center gap-4 py-5 lg:justify-start lg:pr-6">
            <div className="flex -space-x-2" aria-hidden>
              {["from-[#67e8f9] to-[#0891b2]", "from-[#a5f3fc] to-[#22d3ee]", "from-[#5eead4] to-[#0f766e]", "from-[#22d3ee] to-[#0e7490]"].map((g) => (
                <span key={g} className={`grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br ${g} text-on-primary ring-2 ring-bg-secondary`}>
                  <User className="h-3.5 w-3.5" />
                </span>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-text">
                {showMembers ? <>Joined by <span className="tabular-nums">{formatMembers(members)}</span> members</> : "Be one of our first members"}
              </p>
              <p className="text-xs text-subtle">Every account is email-verified</p>
            </div>
          </div>

          <Link href="/app" className="group flex flex-col items-center justify-center gap-2.5 py-5 lg:px-6">
            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3" aria-label="Supported devices">
              {homeCopy.devices.logos.map((d) => (
                <li key={d.name} className="flex items-center">
                  <Image src={d.src} alt={d.alt} width={d.width} height={d.height} title={d.name} className="h-6 w-auto object-contain opacity-80 transition-opacity group-hover:opacity-100 sm:h-7" />
                </li>
              ))}
            </ul>
            <span className="text-center text-xs text-subtle transition-colors group-hover:text-light-blue">Works on your TV, phone and computer</span>
          </Link>

          <div className="flex items-center justify-center py-5 lg:justify-end lg:pl-6">
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

// ─── Overview: what is Apollo Group TV ──────────────────────────────────────

const highlightIcons = [Tv, Receipt, MonitorSmartphone, KeyRound];

export function IntroSection() {
  const c = homeCopy.intro;
  return (
    <Section>
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16 [&>*]:min-w-0">
        <div className="lg:col-span-6">
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <h2 className={cn(h2Class, "mt-3")}>{c.h2}</h2>
          <div className={cn(leadClass, "mt-5 space-y-4")}>
            {c.paragraphs.map((p, i) => (
              <p key={i}>
                <RichText text={p} />
              </p>
            ))}
          </div>
          <p className="mt-6 border-l-2 border-primary pl-4 font-display text-lg font-semibold text-text">{c.tagline}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/plans" size="lg">
              Choose your pack <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href="#how-it-works" variant="secondary" size="lg">
              See how it works
            </ButtonLink>
          </div>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-6">
          {c.highlights.map((h, i) => {
            const Icon = highlightIcons[i % highlightIcons.length];
            return (
              <li key={h.title} className={cn(cardClass, "flex flex-col p-6")}>
                <IconBox icon={Icon} />
                <h3 className="mt-5 font-display text-base font-bold text-text">{h.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{h.body}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}

// ─── Devices ────────────────────────────────────────────────────────────────

export function DevicesSection() {
  const c = homeCopy.devices;
  return (
    <Section>
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16 [&>*]:min-w-0">
        <div className="lg:col-span-5">
          <SectionHeader eyebrow={c.eyebrow} title={c.h2} description={c.description} />
          <p className="mt-6 flex gap-3 text-sm leading-6 text-muted">
            <MessageSquareText className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
            <span>
              Device not listed? <Link href="/contact" className="font-medium text-text underline-offset-4 hover:text-light-blue hover:underline">Ask us before subscribing</Link> —
              we&apos;ll tell you honestly whether it works.
            </span>
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/app">
              Apollo TV app details <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href="/guides" variant="secondary">
              Installation guides
            </ButtonLink>
          </div>
        </div>

        <div className="lg:col-span-7">
          <h3 className="sr-only">{c.supportedTitle}</h3>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-6">
            {c.logos.map((d, i) => (
              <li
                key={d.name}
                className={cn(
                  cardClass,
                  cardHover,
                  "flex h-28 flex-col items-center justify-center gap-3 p-4 sm:h-36 sm:gap-4 sm:p-5",
                  i < 3 ? "sm:col-span-2" : "sm:col-span-3",
                  i === 0 && "col-span-2",
                )}
              >
                <Image src={d.src} alt={d.alt} width={d.width} height={d.height} className="h-10 w-auto max-w-full object-contain sm:h-12" />
                <span className="text-sm font-medium text-muted">{d.name}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-5 text-subtle">{c.trademarks}</p>
        </div>
      </div>
    </Section>
  );
}

// ─── Apollo vs cable ────────────────────────────────────────────────────────

type Mark = "win" | "same" | "short";
const markIcon = { win: Check, same: Minus, short: X } as const;
const markTone = { win: "text-accent", same: "text-warning", short: "text-error" } as const;
const markLabel = { win: "Apollo wins", same: "Comparable", short: "Falls short" } as const;

function Cell({ mark, children, strong }: { mark: Mark; children: React.ReactNode; strong?: boolean }) {
  const Icon = markIcon[mark];
  return (
    <span className="flex items-start gap-2.5">
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", markTone[mark])} strokeWidth={2.5} aria-hidden />
      <span className="sr-only">{markLabel[mark]}: </span>
      <span className={strong ? "font-semibold text-text" : "text-muted"}>{children}</span>
    </span>
  );
}

export function CompareSection({
  fromMonthly,
  liveChannels,
  moviesShows,
}: {
  fromMonthly: string | null;
  /** Owner-set catalog sizes (Admin → Settings → Homepage highlights); blank falls back to plain wording. */
  liveChannels: string;
  moviesShows: string;
}) {
  const c = homeCopy.compare;
  // Competitor columns describe common arrangements in general terms — no invented prices or counts.
  const rows: { k: string; apollo: string; cable: [Mark, string]; other: [Mark, string] }[] = [
    { k: "Monthly cost", apollo: fromMonthly ? `From ${fromMonthly}/mo` : "Shown before you buy", cable: ["short", "Monthly bill plus add-on fees"], other: ["same", "A monthly fee per service"] },
    { k: "Live channels", apollo: liveChannels || "Full live channel guide", cable: ["same", "Fixed channel packages"], other: ["short", "Mostly on-demand; live TV varies"] },
    { k: "Movies & shows", apollo: moviesShows || "On-demand library", cable: ["short", "Limited on-demand"], other: ["same", "Large on-demand libraries"] },
    { k: "4K quality", apollo: "Where available", cable: ["short", "Often an extra cost"], other: ["same", "On some plans"] },
    { k: "TV guide (EPG)", apollo: "Searchable channel guide", cable: ["same", "On-screen guide"], other: ["same", "Varies by service"] },
    { k: "Equipment", apollo: "The app on your own device", cable: ["short", "Set-top box, often rented"], other: ["same", "The app on your own device"] },
    { k: "Support", apollo: "Tickets with full reply history", cable: ["same", "Phone queues"], other: ["same", "Email or help center"] },
    { k: "Contract", apollo: "None — pay once per pack", cable: ["short", "Long-term contracts are common"], other: ["same", "Monthly, renews automatically"] },
  ];
  return (
    <Section>
      <SectionHeader align="center" eyebrow={c.eyebrow} title={c.h2} description={c.description} />

      <p className={cn(afterHeader, "mb-3 text-center text-xs text-subtle md:hidden")} aria-hidden>
        Swipe the table to compare all columns →
      </p>
      <div className={cn("md:mt-10 lg:mt-12", cardClass, "relative overflow-x-auto")}>
        <table className="w-full min-w-[720px] text-sm">
          <caption className="sr-only">Apollo Group TV compared with cable TV and other streaming services</caption>
          <thead>
            <tr className="border-b border-border text-left">
              <th scope="col" className="w-[22%] px-6 py-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-subtle">Feature</th>
              <th scope="col" className="w-[28%] border-x border-primary/20 bg-primary/[0.07] px-6 py-4">
                <Image src="/brand/apollo-logo.webp" alt="Apollo Group TV" width={155} height={32} className="h-8 w-auto" />
              </th>
              <th scope="col" className="w-[25%] px-6 py-5 text-sm font-semibold text-muted">Cable TV</th>
              <th scope="col" className="w-[25%] px-6 py-5 text-sm font-semibold text-muted">Other streaming</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.k} className="border-b border-border transition-colors last:border-0 hover:bg-white/[0.015]">
                <th scope="row" className="px-6 py-4 text-left font-medium text-muted">{r.k}</th>
                <td className="border-x border-primary/20 bg-primary/[0.04] px-6 py-4">
                  <Cell mark="win" strong>
                    {r.apollo}
                  </Cell>
                </td>
                <td className="px-6 py-4">
                  <Cell mark={r.cable[0]}>{r.cable[1]}</Cell>
                </td>
                <td className="px-6 py-4">
                  <Cell mark={r.other[0]}>{r.other[1]}</Cell>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-subtle" aria-label="Legend">
        {(Object.keys(markIcon) as Mark[]).map((m) => {
          const Icon = markIcon[m];
          return (
            <li key={m} className="inline-flex items-center gap-1.5">
              <Icon className={cn("h-3.5 w-3.5", markTone[m])} strokeWidth={2.5} aria-hidden /> {markLabel[m]}
            </li>
          );
        })}
      </ul>
      <p className="mx-auto mt-3 max-w-3xl text-center text-xs leading-5 text-subtle">{c.footnote}</p>
    </Section>
  );
}

// ─── Plans & pricing ────────────────────────────────────────────────────────

export function PlansSection({ plans, checkout }: { plans: Plan[]; checkout: boolean }) {
  const c = homeCopy.plans;
  const { baseMonthly, bestValueId } = pricingContext(plans);
  const maxSave = Math.max(0, ...plans.map((p) => savingsPct(p, baseMonthly)));
  const allOneTime = plans.length > 0 && plans.every((p) => p.oneTime);

  const hooks = [
    allOneTime ? { icon: Receipt, t: "Pay once", b: "No automatic renewals" } : { icon: Receipt, t: "Clear billing", b: "Price shown before you pay" },
    maxSave > 0 ? { icon: Sparkles, t: `Save up to ${maxSave}%`, b: "On longer packs" } : null,
    { icon: KeyRound, t: "Fast activation", b: "Confirmed by our team" },
    { icon: LifeBuoy, t: "Real support", b: "Setup help on every pack" },
  ].filter((h): h is { icon: typeof Receipt; t: string; b: string } => h !== null);

  return (
    <Section>
      <SectionHeader align="center" eyebrow={c.eyebrow} title={c.h2} description={<RichText text={c.description} />} />

      <ul className="mx-auto mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3">
        {hooks.map((h) => (
          <li key={h.t} className="flex items-center gap-2.5">
            <h.icon className="h-4 w-4 shrink-0 text-accent" aria-hidden />
            <span className="text-sm">
              <span className="font-semibold text-text">{h.t}</span> <span className="text-subtle">· {h.b}</span>
            </span>
          </li>
        ))}
      </ul>

      <h3 className="sr-only">Available Apollo Group TV packs</h3>
      {plans.length > 0 ? (
        <div className={cn("mt-12 grid items-stretch gap-5 pt-3 sm:grid-cols-2", plans.length >= 4 ? "xl:grid-cols-4" : "lg:grid-cols-3")}>
          {plans.map((p) => (
            <PlanCard key={p.id} plan={p} baseMonthly={baseMonthly} bestValue={p.id === bestValueId} />
          ))}
        </div>
      ) : (
        <EmptyState icon={CreditCard} title="Plans are being finalized" description="Pricing will be published here soon." className={afterHeader} />
      )}

      <div className={cn(cardClass, "mt-8 flex flex-col items-center justify-between gap-4 px-6 py-5 md:flex-row")}>
        <p className="text-center text-sm leading-6 text-muted md:text-left">
          <span className="font-semibold text-text">Not sure which pack fits?</span>{" "}
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
    </Section>
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
    <Section>
      <SectionHeader
        eyebrow={c.eyebrow}
        title={c.h2}
        description={c.description}
        action={
          <ButtonLink href="/create-account">
            Create your account <ArrowRight className="h-4 w-4" aria-hidden />
          </ButtonLink>
        }
      />
      <ol className={cn(afterHeader, "relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6")}>
        {/* Connector line through the step markers on large screens */}
        <span className="pointer-events-none absolute left-6 right-6 top-6 hidden h-px bg-gradient-to-r from-primary/60 via-border-strong to-border lg:block" aria-hidden />
        {steps.map((s, i) => (
          <li key={s.t} className="relative">
            <span className="relative grid h-12 w-12 place-items-center rounded-full border border-primary/40 bg-bg font-display text-base font-bold text-accent shadow-[0_0_0_6px_var(--bg)]">
              {i + 1}
            </span>
            <h3 className="mt-5 flex items-center gap-2 font-display text-base font-bold text-text">
              <s.icon className="h-4 w-4 text-subtle" aria-hidden /> {s.t}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted">{s.b}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

// ─── Reviews ────────────────────────────────────────────────────────────────

export function ReviewsSection({
  reviews,
}: {
  reviews: { id: string; rating: number; title: string; body: string; isVerified: boolean; author: string; date: string }[];
}) {
  const c = homeCopy.reviews;
  const actions = (
    <>
      <ButtonLink href="/reviews" variant="secondary">
        Read all reviews
      </ButtonLink>
      <ButtonLink href="/reviews#write" variant="ghost">
        Write a review
      </ButtonLink>
    </>
  );

  if (reviews.length > 0) {
    return (
      <Section>
        <SectionHeader eyebrow={c.eyebrow} title={c.h2} description={c.description} action={actions} />
        <div className={afterHeader}>
          <ReviewCarousel reviews={reviews} />
        </div>
      </Section>
    );
  }

  // No published reviews yet: explain how reviews work instead of showing an empty box.
  const rules = [
    { icon: User, t: "Registered accounts only", b: "Every review is tied to a real Apollo Group TV account." },
    { icon: ShieldCheck, t: "Moderated before publishing", b: "We check each review for spam and abuse — never for being positive." },
    { icon: BadgeCheck, t: "“Verified customer” means it", b: "The badge appears only when the reviewer has a subscription on record." },
  ];
  return (
    <Section>
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16 [&>*]:min-w-0">
        <div className="lg:col-span-6">
          <SectionHeader eyebrow={c.eyebrow} title={c.h2} description={c.description} />
          <div className="mt-8 flex flex-wrap gap-3">{actions}</div>
        </div>
        <ul className={cn(cardClass, "divide-y divide-border lg:col-span-6")}>
          {rules.map((r) => (
            <li key={r.t} className="flex gap-4 p-6">
              <IconBox icon={r.icon} size="sm" />
              <div>
                <h3 className="font-semibold text-text">{r.t}</h3>
                <p className="mt-1 text-sm leading-6 text-muted">{r.b}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

// ─── Legal & safety ─────────────────────────────────────────────────────────

const safetyIcons = [FileText, Download, Lock];

export function LegalSection() {
  const c = homeCopy.legal;
  return (
    <Section>
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16 [&>*]:min-w-0">
        <div className="lg:col-span-6">
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <h2 className={cn(h2Class, "mt-3")}>{c.h2}</h2>
          <div className={cn(leadClass, "mt-5 space-y-4")}>
            {c.paragraphs.map((p, i) => (
              <p key={i}>
                <RichText text={p} />
              </p>
            ))}
          </div>
          <p className="mt-6 text-sm leading-6 text-subtle">
            <RichText text={c.more} />
          </p>
        </div>
        <ul className={cn(cardClass, "divide-y divide-border lg:col-span-6")}>
          {c.items.map((it, i) => (
            <li key={it.title} className="flex gap-4 p-6">
              <IconBox icon={safetyIcons[i % safetyIcons.length]} size="sm" />
              <div>
                <h3 className="font-semibold text-text">{it.title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted">
                  <RichText text={it.body} />
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

// ─── FAQ ────────────────────────────────────────────────────────────────────

export function FaqSection() {
  const c = homeCopy.faq;
  const items = homeFaq.map((f, i) => ({ id: `home-${i}`, category: "Home", question: f.q, answer: f.a }));
  return (
    <Section>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16 [&>*]:min-w-0">
        <div className="lg:sticky lg:top-36 lg:col-span-5 lg:self-start">
          <SectionHeader eyebrow={c.eyebrow} title={c.h2} description={<RichText text={c.description} />} />
          <div className={cn(cardClass, "mt-8 p-5")}>
            <p className="font-semibold text-text">Still have a question?</p>
            <p className="mt-1 text-sm leading-6 text-muted">Our team answers every message — usually with a written reply you can come back to.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <ButtonLink href="/contact" size="sm">
                Contact support
              </ButtonLink>
              <ButtonLink href="/faq" variant="ghost" size="sm">
                Full FAQ
              </ButtonLink>
            </div>
          </div>
        </div>
        <div className="lg:col-span-7">
          <FaqAccordion items={items} />
        </div>
      </div>
    </Section>
  );
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
    <Section>
      <SectionHeader eyebrow={c.eyebrow} title={c.h2} description={c.description} />
      <ul className={cn(afterHeader, "grid gap-4 sm:grid-cols-2 lg:grid-cols-4")}>
        {routes.map((r) => (
          <li key={r.t}>
            <Link href={r.href} className={cn(cardClass, cardHover, "group flex h-full flex-col p-6")}>
              <div className="flex items-start justify-between gap-3">
                <IconBox icon={r.icon} />
                <span className="pt-1 text-right text-xs text-subtle">{r.meta}</span>
              </div>
              <h3 className="mt-5 font-display text-base font-bold text-text">{r.t}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-muted">{r.b}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                {r.cta} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-muted">
        Can&apos;t sign in? Reset your password from the{" "}
        <Link href="/sign-in" className="font-medium text-accent hover:text-light-blue">
          Sign in
        </Link>{" "}
        page — the link is valid for 30 minutes.
      </p>
    </Section>
  );
}

// ─── Final CTA ──────────────────────────────────────────────────────────────

export function FinalCta({ fromMonthly, maxSave }: { fromMonthly: string | null; maxSave: number }) {
  const c = homeCopy.cta;
  const badges = ["One-time payment", "No automatic renewal", "No contracts", "Activation by our team"];
  return (
    <section className="section-y relative border-t border-border">
      <Container>
        <div className="relative overflow-hidden rounded-[20px] border border-primary/25 bg-[#07191d] px-6 py-12 text-center sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_90%_at_50%_0%,rgb(34_211_238/0.25),transparent_70%)]" aria-hidden />
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden />
          <div className="relative mx-auto max-w-2xl">
            <Eyebrow>{c.eyebrow}</Eyebrow>
            <h2 className={cn(h2Class, "mt-3")}>{c.h2}</h2>
            <p className={cn(leadClass, "mt-4")}>
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
                  <Check className="h-4 w-4 text-accent" strokeWidth={2.5} aria-hidden /> {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
