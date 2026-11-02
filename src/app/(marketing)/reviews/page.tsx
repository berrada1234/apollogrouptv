import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquareText, ShieldCheck } from "lucide-react";
import { Container, EmptyState, Pagination, Stars } from "@/components/ui/misc";
import { ButtonLink } from "@/components/ui/button";
import { PageHero, ReviewCard } from "@/components/marketing/sections";
import { ReviewForm } from "@/components/forms/review-form";
import { displayName, getApprovedReviews, getRatingDistribution } from "@/lib/queries";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Apollo Group TV Reviews — Moderated Customer Feedback" },
  description: "Read moderated Apollo Group TV reviews from registered customers, see how verification works, and share your own experience.",
  alternates: { canonical: "/reviews" },
  openGraph: { title: "Apollo Group TV Reviews — Moderated Customer Feedback", description: "Read moderated Apollo Group TV reviews from registered customers, see how verification works, and share your own experience.", url: "/reviews" },
};

const PAGE_SIZE = 12;

export default async function ReviewsPage({ searchParams }: PageProps<"/reviews">) {
  const sp = await searchParams;
  const page = Math.max(1, Number.parseInt(String(sp.page ?? "1"), 10) || 1);
  const [{ reviews, total, average }, distribution, user] = await Promise.all([
    getApprovedReviews({ take: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE }),
    getRatingDistribution(),
    getCurrentUser(),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const max = Math.max(1, ...distribution.map((d) => d.count));

  return (
    <>
      <PageHero
        eyebrow="Reviews"
        title="Apollo Group TV reviews"
        description="Feedback from registered customers, published after moderation. Below is exactly how we collect, check and display it."
        crumbs={[{ href: "/reviews", label: "Reviews" }]}
      />

      <section className="border-b border-border py-12" aria-labelledby="how-reviews">
        <Container>
          <h2 id="how-reviews" className="font-display text-xl font-semibold text-text">How reviews work here</h2>
          <ul className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              { t: "Registered accounts only", b: "You need a signed-in account to submit a review, and each account can have one review awaiting moderation at a time." },
              { t: "Moderated before publishing", b: "We publish genuine experiences, positive or negative. We remove spam, abuse, personal data and off-topic posts — not criticism." },
              { t: "“Verified” means a subscription", b: "The verified label appears only when the reviewer has a subscription on record. Ratings and averages come from published reviews only." },
            ].map((x) => (
              <li key={x.t} className="rounded-lg border border-border bg-card p-5 shadow-card">
                <p className="font-semibold text-text">{x.t}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{x.b}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted">
            Curious before reviewing? Read <Link href="/product" className="text-accent hover:text-light-blue">how the service works</Link> or{" "}
            <Link href="/plans" className="text-accent hover:text-light-blue">compare plans</Link>.
          </p>
        </Container>
      </section>

      <section className="py-14 sm:py-16">
        <Container className="grid gap-10 lg:grid-cols-[340px_1fr] lg:gap-12">
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-border bg-card p-6 shadow-card">
              <h2 className="text-sm font-medium text-muted">Overall rating</h2>
              {total > 0 && average != null ? (
                <>
                  <p className="mt-2 flex items-end gap-2">
                    <span className="font-display text-5xl font-semibold tracking-tight text-text tabular-nums">{average.toFixed(1)}</span>
                    <span className="pb-1.5 text-sm text-muted">/ 5</span>
                  </p>
                  <Stars rating={Math.round(average)} size="h-5 w-5" />
                  <p className="mt-1 text-sm text-subtle">
                    Based on {total} {total === 1 ? "review" : "reviews"}
                  </p>
                </>
              ) : (
                <p className="mt-2 text-sm text-muted">No ratings yet.</p>
              )}
              <dl className="mt-6 space-y-2">
                {distribution.map((d) => (
                  <div key={d.stars} className="flex items-center gap-3 text-sm">
                    <dt className="w-12 shrink-0 text-muted">{d.stars} star</dt>
                    <dd className="flex flex-1 items-center gap-3">
                      <span className="h-2 flex-1 overflow-hidden rounded-full bg-inset">
                        <span className="block h-full rounded-full bg-accent" style={{ width: `${(d.count / max) * 100}%` }} />
                      </span>
                      <span className="w-6 text-right text-xs text-subtle tabular-nums">{d.count}</span>
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 flex gap-2 border-t border-border pt-5 text-xs leading-relaxed text-subtle">
                <ShieldCheck className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                “Verified customer” means the reviewer has a subscription on record.
              </p>
            </div>

            <div id="write" className="scroll-mt-24 rounded-lg border border-border bg-card p-6 shadow-card">
              <h2 className="font-display text-base font-semibold text-text">Write a review</h2>
              <p className="mt-1 text-sm text-muted">Checked by our team before publishing.</p>
              <div className="mt-5">
                {user ? (
                  <ReviewForm />
                ) : (
                  <ButtonLink href="/sign-in?next=/reviews%23write" className="w-full">
                    Sign in to write a review
                  </ButtonLink>
                )}
              </div>
            </div>
          </aside>

          <div>
            {reviews.length > 0 ? (
              <>
                <div className="columns-1 gap-5 md:columns-2 [&>*]:mb-5 [&>*]:break-inside-avoid">
                  {reviews.map((r) => (
                    <ReviewCard key={r.id} review={r} author={displayName(r.user.name)} />
                  ))}
                </div>
                <Pagination page={page} totalPages={totalPages} total={total} pageSize={PAGE_SIZE} hrefFor={(p) => (p > 1 ? `/reviews?page=${p}` : "/reviews")} />
              </>
            ) : (
              <EmptyState
                icon={MessageSquareText}
                title="No reviews yet"
                description="Reviews appear here once customers share them and they pass moderation."
                className="h-full min-h-72"
              />
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
