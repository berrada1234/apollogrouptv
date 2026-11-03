"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

type Entry = { title: string; href: string; kind: string; summary?: string; keywords?: string };

/** Instant search across the Help Center index (guides, articles, FAQ answers and key pages). */
export function HelpSearch({ entries }: { entries: Entry[] }) {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter((w) => w.length > 1);
    if (!words.length) return [];
    return entries
      .map((e) => {
        const title = e.title.toLowerCase();
        const text = `${title} ${e.summary ?? ""} ${e.keywords ?? ""}`.toLowerCase();
        if (!words.every((w) => text.includes(w))) return null;
        return { e, score: words.filter((w) => title.includes(w)).length };
      })
      .filter((x) => x !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((x) => x.e);
  }, [q, entries]);

  return (
    <div className="relative max-w-2xl">
      <label htmlFor="help-search" className="sr-only">
        Search the Help Center
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-subtle" aria-hidden />
        <input
          id="help-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search for help, e.g. buffering, M3U, Cash App, refund"
          autoComplete="off"
          className="h-14 w-full rounded-2xl border border-border-strong bg-card pl-12 pr-4 text-base text-text placeholder:text-subtle focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
          aria-describedby="help-search-status"
        />
      </div>
      <p id="help-search-status" className="sr-only" aria-live="polite">
        {q.trim().length > 1 ? `${results.length} results` : ""}
      </p>
      {q.trim().length > 1 && (
        <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          {results.length === 0 ? (
            <p className="px-5 py-4 text-sm text-muted">
              No matches. Try a different word, browse the topics below, or{" "}
              <Link href="/contact" className="text-accent hover:text-light-blue">
                contact support
              </Link>
              .
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {results.map((r) => (
                <li key={`${r.href}|${r.title}`}>
                  <Link href={r.href} className="group flex items-start gap-3 px-5 py-3.5 hover:bg-card-hover">
                    <span className="mt-0.5 shrink-0 rounded-full border border-border px-2 py-0.5 text-[11px] font-medium text-subtle">{r.kind}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium text-text group-hover:text-light-blue">{r.title}</span>
                      {r.summary && <span className="mt-0.5 line-clamp-1 block text-sm text-muted">{r.summary}</span>}
                    </span>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-subtle group-hover:text-accent" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
