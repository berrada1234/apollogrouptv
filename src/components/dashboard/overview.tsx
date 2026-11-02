import Link from "next/link";
import { ArrowRight, Bell, CheckCircle2, Circle, Gift, LifeBuoy, Mail, Package, Receipt } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState, StatCard } from "@/components/ui/misc";
import { db } from "@/lib/db";
import type { CurrentUser } from "@/lib/session";
import { getSettings } from "@/lib/settings";
import { cn, daysFromNow, formatDate, formatDateTime, formatMoney, humanize, intervalLabels } from "@/lib/utils";

/** The subscription that matters most: live ones first, otherwise the most recent. */
export async function getCurrentSubscription(userId: string) {
  return (
    (await db.subscription.findFirst({
      where: { userId, status: { in: ["ACTIVE", "PAST_DUE"] } },
      orderBy: { createdAt: "desc" },
      include: { plan: true },
    })) ??
    (await db.subscription.findFirst({ where: { userId }, orderBy: { createdAt: "desc" }, include: { plan: true } }))
  );
}

export async function getUserOverview(userId: string) {
  const [subscription, openTickets, referrals, unread, recentTickets, notifications, payments] = await Promise.all([
    getCurrentSubscription(userId),
    db.supportTicket.count({ where: { userId, status: { notIn: ["RESOLVED", "CLOSED"] } } }),
    db.referral.count({ where: { referrerId: userId } }),
    db.notification.count({ where: { userId, readAt: null } }),
    db.supportTicket.findMany({ where: { userId }, orderBy: { updatedAt: "desc" }, take: 5 }),
    db.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5 }),
    db.payment.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);
  return { subscription, openTickets, referrals, unread, recentTickets, notifications, payments };
}

type Activity = { id: string; at: Date; icon: typeof Bell; title: string; meta: string; href?: string; tone: "blue" | "success" | "neutral" };

function periodProgress(start: Date | null, end: Date | null, now: number) {
  if (!start || !end) return null;
  const total = end.getTime() - start.getTime();
  if (total <= 0) return null;
  const pct = Math.min(100, Math.max(0, ((now - start.getTime()) / total) * 100));
  const daysLeft = Math.max(0, Math.ceil((end.getTime() - now) / 864e5));
  return { pct, daysLeft };
}

