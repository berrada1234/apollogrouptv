"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Stars } from "@/components/ui/misc";
import { initials } from "@/lib/utils";

type Review = { id: string; rating: number; title: string; body: string; isVerified: boolean; author: string; date: string };

/** One review at a time with previous/next controls; all reviews are real, moderated records. */
export function ReviewCarousel({ reviews }: { reviews: Review[] }) {
  const [i, setI] = useState(0);
  const r = reviews[i];
  const go = (d: number) => setI((v) => (v + d + reviews.length) % reviews.length);

  return (
    <div className="mx-auto max-w-xl" aria-roledescription="carousel" aria-label="Customer reviews">
      <figure className="rounded-lg border border-border bg-card p-7 shadow-card sm:p-8" aria-live="polite">
        <div className="flex items-center justify-between gap-3">
          <Stars rating={r.rating} />
          {r.isVerified && <Badge tone="success" dot>Verified customer</Badge>}
        </div>
        <blockquote className="mt-5">
          <p className="font-display text-lg font-semibold text-text">{r.title}</p>
          <p className="mt-2 leading-relaxed text-muted">“{r.body}”</p>
        </blockquote>
        <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-accent to-primary text-sm font-semibold text-on-primary" aria-hidden>
            {initials(r.author)}
          </span>
          <span>
            <span className="block text-sm font-medium text-text">{r.author}</span>
            <span className="text-xs text-subtle">{r.date}</span>
          </span>
        </figcaption>
      </figure>
      {reviews.length > 1 && (
        <div className="mt-5 flex items-center justify-center gap-4">
          <button type="button" onClick={() => go(-1)} aria-label="Previous review" className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted hover:border-accent/50 hover:text-text">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-subtle tabular-nums">
            {i + 1} / {reviews.length}
          </span>
          <button type="button" onClick={() => go(1)} aria-label="Next review" className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted hover:border-accent/50 hover:text-text">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
