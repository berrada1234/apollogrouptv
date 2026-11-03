import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { PageHeader } from "@/components/page-header";
import { DataTable, EmptyRow, FilterBar, Td } from "@/components/admin/table";
import { StatusBadge } from "@/components/ui/badge";
import { Input, Label, Select } from "@/components/ui/form";
import { Pagination } from "@/components/ui/misc";
import { db } from "@/lib/db";
import { invoiceStatuses, invoiceStatusLabels } from "@/lib/checkout/labels";
import { expireStale } from "@/lib/checkout/service";
import { oneOf, pageHref, pageParam, param } from "@/lib/params";
import { requireRole } from "@/lib/session";
import { formatDateTime, formatMoney } from "@/lib/utils";

export const metadata: Metadata = { title: "Orders & Payments" };
const PAGE_SIZE = 25;

export default async function AdminPaymentsPage({
  searchParams,
}: PageProps<"/admin/payments">) {
  await requireRole("ADMIN");
  await expireStale();
  const sp = await searchParams;
  const status = oneOf(param(sp, "status"), invoiceStatuses);
  const q = param(sp, "q");
  const page = pageParam(sp);
  const where: Prisma.OrderWhereInput = {
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [
            { number: { contains: q } },
            { user: { email: { contains: q } } },
            { user: { name: { contains: q } } },
            { requests: { some: { txid: { contains: q } } } },
            { payments: { some: { providerReference: { contains: q } } } },
          ],
        }
      : {}),
  };
  const [orders, total, counts] = await Promise.all([
    db.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        user: { select: { id: true, name: true, email: true } },
        plan: { select: { name: true } },
        method: { select: { name: true } },
        payments: { select: { providerReference: true }, take: 1 },
        requests: {
          where: { txid: { not: null } },
          select: { txid: true },
          take: 1,
        },
      },
    }),
    db.order.count({ where }),
    db.order.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);
  const count = (s: string) =>
    counts.find((c) => c.status === s)?._count._all ?? 0;
  const needsReview = count("PENDING_CONFIRMATION") + count("UNDERPAID");

  return (
    <>
      <PageHeader
        title="Orders & Payments"
        description={`${total} invoice${total === 1 ? "" : "s"}${needsReview ? ` · ${needsReview} need${needsReview === 1 ? "s" : ""} review` : ""}`}
      />
      <ul className="mb-6 flex flex-wrap gap-2" aria-label="Filter by status">
        {[undefined, ...invoiceStatuses].map((s) => (
          <li key={s ?? "all"}>
            <Link
              href={s ? `/admin/payments?status=${s}` : "/admin/payments"}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${status === s ? "border-primary/60 bg-primary/10 text-light-blue" : "border-border text-muted hover:text-text"}`}
            >
              {s ? invoiceStatusLabels[s] : "All"}
              {s && <span className="text-subtle">{count(s)}</span>}
            </Link>
          </li>
        ))}
      </ul>
      <FilterBar>
        <div className="flex-1">
          <Label htmlFor="q">Search</Label>
          <Input
            id="q"
            name="q"
            defaultValue={q}
            placeholder="Invoice ID, customer name or email, transaction ID"
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select id="status" name="status" defaultValue={status ?? ""}>
            <option value="">All statuses</option>
            {invoiceStatuses.map((s) => (
              <option key={s} value={s}>
                {invoiceStatusLabels[s]}
              </option>
            ))}
          </Select>
        </div>
      </FilterBar>
      <DataTable
        head={[
          "Invoice",
          "Customer",
          "Plan",
          "Amount",
          "Method",
          "Status",
          "Transaction",
          "Created",
          "Expires",
        ]}
        minWidth={1100}
      >
        {orders.length === 0 ? (
          <EmptyRow colSpan={9}>No invoices found.</EmptyRow>
        ) : (
          orders.map((o) => {
            const txn =
              o.payments[0]?.providerReference ??
              o.requests[0]?.txid ??
              o.customerReference;
            return (
              <tr key={o.id}>
                <Td>
                  <Link
                    href={`/admin/payments/${o.id}`}
                    className="font-mono text-xs font-semibold text-accent hover:text-light-blue"
                  >
                    {o.number ?? o.id.slice(-8)}
                  </Link>
                </Td>
                <Td>
                  <Link
                    href={`/admin/users/${o.user.id}`}
                    className="text-text hover:text-light-blue"
                  >
                    {o.user.name}
                  </Link>
                  <span className="block text-xs text-muted">
                    {o.user.email}
                  </span>
                </Td>
                <Td className="text-muted">{o.plan.name}</Td>
                <Td className="font-medium text-text">
                  {formatMoney(o.amountCents, o.currency)}
                </Td>
                <Td className="text-muted">{o.method?.name ?? "—"}</Td>
                <Td>
                  <StatusBadge
                    status={o.status}
                    label={invoiceStatusLabels[o.status]}
                  />
                </Td>
                <Td
                  className="max-w-[160px] truncate font-mono text-xs text-muted"
                  title={txn ?? undefined}
                >
                  {txn ?? "—"}
                </Td>
                <Td className="whitespace-nowrap text-muted">
                  {formatDateTime(o.createdAt)}
                </Td>
                <Td className="whitespace-nowrap text-muted">
                  {o.expiresAt ? formatDateTime(o.expiresAt) : "—"}
                </Td>
              </tr>
            );
          })
        )}
      </DataTable>
      <Pagination
        page={page}
        totalPages={Math.ceil(total / PAGE_SIZE)}
        total={total}
        pageSize={PAGE_SIZE}
        hrefFor={(p) => pageHref("/admin/payments", sp, p)}
      />
    </>
  );
}
