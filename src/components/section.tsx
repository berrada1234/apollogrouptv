import { Container } from "@/components/ui/misc";
import { Eyebrow } from "@/components/home/hero";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

// ─── Design-system primitives ───────────────────────────────────────────────
// One heading scale, one body measure, one header→content gap, one card style.

export const h2Class = "font-display text-[1.875rem] font-bold leading-[1.15] tracking-[-0.02em] text-text sm:text-4xl lg:text-[2.625rem]";
export const leadClass = "text-base leading-7 text-muted sm:text-[17px] sm:leading-8";
/** Gap between a section header and the content it introduces. */
export const afterHeader = "mt-10 lg:mt-12";
export const cardClass = "rounded-[14px] border border-border bg-card shadow-card";
export const cardHover = "transition-[border-color,background-color,transform] duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:bg-card-hover";

export function Section({ compact, className, children }: { compact?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <section className={cn("relative", compact ? "section-y-sm" : "section-y", className)}>
      <Container className="relative">{children}</Container>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  action,
}: {
  eyebrow: string;
  title: string;
  description?: React.ReactNode;
  align?: "left" | "center";
  /** Shown to the right of a left-aligned header on large screens. */
  action?: React.ReactNode;
}) {
  const text = (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className={cn(h2Class, "mt-3")}>{title}</h2>
      {description && <p className={cn(leadClass, "mt-4")}>{description}</p>}
    </div>
  );
  if (!action) return text;
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      {text}
      <div className="flex shrink-0 flex-wrap gap-3">{action}</div>
    </div>
  );
}

export function IconBox({ icon: Icon, size = "md" }: { icon: LucideIcon; size?: "sm" | "md" }) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-[10px] border border-primary/20 bg-primary/10 text-accent",
        size === "sm" ? "h-9 w-9" : "h-11 w-11",
      )}
    >
      <Icon className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} aria-hidden />
    </span>
  );
}