export async function OverviewContent({ user }: { user: CurrentUser }) {
  const [data, settings] = await Promise.all([getUserOverview(user.id), getSettings()]);
  const { subscription } = data;
  const progress = subscription ? periodProgress(subscription.currentPeriodStart, subscription.currentPeriodEnd, daysFromNow(0).getTime()) : null;

  const activity: Activity[] = [
    ...data.recentTickets.map((t) => ({
      id: `t-${t.id}`,
      at: t.updatedAt,
      icon: LifeBuoy,
      title: t.subject,
      meta: `Ticket · ${humanize(t.status)}`,
      href: `/dashboard/support/${t.id}`,
      tone: (t.status === "RESOLVED" ? "success" : "blue") as Activity["tone"],
    })),
    ...data.notifications.map((n) => ({
      id: `n-${n.id}`,
      at: n.createdAt,
      icon: Bell,
      title: n.title,
      meta: n.readAt ? "Notification" : "New notification",
      href: n.href?.startsWith("/") ? n.href : undefined,
      tone: (n.readAt ? "neutral" : "blue") as Activity["tone"],
    })),
    ...data.payments.map((p) => ({
      id: `p-${p.id}`,
      at: p.createdAt,
      icon: Receipt,
      title: `Payment ${formatMoney(p.amountCents, p.currency)}`,
      meta: humanize(p.status),
      href: "/dashboard/billing",
      tone: (p.status === "SUCCEEDED" ? "success" : "neutral") as Activity["tone"],
    })),
  ]
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, 6);

  const onboarding = [
    { done: user.emailVerified, label: "Verify your email", href: "/dashboard/security" },
    { done: Boolean(subscription), label: "Choose a plan", href: "/dashboard/plan" },
    { done: subscription?.status === "ACTIVE", label: "Activate your subscription", href: "/dashboard/plan" },
    { done: false, label: "Set up the app on your devices", href: "/app" },
  ];
  const showOnboarding = onboarding.filter((s) => s.done).length < 3;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Subscription */}
        <section aria-labelledby="sub-title" className="relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-[#0b2a30] via-card to-card p-6 shadow-card sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm text-muted">Your subscription</p>
              <h2 id="sub-title" className="mt-1 font-display text-2xl font-semibold tracking-tight text-text">
                {subscription?.plan.name ?? "No plan yet"}
              </h2>
              {subscription && (
                <p className="mt-1 text-sm text-subtle">
                  {formatMoney(subscription.plan.priceCents, subscription.plan.currency)} · {intervalLabels[subscription.plan.interval]}
                </p>
              )}
            </div>
            {subscription ? <StatusBadge status={subscription.status} /> : <Package className="h-6 w-6 text-subtle" aria-hidden />}
          </div>

          {subscription ? (
            <>
              {progress && (
                <div className="mt-6">
                  <div
                    className="h-2 overflow-hidden rounded-full bg-inset"
                    role="progressbar"
                    aria-label="Billing period elapsed"
                    aria-valuenow={Math.round(progress.pct)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div className="h-full rounded-full bg-accent" style={{ width: `${progress.pct}%` }} />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-subtle">
                    <span>Started {formatDate(subscription.currentPeriodStart)}</span>
                    <span>
                      {progress.daysLeft} {progress.daysLeft === 1 ? "day" : "days"} left · {subscription.cancelAtPeriodEnd ? "Ends" : "Renews"}{" "}
                      {formatDate(subscription.currentPeriodEnd)}
                    </span>
                  </div>
                </div>
              )}
              <div className="mt-6 flex flex-wrap gap-2">
                <ButtonLink href="/dashboard/subscription" size="sm">
                  Subscription details
                </ButtonLink>
                <ButtonLink href="/dashboard/billing" size="sm" variant="secondary">
                  Billing history
                </ButtonLink>
              </div>
            </>
          ) : (
            <>
              <p className="mt-4 max-w-md text-sm text-muted">Choose a plan to get started. Our team will confirm activation with you.</p>
              <ButtonLink href="/dashboard/plan" size="sm" className="mt-6">
                Choose a plan <ArrowRight className="h-4 w-4" aria-hidden />
              </ButtonLink>
            </>
          )}
        </section>

        {/* Support */}
        <section aria-labelledby="support-title" className="flex flex-col rounded-lg border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-accent">
              <LifeBuoy className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2 id="support-title" className="font-display text-base font-semibold text-text">Need help?</h2>
              <p className="text-xs text-subtle">
                {data.openTickets > 0 ? `${data.openTickets} open ${data.openTickets === 1 ? "ticket" : "tickets"}` : "No open tickets"}
              </p>
            </div>
          </div>
          <dl className="mt-5 space-y-2.5 text-sm">
            {settings.general.supportHours && (
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Hours</dt>
                <dd className="text-right text-text">{settings.general.supportHours}</dd>
              </div>
            )}
            {settings.general.supportEmail && (
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Email</dt>
                <dd className="truncate text-right">
                  <a href={`mailto:${settings.general.supportEmail}`} className="inline-flex items-center gap-1 text-accent hover:text-light-blue">
                    <Mail className="h-3.5 w-3.5" aria-hidden /> {settings.general.supportEmail}
                  </a>
                </dd>
              </div>
            )}
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Replies</dt>
              <dd className="text-right text-text">In your dashboard</dd>
            </div>
          </dl>
          <div className="mt-auto flex gap-2 pt-6">
            <ButtonLink href="/dashboard/support/new" size="sm" className="flex-1">
              New ticket
            </ButtonLink>
            <ButtonLink href="/faq" size="sm" variant="secondary" className="flex-1">
              FAQ
            </ButtonLink>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <StatCard label="Open tickets" value={data.openTickets} icon={LifeBuoy} href="/dashboard/support" />
        <StatCard label="Unread" value={data.unread} icon={Bell} href="/dashboard/notifications" />
        <StatCard label="Referred" value={data.referrals} icon={Gift} href="/dashboard/referrals" />
      </div>

      <div className={cn("grid gap-6", showOnboarding && "lg:grid-cols-[1.6fr_1fr]")}>
        <Card>
          <CardHeader title="Recent activity" description="Tickets, notifications and payments on your account." />
          <CardBody>
            {activity.length === 0 ? (
              <EmptyState icon={Bell} title="No activity yet" description="Updates about your account will appear here." className="border-none bg-transparent py-6" />
            ) : (
              <ol className="relative space-y-1 before:absolute before:bottom-3 before:left-[17px] before:top-3 before:w-px before:bg-border">
                {activity.map((a) => {
                  const inner = (
                    <>
                      <span
                        className={cn(
                          "relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border bg-card",
                          a.tone === "success" ? "border-success/40 text-success" : a.tone === "blue" ? "border-primary/40 text-accent" : "border-border text-subtle",
                        )}
                      >
                        <a.icon className="h-4 w-4" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-text">{a.title}</span>
                        <span className="text-xs text-subtle">
                          {a.meta} · {formatDateTime(a.at)}
                        </span>
                      </span>
                    </>
                  );
                  return (
                    <li key={a.id}>
                      {a.href ? (
                        <Link href={a.href} className="flex items-center gap-3 rounded-xl p-1.5 transition-colors hover:bg-card-hover">
                          {inner}
                        </Link>
                      ) : (
                        <div className="flex items-center gap-3 p-1.5">{inner}</div>
                      )}
                    </li>
                  );
                })}
              </ol>
            )}
          </CardBody>
        </Card>

        {showOnboarding && (
          <Card>
            <CardHeader title="Getting started" description={`${onboarding.filter((s) => s.done).length} of ${onboarding.length} done`} />
            <CardBody>
              <ul className="space-y-1">
                {onboarding.map((step) => (
                  <li key={step.label}>
                    <Link href={step.href} className="flex items-center gap-3 rounded-xl p-2 text-sm transition-colors hover:bg-card-hover">
                      {step.done ? <CheckCircle2 className="h-5 w-5 text-success" aria-hidden /> : <Circle className="h-5 w-5 text-border-strong" aria-hidden />}
                      <span className={step.done ? "text-subtle line-through" : "text-text"}>{step.label}</span>
                      <span className="sr-only">{step.done ? "(completed)" : "(to do)"}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
