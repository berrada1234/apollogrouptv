import type { Metadata } from "next";
import { AppShell, type NavItem } from "@/components/app-shell";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { AttentionWatcher } from "@/components/admin/attention-watcher";
import { adminAttention } from "@/lib/admin-attention";
import { db } from "@/lib/db";
import { hasRole, requireRole } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole("SUPPORT");
  const isAdmin = hasRole(user, "ADMIN");
  const [counts, adminUnread, account] = await Promise.all([
    adminAttention(user.id, isAdmin),
    isAdmin ? db.notification.count({ where: { userId: user.id, audience: "ADMIN", readAt: null } }) : 0,
    db.user.findUnique({ where: { id: user.id }, select: { twoFactorEnabled: true } }),
  ]);
  const { openTickets, pendingReviews, newMessages, paymentsToReview, toActivate, newSignups } = counts;
  const attentionKey = [paymentsToReview, toActivate, newSignups, openTickets, newMessages, pendingReviews].join(",");

  const nav: NavItem[] = [
    { href: "/admin", label: "Overview", icon: "overview", short: "Home" },
    ...(isAdmin
      ? ([
          { href: "/admin/funnel", label: "Conversion funnel", icon: "funnel" },
          { href: "/admin/leads", label: "Not purchased", icon: "leads", short: "Leads", badge: newSignups, badgeTone: "alert" },
          { href: "/admin/users", label: "Users", icon: "users" },
          { href: "/admin/plans", label: "Plans", icon: "plan" },
          { href: "/admin/subscriptions", label: "Subscriptions", icon: "subscription", badge: toActivate, badgeTone: "alert" },
          { href: "/admin/payments", label: "Orders & Payments", icon: "payments", short: "Orders", badge: paymentsToReview, badgeTone: "alert" },
          { href: "/admin/payment-methods", label: "Payment Methods", icon: "wallet" },
          { href: "/admin/channels", label: "Channels", icon: "channels" },
        ] satisfies NavItem[])
      : []),
    { href: "/admin/reviews", label: "Reviews", icon: "reviews", badge: pendingReviews },
    ...(isAdmin
      ? ([
          { href: "/admin/faq", label: "FAQ", icon: "faq" },
          { href: "/admin/referrals", label: "Referrals", icon: "referrals" },
        ] satisfies NavItem[])
      : []),
    { href: "/admin/support", label: "Support", icon: "support", badge: openTickets },
    { href: "/admin/messages", label: "Messages", icon: "mail", badge: newMessages },
    // Every staff member manages their own two-step sign-in here; the red dot stays until it's on.
    { href: "/admin/security", label: "Security (2FA)", icon: "security", short: "2FA", badge: account?.twoFactorEnabled ? 0 : 1, badgeTone: "alert" },
    ...(isAdmin
      ? ([
          { href: "/admin/settings", label: "Settings", icon: "settings" },
          { href: "/admin/settings#social", label: "Social media", icon: "social" },
          { href: "/admin/seo", label: "SEO", icon: "seo" },
          { href: "/admin/audit-logs", label: "Audit Logs", icon: "audit" },
        ] satisfies NavItem[])
      : []),
  ];

  return (
    <AppShell
      nav={nav}
      area={isAdmin ? "Administration" : "Support staff"}
      extraLinks={[
        { href: "/dashboard", label: "My dashboard", icon: "profile" },
        { href: "/", label: "View website", icon: "home" },
      ]}
      user={{ name: user.name, email: user.email, role: user.role }}
      bell={isAdmin ? { href: "/admin/notifications", count: adminUnread } : undefined}
      mobileTabs={isAdmin ? ["/admin", "/admin/leads", "/admin/payments", "/admin/subscriptions"] : ["/admin", "/admin/support", "/admin/reviews"]}
    >
      <AttentionWatcher initial={attentionKey} latestSignupId={counts.latestSignup?.id ?? null} />
      {!account?.twoFactorEnabled && (
        <Link
          href="/admin/security#two-step"
          className="mb-6 flex items-center gap-3 rounded-2xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-text hover:border-warning/70"
        >
          <ShieldAlert className="h-5 w-5 shrink-0 text-warning" aria-hidden />
          <span>
            <span className="font-medium">Protect this staff account.</span>{" "}
            <span className="text-muted">Turn on two-step sign-in so a stolen password alone can’t open the admin area.</span>
          </span>
        </Link>
      )}
      {children}
    </AppShell>
  );
}
