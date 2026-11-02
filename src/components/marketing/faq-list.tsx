"use client";

import { useId, useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/misc";
import { RichText, stripRich } from "@/components/rich-text";

type Faq = { id: string; category: string; question: string; answer: string };

export function FaqAccordion({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const baseId = useId();
  return (
    <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card shadow-card">
      {items.map((item) => {
        const expanded = open === item.id;
        const panelId = `${baseId}-${item.id}`;
        const buttonId = `${panelId}-btn`;
        return (
          <div key={item.id} className={cn("transition-colors", expanded && "bg-card-hover/50")}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpen(expanded ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-medium text-text transition-colors hover:text-light-blue sm:px-6 sm:py-5"
              >
                {item.question}
                <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-colors", expanded ? "border-primary/40 bg-primary/10 text-accent" : "border-border text-subtle")}>
                  <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", expanded && "rotate-180")} aria-hidden />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!expanded}
              className="px-5 pb-5 text-sm leading-relaxed whitespace-pre-line text-muted sm:px-6"
            >
              <RichText text={item.answer} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export type FaqTopic = { name: string; slug: string; blurb?: string };

export function FaqExplorer({ items, aside, topics = [] }: { items: Faq[]; aside?: React.ReactNode; /** Fixes topic order and adds anchors + a one-line intro per topic. */ topics?: readonly FaqTopic[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const order = useMemo(() => {
    const known = topics.map((t) => t.name);
    const extra = Array.from(new Set(items.map((i) => i.category))).filter((c) => !known.includes(c));
    return [...known.filter((c) => items.some((i) => i.category === c)), ...extra];
  }, [items, topics]);
  const categories = useMemo(() => ["All", ...order], [order]);
  const topicFor = (name: string) => topics.find((t) => t.name === name);
  const countFor = (c: string) => (c === "All" ? items.length : items.filter((i) => i.category === c).length);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (i) => (category === "All" || i.category === category) && (!q || i.question.toLowerCase().includes(q) || stripRich(i.answer).toLowerCase().includes(q)),
    );
  }, [items, query, category]);

  const grouped = useMemo(() => {
    const map = new Map<string, Faq[]>();
    for (const i of filtered) map.set(i.category, [...(map.get(i.category) ?? []), i]);
    return order.filter((c) => map.has(c)).map((c) => [c, map.get(c)!] as const);
  }, [filtered, order]);

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-12 [&>*]:min-w-0">
      <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" aria-hidden />
          <label htmlFor="faq-search" className="sr-only">
            Search questions
          </label>
          <input
            id="faq-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions"
            className="h-12 w-full rounded-xl border border-border-strong bg-card pl-10 pr-4 text-sm text-text shadow-sm placeholder:text-subtle focus:border-accent focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div role="group" aria-label="Filter by category">
          <p className="mb-2 hidden text-xs font-semibold uppercase tracking-[0.16em] text-subtle lg:block">Topics</p>
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
                className={cn(
                  "flex shrink-0 items-center justify-between gap-3 rounded-full border px-3.5 py-1.5 text-left text-sm transition-colors lg:rounded-lg lg:border-transparent lg:py-2",
                  category === c ? "border-primary bg-primary/15 text-light-blue lg:border-primary/30" : "border-border text-muted hover:text-text lg:hover:bg-card",
                )}
              >
                {c}
                <span className="text-xs tabular-nums opacity-70">{countFor(c)}</span>
              </button>
            ))}
          </div>
        </div>
        {aside && <div className="hidden lg:block">{aside}</div>}
      </div>

      <div>
        <p className="sr-only" aria-live="polite">
          {filtered.length} questions shown
        </p>
        <div className="space-y-12">
          {grouped.length === 0 ? (
            <EmptyState icon={Search} title="No matching questions" description="Try a different search term or topic." />
          ) : (
            grouped.map(([cat, list]) => (
              <section key={cat} id={topicFor(cat)?.slug} aria-labelledby={`faq-${topicFor(cat)?.slug ?? cat}`} className="scroll-mt-24">
                <div className="mb-4">
                  <h2 id={`faq-${topicFor(cat)?.slug ?? cat}`} className="font-display text-xl font-bold text-text sm:text-2xl">
                    {cat}
                  </h2>
                  {topicFor(cat)?.blurb && <p className="mt-1 text-sm text-muted">{topicFor(cat)?.blurb}</p>}
                </div>
                <FaqAccordion items={list} />
              </section>
            ))
          )}
        </div>
        {aside && <div className="mt-10 lg:hidden">{aside}</div>}
      </div>
    </div>
  );
}
