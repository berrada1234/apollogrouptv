"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  MonitorSmartphone,
  Search,
  Bell,
  ChevronDown,
  ClipboardList,
  CreditCard,
  FileClock,
  Gift,
  HelpCircle,
  Home,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Mail,
  Menu,
  MessageSquareText,
  Package,
  Receipt,
  Settings,
  ShieldCheck,
  Tv,
  User,
  Users,
  X,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { authClient } from "@/lib/auth-client";
import { cn, initials } from "@/lib/utils";

const icons = {
  overview: LayoutDashboard,
  profile: User,
  plan: Package,
  subscription: ClipboardList,
  billing: Receipt,
  referrals: Gift,
  support: LifeBuoy,
  notifications: Bell,
  security: ShieldCheck,
  users: Users,
  payments: CreditCard,
  channels: Tv,
  reviews: MessageSquareText,
  faq: HelpCircle,
  settings: Settings,
  audit: FileClock,
  home: Home,
  mail: Mail,
  seo: Search,
  apps: MonitorSmartphone,
};

export type NavIcon = keyof typeof icons;
export type NavItem = {
  href: string;
  label: string;
  icon: NavIcon;
  badge?: number;
  /** Label for the phone tab bar. */
  short?: string;
  /** Other paths that belong to this section (keeps the item highlighted on its sub-pages). */
  match?: string[];
};

export function AppShell({
  nav,
  user,
  area,
  extraLinks,
  bell,
  mobileTabs,
  children,
}: {
  nav: NavItem[];
  user: { name: string; email: string; role: string };
  area: string;
  extraLinks?: NavItem[];
  /** Notification bell in the top bar. */
  bell?: { href: string; count: number };
  /** Up to four hrefs from `nav` shown in the phone bottom bar (plus “More”). */
  mobileTabs?: string[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const rootHref = nav[0]?.href;
  const matches = (href: string) => (href === rootHref ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));
  const isActive = (href: string) => {
    const item = nav.find((n) => n.href === href);
    return matches(href) || Boolean(item?.match?.some(matches));
  };
  const current = nav.find((n) => isActive(n.href));
  const tabs = (mobileTabs ?? []).map((h) => nav.find((n) => n.href === h)).filter((n): n is NavItem => Boolean(n)).slice(0, 4);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-border px-5">
        <Logo height={34} />
      </div>
      <p className="px-5 pt-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-subtle">{area}</p>
      <nav aria-label={area} className="flex-1 overflow-y-auto px-3 py-3">
        <ul className="space-y-0.5">
          {nav.map((item) => {
            const Icon = icons[item.icon];
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/12 text-light-blue before:absolute before:inset-y-2 before:-left-3 before:w-[3px] before:rounded-r before:bg-accent"
                      : "text-muted hover:bg-card hover:text-text",
                  )}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
                  <span className="flex-1">{item.label}</span>
                  {item.badge ? (
                    <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-on-primary">{item.badge}</span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
        {extraLinks && extraLinks.length > 0 && (
          <ul className="mt-4 space-y-0.5 border-t border-border pt-4">
            {extraLinks.map((item) => {
              const Icon = icons[item.icon];
              return (
                <li key={item.href}>
                  <Link href={item.href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted hover:bg-card hover:text-text">
                    <Icon className="h-[18px] w-[18px]" aria-hidden /> {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </nav>
      <div className="border-t border-border p-3">
        <SignOutButton className="w-full" />
      </div>
    </div>
  );

  return (
    <div className="flex min-h-dvh">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-bg-secondary lg:block">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <button type="button" className="absolute inset-0 bg-black/60" aria-label="Close navigation" onClick={() => setOpen(false)} />
          <aside className="relative h-full w-72 max-w-[85vw] border-r border-border bg-bg-secondary">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3.5 grid h-9 w-9 place-items-center rounded-lg text-muted hover:text-text"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      {tabs.length > 0 && (
        <nav aria-label="Quick navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg-secondary/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
          <ul className="grid grid-cols-5">
            {tabs.map((item) => {
              const Icon = icons[item.icon];
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn("relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium", active ? "text-light-blue" : "text-muted")}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                    <span className="max-w-full truncate px-1">{item.short ?? item.label}</span>
                    {item.badge ? <span className="absolute right-[calc(50%-18px)] top-1.5 h-2 w-2 rounded-full bg-primary" aria-label={`${item.badge} new`} /> : null}
                  </Link>
                </li>
              );
            })}
            <li>
              <button type="button" onClick={() => setOpen(true)} aria-expanded={open} className="flex w-full flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted">
                <Menu className="h-5 w-5" aria-hidden />
                More
              </button>
            </li>
          </ul>
        </nav>
      )}

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-bg/85 px-4 backdrop-blur-xl sm:px-6">
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-lg text-muted hover:bg-card hover:text-text lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
            aria-expanded={open}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="hidden text-xs text-subtle sm:block">{area}</p>
            <p className="truncate font-display text-sm font-semibold text-text sm:text-base">{current?.label ?? area}</p>
          </div>
          {bell && (
            <Link
              href={bell.href}
              className="relative grid h-10 w-10 place-items-center rounded-xl text-muted transition-colors hover:bg-card hover:text-text"
              aria-label={bell.count ? `Notifications, ${bell.count} unread` : "Notifications"}
            >
              <Bell className="h-5 w-5" aria-hidden />
              {bell.count > 0 && (
                <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-on-primary ring-2 ring-bg">
                  {bell.count > 9 ? "9+" : bell.count}
                </span>
              )}
            </Link>
          )}
          <UserMenu user={user} />
        </header>
        <main id="main" className={cn("flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10", tabs.length > 0 && "pb-28 lg:pb-8")}>
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

function UserMenu({ user }: { user: { name: string; email: string; role: string } }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 hover:bg-card"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-accent to-primary text-xs font-semibold text-on-primary">
          {initials(user.name)}
        </span>
        <span className="hidden text-left sm:block">
          <span className="block max-w-40 truncate text-sm font-medium text-text">{user.name}</span>
        </span>
        <ChevronDown className="h-4 w-4 text-muted" aria-hidden />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 mt-2 w-64 overflow-hidden rounded-card border border-border bg-card shadow-2xl">
          <div className="border-b border-border px-4 py-3">
            <p className="truncate text-sm font-medium text-text">{user.name}</p>
            <p className="truncate text-xs text-muted">{user.email}</p>
          </div>
          <div className="p-1.5">
            {[
              { href: "/dashboard", label: "Dashboard" },
              { href: "/dashboard/profile", label: "My profile" },
              { href: "/dashboard/security", label: "Security" },
              ...(user.role !== "USER" ? [{ href: "/admin", label: "Admin dashboard" }] : []),
              { href: "/", label: "Back to website" },
            ].map((l) => (
              <Link key={l.href} role="menuitem" href={l.href} className="block rounded-lg px-3 py-2 text-sm text-muted hover:bg-card-hover hover:text-text">
                {l.label}
              </Link>
            ))}
            <SignOutButton className="mt-1 w-full" role="menuitem" />
          </div>
        </div>
      )}
    </div>
  );
}

export function SignOutButton({ className, role }: { className?: string; role?: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  return (
    <button
      type="button"
      role={role}
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await authClient.signOut();
        router.replace("/sign-in");
        router.refresh();
      }}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-error/10 hover:text-error disabled:opacity-60",
        className,
      )}
    >
      <LogOut className="h-[18px] w-[18px]" aria-hidden /> {pending ? "Signing out…" : "Log out"}
    </button>
  );
}
