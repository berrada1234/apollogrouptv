import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Search, Tv, X } from "lucide-react";
import { Breadcrumbs, Container, EmptyState, Pagination } from "@/components/ui/misc";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { SportsSection } from "@/components/sports-section";
import { getChannelCategories, searchChannels } from "@/lib/queries";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Apollo Group TV Channel Guide — Search by Category" },
  description: "Search the Apollo Group TV channel guide by name or browse by category. The catalog lists only authorized, properly licensed content.",
  alternates: { canonical: "/channels" },
  openGraph: { title: "Apollo Group TV Channel Guide — Search by Category", description: "Search the Apollo Group TV channel guide by name or browse by category. The catalog lists only authorized, properly licensed content.", url: "/channels" },
};

const PAGE_SIZE = 24;

function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function ChannelsPage({ searchParams }: PageProps<"/channels">) {
  const sp = await searchParams;
  const q = first(sp.q)?.trim().slice(0, 80) || undefined;
  const category = first(sp.category)?.trim().slice(0, 80) || undefined;
  const page = Math.max(1, Math.min(500, Number.parseInt(first(sp.page) ?? "1", 10) || 1));

  const [categories, { channels, total, totalPages }] = await Promise.all([
    getChannelCategories(),
    searchChannels({ q, category, page, pageSize: PAGE_SIZE }),
  ]);
  const allCount = categories.reduce((n, c) => n + c._count.channels, 0);
  const activeCategory = categories.find((c) => c.slug === category);

  const hrefFor = (p: number, overrides: Record<string, string | undefined> = {}) => {
    const params = new URLSearchParams();
    const merged = { q, category, page: p > 1 ? String(p) : undefined, ...overrides };
    for (const [k, v] of Object.entries(merged)) if (v) params.set(k, v);
    const s = params.toString();
    return `/channels${s ? `?${s}` : ""}`;
  };

  const catLinks = [{ slug: undefined, name: "All channels", count: allCount }, ...categories.map((c) => ({ slug: c.slug, name: c.name, count: c._count.channels }))];

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="bg-spotlight pointer-events-none absolute inset-0" aria-hidden />
        <Container className="relative py-10 sm:py-14">
          <Breadcrumbs items={[{ href: "/channels", label: "Channels" }]} />
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-display text-[2.25rem] font-semibold leading-tight tracking-tight text-text sm:text-5xl">Apollo Group TV channel guide</h1>
              <p className="mt-3 max-w-xl text-muted">
                Search by channel name or pick a category. Counts reflect what&apos;s listed right now, and only authorized, properly licensed content
                appears here. Availability can change as rights agreements change.
              </p>
            </div>
            <form role="search" action="/channels" className="flex w-full gap-2 lg:max-w-md">
              {category && <input type="hidden" name="category" value={category} />}
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" aria-hidden />
                <label htmlFor="channel-search" className="sr-only">Search channels</label>
                <input
                  id="channel-search"
                  name="q"
                  type="search"
                  defaultValue={q}
                  maxLength={80}
                  placeholder="Search by channel name"
                  className="h-12 w-full rounded-xl border border-border-strong bg-card pl-10 pr-4 text-sm text-text shadow-sm placeholder:text-subtle focus:border-accent focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <button type="submit" className={buttonClasses({ size: "lg" })}>
                Search
              </button>
            </form>
          </div>
        </Container>
      </section>

      <section className="py-10 sm:py-14">
        <Container className="grid gap-8 lg:grid-cols-[220px_1fr] lg:gap-10 [&>*]:min-w-0">
          {/* Categories: chips on mobile, sidebar on desktop */}
          <nav aria-label="Categories" className="lg:sticky lg:top-24 lg:self-start">
            <p className="mb-3 hidden text-xs font-semibold uppercase tracking-[0.16em] text-subtle lg:block">Categories</p>
            <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0">
              {catLinks.map((c) => {
                const active = c.slug === category;
                return (
                  <li key={c.slug ?? "all"} className="shrink-0">
                    <Link
                      href={hrefFor(1, { category: c.slug, page: undefined })}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-full border px-3.5 py-1.5 text-sm transition-colors lg:rounded-lg lg:border-transparent lg:py-2",
                        active ? "border-primary bg-primary/15 text-light-blue lg:border-primary/30" : "border-border text-muted hover:text-text lg:hover:bg-card",
                      )}
                    >
                      {c.name}
                      <span className="text-xs tabular-nums opacity-70">{c.count}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted" aria-live="polite">
                <span className="font-medium text-text tabular-nums">{total}</span> {total === 1 ? "channel" : "channels"}
                {activeCategory && <> in {activeCategory.name}</>}
                {q && <> matching “<span className="text-text">{q}</span>”</>}
              </p>
              {(q || category) && (
                <Link href="/channels" className="inline-flex items-center gap-1 text-sm text-accent hover:text-light-blue">
                  <X className="h-3.5 w-3.5" aria-hidden /> Clear filters
                </Link>
              )}
            </div>

            {channels.length === 0 ? (
              <EmptyState
                icon={q ? Search : Tv}
                title={q || category ? "No channels found" : "The catalog is being prepared"}
                description={q || category ? "Try a different search term or category." : "Channel listings will appear here once published."}
                action={
                  (q || category) && (
                    <Link href="/channels" className={buttonClasses({ variant: "secondary" })}>
                      Clear filters
                    </Link>
                  )
                }
              />
            ) : (
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {channels.map((ch) => (
                  <li key={ch.id} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 shadow-card transition-colors hover:border-border-strong">
                    <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-inset">
                      {ch.logoUrl ? (
                        <Image src={ch.logoUrl} alt={`${ch.name} logo`} width={56} height={56} unoptimized={ch.logoUrl.startsWith("http")} className="h-full w-full object-contain p-1.5" />
                      ) : (
                        <span className="font-display text-sm font-semibold text-accent" aria-hidden>
                          {ch.name.replace(/[^A-Za-z0-9 ]/g, "").split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate font-medium text-text">{ch.name}</h2>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <Badge>{ch.category.name}</Badge>
                        {ch.isHd && <Badge tone="blue">HD</Badge>}
                        {ch.language && <span className="text-xs text-subtle">{ch.language}</span>}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <Pagination page={page} totalPages={totalPages} total={total} pageSize={PAGE_SIZE} hrefFor={(p) => hrefFor(p)} />
            <p className="mt-10 border-t border-border pt-6 text-sm text-muted">
              Want to know what each plan includes? See the <Link href="/plans" className="text-accent hover:text-light-blue">plans</Link>, read{" "}
              <Link href="/product" className="text-accent hover:text-light-blue">how the service works</Link>, or check the{" "}
              <Link href="/faq" className="text-accent hover:text-light-blue">FAQ</Link>.
            </p>
          </div>
        </Container>
      </section>
      <SportsSection />
    </>
  );
}
