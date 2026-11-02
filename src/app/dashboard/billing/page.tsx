import type { Metadata } from "next";
import { Receipt } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState, Notice, Pagination } from "@/components/ui/misc";
import { getPaymentProvider } from "@/lib/payments";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { formatDate, formatMoney, humanize } from "@/lib/utils";

export const metadata: Metadata = { title: "Billing History" };

const PAGE_SIZE = 20;

export default async function BillingPage({ searchParams }: PageProps<"/dashboard/billing">) {
  const user = await requireUser("/dashboard/billing");
  const sp = await searchParams;
  const page = Math.max(1, Number.parseInt(String(sp.page ?? "1"), 10) || 1);
  const [payments, total] = await Promise.all([
    db.payment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { subscription: { include: { plan: { select: { name: true } } } } },
    }),
    db.payment.count({ where: { userId: user.id } }),
  ]);

  return (
    <>
      <PageHeader title="Billing History" description="All payments recorded on your account." />
      {!getPaymentProvider() && (
        <div className="mb-6">
          <Notice title="Online checkout isn't connected yet">
            Payments are arranged with our team through a support ticket for now. Every confirmed payment is recorded here with its amount, status and reference —
            nothing is shown until it has actually been recorded.
          </Notice>
        </div>
      )}
      {payments.length === 0 ? (
        <EmptyState icon={Receipt} title="No billing records yet" description="Payments appear here once they’re confirmed and recorded on your account." />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Description</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Reference</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3.5 text-muted">{formatDate(p.createdAt)}</td>
                    <td className="px-5 py-3.5 text-text">{p.subscription?.plan.name ?? "Payment"}</td>
                    <td className="px-5 py-3.5 font-medium text-text">{formatMoney(p.amountCents, p.currency)}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-muted">
                      {humanize(p.provider)} · {p.providerReference.slice(-10)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      <Pagination page={page} totalPages={Math.ceil(total / PAGE_SIZE)} total={total} pageSize={PAGE_SIZE} hrefFor={(p) => `/dashboard/billing?page=${p}`} />
    </>
  );
}
