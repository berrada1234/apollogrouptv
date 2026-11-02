import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { DataTable, EmptyRow, FilterBar, Td } from "@/components/admin/table";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/ui/badge";
import { Input, Label, Select } from "@/components/ui/form";
import { Pagination } from "@/components/ui/misc";
import { db } from "@/lib/db";
import { oneOf, pageHref, pageParam, param } from "@/lib/params";
import { requireRole } from "@/lib/session";
import { formatDateTime, humanize } from "@/lib/utils";

export const metadata: Metadata = { title: "Support" };
const PAGE_SIZE = 25;
const STATUSES = ["OPEN", "IN_PROGRESS", "WAITING_ON_CUSTOMER", "RESOLVED", "CLOSED"] as const;

export default async function AdminSupportPage({ searchParams }: PageProps<"/admin/support">) {
  const actor = await requireRole("SUPPORT");
  const sp = await searchParams;
  const status = oneOf(param(sp, "status"), STATUSES);
  const assigned = param(sp, "assigned");
  const q = param(sp, "q");
  const page = pageParam(sp);
  const where: Prisma.SupportTicketWhereInput = {
    ...(status ? { status } : { status: { notIn: ["CLOSED"] } }),
    ...(assigned === "me" ? { assigneeId: actor.id } : assigned === "none" ? { assigneeId: null } : {}),
    ...(q ? { OR: [{ subject: { contains: q } }, { user: { email: { contains: q } } }] } : {}),
  };
  const [tickets, total] = await Promise.all([
    db.supportTicket.findMany({
      where,
      orderBy: [{ updatedAt: "desc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { user: { select: { name: true, email: true } }, assignee: { select: { name: true } }, _count: { select: { messages: true } } },
    }),
    db.supportTicket.count({ where }),
  ]);

  return (
    <>
      <PageHeader title="Support tickets" description={`${total} tickets${status ? "" : " (closed tickets hidden unless filtered)"}`} />
      <FilterBar>
        <div className="flex-1">
          <Label htmlFor="q">Search</Label>
          <Input id="q" name="q" defaultValue={q} placeholder="Subject or customer email" />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select id="status" name="status" defaultValue={status ?? ""}>
            <option value="">All open</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{humanize(s)}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="assigned">Assignee</Label>
          <Select id="assigned" name="assigned" defaultValue={assigned ?? ""}>
            <option value="">Anyone</option>
            <option value="me">Assigned to me</option>
            <option value="none">Unassigned</option>
          </Select>
        </div>
      </FilterBar>
      <DataTable head={["Subject", "Customer", "Priority", "Status", "Assignee", "Updated"]}>
        {tickets.length === 0 ? (
          <EmptyRow colSpan={6}>No tickets match these filters.</EmptyRow>
        ) : (
          tickets.map((t) => (
            <tr key={t.id} className="hover:bg-card-hover">
              <Td>
                <Link href={`/admin/support/${t.id}`} className="font-medium text-text hover:text-light-blue">{t.subject}</Link>
                <span className="block text-xs text-muted">#{t.id.slice(-6).toUpperCase()} · {t._count.messages} messages</span>
              </Td>
              <Td>
                <span className="text-text">{t.user.name}</span>
                <span className="block text-xs text-muted">{t.user.email}</span>
              </Td>
              <Td><StatusBadge status={t.priority} /></Td>
              <Td><StatusBadge status={t.status} /></Td>
              <Td className="text-muted">{t.assignee?.name ?? "Unassigned"}</Td>
              <Td className="text-muted">{formatDateTime(t.updatedAt)}</Td>
            </tr>
          ))
        )}
      </DataTable>
      <Pagination page={page} totalPages={Math.ceil(total / PAGE_SIZE)} total={total} pageSize={PAGE_SIZE} hrefFor={(p) => pageHref("/admin/support", sp, p)} />
    </>
  );
}
