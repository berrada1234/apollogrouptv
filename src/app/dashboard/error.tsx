"use client";

import { AlertTriangle } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";

/** Keeps the sidebar and header in place when a dashboard page fails to load. */
export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div role="alert" className="mx-auto max-w-md py-16 text-center">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-error/10 text-error">
        <AlertTriangle className="h-6 w-6" aria-hidden />
      </span>
      <h2 className="mt-5 font-display text-2xl font-semibold text-text">This page couldn&apos;t load</h2>
      <p className="mt-2 text-sm text-muted">Your account data is safe. Try again, or contact support if it keeps happening.</p>
      {error.digest && <p className="mt-2 font-mono text-xs text-subtle">Reference: {error.digest}</p>}
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Button onClick={reset}>Try again</Button>
        <ButtonLink href="/dashboard/support/new" variant="secondary">
          Contact support
        </ButtonLink>
      </div>
    </div>
  );
}
