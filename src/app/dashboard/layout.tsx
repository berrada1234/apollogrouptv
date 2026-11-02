import type { Metadata } from "next";
import { AppShell, type NavItem } from "@/components/app-shell";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | Dashboard" },
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser("/dashboard");
  const [unread, openTickets] = await Promise.all([
    db.notification.count({ where: { userId: user.id, readAt: null } }),
    db.supportTicket.count({ where: { userId: user.id, status: "WAITING_ON_CUSTOMER" } }),
  ]);

  const nav: NavItem[] = [
    { href: "/dashboard", label: "Overview", icon: "overview", short: "Home" },
    { href: "/dashboard/profile", label: "My Account", icon: "profile", short: "Account" },
    { href: "/dashboard/plan", label: "My Plan", icon: "plan", short: "Plan" },
    { href: "/dashboard/subscription", label: "Subscription Details", icon: "subscription" },
    { href: "/dashboard/billing", label: "Billing History", icon: "billing" },
    { href: "/dashboard/referrals", label: "Referral Program", icon: "referrals" },
    { href: "/dashboard/support", label: "Support Tickets", icon: "support", badge: openTickets, short: "Support" },
    { href: "/dashboard/notifications", label: "Notifications", icon: "notifications", badge: unread },
    { href: "/dashboard/security", label: "Security Settings", icon: "security" },
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
      mobileTabs={["/dashboard", "/dashboard/plan", "/dashboard/support", "/dashboard/profile"]}
    >
      {children}
    </AppShell>
  );
}
