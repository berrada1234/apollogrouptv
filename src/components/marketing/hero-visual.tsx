import { CheckCircle2, Search, Tv } from "lucide-react";

/*
 * Decorative product illustration: a TV running the Apollo interface plus a
 * phone showing the account dashboard. Artwork is abstract CSS gradients —
 * no third-party media or logos.
 */

const art = [
  "from-[#1e3a8a] via-[#2563eb] to-[#60a5fa]",
  "from-[#0f2a4d] via-[#1d4ed8] to-[#38bdf8]",
  "from-[#172554] via-[#3730a3] to-[#6366f1]",
  "from-[#0c4a6e] via-[#0369a1] to-[#7dd3fc]",
  "from-[#1e293b] via-[#334155] to-[#64748b]",
  "from-[#1e3a8a] via-[#4338ca] to-[#93c5fd]",
];

function Tile({ i, wide }: { i: number; wide?: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-md bg-gradient-to-br ${art[i % art.length]} ${wide ? "aspect-[16/10]" : "aspect-video"}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgb(255_255_255/0.25),transparent_45%)]" />
      <div className="absolute bottom-1.5 left-1.5 h-1 w-1/2 rounded-full bg-white/50" />
    </div>
  );
}

export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[640px] pb-10 lg:pb-14" aria-hidden>
      {/* TV */}
      <div className="relative rounded-[18px] border border-border-strong bg-[#050c17] p-2 shadow-lg sm:p-2.5">
        <div className="overflow-hidden rounded-[11px] bg-bg-secondary">
          {/* top bar */}
          <div className="flex items-center gap-3 border-b border-border/70 px-3 py-2 sm:px-4 sm:py-2.5">
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-text sm:text-xs">
              <Tv className="h-3.5 w-3.5 text-accent" /> Apollo
            </span>
            <div className="hidden gap-3 text-[10px] text-muted sm:flex">
              <span className="text-text">Home</span>
              <span>Categories</span>
              <span>My list</span>
            </div>
            <span className="ml-auto flex h-5 w-24 items-center gap-1 rounded-full bg-card px-2 text-[9px] text-subtle sm:w-32">
              <Search className="h-2.5 w-2.5" /> Search
            </span>
          </div>
          {/* featured */}
          <div className="p-3 sm:p-4">
            <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-[#0b2a5b] via-[#1d4ed8] to-[#0b1728] p-4 sm:p-5">
              <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgb(147_197_253/0.45),transparent_65%)]" />
              <div className="absolute bottom-0 right-6 top-6 hidden w-[38%] rounded-t-xl bg-gradient-to-t from-[#0b1728]/80 to-[#60a5fa]/30 sm:block" />
              <p className="relative text-[9px] font-semibold uppercase tracking-[0.2em] text-light-blue">Featured</p>
              <div className="relative mt-2 h-3 w-36 rounded bg-white/90 sm:h-4 sm:w-48" />
              <div className="relative mt-2 h-1.5 w-44 rounded bg-white/40 sm:w-60" />
              <div className="relative mt-1 h-1.5 w-32 rounded bg-white/30" />
              <div className="relative mt-4 flex gap-2">
                <span className="h-5 w-16 rounded-md bg-white sm:h-6 sm:w-20" />
                <span className="h-5 w-14 rounded-md border border-white/30 bg-white/10 sm:h-6 sm:w-16" />
              </div>
            </div>
            {/* rails */}
            {[0, 3].map((offset) => (
              <div key={offset} className="mt-3 sm:mt-4">
                <div className="mb-1.5 h-1.5 w-20 rounded bg-muted/40" />
                <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                  {[0, 1, 2, 3].map((n) => (
                    <Tile key={n} i={n + offset} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* stand */}
      <div className="mx-auto h-3 w-24 rounded-b-lg bg-gradient-to-b from-[#1b2c44] to-[#0b1728]" />
      <div className="mx-auto h-1.5 w-40 rounded-full bg-[#0b1728] shadow-[0_8px_20px_rgb(2_6_16/0.8)]" />

      {/* phone */}
      <div className="absolute -bottom-2 -left-2 hidden w-[118px] rounded-[20px] sm:block border border-border-strong bg-[#050c17] p-1.5 shadow-lg sm:-left-6 sm:w-[150px] lg:-left-10">
        <div className="overflow-hidden rounded-[15px] bg-bg-secondary px-2.5 pb-3 pt-2">
          <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-border-strong" />
          <p className="text-[8px] text-subtle">My plan</p>
          <p className="text-[11px] font-semibold text-text">Quarterly</p>
          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-success/15 px-1.5 py-0.5 text-[8px] font-medium text-success">
            <span className="h-1 w-1 rounded-full bg-success" /> Active
          </span>
          <div className="mt-2.5 h-1 rounded-full bg-inset">
            <div className="h-1 w-2/3 rounded-full bg-accent" />
          </div>
          <p className="mt-1 text-[7px] text-subtle">54 of 90 days left</p>
          <div className="mt-2.5 space-y-1.5">
            {["Billing", "Support", "Referrals"].map((l) => (
              <div key={l} className="flex items-center justify-between rounded-md bg-card px-1.5 py-1 text-[8px] text-muted">
                {l} <span className="h-1 w-3 rounded bg-border-strong" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* status chip */}
      <div className="absolute -right-1 top-[42%] hidden items-center gap-2 rounded-xl border border-border-strong bg-card/95 px-3 py-2 shadow-lg backdrop-blur sm:flex lg:-right-6">
        <CheckCircle2 className="h-4 w-4 text-success" />
        <div>
          <p className="text-[11px] font-semibold text-text">Ticket resolved</p>
          <p className="text-[10px] text-subtle">Support replied in your dashboard</p>
        </div>
      </div>
    </div>
  );
}
