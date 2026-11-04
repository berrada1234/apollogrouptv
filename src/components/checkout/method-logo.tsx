import { cn } from "@/lib/utils";

export type MethodLogoProps = {
  name: string;
  logoUrl?: string | null;
  glyph?: string | null;
  accent?: string | null;
  size?: "sm" | "md" | "lg";
};

/** The method's uploaded logo, or a brand-coloured tile with its glyph. */
export function MethodLogo({
  name,
  logoUrl,
  glyph,
  accent,
  size = "md",
}: MethodLogoProps) {
  const box =
    size === "lg"
      ? "h-14 w-14 rounded-[14px] text-2xl"
      : size === "sm"
        ? "h-7 w-7 rounded-[8px] text-xs"
        : "h-12 w-12 rounded-[12px] text-xl";
  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- admin-provided logos can live on any host
      <img
        src={logoUrl}
        alt={`${name} logo`}
        className={cn(box, "shrink-0 bg-inset object-contain p-1.5")}
        loading="lazy"
      />
    );
  }
  return (
    <span
      aria-hidden
      className={cn(
        box,
        "grid shrink-0 place-items-center font-display font-extrabold text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.25)]",
      )}
      style={{ backgroundColor: accent || "#22d3ee" }}
    >
      {glyph || name.slice(0, 1).toUpperCase()}
    </span>
  );
}
