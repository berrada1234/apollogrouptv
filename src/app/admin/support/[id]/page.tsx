import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { staffReply, updateTicket } from "@/actions/admin";
import { ActionForm } from "@/components/admin/action-form";
import { PageHeader } from "@/components/page-header";
import { TicketThread } from "@/components/ticket-thread";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Field, Select, Textarea } from "@/components/ui/form";
import { db } from "@/lib/db";
import { hasRole, requireRole } from "@/lib/session";
import { formatDateTime, humanize } from "@/lib/utils";

export const metadata: Metadata = { title: "Ticket" };

const STATUSES = [
  "OPEN",
  "IN_PROGRESS",
  "WAITING_ON_CUSTOMER",
  "RESOLVED",
  "CLOSED",
];

export default async function AdminTicketPage({
  params,
}: PageProps<"/admin/support/[id]">) {
  const actor = await requireRole("SUPPORT");
  const { id } = await params;
  const [ticket, staff] = await Promise.all([
    db.supportTicket.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        messages: {
          orderBy: { createdAt: "asc" },
          include: { author: { select: { name: true } } },
        },
      },
    }),
    db.user.findMany({
      where: { role: { in: ["SUPPORT", "ADMIN"] }, status: "ACTIVE" },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);
  if (!ticket) notFound();

  // Ticket history: every staff change and reply is written to the audit log with the change itself.
  const history = await db.auditLog.findMany({
    where: { targetType: "SupportTicket", targetId: ticket.id },
    orderBy: { createdAt: "asc" },
    include: { actor: { select: { name: true } } },
  });
  const staffName = new Map(staff.map((s) => [s.id, s.name]));
  const describe = (action: string, meta: unknown) => {
    const m = (meta ?? {}) as Record<
      string,
      { from?: string | null; to?: string | null }
    >;
    const parts: string[] = [];
    if (m.status?.to && m.status.from !== m.status.to)
      parts.push(
        `status ${humanize(m.status.from ?? "")} → ${humanize(m.status.to)}`,
      );
    if (m.priority?.to)
      parts.push(
        `priority ${humanize(m.priority.from ?? "")} → ${humanize(m.priority.to)}`,
      );
    if (m.assignee)
      parts.push(
        m.assignee.to
          ? `assigned to ${staffName.get(m.assignee.to) ?? "a staff member"}`
          : "unassigned",
      );
    const verb = action === "ticket.reply" ? "replied" : "updated the ticket";
    return parts.length ? `${verb} · ${parts.join(", ")}` : verb;
  };

  return (
    <>
      <Link
        href="/admin/support"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-text"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden /> All tickets
      </Link>
      <PageHeader
        title={ticket.subject}
        description={
          <>
            #{ticket.id.slice(-6).toUpperCase()} ·{" "}
            {hasRole(actor, "ADMIN") ? (
              <Link
                href={`/admin/users/${ticket.user.id}`}
                className="text-accent hover:text-light-blue"
              >
                {ticket.user.name}
              </Link>
            ) : (
              ticket.user.name
            )}{" "}
            ({ticket.user.email}) · Opened {formatDateTime(ticket.createdAt)}
            {ticket.resolvedAt &&
              ` · Resolved ${formatDateTime(ticket.resolvedAt)}`}
          </>
        }
        actions={
          <>
            <StatusBadge status={ticket.priority} />
            <StatusBadge status={ticket.status} />
          </>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <TicketThread messages={ticket.messages} viewer="staff" />
          <Card>
            <CardHeader
              title="Reply to customer"
              description="The customer is notified in their dashboard and by email."
            />
            <CardBody>
              <ActionForm
                action={staffReply}
                submitLabel="Send reply"
                resetOnSuccess
              >
                <input type="hidden" name="ticketId" value={ticket.id} />
                <Field label="Message" htmlFor="message">
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    maxLength={5000}
                  />
                </Field>
                <Field label="Set status to" htmlFor="reply-status">
                  <Select
                    id="reply-status"
                    name="status"
                    defaultValue="WAITING_ON_CUSTOMER"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {humanize(s)}
                      </option>
                    ))}
                  </Select>
                </Field>
              </ActionForm>
            </CardBody>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="h-fit">
            <CardHeader title="Ticket details" />
            <CardBody>
              <ActionForm
                action={updateTicket}
                submitLabel="Update ticket"
                submitVariant="secondary"
              >
                <input type="hidden" name="ticketId" value={ticket.id} />
                <Field label="Status" htmlFor="status">
                  <Select
                    id="status"
                    name="status"
                    defaultValue={ticket.status}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {humanize(s)}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Priority" htmlFor="priority">
                  <Select
                    id="priority"
                    name="priority"
                    defaultValue={ticket.priority}
                  >
                    {["LOW", "NORMAL", "HIGH", "URGENT"].map((p) => (
                      <option key={p} value={p}>
                        {humanize(p)}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Assignee" htmlFor="assigneeId">
                  <Select
                    id="assigneeId"
                    name="assigneeId"
                    defaultValue={ticket.assigneeId ?? ""}
                  >
                    <option value="">Unassigned</option>
                    {staff.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </Select>
                </Field>
              </ActionForm>
            </CardBody>
          </Card>
          <Card className="h-fit">
            <CardHeader title="History" />
            <CardBody>
              <ol className="space-y-4 border-l border-border pl-4 text-sm">
                <li className="relative">
                  <span
                    className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-accent"
                    aria-hidden
                  />
                  <p className="text-text">
                    {ticket.user.name} opened the ticket
                  </p>
                  <time
                    className="text-xs text-subtle"
                    dateTime={ticket.createdAt.toISOString()}
                  >
                    {formatDateTime(ticket.createdAt)}
                  </time>
                </li>
                {history.map((h) => (
                  <li key={h.id} className="relative">
                    <span
                      className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-border-strong"
                      aria-hidden
                    />
                    <p className="text-text">
                      <span className="font-medium">
                        {h.actor?.name ?? "System"}
                      </span>{" "}
                      <span className="text-muted">
                        {describe(h.action, h.metadata)}
                      </span>
                    </p>
                    <time
                      className="text-xs text-subtle"
                      dateTime={h.createdAt.toISOString()}
                    >
                      {formatDateTime(h.createdAt)}
                    </time>
                  </li>
                ))}
              </ol>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
