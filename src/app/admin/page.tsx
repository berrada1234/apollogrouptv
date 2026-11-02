import type { Metadata } from "next";
import Link from "next/link";
import {
  CreditCard,
  LifeBuoy,
  MessageSquareText,
  Package,
  UserPlus,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState, StatCard } from "@/components/ui/misc";
import { SignupsChart } from "@/components/admin/signups-chart";
import { db } from "@/lib/db";
import { hasRole, requireRole } from "@/lib/session";
import {
  daysFromNow,
  formatDateTime,
  formatMoney,
  humanize,
  isoDay,
} from "@/lib/utils";

export const metadata: Metadata = { title: "Overview" };

const RANGES = [7, 30, 90] as const;

export default async function AdminOverview({
  searchParams,
}: PageProps<"/admin">) {
  const user = await requireRole("SUPPORT");
  const isAdmin = hasRole(user, "ADMIN");
  const sp = await searchParams;
  const range = RANGES.find((r) => String(r) === sp.range) ?? 30;
  const since = daysFromNow(-range);

  // All figures are computed from live database records.
  const [
    users,
    newUsers,
    activeSubs,
    pendingTickets,
    pendingReviews,
    revenue,
    recentUsers,
    recentLogs,
    recentTickets,
    signupDates,
    subsByStatus,
  ] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { createdAt: { gte: since } } }),
    db.subscription.count({ where: { status: "ACTIVE" } }),
    db.supportTicket.count({
      where: { status: { in: ["OPEN", "IN_PROGRESS"] } },
    }),
    db.review.count({ where: { status: "PENDING" } }),
    // Revenue and the customer list are admin-only; support staff see ticket and review workload.
    isAdmin
      ? db.payment.groupBy({
          by: ["currency"],
          where: { status: "SUCCEEDED", createdAt: { gte: since } },
          _sum: { amountCents: true },
        })
      : Promise.resolve([]),
    isAdmin
      ? db.user.findMany({
          orderBy: { createdAt: "desc" },
          take: 6,
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            emailVerified: true,
          },
        })
      : Promise.resolve([]),
    isAdmin
      ? db.auditLog.findMany({
          orderBy: { createdAt: "desc" },
          take: 6,
          include: { actor: { select: { name: true } } },
        })
      : Promise.resolve([]),
    db.supportTicket.findMany({
      where: { status: { in: ["OPEN", "IN_PROGRESS"] } },
      orderBy: { updatedAt: "desc" },
      take: 6,
    }),
    db.user.findMany({
      where: { createdAt: { gte: daysFromNow(-(range - 1)) } },
      select: { createdAt: true },
    }),
    db.subscription.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  // Bucket sign-ups per calendar day (server time) for the selected range.
  const days = Array.from({ length: range }, (_, i) =>
    isoDay(daysFromNow(i - (range - 1))),
  );
  const perDay = new Map(days.map((d) => [d, 0]));
  for (const u of signupDates) {
    const key = isoDay(u.createdAt);
    if (perDay.has(key)) perDay.set(key, perDay.get(key)! + 1);
  }
  const series = days.map((date) => ({ date, count: perDay.get(date)! }));
  const subTotal = subsByStatus.reduce((n, s) => n + s._count._all, 0);
  const subOrder = [
    "ACTIVE",
    "PENDING",
    "PAST_DUE",
    "CANCELED",
    "EXPIRED",
  ] as const;

  const revenueLabel =
    revenue.length === 0
      ? formatMoney(0)
      : revenue
          .map((r) => formatMoney(r._sum.amountCents ?? 0, r.currency))
          .join(" · ");

  return (
    <>
      <PageHeader
        title="Admin overview"
        description="Live figures calculated from your database."
        actions={
          <nav
            aria-label="Date range"
            className="inline-flex rounded-xl border border-border bg-card p-1"
          >
            {RANGES.map((r) => (
              <Link
                key={r}
                href={r === 30 ? "/admin" : `/admin?range=${r}`}
                aria-current={r === range ? "true" : undefined}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${r === range ? "bg-primary/15 text-light-blue" : "text-muted hover:text-text"}`}
              >
                {r} days
              </Link>
            ))}
          </nav>
        }
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Registered users"
          value={users.toLocaleString()}
          icon={Users}
          hint={`+${newUsers} in the last ${range} days`}
          href={isAdmin ? "/admin/users" : undefined}
        />
        <StatCard
          label="Active subscriptions"
          value={activeSubs.toLocaleString()}
          icon={Package}
          href={isAdmin ? "/admin/subscriptions?status=ACTIVE" : undefined}
        />
        <StatCard
          label="Open support tickets"
          value={pendingTickets}
          icon={LifeBuoy}
          href="/admin/support"
        />
        <StatCard
          label="Reviews to moderate"
          value={pendingReviews}
          icon={MessageSquareText}
          href="/admin/reviews"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <Card>
          <CardHeader
            title="New sign-ups"
            description={`Accounts created per day, last ${range} days`}
            action={
              <span className="inline-flex items-center gap-1.5 text-sm text-muted">
                <UserPlus className="h-4 w-4 text-accent" aria-hidden />
                <span className="font-display text-lg font-semibold text-text tabular-nums">
                  {newUsers}
                </span>{" "}
                total
              </span>
            }
          />
          <CardBody>
            <SignupsChart data={series} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader
            title="Subscriptions"
            description={`${subTotal} total by status`}
          />
          <CardBody className="space-y-5">
            {isAdmin && (
              <div>
                <p className="text-xs text-subtle">
                  Revenue, last {range} days
                </p>
                <p className="mt-1 font-display text-2xl font-semibold text-text tabular-nums">
                  {revenueLabel}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-subtle">
                  <CreditCard className="h-3.5 w-3.5" aria-hidden /> Succeeded
                  payments only
                </p>
              </div>
            )}
            <ul className="space-y-3 border-t border-border pt-5">
              {subOrder.map((st) => {
                const n =
                  subsByStatus.find((r) => r.status === st)?._count._all ?? 0;
                return (
                  <li key={st} className="text-sm">
                    <div className="flex items-center justify-between">
                      <StatusBadge status={st} />
                      <span className="text-text tabular-nums">{n}</span>
                    </div>
                    <div
                      className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-inset"
                      aria-hidden
                    >
                      <div
                        className="h-full rounded-full bg-muted/60"
                        style={{
                          width: `${subTotal ? (n / subTotal) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardBody>
        </Card>
      </div>

      <div className={`mt-6 grid gap-6 ${isAdmin ? "lg:grid-cols-2" : ""}`}>
        <Card>
          <CardHeader
            title="Open tickets"
            action={
              <Link
                href="/admin/support"
                className="text-sm text-accent hover:text-light-blue"
              >
                View all
              </Link>
            }
          />
          <CardBody>
            {recentTickets.length === 0 ? (
              <EmptyState
                icon={LifeBuoy}
                title="No open tickets"
                className="border-none py-6"
              />
            ) : (
              <ul className="divide-y divide-border">
                {recentTickets.map((t) => (
                  <li key={t.id}>
                    <Link
                      href={`/admin/support/${t.id}`}
                      className="flex items-center justify-between gap-3 py-3 hover:text-light-blue"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-text">
                          {t.subject}
                        </span>
                        <span className="text-xs text-muted">
                          {formatDateTime(t.updatedAt)}
                        </span>
                      </span>
                      <StatusBadge status={t.priority} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
        {isAdmin && (
          <Card>
            <CardHeader title="Recent sign-ups" />
            <CardBody>
              {recentUsers.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="No users yet"
                  className="border-none py-6"
                />
              ) : (
                <ul className="divide-y divide-border">
                  {recentUsers.map((u) => (
                    <li
                      key={u.id}
                      className="flex items-center justify-between gap-3 py-3"
                    >
                      <span className="min-w-0">
                        {isAdmin ? (
                          <Link
                            href={`/admin/users/${u.id}`}
                            className="block truncate text-sm font-medium text-text hover:text-light-blue"
                          >
                            {u.name}
                          </Link>
                        ) : (
                          <span className="block truncate text-sm font-medium text-text">
                            {u.name}
                          </span>
                        )}
                        <span className="block truncate text-xs text-muted">
                          {u.email}
                        </span>
                      </span>
                      <span className="text-xs text-muted">
                        {formatDateTime(u.createdAt)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        )}
      </div>

      {isAdmin && (
        <Card className="mt-6">
          <CardHeader
            title="Recent admin activity"
            action={
              <Link
                href="/admin/audit-logs"
                className="text-sm text-accent hover:text-light-blue"
              >
                Audit log
              </Link>
            }
          />
          <CardBody>
            {recentLogs.length === 0 ? (
              <p className="text-sm text-muted">
                No administrative actions recorded yet.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {recentLogs.map((l) => (
                  <li
                    key={l.id}
                    className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
                  >
                    <span>
                      <span className="font-medium text-text">
                        {l.actor?.name ?? "System"}
                      </span>{" "}
                      <span className="text-muted">
                        {humanize(l.action.replace(".", "_"))}
                      </span>
                    </span>
                    <span className="text-xs text-muted">
                      {formatDateTime(l.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      )}

      <details className="mt-6 rounded-[14px] border border-border bg-card px-5 py-4 text-sm">
        <summary className="cursor-pointer font-medium text-text">
          How these numbers are calculated
        </summary>
        <dl className="mt-4 grid gap-3 text-muted sm:grid-cols-2">
          <div>
            <dt className="font-medium text-text">Registered users</dt>
            <dd>
              Every account in the database, verified or not. “New” counts
              accounts created in the selected range.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-text">Active subscriptions</dt>
            <dd>
              Subscriptions whose status is Active right now, regardless of when
              they started.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-text">Open support tickets</dt>
            <dd>
              Tickets with status Open or In progress. Waiting-on-customer,
              resolved and closed tickets are excluded.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-text">Reviews to moderate</dt>
            <dd>
              Reviews submitted by customers that are still Pending approval.
            </dd>
          </div>
          {isAdmin && (
            <div>
              <dt className="font-medium text-text">Revenue</dt>
              <dd>
                Sum of payments with status Succeeded created in the selected
                range, per currency. Refunds and failed payments are not
                included.
              </dd>
            </div>
          )}
          <div>
            <dt className="font-medium text-text">Sign-up chart</dt>
            <dd>
              Accounts created per calendar day (server time) across the
              selected range.
            </dd>
          </div>
        </dl>
      </details>
    </>
  );
}
