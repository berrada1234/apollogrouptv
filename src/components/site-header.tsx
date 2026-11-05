"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { isNavActive, mainNav, secondaryNav } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useScrolledPast } from "@/lib/use-scrolled-past";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // The bar condenses once the page scrolls, so the hero gets the full first screen.
  const scrolled = useScrolledPast("12px");
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
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4">
      <div
        className={cn(
          "mx-auto flex h-[3.75rem] max-w-7xl items-center justify-between gap-4 rounded-full pl-5 pr-2.5 transition-[background-color,border-color,box-shadow] duration-300",
          scrolled || open ? "glass-blur shadow-[0_20px_50px_-24px_rgb(0_0_0/0.9)]" : "border border-transparent",
        )}
      >
        <Logo priority height={34} />
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {mainNav.map((item) => {
              const active = isNavActive(item, pathname);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : active ? "true" : undefined}
                    className={cn(
                      "relative whitespace-nowrap rounded-full px-2.5 py-2 text-[13px] font-medium transition-colors xl:px-3.5 xl:text-sm",
                      active ? "bg-white/[0.07] text-text" : "text-muted hover:text-text",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="hidden items-center gap-1.5 lg:flex">{authActions}</div>
        <button
          type="button"
          className="relative z-10 grid h-11 w-11 place-items-center rounded-full text-text hover:bg-white/[0.07] lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div id="mobile-nav" className="fixed inset-x-0 bottom-0 top-[4.5rem] overflow-y-auto bg-[rgb(5_6_15/0.94)] backdrop-blur-xl lg:hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_40%_at_80%_0%,rgb(122_162_255/0.18),transparent_70%)]" aria-hidden />
          <nav aria-label="Mobile" className="relative px-6 pb-10 pt-6">
            <ul>
              {mainNav.map((item, i) => (
                <li key={item.href} className="rise border-b border-border" style={{ "--d": i * 0.5 } as React.CSSProperties}>
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="block py-4 font-hero text-xl font-medium tracking-[-0.03em] text-muted transition-colors hover:text-text aria-[current=page]:text-text"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="rise mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm" style={{ "--d": 4 } as React.CSSProperties} aria-label="More">
              {secondaryNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-muted hover:text-text">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="rise mt-8 flex flex-col gap-2 [&>a]:h-12 [&>a]:w-full" style={{ "--d": 4.5 } as React.CSSProperties}>
              {authActions}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
