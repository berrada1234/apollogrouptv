import type { Metadata } from "next";
import Link from "next/link";
import { LifeBuoy, Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/misc";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Support Tickets" };

export default async function SupportPage() {
  const user = await requireUser("/dashboard/support");
  const tickets = await db.supportTicket.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    take: 100,
    include: { _count: { select: { messages: true } } },
  });

  return (
    <>
      <PageHeader
        title="Support Tickets"
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
    </>
  );
}
