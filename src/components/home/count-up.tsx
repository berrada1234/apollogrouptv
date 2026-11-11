"use client";

import { useEffect, useRef } from "react";

/**
 * Counts up to a real figure once it scrolls into view ("22,000+", "90,000+").
 * The leading number animates; any prefix/suffix is kept as written. Values without a number render as-is.
 * Frames write the span's text directly with one shared number formatter, so the animation costs no React
 * renders and no per-frame Intl setup (both showed up as main-thread blocking time).
 */
export function CountUp({ value, duration = 1600 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const match = value.match(/^(\D*)([\d,]*\.?\d+)(.*)$/);
    if (!match || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const [, prefix, raw, suffix] = match;
    const target = Number(raw.replace(/,/g, ""));
    const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
    const formatter = raw.includes(",")
      ? new Intl.NumberFormat("en-US", { maximumFractionDigits: decimals, minimumFractionDigits: decimals })
      : null;
    const format = (n: number) => prefix + (formatter ? formatter.format(n) : n.toFixed(decimals)) + suffix;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          if (t === 1) {
            el.textContent = value;
            return;
          }
          el.textContent = format(target * (1 - Math.pow(1 - t, 4)));
          frame = requestAnimationFrame(tick);
        };
        el.textContent = format(0);
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = value;
    };
  }, [value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
    </span>
  );
}
