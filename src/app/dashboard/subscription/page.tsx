import type { Metadata } from "next";
import Link from "next/link";
import { Star } from "lucide-react";
import { AutoRefresh } from "@/components/checkout/auto-refresh";
import { AccountField } from "@/components/dashboard/subscription-client";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { db } from "@/lib/db";
import { openAccess } from "@/lib/iptv-access";
import { monthsFor } from "@/lib/pricing";
import { requireUser } from "@/lib/session";
import { subscriptionDisplay } from "@/lib/subscription-status";

export const metadata: Metadata = { title: "My Account" };

function durationLabel(months: number) {
  if (months === 0) return "Lifetime";
  if (months % 12 === 0) return `${months / 12} Year${months === 12 ? "" : "s"}`;
  return `${months} Month${months === 1 ? "" : "s"}`;
}

/** 2027-08-30 */
function isoDate(date: Date | null | undefined) {
  return date ? date.toISOString().slice(0, 10) : "";
}

export default async function MyAccountPage() {
  const user = await requireUser("/dashboard/subscription");
  const now = new Date();
  // Only the signed-in customer's records are loaded; IPTV details are decrypted here for their owner only.
  const [subscriptions, reviewing] = await Promise.all([
    db.subscription.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, include: { plan: true } }),
    db.order.findFirst({ where: { userId: user.id, status: { in: ["PENDING_CONFIRMATION", "UNDERPAID"] } }, orderBy: { createdAt: "desc" }, include: { plan: true } }),
  ]);
  const active = subscriptions
    .filter((s) => s.status === "ACTIVE" && (!s.currentPeriodEnd || s.currentPeriodEnd > now))
    .sort((a, b) => (b.currentPeriodEnd?.getTime() ?? Infinity) - (a.currentPeriodEnd?.getTime() ?? Infinity))[0];
  const shown = active ?? subscriptions[0];
  const status = shown ? subscriptionDisplay(shown, null, now) : reviewing ? { key: "PENDING_CONFIRMATION", label: "Pending Review" } : null;
  // Login details appear only once an admin has saved them and activated the subscription.
  const access = active ? openAccess(active.accessEnc) : null;
  const plan = shown?.plan ?? reviewing?.plan;

  return (
    <div className="mx-auto max-w-2xl">
      <AutoRefresh seconds={30} />
      <PageHeader title="My Account" />
      <section className="overflow-hidden rounded-[18px] border border-border bg-card shadow-card">
        <div className="border-b border-border px-5 py-5">
          <h2 className="font-display text-lg font-bold text-text">Apollo Group TV Subscription{plan ? ` — ${durationLabel(monthsFor(plan.interval))}` : ""}</h2>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted">
            Subscription Status:{" "}
            {status ? (
              <StatusBadge status={status.key} label={status.label} />
            ) : (
              <>
                <span className="text-text">No active subscription</span>
                <Link href="/dashboard/plan" className="text-accent hover:text-light-blue">
                  Choose a pack
                </Link>
              </>
            )}
          </p>
        </div>
        <div className="divide-y divide-border">
          <AccountField label="Username" value={access?.iptvUsername ?? ""} />
          <AccountField label="Password" value={access?.iptvPassword ?? ""} secret />
          <AccountField label="Expiration Date" value={active ? isoDate(active.currentPeriodEnd) : ""} />
          <AccountField label="Connection Limit" value={active ? String(active.connectionLimit) : ""} />
          <AccountField label="M3U URL" value={access?.m3uUrl ?? ""} secret />
          <AccountField label="MAG URL" value={access?.magUrl ?? ""} />
          <AccountField label="Xtream Server" value={access?.xtreamServer ?? ""} />
          <AccountField label="Xtream Username" value={access?.xtreamUsername ?? ""} />
          <AccountField label="Xtream Password" value={access?.xtreamPassword ?? ""} secret />
        </div>
      </section>
      <ButtonLink href="/reviews#write" variant="secondary" className="mt-6 w-full">
        <Star className="h-4 w-4" aria-hidden /> Rate Our Service
      </ButtonLink>
    </div>
  );
}
