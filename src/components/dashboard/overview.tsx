import Link from "next/link";
import { ArrowRight, CalendarClock, Gift, LifeBuoy, MonitorSmartphone, Package, PlayCircle, Receipt, ShieldCheck, Users } from "lucide-react";
import { StatusBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { db } from "@/lib/db";
import type { CurrentUser } from "@/lib/session";
import { getSettings } from "@/lib/settings";
import { cn, daysFromNow, formatDate, formatDateTime, formatMoney, humanize } from "@/lib/utils";

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
  const [subscription, referrals, transactions, recentTickets, recentPayments] = await Promise.all([
    getCurrentSubscription(userId),
    db.referral.count({ where: { referrerId: userId } }),
    db.payment.count({ where: { userId } }),
    db.supportTicket.findMany({ where: { userId }, orderBy: { updatedAt: "desc" }, take: 3 }),
    db.payment.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 3, include: { subscription: { include: { plan: { select: { name: true } } } } } }),
  ]);
  return { subscription, referrals, transactions, recentTickets, recentPayments };
}

const panel = "rounded-[14px] border border-border bg-card shadow-card";

function periodProgress(start: Date | null, end: Date | null, now: number) {
  if (!start || !end) return null;
  const total = end.getTime() - start.getTime();
  if (total <= 0) return null;
  return {
    pct: Math.min(100, Math.max(0, ((now - start.getTime()) / total) * 100)),
    daysLeft: Math.max(0, Math.ceil((end.getTime() - now) / 864e5)),
  };
}

function Stat({ label, children, icon: Icon }: { label: string; children: React.ReactNode; icon: typeof Package }) {
  return (
    <div className={cn(panel, "flex items-center gap-4 p-4 sm:p-5")}>
      <span className="hidden h-11 w-11 shrink-0 place-items-center rounded-[10px] border border-primary/20 bg-primary/10 text-accent sm:grid">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-subtle">{label}</p>
        <div className="mt-1 font-display text-lg font-bold text-text">{children}</div>
      </div>
    </div>
  );
}

