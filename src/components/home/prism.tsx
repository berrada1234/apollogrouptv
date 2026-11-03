"use client";

import { useEffect, useId, useRef, useState } from "react";

/*
 * Hero centrepiece: the Apollo mark rebuilt as a 3D glass prism. A beam of light enters from the left,
 * the facets refract it, and a spectrum fans out toward the content categories of the app.
 * Facet outlines follow the brand mark (public/brand/apollo-mark.png) in a 310×310 box.
 * Decorative only; pointer tilt is skipped for touch and reduced-motion users.
 */

const facets = [
  // d, resting offset (x, y) and depth
  { d: "M140 8 L170 14 L205 88 L112 145 L99 96 Z", fx: -2, fy: -6, fz: 60 },
  { d: "M166 122 L208 96 L246 170 Z", fx: 6, fy: -3, fz: 30 },
  { d: "M93 110 L116 200 L62 172 Z", fx: -6, fy: -1, fz: 10 },
  { d: "M57 180 L141 226 L20 298 L7 278 Z", fx: -7, fy: 5, fz: -20 },
  { d: "M186 210 L169 300 L35 300 Z", fx: 0, fy: 8, fz: 40 },
  { d: "M204 157 L256 188 L301 280 L285 300 L176 300 Z", fx: 8, fy: 5, fz: -40 },
];

const beams = [
  { label: "Live TV", y: "24%" },
  { label: "Movies", y: "50%" },
  { label: "Series", y: "76%" },
];

function Facet({ d, fx, fy, fz, i }: (typeof facets)[number] & { i: number }) {
  const id = useId();
  return (
    <svg
      viewBox="0 0 310 310"
      className="prism-facet overflow-visible"
      style={{ "--fx": `${fx}px`, "--fy": `${fy}px`, "--fz": `${fz}px`, transitionDelay: `${i * 70}ms` } as React.CSSProperties}
    >
      <defs>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#46e0ff" stopOpacity="0.32" />
          <stop offset="0.55" stopColor="#7aa2ff" stopOpacity="0.1" />
          <stop offset="1" stopColor="#9d7bff" stopOpacity="0.28" />
        </linearGradient>
      </defs>
      <path d={d} fill={`url(#${id}f)`} stroke="#9ff0ff" strokeWidth="1.6" strokeLinejoin="round" className="drop-shadow-[0_0_7px_rgb(70_224_255/0.75)]" />
      {/* Specular edge: a short bright highlight on each facet */}
      <path d={d} fill="none" stroke="white" strokeOpacity="0.55" strokeWidth="1" strokeLinejoin="round" pathLength={100} strokeDasharray="14 86" />
    </svg>
  );
}

export function Prism() {
  const stage = useRef<HTMLDivElement>(null);
  const [assembled, setAssembled] = useState(false);

  // Facets start scattered and settle into the mark once, right after the first paint.
  useEffect(() => {
    const t = requestAnimationFrame(() => setAssembled(true));
    return () => cancelAnimationFrame(t);
  }, []);

  // Pointer tilt: one listener, values eased by the CSS transition on .prism-body.
  useEffect(() => {
    const el = stage.current;
    if (!el || !window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty("--rx", ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));
        el.style.setProperty("--ry", ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={stage} className="prism-stage relative h-full w-full" aria-hidden>
      {/* Incoming beam */}
      <div className="absolute left-0 top-[52%] h-px w-[38%] -translate-y-1/2 bg-gradient-to-r from-transparent via-white/50 to-white">
        <span className="beam-pulse absolute -top-[3px] left-0 h-[7px] w-16 rounded-full bg-white/90 blur-[3px]" />
      </div>

      {/* Spectrum fan leaving the prism */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="beam-fan absolute left-[52%] top-0 h-full w-[48%] overflow-visible">
        <defs>
          <linearGradient id="fan-v" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#46e0ff" />
            <stop offset="0.5" stopColor="#7aa2ff" />
            <stop offset="1" stopColor="#9d7bff" />
          </linearGradient>
          <linearGradient id="fan-h" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="white" stopOpacity="0.95" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="fan-fade">
            <rect width="100" height="100" fill="url(#fan-h)" />
          </mask>
        </defs>
        <g mask="url(#fan-fade)">
          <polygon points="0,50 100,6 100,94" fill="url(#fan-v)" opacity="0.22" className="blur-[6px]" />
          <polygon points="0,51 100,20 100,28" fill="#46e0ff" opacity="0.55" />
          <polygon points="0,51 100,46 100,54" fill="#7aa2ff" opacity="0.5" />
          <polygon points="0,51 100,72 100,80" fill="#9d7bff" opacity="0.55" />
        </g>
      </svg>

      {/* Categories at the end of each beam */}
      {beams.map((b, i) => (
        <span
          key={b.label}
          className="glass-blur rise absolute right-[8%] hidden -translate-y-1/2 items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-text sm:inline-flex"
          style={{ top: b.y, "--d": 6 + i } as React.CSSProperties}
        >
          <span className={["h-1.5 w-1.5 rounded-full", ["bg-[#46e0ff]", "bg-[#7aa2ff]", "bg-[#9d7bff]"][i]].join(" ")} />
          {b.label}
        </span>
      ))}

      {/* The prism */}
      <div className="absolute left-[34%] top-1/2 aspect-square w-[40%] -translate-x-1/2 -translate-y-1/2">
        <div className="absolute inset-[-30%] rounded-full bg-[radial-gradient(closest-side,rgb(122_162_255/0.35),rgb(157_123_255/0.12)_55%,transparent)] blur-2xl" />
        <div className="prism-float relative h-full w-full">
          <div className={assembled ? "prism-body relative h-full w-full" : "prism-body prism-assemble relative h-full w-full"}>
            {facets.map((f, i) => (
              <Facet key={f.d} {...f} i={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
