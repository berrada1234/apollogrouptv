import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { PageHeader } from "@/components/page-header";
import { DataTable, EmptyRow, FilterBar, Td } from "@/components/admin/table";
import { StatusBadge } from "@/components/ui/badge";
import { Input, Label, Select } from "@/components/ui/form";
import { Pagination } from "@/components/ui/misc";
import { db } from "@/lib/db";
import { oneOf, pageHref, pageParam, param } from "@/lib/params";
import { requireRole } from "@/lib/session";
import { daysFromNow, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Subscriptions" };
const PAGE_SIZE = 25;
const STATUSES = ["PENDING", "ACTIVE", "PAST_DUE", "CANCELED", "EXPIRED"] as const;

export default async function AdminSubscriptionsPage({ searchParams }: PageProps<"/admin/subscriptions">) {
  await requireRole("ADMIN");
  const sp = await searchParams;
  const status = oneOf(param(sp, "status"), STATUSES);
  const q = param(sp, "q");
  const page = pageParam(sp);
  const where: Prisma.SubscriptionWhereInput = {
    ...(status ? { status } : {}),
    ...(q ? { user: { OR: [{ email: { contains: q } }, { name: { contains: q } }] } } : {}),
  };
  const now = daysFromNow(0);
  const soon = daysFromNow(7);
  const [subs, total, renewingSoon] = await Promise.all([
    db.subscription.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { user: { select: { id: true, name: true, email: true } }, plan: { select: { name: true } } },
    }),
    db.subscription.count({ where }),
    db.subscription.count({ where: { status: "ACTIVE", currentPeriodEnd: { lte: soon, gte: now } } }),
  ]);

  return (
    <>
      <PageHeader title="Subscriptions" description={`${total} subscriptions · ${renewingSoon} active ones end or renew within 7 days`} />
      <FilterBar>
        <div className="flex-1">
          <Label htmlFor="q">Customer</Label>
          <Input id="q" name="q" defaultValue={q} placeholder="Name or email" />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select id="status" name="status" defaultValue={status ?? ""}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </div>
      </FilterBar>
      <DataTable head={["Customer", "Plan", "Status", "Period start", "Period end", "Auto-renew", "Source"]}>
        {subs.length === 0 ? (
          <EmptyRow colSpan={7}>No subscriptions found.</EmptyRow>
        ) : (
          subs.map((s) => (
            <tr key={s.id}>
              <Td>
                <Link href={`/admin/users/${s.user.id}`} className="font-medium text-text hover:text-light-blue">{s.user.name}</Link>
                <span className="block text-xs text-muted">{s.user.email}</span>
              </Td>
              <Td className="text-text">{s.plan.name}</Td>
              <Td><StatusBadge status={s.status} /></Td>
              <Td className="text-muted">{formatDate(s.currentPeriodStart)}</Td>
              <Td className="text-muted">{formatDate(s.currentPeriodEnd)}</Td>
              <Td className="text-muted">{s.cancelAtPeriodEnd ? "Off" : "On"}</Td>
              <Td className="text-muted">{s.providerSubscriptionId ? "Provider" : "Manual"}</Td>
            </tr>
          ))
        )}
      </DataTable>
      <Pagination page={page} totalPages={Math.ceil(total / PAGE_SIZE)} total={total} pageSize={PAGE_SIZE} hrefFor={(p) => pageHref("/admin/subscriptions", sp, p)} />
    </>
  );
}
