"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Stars } from "@/components/ui/misc";
import { initials } from "@/lib/utils";

type Review = { id: string; rating: number; title: string; body: string; isVerified: boolean; author: string; date: string };

/** One review at a time, sliding in the direction of travel; all reviews are real, moderated records. Auto-advances until the visitor interacts. */
export function ReviewCarousel({ reviews }: { reviews: Review[] }) {
  const [[i, dir], setState] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const r = reviews[i];

  const go = useCallback((d: number) => setState(([v]) => [(v + d + reviews.length) % reviews.length, d]), [reviews.length]);

  useEffect(() => {
    if (paused || reduce || reviews.length < 2) return;
    const t = setInterval(() => go(1), 7000);
    return () => clearInterval(t);
  }, [paused, reduce, reviews.length, go]);

  return (
    <div
      className="mx-auto max-w-3xl"
      aria-roledescription="carousel"
      aria-label="Customer reviews"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
    >
      <div className="glass edge-spectrum relative overflow-hidden rounded-[24px]">
        <Quote className="pointer-events-none absolute -right-4 -top-4 h-40 w-40 rotate-180 text-white/[0.03]" aria-hidden />
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <motion.figure
            key={r.id}
            custom={dir}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * 60, filter: "blur(6px)" }),
              center: { opacity: 1, x: 0, filter: "blur(0px)" },
              exit: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * -60, filter: "blur(6px)" }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="p-7 sm:p-10"
            aria-live={paused ? "polite" : "off"}
          >
            <div className="flex items-center justify-between gap-3">
              <Stars rating={r.rating} />
              {r.isVerified && (
                <Badge tone="success" dot>
                  Verified customer
                </Badge>
              )}
            </div>
            <blockquote className="mt-6">
              <p className="font-hero text-xl font-medium leading-snug tracking-[-0.03em] text-text sm:text-2xl">{r.title}</p>
              <p className="mt-4 text-base leading-7 text-muted">“{r.body}”</p>
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-3 border-t border-border pt-6">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[image:var(--spectrum)] text-sm font-semibold text-on-primary" aria-hidden>
                {initials(r.author)}
              </span>
              <span>
                <span className="block text-sm font-medium text-text">{r.author}</span>
                <span className="text-xs text-subtle">{r.date}</span>
              </span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      {reviews.length > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button type="button" onClick={() => go(-1)} aria-label="Previous review" className="grid h-11 w-11 place-items-center rounded-full border border-border-strong text-muted transition-colors hover:border-accent/50 hover:text-text">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1.5">
            {reviews.map((rev, n) => (
              <button
                key={rev.id}
                type="button"
                onClick={() => setState([n, n > i ? 1 : -1])}
                aria-label={`Show review ${n + 1} of ${reviews.length}`}
                aria-current={n === i ? "true" : undefined}
                className="grid h-6 place-items-center px-0.5"
              >
                <span className={n === i ? "h-1.5 w-6 rounded-full bg-[image:var(--spectrum)] transition-all duration-300" : "h-1.5 w-1.5 rounded-full bg-white/25 transition-all duration-300 hover:bg-white/50"} />
              </button>
            ))}
          </div>
          <button type="button" onClick={() => go(1)} aria-label="Next review" className="grid h-11 w-11 place-items-center rounded-full border border-border-strong text-muted transition-colors hover:border-accent/50 hover:text-text">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
