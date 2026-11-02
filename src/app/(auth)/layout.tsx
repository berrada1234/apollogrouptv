import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, LifeBuoy, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

function BrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden border-r border-border bg-bg-secondary lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
      <div className="bg-spotlight pointer-events-none absolute inset-0" aria-hidden />
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
      <Logo className="relative" height={52} />

      <div className="relative">
        <h2 className="max-w-md font-display text-3xl font-semibold leading-tight tracking-tight text-text xl:text-4xl">
          One account for your plan, billing and support.
        </h2>
        <p className="mt-4 max-w-md text-muted">Sign in to see where everything stands — no emails to dig through.</p>

        {/* Illustrative account preview */}
        <div className="mt-10 max-w-sm space-y-3" aria-hidden>
          <div className="rounded-lg border border-border-strong bg-card p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs text-subtle">Subscription</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[11px] text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" /> Active
              </span>
            </div>
            <p className="mt-1 font-display text-lg font-semibold text-text">Quarterly plan</p>
            <div className="mt-3 h-1.5 rounded-full bg-inset">
              <div className="h-1.5 w-3/5 rounded-full bg-accent" />
            </div>
          </div>
          <div className="ml-8 flex items-center gap-3 rounded-lg border border-border bg-card/90 p-4 shadow-card">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
            <div>
              <p className="text-sm font-medium text-text">Ticket resolved</p>
              <p className="text-xs text-subtle">Support replied to your request</p>
            </div>
          </div>
        </div>
      </div>

      <ul className="relative flex gap-6 text-xs text-subtle">
        <li className="inline-flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-accent" aria-hidden /> Verified sign-in
        </li>
        <li className="inline-flex items-center gap-1.5">
          <LifeBuoy className="h-4 w-4 text-accent" aria-hidden /> Ticket support
        </li>
      </ul>
    </aside>
  );
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1fr]">
      <BrandPanel />
      <main id="main" className="relative flex flex-col px-5 py-6 sm:px-10 sm:py-8">
        <div className="bg-spotlight pointer-events-none absolute inset-0 lg:hidden" aria-hidden />
        <div className="relative flex items-center justify-between">
          <Logo className="lg:hidden" height={34} />
          <Link href="/" className="ml-auto inline-flex items-center gap-1.5 text-sm text-muted hover:text-text">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to site
          </Link>
        </div>
        <div className="relative flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-[420px]">{children}</div>
        </div>
        <p className="relative text-center text-xs text-subtle">
          By continuing you agree to our{" "}
          <Link href="/terms-and-conditions" className="underline-offset-2 hover:text-muted hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="underline-offset-2 hover:text-muted hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </main>
    </div>
  );
}
