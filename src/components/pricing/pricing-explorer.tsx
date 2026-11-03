"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { cn, formatMoney } from "@/lib/utils";

export type PricingPlan = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  currency: string;
  months: number;
  periodLabel: string;
  accessLabel: string;
  oneTime: boolean;
  features: string[];
  devices: number | null;
  monthlyCents: number | null;
  savingsPct: number;
  /** Full price at the shortest pack's monthly rate, shown struck through when there is a real saving. */
  fullPriceCents: number | null;
  badge: "popular" | "best" | "recommended" | null;
};

const badgeLabel = { popular: "Most popular", best: "Best value", recommended: "Recommended" } as const;

/** Tweens between prices so a period change reads as the same number moving, not a swap. */
function AnimatedPrice({ cents, currency, className }: { cents: number; currency: string; className?: string }) {
  const [shown, setShown] = useState(cents);
  const from = useRef(cents);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || from.current === cents) {
      from.current = cents;
      setShown(cents);
      return;
    }
    const start = performance.now();
    const a = from.current;
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 450);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(a + (cents - a) * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
      else from.current = cents;
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [cents, reduce]);

  return <span className={cn("tabular-nums", className)}>{formatMoney(shown, currency)}</span>;
}

/** Check mark that draws itself when it scrolls in (CSS scroll timeline; static elsewhere). */
export function DrawnCheck({ className }: { className?: string }) {
  return (
    <span className={cn("grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[linear-gradient(140deg,rgb(70_224_255/0.22),rgb(157_123_255/0.22))]", className)} aria-hidden>
      <svg viewBox="0 0 16 16" className="h-3 w-3">
        <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="#8aecff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="check-draw" pathLength={1} />
      </svg>
    </span>
  );
}

/** Pulls its child a few pixels toward the pointer: a small, tactile hover response. */
function Magnetic({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const dx = Math.max(-8, Math.min(8, (e.clientX - (r.left + r.width / 2)) * 0.18));
    const dy = Math.max(-5, Math.min(5, (e.clientY - (r.top + r.height / 2)) * 0.3));
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  };
  const leave = () => ref.current && (ref.current.style.transform = "");
  return (
    <span ref={ref} onPointerMove={move} onPointerLeave={leave} className={cn("block transition-transform duration-300 ease-out", className)}>
      {children}
    </span>
  );
}

