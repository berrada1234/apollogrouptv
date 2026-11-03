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
    { href: "/dashboard", label: "Dashboard", icon: "overview", short: "Home" },
    { href: "/dashboard/profile", label: "My Accounts", icon: "profile", short: "Account", badge: unread, match: ["/dashboard/security", "/dashboard/notifications"] },
    { href: "/dashboard/apps", label: "Apps & Guides", icon: "apps", short: "Apps" },
    { href: "/dashboard/plan", label: "Plans & Billing", icon: "plan", short: "Plans", match: ["/dashboard/subscription"] },
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
    >
      {children}
    </AppShell>
  );
}
