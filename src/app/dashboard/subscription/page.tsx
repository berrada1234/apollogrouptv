import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarClock,
  ClipboardList,
  Hourglass,
  MonitorSmartphone,
  ShieldCheck,
} from "lucide-react";
import { AutoRefresh } from "@/components/checkout/auto-refresh";
import { CopyField } from "@/components/dashboard/copy-field";
import {
  ActivationCelebration,
  CopyAllButton,
} from "@/components/dashboard/subscription-client";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/misc";
import { db } from "@/lib/db";
import { openAccess } from "@/lib/iptv-access";
import { requireUser } from "@/lib/session";
import { subscriptionDisplay } from "@/lib/subscription-status";
import { cn, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "My Subscription" };

const CELEBRATE_DAYS = 7;

export default async function MySubscriptionPage() {
  const user = await requireUser("/dashboard/subscription");
  const now = new Date();
  // Everything below is scoped to the signed-in customer; IPTV details are decrypted only here, for their owner.
  const [subscriptions, reviewing] = await Promise.all([
    db.subscription.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { plan: true, order: { select: { id: true, number: true } } },
    }),
    db.order.findFirst({
      where: {
        userId: user.id,
        status: { in: ["PENDING_CONFIRMATION", "UNDERPAID"] },
      },
      orderBy: { createdAt: "desc" },
      include: { plan: true },
    }),
  ]);
  const active = subscriptions
    .filter(
      (s) =>
        s.status === "ACTIVE" &&
        (!s.currentPeriodEnd || s.currentPeriodEnd > now),
    )
    .sort(
      (a, b) =>
        (b.currentPeriodEnd?.getTime() ?? Infinity) -
        (a.currentPeriodEnd?.getTime() ?? Infinity),
    )[0];
  const awaiting = subscriptions.find((s) => s.status === "PENDING");
  const access = active ? openAccess(active.accessEnc) : null;
  const daysLeft = active?.currentPeriodEnd
    ? Math.max(
        0,
        Math.ceil(
          (active.currentPeriodEnd.getTime() - now.getTime()) / 86_400_000,
        ),
      )
    : null;
  const celebrate = Boolean(
    active?.activatedAt &&
    now.getTime() - active.activatedAt.getTime() < CELEBRATE_DAYS * 86_400_000,
  );
  const pending = reviewing ?? awaiting;

  const fields = access
    ? (
        [
          ["IPTV Username", access.iptvUsername, false],
          ["IPTV Password", access.iptvPassword, true],
          ["M3U URL", access.m3uUrl, true],
          ["MAG URL", access.magUrl, false],
          ["Xtream Server", access.xtreamServer, false],
          ["Xtream Username", access.xtreamUsername, false],
          ["Xtream Password", access.xtreamPassword, true],
        ] as const
      ).filter(([, value]) => value)
    : [];
  const allText = active
    ? [
        "Apollo Group TV account details",
        "Status: Active",
        ...fields.map(([label, value]) => `${label}: ${value}`),
        `Start Date: ${formatDate(active.currentPeriodStart)}`,
        `Expiry Date: ${formatDate(active.currentPeriodEnd)}`,
        `Connection Limit: ${active.connectionLimit}`,
      ].join("\n")
    : "";

  return (
    <>
      {pending && !active && <AutoRefresh seconds={30} />}
      <PageHeader
        title="My Subscription"
        description="Your subscription status and IPTV account details."
      />

      {pending && (
        <section
          className={cn(
            "mb-6 flex flex-wrap items-start gap-4 rounded-[16px] border border-primary/30 bg-primary/[0.06] p-5",
            active && "py-4",
          )}
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/15 text-accent">
            <Hourglass
              className="h-5 w-5 animate-pulse motion-reduce:animate-none"
              aria-hidden
            />
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex flex-wrap items-center gap-2 font-semibold text-text">
              Status:{" "}
              <StatusBadge
                status="PENDING_CONFIRMATION"
                label="Pending Review"
              />
            </p>
            <p className="mt-1 text-sm leading-6 text-muted">
              {reviewing
                ? "Your payment confirmation has been received. We are reviewing your request."
                : "Your payment has been approved. We're activating your subscription now."}{" "}
              {!active &&
                "Your IPTV account details will appear here as soon as it's active."}
            </p>
          </div>
          {reviewing && (
            <ButtonLink
              href={`/dashboard/payment-review/${reviewing.id}`}
              variant="secondary"
              size="sm"
            >
              View status
            </ButtonLink>
          )}
        </section>
      )}

      {active ? (
        <div className="space-y-6">
          <ActivationCelebration confetti={celebrate} />

          <Card>
            <CardHeader
              title="Your IPTV Account Details"
              description={`${active.plan.name}${active.order?.number ? ` · Invoice ${active.order.number}` : ""}`}
              action={
                fields.length > 0 ? <CopyAllButton text={allText} /> : undefined
              }
            />
            <CardBody className="space-y-6">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-success/30 bg-success/[0.06] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-subtle">
                    Status
                  </p>
                  <p className="mt-2">
                    <StatusBadge status="ACTIVE" label="Active" />
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-inset p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-subtle">
                    Start Date
                  </p>
                  <p className="mt-1.5 font-semibold text-text">
                    {formatDate(active.currentPeriodStart)}
                  </p>
                </div>
                <div
                  className={cn(
                    "rounded-xl border p-4",
                    daysLeft !== null && daysLeft <= 7
                      ? "border-warning/40 bg-warning/[0.07]"
                      : "border-primary/30 bg-primary/[0.06]",
                  )}
                >
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-subtle">
                    <CalendarClock className="h-3.5 w-3.5" aria-hidden /> Expiry
                    Date
                  </p>
                  <p className="mt-1.5 font-display text-lg font-bold text-text">
                    {active.currentPeriodEnd
                      ? formatDate(active.currentPeriodEnd)
                      : "No end date"}
                  </p>
                  {daysLeft !== null && (
                    <p className="text-xs text-muted">
                      {daysLeft === 0
                        ? "Ends today"
                        : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`}
                    </p>
                  )}
                </div>
                <div className="rounded-xl border border-border bg-inset p-4">
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-subtle">
                    <MonitorSmartphone className="h-3.5 w-3.5" aria-hidden />{" "}
                    Connection Limit
                  </p>
                  <p className="mt-1.5 font-semibold text-text">
                    {active.connectionLimit} device
                    {active.connectionLimit === 1 ? "" : "s"} at once
                  </p>
                </div>
              </div>

              {fields.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {fields.map(([label, value, secret]) => (
                    <CopyField
                      key={label}
                      label={label}
                      value={value}
                      secret={secret}
                      compact
                    />
                  ))}
                </div>
              ) : (
                <p className="rounded-xl border border-border bg-inset p-4 text-sm text-muted">
                  Your login details aren&apos;t on this page yet. Check{" "}
                  <Link
                    href="/dashboard/profile#player-login"
                    className="text-accent hover:text-light-blue"
                  >
                    My Accounts
                  </Link>{" "}
                  or{" "}
                  <Link
                    href="/dashboard/support/new"
                    className="text-accent hover:text-light-blue"
                  >
                    contact support
                  </Link>
                  .
                </p>
              )}
              <p className="flex items-start gap-2 text-xs leading-5 text-subtle">
                <ShieldCheck
                  className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                  aria-hidden
                />
                <span>
                  These details are private to your account. Don&apos;t share
                  them: using more devices than your connection limit can
                  interrupt playback. Need help setting up?{" "}
                  <Link
                    href="/dashboard/apps"
                    className="text-accent hover:text-light-blue"
                  >
                    Apps &amp; Guides
                  </Link>
                </span>
              </p>
            </CardBody>
          </Card>
        </div>
      ) : (
        !pending && (
          <EmptyState
            icon={ClipboardList}
            title="No active subscription"
            description="Choose a pack and complete your payment. Your IPTV account details will appear here once it's activated."
            action={
              <ButtonLink href="/dashboard/plan">Choose a pack</ButtonLink>
            }
          />
        )
      )}

      {subscriptions.length > 0 && (
        <Card className="mt-8">
          <CardHeader title="Subscription history" />
          <CardBody className="divide-y divide-border p-0">
            {subscriptions.map((s) => {
              const d = subscriptionDisplay(s, null, now);
              return (
                <div
                  key={s.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 text-sm"
                >
                  <div>
                    <p className="font-medium text-text">{s.plan.name}</p>
                    <p className="text-xs text-muted">
                      {formatDate(s.currentPeriodStart)} –{" "}
                      {formatDate(s.currentPeriodEnd)}
                      {s.order?.number ? ` · ${s.order.number}` : ""}
                    </p>
                  </div>
                  <StatusBadge status={d.key} label={d.label} />
                </div>
              );
            })}
          </CardBody>
        </Card>
      )}
    </>
  );
}
