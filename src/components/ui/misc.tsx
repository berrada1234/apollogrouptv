import Link from "next/link";
import { ChevronLeft, ChevronRight, ChevronRight as Sep, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { absoluteUrl } from "@/lib/site";

export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)} {...props} />;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "center" | "left";
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>}
      <Tag className="font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl">{title}</Tag>
      {description && <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{description}</p>}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-card border border-dashed border-border-strong bg-inset/40 px-6 py-12 text-center", className)}>
      <span className="mb-4 grid h-12 w-12 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-accent">
        <Icon className="h-6 w-6" aria-hidden />
      </span>
      <h3 className="font-display text-base font-semibold text-text">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-card-hover", className)} aria-hidden />;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  href,
}: {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  hint?: React.ReactNode;
  href?: string;
}) {
  const body = (
    <>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-muted sm:text-sm">{label}</p>
        <span className="hidden h-9 w-9 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-accent sm:grid">
          <Icon className="h-[18px] w-[18px]" aria-hidden />
        </span>
      </div>
      <div className="mt-2 font-display text-xl font-semibold tracking-tight text-text tabular-nums sm:mt-3 sm:text-2xl">{value}</div>
      {hint && <p className="mt-1.5 text-xs text-subtle">{hint}</p>}
    </>
  );
  const cls = "block rounded-card border border-border bg-card p-4 shadow-card sm:p-5";
  return href ? (
    <Link href={href} className={cn(cls, "transition-colors hover:border-border-strong hover:bg-card-hover")}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

export function Breadcrumbs({ items }: { items: { href: string; label: string }[] }) {
  const all = [{ href: "/", label: "Home" }, ...items];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 text-muted">
        {all.map((item, i) => (
          <li key={item.href} className="flex items-center gap-1.5">
            {i > 0 && <Sep className="h-3.5 w-3.5 opacity-60" aria-hidden />}
            {i === all.length - 1 ? (
              <span aria-current="page" className="text-light-blue">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="hover:text-text">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </nav>
  );
}

/** Page numbers with ellipses: 1 … 4 5 6 … 20 */
export function pageWindow(page: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, page - 1, page, page + 1].filter((p) => p >= 1 && p <= total));
  const sorted = [...set].sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("…");
    out.push(p);
  });
  return out;
}

export function Pagination({
  page,
  totalPages,
  hrefFor,
  total,
  pageSize,
}: {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
  total?: number;
  pageSize?: number;
}) {
  if (totalPages <= 1) {
    return total != null && total > 0 ? <p className="mt-4 text-sm text-muted">Showing all {total}</p> : null;
  }
  const item = "inline-flex h-9 min-w-9 items-center justify-center gap-1 rounded-lg border px-2.5 text-sm transition-colors";
  const idle = "border-border text-muted hover:border-accent/50 hover:text-text";
  const disabled = "pointer-events-none border-border/50 text-subtle/50";
  return (
    <nav aria-label="Pagination" className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
      {total != null && pageSize ? (
        <p className="text-sm text-muted">
          Showing <span className="text-text">{(page - 1) * pageSize + 1}</span>–
          <span className="text-text">{Math.min(page * pageSize, total)}</span> of <span className="text-text">{total}</span>
        </p>
      ) : (
        <p className="text-sm text-muted">
          Page {page} of {totalPages}
        </p>
      )}
      <ul className="flex items-center gap-1">
        <li>
          <Link href={hrefFor(page - 1)} rel="prev" aria-disabled={page <= 1} tabIndex={page <= 1 ? -1 : undefined} className={cn(item, page <= 1 ? disabled : idle)}>
            <ChevronLeft className="h-4 w-4" aria-hidden />
            <span className="sr-only sm:not-sr-only">Prev</span>
          </Link>
        </li>
        {pageWindow(page, totalPages).map((p, i) =>
          p === "…" ? (
            <li key={`gap-${i}`} className="px-1 text-sm text-subtle" aria-hidden>
              …
            </li>
          ) : (
            <li key={p} className={cn(Math.abs(p - page) > 1 && p !== 1 && p !== totalPages && "hidden sm:block")}>
              <Link
                href={hrefFor(p)}
                aria-current={p === page ? "page" : undefined}
                className={cn(item, p === page ? "border-primary bg-primary/15 font-medium text-light-blue" : idle)}
              >
                {p}
              </Link>
            </li>
          ),
        )}
        <li>
          <Link href={hrefFor(page + 1)} rel="next" aria-disabled={page >= totalPages} tabIndex={page >= totalPages ? -1 : undefined} className={cn(item, page >= totalPages ? disabled : idle)}>
            <span className="sr-only sm:not-sr-only">Next</span>
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export function Notice({ tone = "info", title, children }: { tone?: "info" | "warning"; title: string; children?: React.ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-card border px-4 py-3.5 text-sm",
        tone === "warning" ? "border-warning/40 bg-warning/10 text-warning" : "border-primary/40 bg-primary/10 text-light-blue",
      )}
    >
      <p className="font-semibold">{title}</p>
      {children && <div className="mt-1 text-text/80">{children}</div>}
    </div>
  );
}

export function Stars({ rating, size = "h-4 w-4" }: { rating: number; size?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} viewBox="0 0 20 20" className={cn(size, i <= rating ? "fill-accent" : "fill-border-strong")} aria-hidden>
          <path d="M10 1.5l2.6 5.3 5.9.9-4.25 4.1 1 5.85L10 14.9l-5.25 2.75 1-5.85L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}
