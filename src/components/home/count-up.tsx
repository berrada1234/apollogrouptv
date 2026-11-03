"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts up to a real figure once it scrolls into view ("20,000+", "4.8/5").
 * The leading number animates; any prefix/suffix is kept as written. Values without a number render as-is.
 */
export function CountUp({ value, duration = 1600 }: { value: string; duration?: number }) {
  const match = value.match(/^(\D*)([\d,]*\.?\d+)(.*)$/);
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!match || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const [, prefix, raw, suffix] = match;
    const target = Number(raw.replace(/,/g, ""));
    const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
    const grouped = raw.includes(",");
    const format = (n: number) =>
      prefix + (grouped ? n.toLocaleString("en-US", { maximumFractionDigits: decimals, minimumFractionDigits: decimals }) : n.toFixed(decimals)) + suffix;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 4);
          setShown(format(t === 1 ? target : target * eased));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        setShown(format(0));
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {shown}
    </span>
  );
}
