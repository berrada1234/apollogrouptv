import type { Metadata } from "next";
import { AppShell, type NavItem } from "@/components/app-shell";
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
  const [openTickets, pendingReviews, newMessages] = await Promise.all([
    db.supportTicket.count({ where: { status: { in: ["OPEN", "IN_PROGRESS"] } } }),
    db.review.count({ where: { status: "PENDING" } }),
    db.contactMessage.count({ where: { status: "NEW" } }),
  ]);
  const adminUnread = isAdmin ? await db.notification.count({ where: { userId: user.id, audience: "ADMIN", readAt: null } }) : 0;

  const nav: NavItem[] = [
    { href: "/admin", label: "Overview", icon: "overview", short: "Home" },
    ...(isAdmin
      ? ([
          { href: "/admin/funnel", label: "Conversion funnel", icon: "funnel" },
          { href: "/admin/users", label: "Users", icon: "users" },
          { href: "/admin/plans", label: "Plans", icon: "plan" },
          { href: "/admin/subscriptions", label: "Subscriptions", icon: "subscription" },
          { href: "/admin/payments", label: "Orders & Payments", icon: "payments" },
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
    ...(isAdmin
      ? ([
          { href: "/admin/settings", label: "Settings", icon: "settings" },
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
      mobileTabs={isAdmin ? ["/admin", "/admin/users", "/admin/support", "/admin/reviews"] : ["/admin", "/admin/support", "/admin/reviews"]}
    >
      {children}
    </AppShell>
  );
}