function PlanCard({ plan, selected, onSelect }: { plan: PricingPlan; selected: boolean; onSelect: () => void }) {
  const ref = useRef<HTMLElement>(null);

  // 3D tilt toward the pointer; mouse only, skipped for reduced motion.
  const tilt = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--tilt-x", `${(-y * 7).toFixed(2)}deg`);
    el.style.setProperty("--tilt-y", `${(x * 9).toFixed(2)}deg`);
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  const reset = () => {
    ref.current?.style.setProperty("--tilt-x", "0deg");
    ref.current?.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <article
      ref={ref}
      onPointerMove={tilt}
      onPointerLeave={reset}
      onClick={onSelect}
      data-active={selected}
      aria-labelledby={`plan-${plan.slug}`}
      className={cn(
        "price-card glow-border group relative flex h-full cursor-pointer flex-col rounded-[24px] p-7 sm:p-8",
        selected ? "price-card-active" : "",
      )}
    >
      {plan.badge && (
        <span
          className={cn(
            "absolute -top-3.5 left-7 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold shadow-[0_8px_24px_-8px_rgb(122_162_255/0.9)]",
            plan.badge === "popular" ? "bg-[image:var(--spectrum)] text-on-primary" : "border border-[rgb(122_162_255/0.45)] bg-[#0c1024] text-light-blue",
          )}
        >
          {plan.badge === "popular" ? <Star className="h-3 w-3" fill="currentColor" aria-hidden /> : <Sparkles className="h-3 w-3" aria-hidden />}
          {badgeLabel[plan.badge]}
        </span>
      )}

      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 id={`plan-${plan.slug}`} className="text-lg font-semibold text-text">
            {plan.name}
          </h3>
          <p className="mt-0.5 text-sm font-medium text-light-blue">{plan.accessLabel}</p>
        </div>
        {plan.savingsPct > 0 && <span className="rounded-full bg-success/12 px-2.5 py-1 text-xs font-semibold text-success">Save {plan.savingsPct}%</span>}
      </div>

      <div className="mt-7">
        {plan.fullPriceCents && plan.savingsPct > 0 ? (
          <p className="text-sm text-subtle">
            <span className="line-through">{formatMoney(plan.fullPriceCents, plan.currency)}</span>
            <span className="sr-only"> at the monthly rate</span>
          </p>
        ) : (
          <p className="text-sm text-transparent" aria-hidden>
            –
          </p>
        )}
        <p className="font-hero text-[2.75rem] font-medium leading-none tracking-[-0.05em] text-text tabular-nums">{formatMoney(plan.priceCents, plan.currency)}</p>
        <p className="mt-2 text-sm text-muted">
          {plan.oneTime ? `One payment for ${plan.accessLabel.toLowerCase()}` : `Billed ${plan.periodLabel.toLowerCase()}`}
        </p>
        {plan.monthlyCents && plan.months > 1 && (
          <p className="mt-3 inline-flex rounded-full border border-border px-3 py-1 text-xs text-muted">
            <span className="font-semibold text-text">{formatMoney(plan.monthlyCents, plan.currency)}</span>&nbsp;per month
          </p>
        )}
      </div>

      {plan.features.length > 0 && (
        <ul className="mt-7 space-y-3 border-t border-border pt-7">
          {plan.features.map((f) => (
            <li key={f} className="flex gap-3 text-sm text-text/90">
              <DrawnCheck className="mt-px" />
              {f}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto pt-8">
        <Magnetic>
          <Link
            href={`/create-account?plan=${plan.slug}`}
            onClick={(e) => e.stopPropagation()}
            className={buttonClasses({ variant: selected ? "primary" : "secondary", size: "lg", className: "w-full" })}
          >
            Get {plan.name.replace(/\s+(pack|plan)$/i, "")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </Magnetic>
      </div>
    </article>
  );
}

/**
 * Period switch, live summary and pack cards. Every figure comes from the real price list:
 * savings compare each pack with buying the shortest pack repeatedly for the same time.
 */
export function PricingExplorer({ plans, defaultId }: { plans: PricingPlan[]; defaultId: string }) {
  const [selectedId, setSelectedId] = useState(defaultId);
  const selected = plans.find((p) => p.id === selectedId) ?? plans[0];

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const next = e.key === "ArrowRight" || e.key === "ArrowDown" ? i + 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? i - 1 : null;
    if (next === null) return;
    e.preventDefault();
    const p = plans[(next + plans.length) % plans.length];
    setSelectedId(p.id);
    document.getElementById(`period-${p.slug}`)?.focus();
  };

  return (
    <div>
      {/* Billing period switch */}
      <div className="flex justify-center">
        <div role="radiogroup" aria-label="Billing period" className="glass-blur grid w-full max-w-md grid-cols-2 gap-1 rounded-[22px] p-1.5 sm:flex sm:w-auto sm:max-w-none sm:rounded-full">
          {plans.map((p, i) => {
            const active = p.id === selected.id;
            return (
              <button
                key={p.id}
                id={`period-${p.slug}`}
                type="button"
                role="radio"
                aria-checked={active}
                tabIndex={active ? 0 : -1}
                onClick={() => setSelectedId(p.id)}
                onKeyDown={(e) => onKey(e, i)}
                className={cn(
                  "relative shrink-0 rounded-full px-3 py-2.5 text-sm font-semibold transition-colors duration-300 sm:px-5",
                  active ? "text-on-primary" : "text-muted hover:text-text",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="period-pill"
                    className="absolute inset-0 rounded-full bg-[image:var(--spectrum)] shadow-[0_8px_24px_-8px_rgb(122_162_255/0.9)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative inline-flex items-center gap-2">
                  {p.periodLabel}
                  {p.savingsPct > 0 && (
                    <span className={cn("rounded-full px-1.5 py-0.5 text-[11px] font-bold", active ? "bg-black/15" : "bg-success/12 text-success")}>-{p.savingsPct}%</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live summary of the selected period */}
      <div className="mx-auto mt-6 max-w-3xl" aria-live="polite">
        <div className="glass edge-spectrum flex flex-col items-center gap-5 rounded-[24px] px-6 py-5 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-sm text-muted">
              {selected.name} · {selected.accessLabel}
            </p>
            <p className="mt-1 flex flex-wrap items-baseline justify-center gap-x-3 sm:justify-start">
              <AnimatedPrice cents={selected.priceCents} currency={selected.currency} className="font-hero text-3xl font-medium tracking-[-0.05em] text-text" />
              {selected.monthlyCents && selected.months > 1 && (
                <span className="text-sm text-muted">
                  = <AnimatedPrice cents={selected.monthlyCents} currency={selected.currency} className="font-semibold text-text" /> per month
                </span>
              )}
            </p>
            <p className="mt-1 text-xs text-subtle">
              {selected.savingsPct > 0 && selected.fullPriceCents
                ? `${formatMoney(selected.fullPriceCents - selected.priceCents, selected.currency)} less than ${selected.months} months of the monthly pack.`
                : selected.oneTime
                  ? "One payment. Nothing renews automatically."
                  : "Billed per period."}
            </p>
          </div>
          <Magnetic className="w-full sm:w-auto">
            <Link href={`/create-account?plan=${selected.slug}`} className={buttonClasses({ size: "lg", className: "w-full sm:w-auto" })}>
              Get {selected.name.replace(/\s+(pack|plan)$/i, "")} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Magnetic>
        </div>
      </div>

      {/* Pack cards */}
      <h2 className="sr-only">Available packs</h2>
      <div className={cn("mt-14 grid items-stretch gap-6 pt-3 md:grid-cols-2", plans.length >= 4 ? "xl:grid-cols-4" : "lg:grid-cols-3")}>
        {plans.map((p, i) => (
          <div key={p.id} className="rise" style={{ "--d": i + 2 } as React.CSSProperties}>
            <PlanCard plan={p} selected={p.id === selected.id} onSelect={() => setSelectedId(p.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}
