import Link from "next/link";
import { cn } from "@/lib/utils";

/** Tabs that tie related dashboard pages into one section (e.g. My Accounts → Profile · Security · Notifications). */
export function SectionTabs({ tabs, current }: { tabs: { href: string; label: string; badge?: number }[]; current: string }) {
  return (
    <nav aria-label="Section" className="no-scrollbar -mx-4 mb-6 flex gap-1 overflow-x-auto border-b border-border px-4 sm:mx-0 sm:px-0">
      {tabs.map((t) => {
        const active = t.href === current;
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative -mb-px inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
              active ? "border-primary text-text" : "border-transparent text-muted hover:text-text",
            )}
          >
            {t.label}
            {t.badge ? <span className="rounded-full bg-primary px-1.5 text-[10px] font-semibold text-on-primary">{t.badge}</span> : null}
          </Link>
        );
      })}
    </nav>
  );
}

export const accountTabs = (unread = 0) => [
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/dashboard/security", label: "Security" },
  { href: "/dashboard/notifications", label: "Notifications", badge: unread },
];

export const planTabs = [
  { href: "/dashboard/plan", label: "My plan" },
  { href: "/dashboard/subscription", label: "My Account" },
];
