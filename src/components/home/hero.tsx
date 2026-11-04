import Link from "next/link";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/misc";
import { CountUp } from "@/components/home/count-up";
import { Prism } from "@/components/home/prism";
import { homeCopy } from "@/content/home";

/** Small sentence-case label above a heading, marked with a short spectrum tick. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5 text-sm font-medium text-light-blue">
      <span className="h-px w-6 bg-[image:var(--spectrum)]" aria-hidden />
      {children}
    </span>
  );
}

const delay = (d: number) => ({ "--d": d }) as React.CSSProperties;

export function HomeHero({
  stats,
  badges,
}: {
  stats: { label: string; value: string }[];
  badges: string[];
}) {
  // "Apollo Group TV: Live TV and …" — the brand sits on its own line above the statement.
  const [brand, ...rest] = homeCopy.hero.h1.split(": ");
  const statement = rest.join(": ");
  const [brandFirst, ...brandWords] = brand.split(" ");
  const brandRest = brandWords.join(" ");

  return (
    <section className="relative isolate -mt-[4.5rem] overflow-hidden pt-[4.5rem]">
      {/* Backdrop: midnight-to-void wash, a violet horizon, stars and a faint grid. */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_70%_40%,var(--midnight),transparent_70%),radial-gradient(60%_50%_at_90%_100%,var(--nebula),transparent_70%)]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="starfield" />
      </div>
      <div className="bg-grid pointer-events-none absolute inset-0 -z-10 opacity-50" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-bg" aria-hidden />

      <Container className="relative grid min-h-[calc(100svh-4.5rem)] grid-rows-[auto_1fr_auto] lg:min-h-[min(calc(100svh-4.5rem),900px)]">
        {/* Art on large screens: the right half of the hero. */}
        <div className="absolute inset-y-0 left-[44%] right-[-6%] hidden lg:block">
          <Prism />
        </div>

        <div className="relative z-10 flex max-w-[44rem] flex-col justify-center pb-10 pt-8 sm:pt-12 lg:py-16">
          {/* Official-site badge with a live green status light. */}
          <p className="rise inline-flex w-fit items-center gap-2.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-1.5 text-sm font-semibold text-emerald-300 shadow-[0_0_24px_-6px_rgb(52_211_153/0.7)]" style={delay(0)}>
            <span className="relative flex h-2.5 w-2.5" aria-hidden>
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgb(52_211_153/0.95)]" />
            </span>
            Official Apollo Group TV
          </p>
          {/*
            Art on phones and tablets: anchored to the headline, centred on the brand line in the empty space to its right,
            so it follows the text at every screen width. --s is the prism size; the Prism draws it at 40% of the box width,
            centred 34% from the box's left edge.
          */}
          <div className="relative">
            <div
              className="pointer-events-none absolute left-[calc(100%-var(--s)*1.25)] top-[calc(4.15rem-var(--s)/2)] h-[var(--s)] w-[calc(var(--s)*2.5)] opacity-90 sm:top-[calc(5.17rem-var(--s)/2)] lg:hidden"
              style={{ "--s": "clamp(100px, 30vw, 170px)" } as React.CSSProperties}
            >
              <Prism />
            </div>
          <h1 className="relative mt-6 font-hero font-medium tracking-[-0.045em] text-text">
            <span className="rise block text-[2.6rem] font-semibold leading-[1.02] sm:text-[3.6rem] xl:text-[4.2rem]" style={delay(1)}>
              {/* Two lines below desktop so the prism always has the space right of the second line. */}
              {brandFirst} <br className="lg:hidden" />
              {brandRest}
              <span className="sr-only">: </span>
            </span>
            <span className="rise mt-3 block text-[1.5rem] leading-[1.15] text-light-blue sm:text-[2rem] xl:text-[2.35rem]" style={delay(2)}>
              {statement}
            </span>
          </h1>
          </div>
          <p className="rise mt-6 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8" style={delay(3)}>
            {homeCopy.hero.lead}
          </p>

          <div className="rise mt-9 flex flex-col gap-3 sm:flex-row sm:items-center" style={delay(4)}>
            <ButtonLink href="/plans" size="lg">
              View plans <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href="/product" variant="secondary" size="lg">
              Explore features
            </ButtonLink>
          </div>

          <ul className="rise mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted" style={delay(5)}>
            {badges.map((b) => (
              <li key={b} className="inline-flex items-center gap-1.5">
                {b.includes("money-back") ? (
                  <>
                    <ShieldCheck className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                    <Link href="/refund-policy" className="font-medium text-text underline-offset-4 hover:text-light-blue hover:underline">
                      {b}
                    </Link>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 shrink-0 text-accent" strokeWidth={2.5} aria-hidden /> {b}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>

        {stats.length > 0 && (
          <dl className="glass-blur rise relative z-10 mb-8 grid grid-cols-1 divide-y divide-border rounded-[20px] sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:mb-12 lg:max-w-3xl" style={delay(6)}>
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse px-6 py-4 sm:py-5">
                <dt className="mt-1 text-xs text-subtle sm:text-sm">{s.label}</dt>
                <dd className="font-hero text-2xl font-medium tracking-[-0.04em] text-text sm:text-[1.75rem]">
                  <span className="sr-only">{s.value}</span>
                  <span aria-hidden>
                    <CountUp value={s.value} />
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        )}
      </Container>
    </section>
  );
}