export async function OverviewContent({ user }: { user: CurrentUser }) {
  const [data, settings] = await Promise.all([getUserOverview(user.id), getSettings()]);
  const { subscription } = data;
  const live = subscription && (subscription.status === "ACTIVE" || subscription.status === "PAST_DUE");
  const progress = live ? periodProgress(subscription.currentPeriodStart, subscription.currentPeriodEnd, daysFromNow(0).getTime()) : null;
  const referralHint = settings.referral.enabled && settings.referral.rewardDescription ? settings.referral.rewardDescription : "Share your personal link";

  const actions = [
    { href: "/dashboard/apps", icon: PlayCircle, title: "Start watching", body: "Install the Apollo TV app and sign in" },
    { href: "/dashboard/apps", icon: MonitorSmartphone, title: "Download apps", body: "Setup steps for each device" },
    { href: "/dashboard/support/new", icon: LifeBuoy, title: "Open a ticket", body: "Get help from our team" },
    { href: "/dashboard/referrals", icon: Gift, title: "Refer a friend", body: referralHint },
  ];

  return (
    <div className="space-y-6">
      {/* Safety notice */}
      <div className="flex gap-3 rounded-[14px] border border-primary/25 bg-primary/[0.06] px-5 py-4 text-sm">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
        <p className="text-muted">
          <span className="font-semibold text-text">Pay safely.</span> Only arrange payment through your Apollo Group TV account or a support ticket from our team — never to
          an address, link or wallet someone sends you by email or message. We will never ask for your password.
        </p>
      </div>

      {/* Key figures */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Stat label="Subscription" icon={Package}>
          {subscription ? <StatusBadge status={subscription.status} /> : <span className="text-muted">None yet</span>}
        </Stat>
        <Stat label={live || !subscription?.currentPeriodEnd ? "Expires" : "Ended"} icon={CalendarClock}>
          {subscription?.currentPeriodEnd ? formatDate(subscription.currentPeriodEnd) : <span className="text-muted">N/A</span>}
        </Stat>
        <Stat label="Referrals" icon={Users}>
          <span className="tabular-nums">{data.referrals}</span>
        </Stat>
        <Stat label="Transactions" icon={Receipt}>
          <span className="tabular-nums">{data.transactions}</span>
        </Stat>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr] [&>*]:min-w-0">
        {/* Account details */}
        <section aria-labelledby="account-heading" className={cn(panel, "flex flex-col p-6")}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="account-heading" className="font-display text-lg font-bold text-text">
                Account details
              </h2>
              <p className="mt-1 text-sm text-muted">{user.email}</p>
            </div>
            {subscription ? (
              <StatusBadge status={subscription.status} />
            ) : (
              <span className="shrink-0 whitespace-nowrap rounded-full border border-border-strong px-2.5 py-0.5 text-xs font-medium text-muted">No plan</span>
            )}
          </div>

          <div className="mt-6 flex-1 rounded-xl border border-border bg-inset p-5">
            {live ? (
              <>
                <p className="text-xs text-subtle">Current pack</p>
                <p className="mt-1 font-display text-2xl font-bold text-text">{subscription.plan.name}</p>
                {progress && (
                  <div className="mt-5">
                    <div className="flex justify-between text-xs text-muted">
                      <span>{progress.daysLeft} days left</span>
                      <span>Ends {formatDate(subscription.currentPeriodEnd!)}</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-border" aria-hidden>
                      <div className="h-full rounded-full bg-primary" style={{ width: `${100 - progress.pct}%` }} />
                    </div>
                  </div>
                )}
              </>
            ) : subscription ? (
              <>
                <p className="font-display text-xl font-bold text-text">{humanize(subscription.status)}</p>
                <p className="mt-1 text-sm text-muted">
                  Your {subscription.plan.name} {subscription.status === "PENDING" ? "request is waiting for activation by our team." : "is no longer active."}
                </p>
              </>
            ) : (
              <>
                <p className="font-display text-xl font-bold text-text">No active subscription</p>
                <p className="mt-1 text-sm text-muted">Choose a pack to start watching. Our team confirms activation with you.</p>
              </>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {!live && (
              <ButtonLink href="/dashboard/plan">
                {subscription?.status === "PENDING" ? "View request" : "Subscribe now"} <ArrowRight className="h-4 w-4" aria-hidden />
              </ButtonLink>
            )}
            <ButtonLink href={live ? "/dashboard/apps" : "/dashboard/subscription"} variant="secondary">
              {live ? "Set up your devices" : "Subscription history"}
            </ButtonLink>
          </div>
        </section>

        {/* Quick actions */}
        <section aria-label="Quick actions" className="grid grid-cols-2 gap-4">
          {actions.map((a) => (
            <Link
              key={a.title}
              href={a.href}
              className={cn(panel, "group flex flex-col p-5 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/30")}
            >
              <span className="grid h-10 w-10 place-items-center rounded-[10px] bg-primary/10 text-accent transition-colors group-hover:bg-primary group-hover:text-on-primary">
                <a.icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="mt-4 font-semibold text-text">{a.title}</span>
              <span className="mt-1 text-sm leading-5 text-muted">{a.body}</span>
            </Link>
          ))}
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 [&>*]:min-w-0">
        {/* Recent transactions */}
        <section aria-labelledby="tx-heading" className={panel}>
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 id="tx-heading" className="font-display text-base font-bold text-text">
              Recent transactions
            </h2>
            <Link href="/dashboard/billing" className="text-sm font-medium text-accent hover:text-light-blue">
              View all
            </Link>
          </div>
          {data.recentPayments.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <Receipt className="mx-auto h-8 w-8 text-subtle" aria-hidden />
              <p className="mt-3 font-medium text-text">No transactions yet</p>
              <Link href="/dashboard/plan" className="mt-1 inline-block text-sm text-accent hover:text-light-blue">
                Choose your first pack
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {data.recentPayments.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 px-5 py-3.5 text-sm">
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-text">{p.subscription?.plan.name ?? "Payment"}</span>
                    <span className="text-xs text-subtle">{formatDateTime(p.createdAt)}</span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="font-semibold text-text tabular-nums">{formatMoney(p.amountCents, p.currency)}</span>
                    <StatusBadge status={p.status} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Recent tickets */}
        <section aria-labelledby="tk-heading" className={panel}>
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 id="tk-heading" className="font-display text-base font-bold text-text">
              Recent tickets
            </h2>
            <Link href="/dashboard/support" className="text-sm font-medium text-accent hover:text-light-blue">
              View all
            </Link>
          </div>
          {data.recentTickets.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <LifeBuoy className="mx-auto h-8 w-8 text-subtle" aria-hidden />
              <p className="mt-3 font-medium text-text">No support tickets</p>
              <Link href="/dashboard/support/new" className="mt-1 inline-block text-sm text-accent hover:text-light-blue">
                Create a ticket
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {data.recentTickets.map((t) => (
                <li key={t.id}>
                  <Link href={`/dashboard/support/${t.id}`} className="flex items-center justify-between gap-3 px-5 py-3.5 text-sm hover:bg-card-hover">
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-text">{t.subject}</span>
                      <span className="text-xs text-subtle">Updated {formatDateTime(t.updatedAt)}</span>
                    </span>
                    <StatusBadge status={t.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
