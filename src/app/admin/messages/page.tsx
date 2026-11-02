import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import { setContactStatus } from "@/actions/admin";
import { ActionForm } from "@/components/admin/action-form";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { EmptyState, Pagination } from "@/components/ui/misc";
import { db } from "@/lib/db";
import { oneOf, pageHref, pageParam, param } from "@/lib/params";
import { requireRole } from "@/lib/session";
import { cn, formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Messages" };
const PAGE_SIZE = 20;
const STATUSES = ["NEW", "READ", "ARCHIVED"] as const;

export default async function MessagesPage({ searchParams }: PageProps<"/admin/messages">) {
  await requireRole("SUPPORT");
  const sp = await searchParams;
  const status = oneOf(param(sp, "status"), STATUSES) ?? "NEW";
  const page = pageParam(sp);
  const [messages, total, counts] = await Promise.all([
    db.contactMessage.findMany({ where: { status }, orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    db.contactMessage.count({ where: { status } }),
    db.contactMessage.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);
  const countFor = (s: string) => counts.find((c) => c.status === s)?._count._all ?? 0;

  return (
    <>
      <PageHeader title="Messages" description="Submissions from the public contact form. Reply by email; customers with accounts can also be helped through tickets." />
      <nav className="mb-6 flex gap-2" aria-label="Message status">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/messages?status=${s}`}
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
      {messages.length === 0 ? (
        <EmptyState icon={Mail} title="No messages here" description="New contact form submissions will appear in this list." />
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <Card key={m.id}>
              <CardBody>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="blue">{m.topic}</Badge>
                      <StatusBadge status={m.status === "NEW" ? "OPEN" : m.status === "READ" ? "RESOLVED" : "CLOSED"} label={m.status.charAt(0) + m.status.slice(1).toLowerCase()} />
                      {m.userId && <Badge>Has account</Badge>}
                    </div>
                    <h2 className="mt-2 font-semibold text-text">{m.subject}</h2>
                    <p className="text-xs text-muted">
                      {m.name} ·{" "}
                      <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`} className="text-accent hover:text-light-blue">
                        {m.email}
                      </a>{" "}
                      · {formatDateTime(m.createdAt)}
                    </p>
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-text/90">{m.message}</p>
                <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                  {m.status !== "READ" && (
                    <ActionForm action={setContactStatus} inline submitLabel="Mark as read" submitVariant="secondary">
                      <input type="hidden" name="messageId" value={m.id} />
                      <input type="hidden" name="status" value="READ" />
                    </ActionForm>
                  )}
                  {m.status !== "ARCHIVED" && (
                    <ActionForm action={setContactStatus} inline submitLabel="Archive" submitVariant="ghost">
                      <input type="hidden" name="messageId" value={m.id} />
                      <input type="hidden" name="status" value="ARCHIVED" />
                    </ActionForm>
                  )}
                  {m.status !== "NEW" && (
                    <ActionForm action={setContactStatus} inline submitLabel="Mark as new" submitVariant="ghost">
                      <input type="hidden" name="messageId" value={m.id} />
                      <input type="hidden" name="status" value="NEW" />
                    </ActionForm>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
      <Pagination page={page} totalPages={Math.ceil(total / PAGE_SIZE)} total={total} pageSize={PAGE_SIZE} hrefFor={(p) => pageHref("/admin/messages", sp, p)} />
    </>
  );
}
