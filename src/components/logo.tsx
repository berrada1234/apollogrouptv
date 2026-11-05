import { useId } from "react";
import Link from "next/link";
import { MARK } from "@/lib/brand-mark";
import { cn } from "@/lib/utils";

/** The mark on its own. `cut` widens the blade gaps for very small sizes. */
export function BrandMark({ size = 36, className, title = "Apollo Group TV logo", cut = 4 }: { size?: number; className?: string; title?: string | null; cut?: number }) {
  // Unique ids per instance: a gradient referenced from a hidden SVG would otherwise render blank.
  const id = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      role={title ? "img" : undefined}
      aria-label={title ?? undefined}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <linearGradient id={`${id}g`} x1="18" y1="18" x2="104" y2="104" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={MARK.stops[0]} />
          <stop offset="0.55" stopColor={MARK.stops[1]} />
          <stop offset="1" stopColor={MARK.stops[2]} />
        </linearGradient>
        <mask id={`${id}m`} maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="120">
          <polygon points={MARK.outer} fill="#fff" stroke="#fff" strokeWidth="14" strokeLinejoin="round" />
          <polygon points={MARK.play} fill="#000" stroke="#000" strokeWidth={cut * 0.9} strokeLinejoin="round" />
          {MARK.cuts.map(([x1, y1, x2, y2]) => (
            <line key={`${x1}-${y1}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#000" strokeWidth={cut} strokeLinecap="round" />
          ))}
        </mask>
      </defs>
      <rect width="120" height="120" fill={`url(#${id}g)`} mask={`url(#${id}m)`} />
    </svg>
  );
}

/** @deprecated Use BrandMark. Kept so existing call sites keep working. */
export const LogoMark = BrandMark;

/** Mark + "Apollo Group TV" in the display face. `height` is the mark size; the name scales with it. */
export function Wordmark({ height = 40, className, tone = "dark" }: { height?: number; className?: string; tone?: "dark" | "light" }) {
  const fontSize = Math.round(height * 0.56);
  return (
    <span className={cn("inline-flex shrink-0 items-center", className)} style={{ gap: Math.round(height * 0.3) }}>
      <BrandMark size={height} title={null} />
      <span className="whitespace-nowrap font-hero leading-none tracking-[-0.03em]" style={{ fontSize }}>
        <span className={cn("font-semibold", tone === "dark" ? "text-text" : "text-[#0F1530]")}>Apollo</span>{" "}
        <span className={cn("font-normal", tone === "dark" ? "text-[#A9B8FF]" : "text-[#4A5BBF]")}>Group TV</span>
      </span>
    </span>
  );
}

/** The site logo, linking home. */
export function Logo({ className, height = 40 }: { className?: string; height?: number; priority?: boolean }) {
  return (
    <Link href="/" className={cn("inline-flex shrink-0 items-center", className)} aria-label="Apollo Group TV home">
      <Wordmark height={height} />
    </Link>
  );
}
