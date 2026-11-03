import { Container } from "@/components/ui/misc";
import { Eyebrow } from "@/components/home/hero";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

// ─── Design-system primitives ───────────────────────────────────────────────
// One heading scale, one body measure, one header→content gap, one card style.

export const h2Class = "font-hero text-[1.75rem] font-medium leading-[1.12] tracking-[-0.035em] text-text sm:text-[2.25rem] lg:text-[2.75rem]";
export const leadClass = "text-base leading-7 text-muted sm:text-[17px] sm:leading-8";
/** Gap between a section header and the content it introduces. */
export const afterHeader = "mt-12 lg:mt-14";
export const cardClass = "glass rounded-[16px]";
export const cardHover = "card-glow transition-[border-color,transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-[rgb(122_162_255/0.3)] hover:shadow-lg";

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
    <div className={cn("reveal max-w-2xl", align === "center" && "mx-auto text-center")}>
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
        "icon-lift grid shrink-0 place-items-center rounded-[12px] border border-[rgb(122_162_255/0.25)] bg-[linear-gradient(140deg,rgb(70_224_255/0.16),rgb(157_123_255/0.12))] text-accent",
        size === "sm" ? "h-9 w-9" : "h-11 w-11",
      )}
    >
      <Icon className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} aria-hidden />
    </span>
  );
}
