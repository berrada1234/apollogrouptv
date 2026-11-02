import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { PageHeader } from "@/components/page-header";
import { DataTable, EmptyRow, FilterBar, Td } from "@/components/admin/table";
import { StatusBadge } from "@/components/ui/badge";
import { Input, Label, Select } from "@/components/ui/form";
import { Notice, Pagination } from "@/components/ui/misc";
import { db } from "@/lib/db";
import { getPaymentProvider } from "@/lib/payments";
import { oneOf, pageHref, pageParam, param } from "@/lib/params";
import { requireRole } from "@/lib/session";
import { formatDateTime, formatMoney, humanize } from "@/lib/utils";

export const metadata: Metadata = { title: "Orders & Payments" };
const PAGE_SIZE = 25;
const STATUSES = ["PENDING", "SUCCEEDED", "FAILED", "REFUNDED", "PARTIALLY_REFUNDED"] as const;

export default async function AdminPaymentsPage({ searchParams }: PageProps<"/admin/payments">) {
  await requireRole("ADMIN");
  const sp = await searchParams;
  const status = oneOf(param(sp, "status"), STATUSES);
  const q = param(sp, "q");
  const page = pageParam(sp);
  const where: Prisma.PaymentWhereInput = {
    ...(status ? { status } : {}),
    ...(q ? { OR: [{ providerReference: { contains: q } }, { user: { email: { contains: q } } }] } : {}),
  };
  const [payments, total, orders] = await Promise.all([
    db.payment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
    db.payment.count({ where }),
    db.order.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);
  const provider = getPaymentProvider();

  return (
    <>
      <PageHeader
        title="Orders & Payments"
        description={`${total} payment records · Orders: ${orders.map((o) => `${o._count._all} ${humanize(o.status).toLowerCase()}`).join(", ") || "none"}`}
      />
      <div className="mb-6">
        <Notice title={provider ? `Payment provider: ${humanize(provider)}` : "No payment provider connected"}>
          Payment records are read-only here. They are created and updated only from verified provider webhooks. Refunds must be issued
          through the payment provider{provider ? "" : " once one is integrated"}.
        </Notice>
      </div>
      <FilterBar>
        <div className="flex-1">
          <Label htmlFor="q">Search</Label>
          <Input id="q" name="q" defaultValue={q} placeholder="Provider reference or customer email" />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select id="status" name="status" defaultValue={status ?? ""}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{humanize(s)}</option>
            ))}
          </Select>
        </div>
      </FilterBar>
      <DataTable head={["Date", "Customer", "Amount", "Status", "Provider", "Reference"]}>
        {payments.length === 0 ? (
          <EmptyRow colSpan={6}>No payments recorded.</EmptyRow>
        ) : (
          payments.map((p) => (
            <tr key={p.id}>
              <Td className="text-muted">{formatDateTime(p.createdAt)}</Td>
              <Td>
                <Link href={`/admin/users/${p.user.id}`} className="text-text hover:text-light-blue">{p.user.name}</Link>
                <span className="block text-xs text-muted">{p.user.email}</span>
              </Td>
              <Td className="font-medium text-text">{formatMoney(p.amountCents, p.currency)}</Td>
              <Td><StatusBadge status={p.status} /></Td>
              <Td className="text-muted">{humanize(p.provider)}</Td>
              <Td className="font-mono text-xs text-muted">{p.providerReference}</Td>
            </tr>
          ))
        )}
      </DataTable>
      <Pagination page={page} totalPages={Math.ceil(total / PAGE_SIZE)} total={total} pageSize={PAGE_SIZE} hrefFor={(p) => pageHref("/admin/payments", sp, p)} />
    </>
  );
}
