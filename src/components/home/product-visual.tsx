import { Play, Search } from "lucide-react";

/*
 * Hero product visual: the Apollo TV interface on a television plus a phone, drawn in CSS.
 * Poster art is abstract gradients — no third-party media, logos or invented titles. Decorative only.
 */

const posters = [
  "from-[#0e7490] via-[#0b3b47] to-[#06090c]",
  "from-[#155e75] via-[#0f2f3a] to-[#06090c]",
  "from-[#334155] via-[#1b2430] to-[#06090c]",
  "from-[#0f766e] via-[#0c3532] to-[#06090c]",
  "from-[#3f3f46] via-[#1f1f23] to-[#06090c]",
];

function Poster({ i, progress }: { i: number; progress?: number }) {
  return (
    <div className={`relative aspect-[16/10] overflow-hidden rounded-md bg-gradient-to-br ${posters[i % posters.length]}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgb(255_255_255/0.18),transparent_50%)]" />
      {progress !== undefined && (
        <div className="absolute inset-x-1.5 bottom-1.5 h-[3px] rounded-full bg-white/15">
          <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}

export function ProductVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[620px]" aria-hidden>
      {/* Ambient light behind the screen */}
      <div className="absolute -inset-x-10 -inset-y-8 rounded-full bg-[radial-gradient(50%_50%_at_55%_45%,rgb(34_211_238/0.22),transparent_70%)] blur-2xl" />

      {/* TV */}
      <div className="relative rounded-[18px] border border-white/10 bg-[#0b0d10] p-1.5 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9)] sm:p-2">
        <div className="overflow-hidden rounded-[12px] bg-[#07090b]">
          {/* App bar */}
          <div className="flex items-center gap-3 border-b border-white/5 px-3 py-2 sm:px-4">
            <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_rgb(34_211_238/0.9)]" />
            <div className="flex gap-1 text-[9px] font-medium sm:text-[10px]">
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-text">Live TV</span>
              <span className="px-2 py-0.5 text-muted">Movies</span>
              <span className="px-2 py-0.5 text-muted">Series</span>
              <span className="hidden px-2 py-0.5 text-muted sm:inline">Sports</span>
            </div>
            <span className="ml-auto grid h-5 w-5 place-items-center rounded-full bg-white/5 text-muted">
              <Search className="h-2.5 w-2.5" />
            </span>
          </div>

          {/* Featured */}
          <div className="p-2.5 sm:p-3.5">
            <div className="relative aspect-[21/9] overflow-hidden rounded-lg bg-[linear-gradient(115deg,#06090c_10%,#0b3a46_55%,#22d3ee_140%)]">
              <div className="absolute inset-0 bg-[radial-gradient(60%_90%_at_85%_30%,rgb(103_232_249/0.35),transparent_60%)]" />
              <div className="absolute inset-y-0 right-0 w-1/2 bg-[repeating-linear-gradient(100deg,transparent_0_18px,rgb(255_255_255/0.025)_18px_19px)]" />
              <div className="absolute bottom-0 left-0 p-3 sm:p-4">
                <span className="inline-flex items-center gap-1 rounded bg-red-500 px-1.5 py-0.5 text-[8px] font-bold tracking-wider text-white sm:text-[9px]">
                  <span className="h-1 w-1 rounded-full bg-white" /> LIVE
                </span>
                <div className="mt-2 h-2.5 w-28 rounded bg-white/90 sm:h-3 sm:w-40" />
                <div className="mt-1.5 h-1.5 w-36 rounded bg-white/35 sm:w-52" />
                <div className="mt-3 flex gap-1.5">
                  <span className="flex h-5 items-center gap-1 rounded-md bg-white px-2 text-[8px] font-semibold text-[#06090c] sm:h-6 sm:text-[9px]">
                    <Play className="h-2.5 w-2.5 fill-current" /> Watch
                  </span>
                  <span className="h-5 w-12 rounded-md border border-white/25 bg-white/10 sm:h-6 sm:w-14" />
                </div>
              </div>
            </div>

            {/* Rails */}
            <div className="mt-3">
              <div className="mb-1.5 h-1.5 w-16 rounded bg-white/20" />
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {[0, 1, 2, 3].map((n) => (
                  <Poster key={n} i={n} progress={[72, 35, 88, 15][n]} />
                ))}
              </div>
            </div>
            <div className="mt-3 hidden sm:block">
              <div className="mb-1.5 h-1.5 w-20 rounded bg-white/20" />
              <div className="grid grid-cols-5 gap-2">
                {[0, 1, 2, 3, 4].map((n) => (
                  <div key={n} className="flex h-8 items-center justify-center rounded-md border border-white/5 bg-white/[0.04]">
                    <span className="h-1.5 w-8 rounded bg-white/25" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stand */}
      <div className="relative mx-auto h-2.5 w-20 rounded-b-md bg-gradient-to-b from-[#1a1f25] to-[#0b0d10]" />
      <div className="relative mx-auto h-1 w-36 rounded-full bg-[#0b0d10] shadow-[0_10px_24px_rgb(0_0_0/0.9)]" />

      {/* Phone */}
      <div className="absolute -bottom-6 -left-4 hidden w-[128px] rounded-[22px] border border-white/10 bg-[#0b0d10] p-1.5 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.95)] sm:block lg:-left-10 lg:w-[140px]">
        <div className="overflow-hidden rounded-[17px] bg-[#07090b] p-2">
          <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-white/15" />
          <Poster i={1} />
          <div className="mt-2 h-1.5 w-16 rounded bg-white/70" />
          <div className="mt-1 h-1 w-20 rounded bg-white/25" />
          <div className="mt-2.5 space-y-1.5">
            {[0, 1, 2].map((n) => (
              <div key={n} className="flex items-center gap-1.5">
                <span className="h-5 w-7 shrink-0 rounded bg-white/[0.06]" />
                <span className="h-1 flex-1 rounded bg-white/15" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quality chip */}
      <div className="absolute -right-2 top-[18%] hidden items-center gap-2 rounded-xl border border-white/10 bg-[#0f1216]/90 px-3 py-2 shadow-lg backdrop-blur sm:flex lg:-right-6">
        <span className="rounded bg-primary/15 px-1.5 py-0.5 font-display text-[10px] font-bold text-accent">4K</span>
        <span className="text-[11px] font-medium text-text">HD · Full HD · 4K where available</span>
      </div>
    </div>
  );
}
