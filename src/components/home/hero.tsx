import Link from "next/link";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/misc";
import { ProductVisual } from "@/components/home/product-visual";
import { homeCopy } from "@/content/home";

/** Small uppercase label above a heading: a cyan dot and tracked text, no box. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
      <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgb(34_211_238/0.8)]" aria-hidden />
      {children}
    </span>
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
      {/* Cinematic backdrop: one cyan light source behind the product, a faint grid, and a fade into the page. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_70%_at_78%_35%,rgb(34_211_238/0.13),transparent_70%),radial-gradient(40%_50%_at_10%_0%,rgb(34_211_238/0.06),transparent_70%)]" aria-hidden />
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-bg" aria-hidden />

      <Container className="relative grid items-center gap-12 pb-14 pt-10 sm:pb-16 sm:pt-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-20 lg:pt-16">
        <div className="motion-safe:animate-[fade-up_0.6s_ease-out_both]">
          <Eyebrow>{tagline}</Eyebrow>
          <h1 className="mt-5 font-display text-[2.375rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-text sm:text-[3.25rem] xl:text-[3.75rem]">
            Apollo Group TV: Live TV and{" "}
            <span className="bg-gradient-to-r from-primary to-light-blue bg-clip-text text-transparent">
              <span className="whitespace-nowrap">On-Demand</span> Streaming
            </span>
            , Made Simple
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">{homeCopy.hero.lead}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/plans" size="lg">
              View plans <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href="/product" variant="secondary" size="lg">
              Explore features
            </ButtonLink>
          </div>

          <ul className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
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

          {stats.length > 0 && (
            <dl className="mt-8 flex max-w-lg gap-8 border-t border-border pt-6">
              {stats.map((s) => (
                <div key={s.label} className="flex min-w-0 flex-col-reverse">
                  <dt className="mt-1 text-xs text-subtle sm:text-sm">{s.label}</dt>
                  <dd className="font-display text-2xl font-bold tracking-tight text-text tabular-nums sm:text-[1.75rem]">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div className="motion-safe:animate-[fade-up_0.8s_ease-out_0.1s_both] lg:pl-4">
          <ProductVisual />
        </div>
      </Container>
    </section>
  );
}
