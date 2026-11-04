import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { cn, daysFromNow } from "@/lib/utils";

export const metadata: Metadata = { title: "Conversion funnel" };

const RANGES = [7, 30, 90] as const;

const KIND_LABELS: Record<string, string> = {
  invoice: "Unpaid invoice (after 1 hour)",
  day1: "Day 1: account ready",
  day3: "Day 3: device check",
  day7: "Day 7: last reminder",
  winback1: "Win-back: 1 day after expiry",
  winback7: "Win-back: 7 days after expiry",
};

const pct = (part: number, whole: number) => (whole > 0 ? `${Math.round((part / whole) * 100)}%` : "—");

/**
 * Where sign-ups drop out (account → verified email → chose a pack → paid) and how each reminder email performs.
 * Every figure comes from live records: customers who signed up in the selected window, and reminders sent in it.
 */
export default async function FunnelPage({ searchParams }: PageProps<"/admin/funnel">) {
  await requireRole("ADMIN");
  const sp = await searchParams;
  const range = RANGES.find((r) => String(r) === sp.range) ?? 30;
  const since = daysFromNow(-range);

  const cohort = await db.user.findMany({
    where: { role: "USER", createdAt: { gte: since } },
    select: {
      id: true,
      emailVerified: true,
      remindersOptOut: true,
      _count: { select: { subscriptions: true } },
      orders: { select: { status: true } },
      tickets: { where: { subject: { contains: "activation request" } }, select: { id: true }, take: 1 },
    },
  });
  const signedUp = cohort.length;
  const verified = cohort.filter((u) => u.emailVerified).length;
  // Choosing a pack is an invoice when online checkout is on, or an activation-request ticket when it isn't.
  const chose = cohort.filter((u) => u.orders.length > 0 || u.tickets.length > 0).length;
  const paid = cohort.filter((u) => u._count.subscriptions > 0 || u.orders.some((o) => o.status === "PAID")).length;
  const optedOut = cohort.filter((u) => u.remindersOptOut).length;

  const steps = [
    { label: "Created an account", value: signedUp, prev: signedUp },
    { label: "Verified their email", value: verified, prev: signedUp },
    { label: "Chose a pack", hint: "Invoice or activation request", value: chose, prev: verified },
    { label: "Paid or activated", value: paid, prev: chose },
  ];

  // Reminder performance: for each email, how many recipients bought afterwards.
  const reminders = await db.emailReminder.findMany({ where: { sentAt: { gte: since } }, select: { userId: true, kind: true, sentAt: true } });
  const userIds = [...new Set(reminders.map((r) => r.userId))];
  const [paidOrders, subs] = userIds.length
    ? await Promise.all([
        db.order.findMany({ where: { userId: { in: userIds }, status: "PAID" }, select: { userId: true, paidAt: true, createdAt: true } }),
        db.subscription.findMany({ where: { userId: { in: userIds } }, select: { userId: true, createdAt: true } }),
      ])
    : [[], []];
  const purchases = new Map<string, Date[]>();
  for (const o of paidOrders) purchases.set(o.userId, [...(purchases.get(o.userId) ?? []), o.paidAt ?? o.createdAt]);
  for (const s of subs) purchases.set(s.userId, [...(purchases.get(s.userId) ?? []), s.createdAt]);

  const byKind = new Map<string, { sent: number; bought: number }>();
  for (const r of reminders) {
    const kind = r.kind.split(":")[0];
    const row = byKind.get(kind) ?? { sent: 0, bought: 0 };
    row.sent++;
    if ((purchases.get(r.userId) ?? []).some((d) => d > r.sentAt)) row.bought++;
    byKind.set(kind, row);
  }
  const kindRows = Object.keys(KIND_LABELS).map((k) => ({ kind: k, label: KIND_LABELS[k], ...(byKind.get(k) ?? { sent: 0, bought: 0 }) }));
  const totalSent = kindRows.reduce((a, r) => a + r.sent, 0);

  return (
    <>
      <PageHeader
        title="Conversion funnel"
        description={`Customers who signed up in the last ${range} days, and reminder emails sent in that time.`}
        actions={
          <nav aria-label="Date range" className="inline-flex rounded-xl border border-border bg-card p-1">
            {RANGES.map((r) => (
              <Link
                key={r}
                href={r === 30 ? "/admin/funnel" : `/admin/funnel?range=${r}`}
                aria-current={r === range ? "true" : undefined}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  r === range ? "bg-primary/15 text-light-blue" : "text-muted hover:text-text",
                )}
              >
                {r} days
              </Link>
            ))}
          </nav>
        }
      />

      <Card>
        <CardHeader title="From sign-up to purchase" description="Each bar is a share of everyone who created an account. The percentage on the right is the step's own conversion." />
        <CardBody>
          <ol className="space-y-5">
            {steps.map((s, i) => (
              <li key={s.label}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-medium text-text">
                    <span className="mr-2 text-muted">{i + 1}.</span>
                    {s.label}
                    {s.hint && <span className="ml-2 text-xs text-subtle">{s.hint}</span>}
                  </p>
                  <p className="text-sm tabular-nums text-muted">
                    <span className="font-semibold text-text">{s.value}</span>
                    {i > 0 && <span className="ml-2">{pct(s.value, s.prev)} of previous step</span>}
                  </p>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-inset" aria-hidden>
                  <div className="h-full rounded-full bg-[image:var(--spectrum)]" style={{ width: signedUp ? `${Math.max(2, (s.value / signedUp) * 100)}%` : "0%" }} />
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm text-muted">
            Overall: <span className="font-semibold text-text">{pct(paid, signedUp)}</span> of sign-ups paid.
            {optedOut > 0 && <> {optedOut} turned off reminder emails.</>}
          </p>
        </CardBody>
      </Card>

      <Card className="mt-6">
        <CardHeader
          title="Reminder emails"
          description="Bought after means the customer paid or was activated at any time after that email. It shows correlation, not proof the email caused it."
        />
        <CardBody className="overflow-x-auto p-0 sm:p-0">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-subtle">
                <th className="px-5 py-3 font-medium sm:px-6">Email</th>
                <th className="px-3 py-3 text-right font-medium">Sent</th>
                <th className="px-3 py-3 text-right font-medium">Bought after</th>
                <th className="px-5 py-3 text-right font-medium sm:px-6">Rate</th>
              </tr>
            </thead>
            <tbody>
              {kindRows.map((r) => (
                <tr key={r.kind} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 text-text sm:px-6">{r.label}</td>
                  <td className="px-3 py-3 text-right tabular-nums text-muted">{r.sent}</td>
                  <td className="px-3 py-3 text-right tabular-nums text-muted">{r.bought}</td>
                  <td className="px-5 py-3 text-right tabular-nums font-semibold text-text sm:px-6">{pct(r.bought, r.sent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalSent === 0 && <p className="px-5 py-4 text-sm text-muted sm:px-6">No reminder emails were sent in this period yet.</p>}
        </CardBody>
      </Card>
    </>
  );
}
