"use client";

import { useState } from "react";
import { Check, ClipboardCopy, Gift, PartyPopper } from "lucide-react";

const COLORS = ["#22d3ee", "#a5f3fc", "#fbbf24", "#f472b6", "#34d399", "#ffffff"];

// Fixed layout (no randomness), so server and browser render the same confetti.
const PIECES = Array.from({ length: 36 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: ((i * 13) % 20) / 10,
  duration: 2.4 + ((i * 7) % 10) / 10,
  color: COLORS[i % COLORS.length],
  size: 6 + (i % 3) * 2,
}));

/** "Surprise" header shown once a subscription is active; confetti plays for recently activated ones. */
export function ActivationCelebration({ confetti }: { confetti: boolean }) {
  return (
    <section className="relative overflow-hidden rounded-[20px] border border-primary/40 bg-gradient-to-br from-[#0b2a30] via-card to-[#1b1030] p-6 text-center shadow-glow sm:p-10">
      {confetti && (
        <div className="pointer-events-none absolute inset-0 motion-reduce:hidden" aria-hidden>
          {PIECES.map((p, i) => (
            <span
              key={i}
              className="absolute top-0 block rounded-[2px] opacity-0"
              style={{
                left: `${p.left}%`,
                width: p.size,
                height: p.size * 1.6,
                backgroundColor: p.color,
                animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s 2 both`,
              }}
            />
          ))}
        </div>
      )}
      <span className="relative mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/15 text-accent [animation:gift-pop_1.6s_ease-in-out_3] motion-reduce:animate-none">
        <Gift className="h-8 w-8" aria-hidden />
      </span>
      <p className="relative mt-5 text-xs font-bold uppercase tracking-[0.18em] text-accent">🎁 Surprise! Your account is now active!</p>
      <h2 className="relative mt-3 inline-flex items-center gap-2 font-display text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
        <PartyPopper className="h-8 w-8 text-warning" aria-hidden /> Congratulations!
      </h2>
      <p className="relative mx-auto mt-3 max-w-lg text-sm leading-6 text-muted sm:text-base">
        Your Apollo Group TV subscription is now active. Thank you for choosing us!
      </p>
    </section>
  );
}

/** Copies every login detail as plain text, one per line. */
export function CopyAllButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          setCopied(false);
        }
      }}
      className="inline-flex items-center gap-2 rounded-xl border border-primary/50 px-4 py-2 text-sm font-semibold text-light-blue transition-colors hover:bg-primary/10"
    >
      {copied ? <Check className="h-4 w-4 text-success" aria-hidden /> : <ClipboardCopy className="h-4 w-4" aria-hidden />}
      <span aria-live="polite">{copied ? "Copied all details" : "Copy All Details"}</span>
    </button>
  );
}
