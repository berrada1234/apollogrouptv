import Link from "next/link";
import { ArrowRight, ChevronRight, Clock, Globe2 } from "lucide-react";
import type { PaymentGuide } from "@/content/payment-guides";
import { cn } from "@/lib/utils";

/** Icon tile used on guide cards and guide headers. */
export function GuideGlyph({ guide, size = "md" }: { guide: Pick<PaymentGuide, "glyph" | "accent">; size?: "md" | "lg" }) {
  return (
    <span
      aria-hidden
      className={cn("grid shrink-0 place-items-center rounded-[14px] border", size === "lg" ? "h-16 w-16 text-3xl" : "h-12 w-12 text-2xl")}
      style={{ backgroundColor: `${guide.accent}1f`, borderColor: `${guide.accent}55` }}
    >
      {guide.glyph}
    </span>
  );
}

export function GuideMeta({ guide, className }: { guide: Pick<PaymentGuide, "minutes" | "region">; className?: string }) {
  return (
    <span className={cn("inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-subtle", className)}>
      <span className="inline-flex items-center gap-1">
        <Clock className="h-3.5 w-3.5" aria-hidden /> ~{guide.minutes} minutes
      </span>
      <span className="inline-flex items-center gap-1">
        <Globe2 className="h-3.5 w-3.5" aria-hidden /> {guide.region}
      </span>
    </span>
  );
}

export function GuideCard({ guide }: { guide: PaymentGuide }) {
  return (
    <Link
      href={`/payment-guides/${guide.slug}`}
      className="group flex h-full flex-col rounded-[16px] border border-border bg-card p-5 shadow-card transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/40"
    >
      <div className="flex items-center gap-3.5">
        <GuideGlyph guide={guide} />
        <div className="min-w-0">
          <p className="font-display text-base font-bold text-text">{guide.name}</p>
          <GuideMeta guide={guide} />
        </div>
      </div>
      <p className="mt-3 flex-1 text-sm leading-6 text-muted">{guide.summary}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent group-hover:text-light-blue">
        Read the guide <ArrowRight className="h-4 w-4" aria-hidden />
      </span>
    </Link>
  );
}

/** The route the money takes, as a simple diagram (the guide's "image"). */
export function PaymentFlow({ guide }: { guide: PaymentGuide }) {
  return (
    <figure className="rounded-[16px] border border-border bg-card p-5 shadow-card" aria-label={`How paying with ${guide.name} works: ${guide.flow.join(", then ")}`}>
      <ol className="grid gap-3 sm:grid-cols-4">
        {guide.flow.map((label, i) => (
          <li key={label} className="relative flex items-center gap-3 sm:flex-col sm:text-center">
            <span
              className={cn(
                "grid h-10 w-10 shrink-0 place-items-center rounded-full border font-display text-sm font-bold",
                i === guide.flow.length - 1 ? "border-success/50 bg-success/15 text-success" : "border-primary/40 bg-primary/10 text-accent",
              )}
            >
              {i + 1}
            </span>
            <span className="text-sm font-medium text-text">{label}</span>
            {i < guide.flow.length - 1 && <ChevronRight className="absolute -right-2.5 top-2.5 hidden h-5 w-5 text-subtle sm:block" aria-hidden />}
          </li>
        ))}
      </ol>
      <figcaption className="mt-4 border-t border-border pt-3 text-xs text-subtle">How your {guide.name} payment reaches Apollo Group TV.</figcaption>
    </figure>
  );
}
