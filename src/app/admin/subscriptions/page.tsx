import type { Metadata } from "next";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { DataTable, EmptyRow, Td } from "@/components/admin/table";
import { StatusBadge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/misc";
import { db } from "@/lib/db";
import { expireStale } from "@/lib/checkout/service";
import { pageHref, pageParam } from "@/lib/params";
import { requireRole } from "@/lib/session";
import { subscriptionDisplay, type Display } from "@/lib/subscription-status";
import { sweepSubscriptions } from "@/lib/subscriptions";
import { formatMoney } from "@/lib/utils";

export const metadata: Metadata = { title: "Subscriptions" };
const PAGE_SIZE = 25;
// Recent records only, newest first.
const WINDOW = 500;

type Row = { key: string; user: string; plan: string; price: string; status: Display; date: Date; editHref: string };

const dateLabel = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });

export default async function SubscriptionsPage({ searchParams }: PageProps<"/admin/subscriptions">) {
  await requireRole("ADMIN");
  await Promise.all([expireStale(), sweepSubscriptions()]);
  const sp = await searchParams;
  const page = pageParam(sp);

  const [orders, granted] = await Promise.all([
    db.order.findMany({
      orderBy: { createdAt: "desc" },
      take: WINDOW,
      include: { user: { select: { name: true } }, plan: { select: { name: true } }, subscription: true },
    }),
    // Subscriptions granted by an admin without an invoice.
    db.subscription.findMany({
      where: { order: null },
      orderBy: { createdAt: "desc" },
      take: WINDOW,
      include: { user: { select: { name: true } }, plan: { select: { name: true, priceCents: true, currency: true } } },
    }),
  ]);

  const rows: Row[] = [
    ...orders.map((o) => ({
      key: o.id,
      user: o.user.name,
      plan: o.plan.name,
      price: formatMoney(o.amountCents, o.currency),
      status: subscriptionDisplay(o.subscription, o.status),
      date: o.createdAt,
      // Before a subscription exists, the pencil opens the invoice to review the payment.
      editHref: o.subscription ? `/admin/subscriptions/${o.subscription.id}` : `/admin/payments/${o.id}`,
    })),
    ...granted.map((s) => ({
      key: s.id,
      user: s.user.name,
      plan: s.plan.name,
      price: formatMoney(s.plan.priceCents, s.plan.currency),
      status: subscriptionDisplay(s),
      date: s.createdAt,
      editHref: `/admin/subscriptions/${s.id}`,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());
  const visible = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <h1 className="mb-6 font-display text-2xl font-semibold tracking-tight text-text sm:text-3xl">Subscriptions ({rows.length})</h1>
      <DataTable head={["User", "Plan", "Price", "Status", "Date", "Actions"]}>
        {visible.length === 0 ? (
          <EmptyRow colSpan={6}>No subscriptions yet.</EmptyRow>
        ) : (
          visible.map((r) => (
            <tr key={r.key}>
              <Td className="text-text">{r.user}</Td>
              <Td className="text-muted">{r.plan}</Td>
              <Td className="font-semibold text-text">{r.price}</Td>
              <Td>
                <StatusBadge status={r.status.key} label={r.status.label.toLowerCase()} />
              </Td>
              <Td className="whitespace-nowrap text-muted">{dateLabel(r.date)}</Td>
              <Td>
                <Link href={r.editHref} className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-inset hover:text-text" aria-label={`Edit ${r.user}'s subscription`}>
                  <Pencil className="h-4 w-4" aria-hidden />
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
