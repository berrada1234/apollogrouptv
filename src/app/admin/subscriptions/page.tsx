import type { Metadata } from "next";
import Link from "next/link";
import { Pencil, Search } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { DataTable, EmptyRow, FilterBar, Td } from "@/components/admin/table";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Input, Label, Select } from "@/components/ui/form";
import { Pagination } from "@/components/ui/misc";
import { db } from "@/lib/db";
import { invoiceStatusLabels } from "@/lib/checkout/labels";
import { expireStale } from "@/lib/checkout/service";
import { pageHref, pageParam, param } from "@/lib/params";
import { requireRole } from "@/lib/session";
import { filterKeys, subscriptionDisplay, subscriptionFilters, type Display } from "@/lib/subscription-status";
import { sweepSubscriptions } from "@/lib/subscriptions";
import { cn, formatDate, formatMoney } from "@/lib/utils";

export const metadata: Metadata = { title: "Subscriptions Management" };
const PAGE_SIZE = 25;
// Recent records only; older history stays searchable by email or invoice.
const WINDOW = 500;

type Row = {
  key: string;
  customer: { id: string; name: string; email: string };
  invoice: string | null;
  plan: string;
  amount: string;
  method: string;
  payment: { key: string; label: string } | null;
  sub: Display;
  start: Date | null;
  end: Date | null;
  editHref: string;
  needsAction: boolean;
  createdAt: Date;
};

