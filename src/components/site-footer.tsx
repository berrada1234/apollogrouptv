import Link from "next/link";
import { Logo } from "@/components/logo";
import { buttonClasses } from "@/components/ui/button";
import { footerNav, siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-bg-secondary">
      <div className="footer-cta mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 rounded-lg border border-primary/25 bg-gradient-to-r from-[#0b2a30] to-card px-6 py-6 shadow-card sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="font-display text-lg font-semibold text-text">Ready when you are.</p>
            <p className="mt-1 text-sm text-muted">Create your account, pick a plan and get set up in minutes.</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Link href="/create-account" className={buttonClasses({ size: "sm" })}>
              Get started
            </Link>
            <Link href="/plans" className={buttonClasses({ size: "sm", variant: "ghost" })}>
              See plans
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.3fr_repeat(5,1fr)]">
          <div className="max-w-xs">
            <Logo height={44} />
            <p className="mt-4 text-sm leading-relaxed text-muted">
              A digital entertainment platform with clear plans, an organized catalog and support that answers.
            </p>
            <Link href="/client-portal" className="mt-4 inline-block text-sm font-medium text-accent hover:text-light-blue">
              Need help? Open a support request →
            </Link>
          </div>
          {footerNav.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="text-sm font-semibold text-text">{group.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted transition-colors hover:text-text">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>Only authorized, properly licensed content is listed in our catalog.</p>
        </div>
      </div>
    </footer>
  );
}
