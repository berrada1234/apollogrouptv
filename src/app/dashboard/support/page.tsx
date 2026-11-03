import type { Metadata } from "next";
import Link from "next/link";
import { LifeBuoy, Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState, Pagination } from "@/components/ui/misc";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Support" };

const PAGE_SIZE = 15;

export default async function SupportPage({ searchParams }: PageProps<"/dashboard/support">) {
  const user = await requireUser("/dashboard/support");
  const sp = await searchParams;
  const page = Math.max(1, Number.parseInt(String(sp.page ?? "1"), 10) || 1);
  const [tickets, total] = await Promise.all([
    db.supportTicket.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { _count: { select: { messages: true } } },
    }),
    db.supportTicket.count({ where: { userId: user.id } }),
  ]);

  return (
    <>
      <PageHeader
        title="Support"
        description="Open a request and follow every reply in one place."
        actions={
          <ButtonLink href="/dashboard/support/new">
            <Plus className="h-4 w-4" aria-hidden /> New ticket
          </ButtonLink>
        }
      />
      {tickets.length === 0 ? (
        <EmptyState
          icon={LifeBuoy}
          title="No tickets yet"
          description="When you need help, open a ticket and our team will reply here."
          action={<ButtonLink href="/dashboard/support/new">Open your first ticket</ButtonLink>}
        />
      ) : (
        <Card className="divide-y divide-border">
          {tickets.map((t) => (
            <Link
              key={t.id}
              href={`/dashboard/support/${t.id}`}
              className="flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-card-hover sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-text">{t.subject}</p>
                <p className="mt-0.5 text-xs text-muted">
                  #{t.id.slice(-6).toUpperCase()} · {t._count.messages} messages · Updated {formatDateTime(t.updatedAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={t.priority} />
                <StatusBadge status={t.status} />
              </div>
            </Link>
          ))}
        </Card>
      )}
      <Pagination page={page} totalPages={Math.ceil(total / PAGE_SIZE)} total={total} pageSize={PAGE_SIZE} hrefFor={(p) => `/dashboard/support?page=${p}`} />
    </>
  );
}
