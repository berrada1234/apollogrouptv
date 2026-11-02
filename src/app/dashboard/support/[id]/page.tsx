import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Notice } from "@/components/ui/misc";
import { TicketReplyForm } from "@/components/forms/support-forms";
import { TicketThread } from "@/components/ticket-thread";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Support Ticket" };

export default async function TicketPage({ params }: PageProps<"/dashboard/support/[id]">) {
  const { id } = await params;
  const user = await requireUser(`/dashboard/support/${id}`);
  // Scoped by userId so customers can only open their own tickets.
  const ticket = await db.supportTicket.findFirst({
    where: { id, userId: user.id },
    include: { messages: { orderBy: { createdAt: "asc" }, include: { author: { select: { name: true } } } } },
  });
  if (!ticket) notFound();

  return (
    <>
      <Link href="/dashboard/support" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-text">
        <ArrowLeft className="h-4 w-4" aria-hidden /> All tickets
      </Link>
      <PageHeader
        title={ticket.subject}
        description={`#${ticket.id.slice(-6).toUpperCase()} · Opened ${formatDateTime(ticket.createdAt)}`}
        actions={
          <>
            <StatusBadge status={ticket.priority} />
            <StatusBadge status={ticket.status} />
          </>
        }
      />
      <div className="max-w-3xl space-y-6">
        <TicketThread messages={ticket.messages} viewer="customer" />
        {ticket.status === "CLOSED" ? (
          <Notice title="This ticket is closed">Need more help? Open a new ticket and reference this one.</Notice>
        ) : (
          <Card>
            <CardHeader title="Reply" />
            <CardBody>
              <TicketReplyForm ticketId={ticket.id} />
            </CardBody>
          </Card>
        )}
      </div>
    </>
  );
}
