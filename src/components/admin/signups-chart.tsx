"use client";

import { useState } from "react";

type Point = { date: string; count: number };

/**
 * Daily sign-ups bar chart (single series, so no legend — the card title names it).
 * Bars: primary blue, validated ≥3:1 against the card surface; 4px rounded tops,
 * 2px gaps; hit areas span the full column height; a table mirrors the data.
 */
export function SignupsChart({ data }: { data: Point[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.count));
  const niceMax = max <= 4 ? 4 : Math.ceil(max / 4) * 4;
  const W = 600;
  const H = 160;
  const gap = 2;
  const barW = W / data.length - gap;
  const fmt = (d: string) => new Date(`${d}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const active = hover != null ? data[hover] : null;

  return (
    <div>
      <div className="relative">
        {/* y labels */}
        <div className="pointer-events-none absolute inset-y-0 left-0 flex w-7 flex-col justify-between text-[10px] text-subtle tabular-nums" aria-hidden>
          <span>{niceMax}</span>
          <span>{niceMax / 2}</span>
          <span>0</span>
        </div>
        <div className="relative ml-8">
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-40 w-full overflow-visible" role="img" aria-label="Daily sign-ups over the last 30 days">
            {[0, 0.5, 1].map((t) => (
              <line key={t} x1={0} x2={W} y1={H * t} y2={H * t} stroke="var(--border)" strokeWidth={1} strokeDasharray={t === 1 ? undefined : "3 4"} vectorEffect="non-scaling-stroke" />
            ))}
            {data.map((d, i) => {
              const h = (d.count / niceMax) * H;
              const x = i * (barW + gap);
              const r = Math.min(4, barW / 2, h);
              return (
                <g key={d.date}>
                  {d.count > 0 && (
                    <path
                      d={`M${x},${H} V${H - h + r} Q${x},${H - h} ${x + r},${H - h} H${x + barW - r} Q${x + barW},${H - h} ${x + barW},${H - h + r} V${H} Z`}
                      fill="var(--primary)"
                      opacity={hover == null || hover === i ? 1 : 0.45}
                    />
                  )}
                  <rect
                    x={x - gap / 2}
                    y={0}
                    width={barW + gap}
                    height={H}
                    fill="transparent"
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(null)}
                  />
                </g>
              );
            })}
          </svg>
          {active && hover != null && (
            <div
              className="pointer-events-none absolute -top-2 z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-border-strong bg-raised px-2.5 py-1.5 text-xs shadow-lg"
              style={{ left: `${((hover + 0.5) / data.length) * 100}%` }}
              role="status"
            >
              <span className="block text-subtle">{fmt(active.date)}</span>
              <span className="font-medium text-text tabular-nums">
                {active.count} {active.count === 1 ? "sign-up" : "sign-ups"}
              </span>
            </div>
          )}
          <div className="mt-2 flex justify-between text-[10px] text-subtle" aria-hidden>
            <span>{fmt(data[0].date)}</span>
            <span>{fmt(data[Math.floor(data.length / 2)].date)}</span>
            <span>{fmt(data[data.length - 1].date)}</span>
          </div>
        </div>
      </div>
      <details className="mt-3 text-xs text-muted">
        <summary className="cursor-pointer select-none hover:text-text">View as table</summary>
        <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-border">
          <table className="w-full">
            <thead className="sticky top-0 bg-card text-left text-subtle">
              <tr>
                <th className="px-3 py-1.5 font-medium">Date</th>
                <th className="px-3 py-1.5 text-right font-medium">Sign-ups</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.date} className="border-t border-border">
                  <td className="px-3 py-1">{fmt(d.date)}</td>
                  <td className="px-3 py-1 text-right tabular-nums text-text">{d.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
