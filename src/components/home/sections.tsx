import Image from "next/image";
import Link from "next/link";
import type { Plan } from "@prisma/client";
import {
  ArrowDown,
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
  Smartphone,
  Laptop,
  Globe,
  Star,
  Tv,
  User,
  UserPlus,
  X,
  BadgeCheck,
  Download,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { LogoMark, Wordmark } from "@/components/logo";
import { Container, EmptyState } from "@/components/ui/misc";
import { PlanCard } from "@/components/marketing/sections";
import { FaqAccordion } from "@/components/marketing/faq-list";
import { Eyebrow } from "@/components/home/hero";
import { ReviewCarousel } from "@/components/home/review-carousel";
import { RichText } from "@/components/rich-text";
import { PostCard } from "@/components/blog";
import { MethodLogo } from "@/components/checkout/method-logo";
import { FireTvCheck } from "@/components/home/fire-tv-check";
import type { BlogPost } from "@/lib/blog";
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

/* Member avatars: AI-generated portraits of people who don't exist, so no real person's face is used. */
const memberPhotos = [
  { src: "/images/avatars/member-1.webp", alt: "Illustrative portrait of a smiling woman with short curly hair" },
  { src: "/images/avatars/member-2.webp", alt: "Illustrative portrait of a smiling man with short dark hair and stubble" },
  { src: "/images/avatars/member-3.webp", alt: "Illustrative portrait of a smiling woman with long straight black hair" },
  { src: "/images/avatars/member-4.webp", alt: "Illustrative portrait of a smiling man with a short beard" },
  { src: "/images/avatars/member-5.webp", alt: "Illustrative portrait of a smiling woman with dark hair tied back" },
];

/** A portrait in a pink-to-violet ring, with a dark edge so overlapping circles stay separate. */
function MemberAvatar({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="relative grid h-9 w-9 place-items-center rounded-full bg-[linear-gradient(135deg,#ff3d9a,#9d7bff)] sm:h-11 sm:w-11 p-[2px] shadow-[0_6px_16px_-6px_rgb(255_61_154/0.6)]">
      <Image src={src} alt={alt} width={64} height={64} loading="eager" className="h-full w-full rounded-full border-2 border-[#0c1024] object-cover" />
    </span>
  );
}

/** Five stars with a partial fill for fractional ratings (4.8 → the last star 80% filled). */
function RatingStars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5" aria-hidden>
      {[0, 1, 2, 3, 4].map((n) => {
        const fill = Math.max(0, Math.min(1, rating - n));
        return (
          <span key={n} className="relative h-[18px] w-[18px]">
            <Star className="absolute inset-0 h-full w-full text-white/15" fill="currentColor" strokeWidth={0} />
            <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className="h-[18px] w-[18px] text-[#fbbf24] drop-shadow-[0_0_6px_rgb(251_191_36/0.55)]" fill="currentColor" strokeWidth={0} />
            </span>
          </span>
        );
      })}
    </span>
  );
}

