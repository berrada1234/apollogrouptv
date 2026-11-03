import type { Metadata } from "next";
import { AppShell, type NavItem } from "@/components/app-shell";
import Link from "next/link";
import { Gift, Heart } from "lucide-react";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | Dashboard" },
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser("/dashboard");
  const [unread, openTickets, settings] = await Promise.all([
    db.notification.count({ where: { userId: user.id, audience: "USER", readAt: null } }),
    db.supportTicket.count({ where: { userId: user.id, status: "WAITING_ON_CUSTOMER" } }),
    getSettings(),
  ]);
  // The reward headline is shown only once the owner enables the program with a written reward.
  const reward = settings.referral.enabled && settings.referral.rewardDescription ? settings.referral.rewardDescription : null;
  const sidebarFooter = (
    <div className="space-y-2">
      <div className="rounded-xl border border-primary/25 bg-[#07191d] p-4 text-center">
        <span className="mx-auto grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-accent">
          <Gift className="h-4 w-4" aria-hidden />
        </span>
        <p className="mt-2 font-display text-sm font-bold text-text">{reward ?? "Invite your friends"}</p>
        <p className="mt-0.5 text-xs text-subtle">{reward ? "for every referred friend" : "Share your personal link"}</p>
        <Link href="/dashboard/referrals" className="mt-3 block rounded-lg bg-primary py-2 text-xs font-semibold text-on-primary hover:bg-primary-hover">
          Refer a friend
        </Link>
      </div>
      <Link href="/dashboard/support/new?topic=gift" className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5 hover:border-border-strong">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-error/10 text-error">
          <Heart className="h-4 w-4" aria-hidden />
        </span>
        <span className="min-w-0">
          <span className="block text-xs font-semibold text-text">Gift a pack</span>
          <span className="block text-[11px] text-subtle">Buy for someone special</span>
        </span>
      </Link>
    </div>
  );

  const nav: NavItem[] = [
    { href: "/dashboard", label: "Dashboard", icon: "overview", short: "Home" },
    { href: "/dashboard/profile", label: "My Accounts", icon: "profile", short: "Account", badge: unread, match: ["/dashboard/security", "/dashboard/notifications"] },
    { href: "/dashboard/apps", label: "Apps & Guides", icon: "apps", short: "Apps" },
    { href: "/dashboard/subscription", label: "My Subscription", icon: "subscription", match: ["/dashboard/payment-review"] },
    { href: "/dashboard/plan", label: "Plans & Billing", icon: "plan", short: "Plans" },
    { href: "/dashboard/billing", label: "Transactions", icon: "billing" },
    { href: "/dashboard/referrals", label: "Referrals & Gifts", icon: "referrals" },
    { href: "/dashboard/support", label: "Support", icon: "support", badge: openTickets, short: "Support" },
  ];

  const extra: NavItem[] = [
    ...(user.role !== "USER" ? [{ href: "/admin", label: "Admin dashboard", icon: "settings" as const }] : []),
    { href: "/", label: "Back to website", icon: "home" },
  ];

  return (
    <AppShell
      nav={nav}
      extraLinks={extra}
      area="My account"
      user={{ name: user.name, email: user.email, role: user.role }}
      bell={{ href: "/dashboard/notifications", count: unread }}
      mobileTabs={["/dashboard", "/dashboard/apps", "/dashboard/plan", "/dashboard/support"]}
      sidebarFooter={sidebarFooter}
    >
      {children}
    </AppShell>
  );
}
