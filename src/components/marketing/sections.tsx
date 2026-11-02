import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import type { Plan } from "@prisma/client";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs, Container, Stars } from "@/components/ui/misc";
import { cn, formatDate, formatMoney, intervalLabels, intervalShort, parseFeatures } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
  children,
  aside,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs: { href: string; label: string }[];
  children?: React.ReactNode;
  /** Optional visual shown beside the text on large screens. */
  aside?: React.ReactNode;
  align?: "left" | "center";
}) {
  const centered = align === "center" && !aside;
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="bg-spotlight pointer-events-none absolute inset-0" aria-hidden />
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
      <Container className={cn("relative py-12 sm:py-16 lg:py-20", aside && "grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]")}>
        <div className={cn(centered && "mx-auto max-w-3xl text-center [&_nav_ol]:justify-center")}>
          <Breadcrumbs items={crumbs} />
          {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>}
          <h1 className={cn("max-w-3xl font-display text-[2.25rem] font-semibold leading-[1.1] tracking-tight text-text sm:text-5xl", centered && "mx-auto")}>
            {title}
          </h1>
          {description && <p className={cn("mt-5 max-w-2xl text-lg leading-relaxed text-muted", centered && "mx-auto")}>{description}</p>}
          {children && <div className="mt-8">{children}</div>}
        </div>
        {aside && <div className="hidden lg:block">{aside}</div>}
      </Container>
    </section>
  );
}

export function PlanCard({ plan, cta }: { plan: Plan; cta?: React.ReactNode }) {
  const features = parseFeatures(plan.features);
  const months = { MONTHLY: 1, QUARTERLY: 3, SEMIANNUAL: 6, YEARLY: 12, ONE_TIME: 0 }[plan.interval];
  const monthly = months > 1 ? Math.round(plan.priceCents / months) : null;
  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-lg border p-6 transition-colors sm:p-7",
        plan.highlighted
          ? "border-primary/60 bg-gradient-to-b from-[#12294a] to-card shadow-glow"
          : "border-border bg-card shadow-card hover:border-border-strong",
      )}
    >
      {plan.highlighted && (
        <Badge tone="blue" className="absolute -top-3 left-6 bg-bg">
          <Sparkles className="h-3 w-3" aria-hidden /> Recommended
        </Badge>
      )}
      <h3 className="font-display text-lg font-semibold text-text">{plan.name}</h3>
      <p className="mt-2 min-h-12 text-sm leading-relaxed text-muted">{plan.description}</p>
      <p className="mt-6 flex items-baseline gap-1">
        <span className="font-display text-4xl font-semibold tracking-tight text-text">
          {formatMoney(plan.priceCents, plan.currency)}
        </span>
        <span className="text-sm text-muted">{intervalShort[plan.interval]}</span>
      </p>
      <p className="mt-1 text-xs text-subtle">
        Billed {intervalLabels[plan.interval].toLowerCase()}
        {monthly && <> · {formatMoney(monthly, plan.currency)}/mo equivalent</>}
      </p>
      {features.length > 0 && (
        <ul className="mt-6 space-y-3 border-t border-border pt-6">
          {features.map((f) => (
            <li key={f} className="flex gap-3 text-sm text-text/90">
              <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-primary/15 text-accent">
                <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
              </span>
              {f}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-auto pt-7">
        {cta ?? (
          <ButtonLink
            href={`/create-account?plan=${plan.slug}`}
            variant={plan.highlighted ? "primary" : "secondary"}
            className="w-full"
          >
            Choose {plan.name}
          </ButtonLink>
        )}
      </div>
    </article>
  );
}

export function ReviewCard({
  review,
  author,
}: {
  review: { rating: number; title: string; body: string; isVerified: boolean; createdAt: Date };
  author: string;
}) {
  return (
    <article className="flex h-full flex-col rounded-card border border-border bg-card p-6 shadow-card">
      <div className="flex items-center justify-between gap-2">
        <Stars rating={review.rating} />
        {review.isVerified && <Badge tone="success">Verified customer</Badge>}
      </div>
      <h3 className="mt-4 font-display text-base font-semibold text-text">{review.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{review.body}</p>
      <p className="mt-5 border-t border-border pt-4 text-sm">
        <span className="font-medium text-text">{author}</span>
        <span className="text-muted"> · {formatDate(review.createdAt)}</span>
      </p>
    </article>
  );
}

export function CtaBand({
  title = "Ready to get started?",
  description = "Create your account in minutes and manage everything from one dashboard.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="py-20">
      <Container>
        <div className="relative overflow-hidden rounded-[22px] border border-primary/30 bg-gradient-to-br from-[#0f2542] via-card to-bg-secondary px-6 py-14 text-center sm:px-12">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-primary/25 blur-3xl" aria-hidden />
          <h2 className="relative font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl">{title}</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-muted">{description}</p>
          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/create-account" size="lg">
              Create account
            </ButtonLink>
            <ButtonLink href="/plans" variant="secondary" size="lg">
              Compare plans
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function RelatedLinks({ links }: { links: { href: string; label: string; description: string }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="group rounded-card border border-border bg-card p-5 transition-colors hover:border-accent/50"
        >
          <p className="font-medium text-text group-hover:text-light-blue">{l.label} →</p>
          <p className="mt-1 text-sm text-muted">{l.description}</p>
        </Link>
      ))}
    </div>
  );
}
