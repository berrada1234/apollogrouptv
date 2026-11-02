"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { mainNav } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const { data: session, isPending } = useSession();

  // Close the mobile menu after navigation (state adjusted during render, not in an effect).
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const authActions = isPending ? (
    <span className="h-10 w-40" aria-hidden />
  ) : session ? (
    <ButtonLink href="/dashboard" size="sm">
      Dashboard
    </ButtonLink>
  ) : (
    <>
      <ButtonLink href="/sign-in" variant="ghost" size="sm">
        Sign in
      </ButtonLink>
      <ButtonLink href="/create-account" size="sm">
        Create account
      </ButtonLink>
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo priority />
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-0.5 xl:gap-1">
            {mainNav.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "whitespace-nowrap rounded-lg px-2 py-2 text-[13px] font-medium transition-colors xl:px-3 xl:text-sm",
                      active ? "text-text" : "text-muted hover:text-text",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="hidden items-center gap-2 lg:flex">{authActions}</div>
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg text-muted hover:bg-card hover:text-text lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div id="mobile-nav" className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border bg-bg lg:hidden">
          <nav aria-label="Mobile" className="px-4 py-4">
            <ul className="space-y-1">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="block rounded-lg px-3 py-3 text-base font-medium text-muted hover:bg-card hover:text-text aria-[current=page]:bg-card aria-[current=page]:text-text"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-2 border-t border-border pt-6 [&>a]:w-full">{authActions}</div>
          </nav>
        </div>
      )}
    </header>
  );
}