export function SocialProofBar({
  members,
  rating,
  overrides,
}: {
  members: number;
  rating: { average: number | null; total: number };
  /** Owner-entered figures (Admin → Settings → Homepage highlights); blank falls back to live data. */
  overrides: { rating: string; reviewCount: string; members: string };
}) {
  // Below 50 a live member count reads as noise rather than proof, so the bar invites instead.
  const memberLabel = overrides.members || (members >= 50 ? formatMembers(members) : null);
  const score = overrides.rating ? Number(overrides.rating) : rating.total > 0 ? rating.average : null;
  const reviewLabel = overrides.reviewCount || (rating.total > 0 ? rating.total.toLocaleString("en-US") : null);

  return (
    <section aria-label="At a glance" className="relative pb-4 pt-2">
      <Container>
        <div className="glass edge-spectrum grid divide-y divide-border rounded-[28px] px-6 sm:px-8 lg:grid-cols-[1.25fr_1.2fr_1fr] lg:divide-x lg:divide-y-0">
          <div className="flex items-center justify-center gap-4 py-6 lg:justify-start lg:pr-8">
            <div className="flex shrink-0 -space-x-3">
              {memberPhotos.map((m) => (
                <MemberAvatar key={m.src} src={m.src} alt={m.alt} />
              ))}
            </div>
            <div>
              {memberLabel ? (
                <>
                  <p className="whitespace-nowrap font-hero text-base font-medium tracking-[-0.03em] text-text">
                    Joined by <span className="tabular-nums">{memberLabel}</span>
                  </p>
                  <p className="text-sm text-muted">cord-cutters worldwide</p>
                </>
              ) : (
                <>
                  <p className="font-hero text-base font-medium tracking-[-0.03em] text-text">Be one of our first members</p>
                  <p className="text-sm text-muted">Every account is email-verified</p>
                </>
              )}
            </div>
          </div>

          <Link href="/app" className="group flex flex-col items-center justify-center gap-3 py-6 lg:px-8">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3" aria-label="Supported devices">
              {homeCopy.devices.logos.map((d) => (
                <li key={d.name} className="flex items-center">
                  <Image src={d.src} alt={d.alt} width={d.width} height={d.height} title={d.name} className="h-6 w-auto object-contain opacity-80 transition-[opacity,transform] duration-300 group-hover:opacity-100 sm:h-7" />
                </li>
              ))}
            </ul>
            <span className="text-center text-xs text-subtle transition-colors group-hover:text-light-blue">Works on your TV, phone and computer</span>
          </Link>

          <div className="flex items-center justify-center py-6 lg:justify-end lg:pl-8">
            {score !== null && reviewLabel ? (
              <Link href="/reviews" className="group flex items-center gap-4">
                <span className="font-hero text-[2rem] font-medium leading-none tracking-[-0.05em] text-text tabular-nums">
                  {score.toFixed(1)}
                  <span className="text-lg text-muted">/5</span>
                </span>
                <span className="flex flex-col gap-1.5">
                  <RatingStars rating={score} />
                  <span className="text-sm text-muted transition-colors group-hover:text-light-blue">
                    ({reviewLabel} {reviewLabel === "1" ? "review" : "reviews"})
                  </span>
                </span>
                <span className="sr-only">Rated {score.toFixed(1)} out of 5</span>
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
          <p className="mt-7 border-l border-[rgb(122_162_255/0.6)] pl-5 font-hero text-lg font-medium leading-snug tracking-[-0.02em] text-text">{c.tagline}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/plans" size="lg">
              Choose your pack <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href="#how-it-works" variant="secondary" size="lg">
              See how it works
            </ButtonLink>
          </div>
        </div>

        <div className="relative lg:col-span-6">
          {/* Orbit rings behind the devices: one slow rotation, decorative. */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[115%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05] motion-safe:animate-[spin_90s_linear_infinite]" aria-hidden>
            <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_12px_rgb(70_224_255/0.9)]" />
          </div>
          <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[0.06]" aria-hidden />
          <figure className="parallax relative">
            <div className="glass edge-spectrum overflow-hidden rounded-[18px] p-1.5 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9)] sm:p-2">
              <Image
                src="/images/app/apollo-group-tv-app-home-screen.webp"
                alt="Apollo Group TV app home screen: a featured title, trending and popular movie rows, and a menu for Search, Movies, TV Shows, Live TV, Sports VOD and the TV Guide"
                width={1672}
                height={941}
                sizes="(min-width: 1024px) 560px, 100vw"
                className="h-auto w-full rounded-[12px]"
              />
            </div>
            <figcaption className="mt-3 text-center text-xs text-subtle">The Apollo TV app home screen on a TV</figcaption>
          </figure>
        </div>
      </div>
    </Section>
  );
}

// ─── Services: what every pack includes ─────────────────────────────────────

export function ServicesSection() {
  const c = homeCopy.services;
  return (
    <Section>
      <SectionHeader eyebrow={c.eyebrow} title={c.h2} description={c.description} />
      {/* Bento: the first item leads, the rest support it. */}
      <ul className={cn(afterHeader, "grid gap-4 md:grid-cols-6")}>
        {homeCopy.intro.highlights.map((h, i) => {
          const Icon = highlightIcons[i % highlightIcons.length];
          const lead = i === 0;
          return (
            <li
              key={h.title}
              className={cn(
                cardClass,
                cardHover,
                "group flex flex-col p-7",
                lead ? "edge-spectrum md:col-span-4 md:row-span-2 md:p-10" : i === 1 ? "md:col-span-2 md:row-span-2" : "md:col-span-3",
              )}
            >
              <IconBox icon={Icon} />
              <h3 className={cn("mt-6 text-text", lead ? "font-hero text-2xl font-medium tracking-[-0.03em] sm:text-[1.75rem]" : "text-lg font-semibold")}>{h.title}</h3>
              <p className={cn("mt-3 text-muted", lead ? "max-w-md text-base leading-7" : "text-sm leading-6")}>{h.body}</p>
              {lead && (
                <div className="mt-auto flex flex-wrap gap-2 pt-10" aria-hidden>
                  {["HD", "Full HD", "4K"].map((q, n) => (
                    <span
                      key={q}
                      className={cn(
                        "rounded-full border px-4 py-1.5 font-hero text-sm font-medium tracking-[-0.02em] transition-transform duration-500 group-hover:-translate-y-1",
                        n === 2 ? "border-transparent bg-[image:var(--spectrum)] text-on-primary" : "border-border-strong text-light-blue",
                      )}
                      style={{ transitionDelay: `${n * 60}ms` }}
                    >
                      {q}
                    </span>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
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
              Device not listed? <Link href="/contact" className="font-medium text-text underline-offset-4 hover:text-light-blue hover:underline">Ask us before subscribing</Link> and
              we&apos;ll tell you whether it works.
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
    { k: "Contract", apollo: "None. You pay once per pack", cable: ["short", "Long-term contracts are common"], other: ["same", "Monthly, renews automatically"] },
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
                <Wordmark height={26} />
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

type HomeMethod = { id: string; name: string; logoUrl: string | null; glyph: string | null; accent: string | null };

export function PlansSection({ plans, checkout, methods = [] }: { plans: Plan[]; checkout: boolean; /** Methods customers can actually use right now. */ methods?: HomeMethod[] }) {
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

      {methods.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          <span className="text-sm text-subtle">Pay with</span>
          <ul className="flex flex-wrap justify-center gap-2" aria-label="Accepted payment methods">
            {methods.map((m) => (
              <li key={m.id}>
                <Link href="/payment-methods" className="inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.03] py-1 pl-1 pr-3 text-sm text-text transition-colors hover:border-accent/40">
                  <MethodLogo name={m.name} logoUrl={m.logoUrl} glyph={m.glyph} accent={m.accent} size="sm" />
                  {m.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/payment-guides" className="text-sm font-semibold text-accent hover:text-light-blue">
            Payment guides
          </Link>
        </div>
      )}

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
          {checkout ? "Our team is happy to help you choose." : "You don't need a card to start. Our team confirms activation and payment options with you."}
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
        <span className="draw-x pointer-events-none absolute left-6 right-6 top-6 hidden h-px bg-[image:var(--spectrum)] opacity-70 lg:block" aria-hidden />
        {steps.map((s, i) => (
          <li key={s.t} className="group relative">
            <span className="relative grid h-12 w-12 place-items-center rounded-full border border-[rgb(122_162_255/0.45)] bg-bg font-hero text-base font-medium text-light-blue shadow-[0_0_0_8px_var(--bg),0_0_24px_-4px_rgb(70_224_255/0.5)] transition-colors duration-300 group-hover:bg-[image:var(--spectrum)] group-hover:text-on-primary">
              {i + 1}
            </span>
            <h3 className="mt-6 flex items-center gap-2 text-lg font-semibold text-text">
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
    { icon: User, t: "Written by real customers", b: "Only people with an account can post, so every review comes from someone who has used the service." },
    { icon: ShieldCheck, t: "Checked, not curated", b: "We publish critical reviews too. Only spam, abuse and personal details are removed." },
    { icon: BadgeCheck, t: "Labels you can rely on", b: "A review is marked as a customer review only when a paid pack is on record for that account." },
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
            <p className="mt-1 text-sm leading-6 text-muted">Our team answers every message, usually with a written reply you can come back to.</p>
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
        page. The link is valid for 30 minutes.
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
        <div className="edge-spectrum relative overflow-hidden rounded-[32px] bg-[radial-gradient(90%_120%_at_50%_0%,var(--midnight),var(--bg)_70%)] px-6 py-16 text-center sm:px-12 sm:py-24">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <div className="starfield" />
          </div>
          <div className="pointer-events-none absolute -bottom-1/2 left-1/2 h-[120%] w-[90%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(157_123_255/0.3),rgb(70_224_255/0.08)_60%,transparent)] blur-2xl" aria-hidden />
          <LogoMark size={64} className="relative mx-auto mb-8 drop-shadow-[0_0_24px_rgb(70_224_255/0.6)] motion-safe:animate-[prism-float_9s_ease-in-out_infinite]" />
          <div className="relative mx-auto max-w-2xl">
            <Eyebrow>{c.eyebrow}</Eyebrow>
            <h2 className={cn(h2Class, "mt-3")}>{c.h2}</h2>
            <p className={cn(leadClass, "mt-4")}>
              {c.body}
              {fromMonthly && (
                <>
                  {" "}
                  Packs start from <span className="font-semibold text-text">{fromMonthly}/mo</span>
                  {maxSave > 0 && <>, and longer packs save up to {maxSave}%</>}.
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

// ─── Official site check ────────────────────────────────────────────────────

/** How to tell the official site from lookalikes. Every point matches how the site actually works. */
export function OfficialSiteSection({ domain }: { domain: string }) {
  const checks = [
    { icon: Globe, t: `The address is ${domain}`, b: "Type it yourself or use a bookmark. Sites with extra letters, hyphens or other endings aren't us." },
    { icon: Receipt, t: "You only pay through your own invoice", b: "Every invoice is created in your account and has a number starting with AGT-. Nobody from Apollo will ask you to pay by message or email." },
    { icon: KeyRound, t: "Login details stay in My Account", b: "Your app login appears in My Account once your pack is active. We never send it by email or chat." },
    { icon: LifeBuoy, t: "Support answers in your ticket", b: "Help comes through tickets in your dashboard or our contact page, so every reply is on record." },
  ];
  return (
    <Section>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16 [&>*]:min-w-0">
        <div className="lg:col-span-5">
          <SectionHeader
            eyebrow="Official website"
            title="How to Know You're on the Official Apollo Group TV Site"
            description="Lookalike sites copy the Apollo name to take payments. Four checks tell you you're in the right place before you pay."
          />
          <Link href="/blog/apollo-group-tv-official-website" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-light-blue">
            How to spot a fake Apollo site <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          {checks.map((c) => (
            <li key={c.t} className={cn(cardClass, "group flex flex-col p-6")}>
              <IconBox icon={c.icon} />
              <h3 className="mt-5 font-semibold text-text">{c.t}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{c.b}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

// ─── Latest guides ──────────────────────────────────────────────────────────

export function GuidesSection({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;
  return (
    <Section>
      <SectionHeader
        eyebrow="Guides"
        title="Apollo TV Setup and Help Guides"
        description="Step-by-step answers to the questions customers ask most, from installing the app to renewing your pack."
        action={
          <ButtonLink href="/blog" variant="secondary">
            All articles
          </ButtonLink>
        }
      />
      <ul className={cn(afterHeader, "grid gap-5 sm:grid-cols-2 lg:grid-cols-3")}>
        {posts.map((p) => (
          <li key={p.slug}>
            <PostCard post={p} headingLevel="h3" />
          </li>
        ))}
      </ul>
    </Section>
  );
}

// ─── Your device ────────────────────────────────────────────────────────────

const deviceIcon = (name: string) => (/fire|android tv/i.test(name) ? Tv : /phone|android/i.test(name) ? Smartphone : /apple tv/i.test(name) ? Tv : /mac|windows/i.test(name) ? Laptop : MonitorSmartphone);

/** Every supported device links to its guide; popular unsupported TVs link to the honest workaround. */
export function DeviceCheckSection({ devices }: { devices: { name: string; slug: string }[] }) {
  const choices = [
    ...devices.map((d) => ({ name: d.name, href: `/guides/${d.slug}`, note: "Setup guide", supported: true })),
    { name: "Google TV", href: "/blog/apollo-tv-google-tv", note: "Setup guide", supported: true },
    { name: "Samsung or LG TV", href: "/blog/apollo-tv-samsung-lg-smart-tv", note: "Use a streaming stick", supported: false },
    { name: "Roku", href: "/blog/apollo-group-tv-roku", note: "Use a streaming stick", supported: false },
  ];
  return (
    <Section>
      <SectionHeader
        eyebrow="Your device"
        title="Choose Your Device to Set Up Apollo TV"
        description="Pick the screen you'll watch on to get its step-by-step guide. If your TV can't run the app directly, we'll show you what works instead."
      />
      <div className={cn(afterHeader, "grid gap-8 lg:grid-cols-12 lg:gap-10 [&>*]:min-w-0")}>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:col-span-7">
          {choices.map((c) => {
            const Icon = deviceIcon(c.name);
            return (
              <li key={c.href + c.name}>
                <Link href={c.href} className={cn(cardClass, cardHover, "group flex h-full flex-col gap-3 p-4 sm:p-5")}>
                  <IconBox icon={Icon} size="sm" />
                  <span className="font-semibold leading-snug text-text">{c.name}</span>
                  <span className={cn("mt-auto inline-flex items-center gap-1 text-xs font-semibold", c.supported ? "text-accent" : "text-warning")}>
                    {c.note} <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="lg:col-span-5">
          <FireTvCheck />
        </div>
      </div>
    </Section>
  );
}

// ─── Key facts ──────────────────────────────────────────────────────────────

/** One consistent set of facts, rendered from settings and the price list, for readers and answer engines alike. */
/**
 * The official address spelled out tile by tile. Lookalike sites differ by a single letter, so the design
 * asks visitors to compare the spelling, not just glance at a logo.
 */
function OfficialAddressPlate({ domain }: { domain: string }) {
  return (
    <div className="mt-10 overflow-hidden rounded-[20px] border border-primary/25 bg-[linear-gradient(160deg,rgb(70_224_255/0.08),rgb(11_18_51/0.6)_45%,rgb(5_6_15/0.9))] shadow-[0_24px_60px_-30px_rgb(70_224_255/0.55)]">
      <div className="flex items-center gap-3 border-b border-white/[0.07] px-5 py-4">
        <LogoMark size={36} className="drop-shadow-[0_0_10px_rgb(70_224_255/0.55)]" />
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-text">
            <BadgeCheck className="h-4 w-4 text-emerald-400" aria-hidden /> Official website
          </p>
          <p className="text-xs text-muted">This is the only address we use</p>
        </div>
      </div>

      <div className="px-5 py-5">
        <p className="sr-only">The official address is {domain}</p>
        <div className="flex items-center gap-2" aria-hidden>
          <Lock className="h-4 w-4 shrink-0 text-emerald-400" />
          <span className="text-xs text-subtle">https://</span>
        </div>
        {/* One tile per character, so a changed or added letter stands out. */}
        <div
          className="mt-3 grid gap-1"
          style={{ gridTemplateColumns: [...domain].map((ch) => (ch === "." ? "0.5fr" : "1fr")).join(" ") }}
          aria-hidden
        >
          {[...domain].map((ch, i) => (
            <span
              key={i}
              className={cn(
                "grid aspect-[3/4] min-w-0 place-items-center rounded-[6px] font-hero text-[clamp(0.75rem,3.2vw,1.15rem)] font-medium leading-none lg:text-[clamp(0.8rem,1.2vw,1.1rem)]",
                // The dot sits on the baseline like a real full stop, in the accent colour.
                ch === "." ? "place-items-end justify-center pb-[18%] text-primary" : "border border-white/[0.08] bg-[#070b1f] text-text shadow-[inset_0_1px_0_rgb(255_255_255/0.04)]",
              )}
            >
              {ch}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm leading-6 text-muted">
          Check the spelling before you sign in or pay. An extra letter, a hyphen or a different ending means it isn&apos;t us.
        </p>
        <Link href="#official-site" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-light-blue">
          Four ways to check <ArrowDown className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
    </div>
  );
}

export function QuickFactsSection({ facts, domain }: { facts: { k: string; v: React.ReactNode }[]; domain: string }) {
  return (
    <Section>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16 [&>*]:min-w-0">
        {/* Sticky on desktop, so the address stays beside the long facts table as it scrolls. */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
          <SectionHeader
            eyebrow="Key facts"
            title="Apollo Group TV at a Glance"
            description="The essentials in one place: what the service is, how you pay, where it works and what isn't included."
          />
          <OfficialAddressPlate domain={domain} />
        </div>
        <div className={cn(cardClass, "overflow-hidden lg:col-span-7")}>
          <table className="w-full text-sm">
            <caption className="sr-only">Apollo Group TV key facts</caption>
            <tbody>
              {facts.map((f) => (
                <tr key={f.k} className="border-b border-border last:border-0">
                  <th scope="row" className="w-[34%] px-5 py-4 text-left align-top font-medium text-muted sm:px-6">
                    {f.k}
                  </th>
                  <td className="px-5 py-4 leading-6 text-text sm:px-6">{f.v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}
