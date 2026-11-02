import Link from "next/link";
import { ArrowRight, Film, Newspaper, Play, ShieldCheck, Trophy } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/misc";
import { homeCopy } from "@/content/home";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-primary/35 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-light-blue">
      {children}
    </span>
  );
}

/** Concentric "broadcast" rings around a play button, with a few floating category chips. Decorative. */
function SignalVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]" aria-hidden>
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgb(59_130_246/0.22),transparent_62%)]" />
      {[100, 80, 62, 46].map((size, i) => (
        <div
          key={size}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{
            width: `${size}%`,
            height: `${size}%`,
            borderColor: `rgb(96 165 250 / ${0.1 + i * 0.08})`,
            borderStyle: i === 0 ? "dashed" : "solid",
          }}
        />
      ))}
      <div className="absolute left-1/2 top-1/2 grid h-[26%] w-[26%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-accent/50 bg-[radial-gradient(circle_at_30%_30%,#1e3a8a,#0b1728)] shadow-[0_0_60px_-10px_rgb(59_130_246/0.7)]">
        <span className="grid h-[52%] w-[52%] place-items-center rounded-full bg-white text-bg shadow-lg">
          <Play className="ml-[6%] h-1/2 w-1/2 fill-current" />
        </span>
      </div>
      {[
        { icon: Trophy, label: "Sports", pos: "left-[4%] top-[22%]" },
        { icon: Newspaper, label: "News", pos: "right-[2%] top-[34%]" },
        { icon: Film, label: "Movies", pos: "bottom-[14%] left-[14%]" },
      ].map((c) => (
        <div key={c.label} className={`absolute ${c.pos} flex items-center gap-2 rounded-xl border border-border-strong bg-card/90 px-3 py-2 text-xs font-medium text-text shadow-lg backdrop-blur`}>
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/15 text-accent">
            <c.icon className="h-4 w-4" />
          </span>
          {c.label}
        </div>
      ))}
    </div>
  );
}

export function HomeHero({
  tagline,
  stats,
  badges,
}: {
  tagline: string;
  stats: { label: string; value: string }[];
  badges: string[];
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-spotlight pointer-events-none absolute inset-0" aria-hidden />
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
      <Container className="relative grid items-center gap-10 pb-14 pt-10 sm:pb-20 sm:pt-16 lg:grid-cols-[1.35fr_1fr] lg:gap-8">
        <div>
          <Eyebrow>{tagline}</Eyebrow>
          <h1 className="mt-5 font-display text-[2.4rem] font-semibold leading-[1.06] tracking-tight text-text sm:text-[3.4rem] lg:text-[3.3rem] xl:text-[3.6rem]">
            Apollo Group TV: Live TV and <span className="text-gradient"><span className="whitespace-nowrap">On-Demand</span> Streaming</span>, Made Simple
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{homeCopy.hero.lead}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/plans" size="lg">
              View plans <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href="/product" variant="secondary" size="lg">
              Explore features
            </ButtonLink>
          </div>
          <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
            <ShieldCheck className="h-4 w-4 shrink-0 text-accent" aria-hidden />
            {badges.map((b, i) => (
              <span key={b} className="flex items-center gap-2">
                {i > 0 && <span className="text-subtle" aria-hidden>·</span>}
                {b.includes("money-back") ? (
                  <Link href="/refund-policy" className="font-medium text-text underline-offset-4 hover:text-light-blue hover:underline">
                    {b}
                  </Link>
                ) : (
                  b
                )}
              </span>
            ))}
          </p>
          {stats.length > 0 && (
            <dl className="mt-10 flex max-w-xl divide-x divide-border rounded-2xl border border-border bg-card/70 py-4 shadow-sm">
              {stats.map((s) => (
                <div key={s.label} className="flex min-w-0 flex-1 flex-col-reverse px-3 text-center sm:px-5">
                  <dt className="mt-1 text-[11px] text-subtle sm:text-xs">{s.label}</dt>
                  <dd className="font-display text-xl font-semibold text-text tabular-nums sm:text-2xl">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        <div className="hidden sm:block">
          <SignalVisual />
        </div>
      </Container>
    </section>
  );
}