export default async function SubscriptionsManagementPage({ searchParams }: PageProps<"/admin/subscriptions">) {
  await requireRole("ADMIN");
  await Promise.all([expireStale(), sweepSubscriptions()]);
  const sp = await searchParams;
  const filter = param(sp, "status");
  const q = param(sp, "q");
  const page = pageParam(sp);
  const match = q ? { OR: [{ email: { contains: q } }, { name: { contains: q } }] } : undefined;

  const [orders, granted] = await Promise.all([
    db.order.findMany({
      where: q ? { OR: [{ number: { contains: q } }, { user: match }] } : {},
      orderBy: { createdAt: "desc" },
      take: WINDOW,
      include: { user: { select: { id: true, name: true, email: true } }, plan: { select: { name: true } }, method: { select: { name: true } }, subscription: true },
    }),
    // Subscriptions granted by an admin without an invoice.
    db.subscription.findMany({
      where: { order: null, ...(match ? { user: match } : {}) },
      orderBy: { createdAt: "desc" },
      take: WINDOW,
      include: { user: { select: { id: true, name: true, email: true } }, plan: { select: { name: true, priceCents: true, currency: true } } },
    }),
  ]);

  const rows: Row[] = [
    ...orders.map((o) => ({
      key: o.id,
      customer: o.user,
      invoice: o.number,
      plan: o.plan.name,
      amount: formatMoney(o.amountCents, o.currency),
      method: o.method?.name ?? "—",
      payment: { key: o.status, label: invoiceStatusLabels[o.status] },
      sub: subscriptionDisplay(o.subscription, o.status),
      start: o.subscription?.currentPeriodStart ?? null,
      end: o.subscription?.currentPeriodEnd ?? null,
      editHref: o.subscription ? `/admin/subscriptions/${o.subscription.id}` : `/admin/payments/${o.id}`,
      needsAction: o.status === "PENDING_CONFIRMATION" || o.status === "UNDERPAID" || o.subscription?.status === "PENDING",
      createdAt: o.createdAt,
    })),
    ...granted.map((s) => ({
      key: s.id,
      customer: s.user,
      invoice: null,
      plan: s.plan.name,
      amount: formatMoney(s.plan.priceCents, s.plan.currency),
      method: "Granted by admin",
      payment: null,
      sub: subscriptionDisplay(s),
      start: s.currentPeriodStart,
      end: s.currentPeriodEnd,
      editHref: `/admin/subscriptions/${s.id}`,
      needsAction: s.status === "PENDING",
      createdAt: s.createdAt,
    })),
  ]
    .filter((r) => !filter || r.sub.label === filterKeys[filter])
    // Requests that need attention first, then newest.
    .sort((a, b) => Number(b.needsAction) - Number(a.needsAction) || b.createdAt.getTime() - a.createdAt.getTime());

  const needsAction = rows.filter((r) => r.needsAction).length;
  const visible = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <PageHeader
        title="Subscriptions Management"
        description={`${rows.length} record${rows.length === 1 ? "" : "s"}${needsAction ? ` · ${needsAction} waiting for you` : ""}`}
      />
      <ul className="mb-6 flex flex-wrap gap-2" aria-label="Filter by subscription status">
        {[{ value: "", label: "All" }, ...subscriptionFilters].map((f) => (
          <li key={f.value}>
            <Link
              href={f.value ? `/admin/subscriptions?status=${f.value}` : "/admin/subscriptions"}
              className={cn(
                "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
                (filter ?? "") === f.value ? "border-primary/60 bg-primary/10 text-light-blue" : "border-border text-muted hover:text-text",
              )}
            >
              {f.label}
            </Link>
          </li>
        ))}
      </ul>
      <FilterBar>
        <div className="flex-1">
          <Label htmlFor="q">Search</Label>
          <Input id="q" name="q" defaultValue={q} placeholder="Customer email or name, or invoice ID" />
        </div>
        <div>
          <Label htmlFor="status">Subscription status</Label>
          <Select id="status" name="status" defaultValue={filter ?? ""}>
            <option value="">All statuses</option>
            {subscriptionFilters.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </Select>
        </div>
      </FilterBar>
      <DataTable head={["Customer", "Invoice", "Plan", "Amount", "Method", "Payment", "Subscription", "Start", "Expiry", "Actions"]} minWidth={1200}>
        {visible.length === 0 ? (
          <EmptyRow colSpan={10}>No subscriptions found.</EmptyRow>
        ) : (
          visible.map((r) => (
            <tr key={r.key} className={cn(r.needsAction && "bg-primary/[0.06]")}>
              <Td>
                <span className="flex items-center gap-2">
                  {r.needsAction && <Badge tone="blue">New</Badge>}
                  <Link href={`/admin/users/${r.customer.id}`} className="text-text hover:text-light-blue">
                    {r.customer.name}
                  </Link>
                </span>
                <span className="block text-xs text-muted">{r.customer.email}</span>
              </Td>
              <Td className="font-mono text-xs text-muted">{r.invoice ?? "—"}</Td>
              <Td className="text-muted">{r.plan}</Td>
              <Td className="font-medium text-text">{r.amount}</Td>
              <Td className="text-muted">{r.method}</Td>
              <Td>{r.payment ? <StatusBadge status={r.payment.key} label={r.payment.label} /> : <span className="text-muted">—</span>}</Td>
              <Td>
                <StatusBadge status={r.sub.key} label={r.sub.label} />
              </Td>
              <Td className="whitespace-nowrap text-muted">{formatDate(r.start)}</Td>
              <Td className="whitespace-nowrap text-muted">{formatDate(r.end)}</Td>
              <Td>
                <Link href={r.editHref} className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-accent hover:text-light-blue">
                  {r.editHref.startsWith("/admin/payments") ? (
                    <>
                      <Search className="h-4 w-4" aria-hidden /> Review payment
                    </>
                  ) : (
                    <>
                      <Pencil className="h-4 w-4" aria-hidden /> Edit Subscription
                    </>
                  )}
                </Link>
              </Td>
            </tr>
          ))
        )}
      </DataTable>
      <Pagination page={page} totalPages={Math.ceil(rows.length / PAGE_SIZE)} total={rows.length} pageSize={PAGE_SIZE} hrefFor={(p) => pageHref("/admin/subscriptions", sp, p)} />
    </>
  );
}
