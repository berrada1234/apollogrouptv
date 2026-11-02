import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquareText } from "lucide-react";
import { moderateReview, setReviewVerified } from "@/actions/admin";
import { ActionForm } from "@/components/admin/action-form";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { EmptyState, Pagination, Stars } from "@/components/ui/misc";
import { db } from "@/lib/db";
import { oneOf, pageHref, pageParam, param } from "@/lib/params";
import { requireRole } from "@/lib/session";
import { cn, formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Reviews" };
const PAGE_SIZE = 20;
const STATUSES = ["PENDING", "APPROVED", "REJECTED"] as const;

export default async function AdminReviewsPage({ searchParams }: PageProps<"/admin/reviews">) {
  await requireRole("SUPPORT");
  const sp = await searchParams;
  const status = oneOf(param(sp, "status"), STATUSES) ?? "PENDING";
  const page = pageParam(sp);
  const [reviews, total, counts] = await Promise.all([
    db.review.findMany({
      where: { status },
      orderBy: { createdAt: status === "PENDING" ? "asc" : "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { user: { select: { name: true, email: true, _count: { select: { subscriptions: true } } } } },
    }),
    db.review.count({ where: { status } }),
    db.review.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);
  const countFor = (s: string) => counts.find((c) => c.status === s)?._count._all ?? 0;

  return (
    <>
      <PageHeader title="Reviews" description="Approve genuine reviews; reject spam, abuse or off-topic content." />
      <nav className="mb-6 flex gap-2" aria-label="Review status">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/reviews?status=${s}`}
            aria-current={status === s ? "page" : undefined}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm",
              status === s ? "border-primary bg-primary/15 text-light-blue" : "border-border text-muted hover:text-text",
            )}
          >
            {s.charAt(0) + s.slice(1).toLowerCase()} ({countFor(s)})
          </Link>
        ))}
      </nav>
      {reviews.length === 0 ? (
        <EmptyState icon={MessageSquareText} title="Nothing here" description="No reviews with this status." />
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <Card key={r.id}>
              <CardBody>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Stars rating={r.rating} />
                      <StatusBadge status={r.status} />
                      {r.isVerified && <Badge tone="success">Verified</Badge>}
                    </div>
                    <h2 className="mt-2 font-semibold text-text">{r.title}</h2>
                    <p className="text-xs text-muted">
                      {r.user.name} · {r.user.email} · {r.user._count.subscriptions} subscriptions · {formatDateTime(r.createdAt)}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap text-text/90">{r.body}</p>
                <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                  {r.status !== "APPROVED" && (
                    <ActionForm action={moderateReview} inline submitLabel="Approve">
                      <input type="hidden" name="reviewId" value={r.id} />
                      <input type="hidden" name="decision" value="APPROVED" />
                    </ActionForm>
                  )}
                  {r.status !== "REJECTED" && (
                    <ActionForm
                      action={moderateReview}
                      inline
                      submitLabel="Reject"
                      submitVariant="danger"
                      confirm={{ title: "Reject this review?", description: "It won’t be shown on the website. You can approve it later from the Rejected tab." }}
                    >
                      <input type="hidden" name="reviewId" value={r.id} />
                      <input type="hidden" name="decision" value="REJECTED" />
                    </ActionForm>
                  )}
                  <ActionForm action={setReviewVerified} inline submitLabel={r.isVerified ? "Remove verified" : "Mark verified"} submitVariant="secondary">
                    <input type="hidden" name="reviewId" value={r.id} />
                    <input type="hidden" name="verified" value={r.isVerified ? "false" : "true"} />
                  </ActionForm>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
      <Pagination page={page} totalPages={Math.ceil(total / PAGE_SIZE)} total={total} pageSize={PAGE_SIZE} hrefFor={(p) => pageHref("/admin/reviews", sp, p)} />
    </>
  );
}
