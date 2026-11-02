"use client";

import { AlertTriangle } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main" className="flex flex-1 items-center justify-center px-4 py-24">
      <div className="max-w-md text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-error/10 text-error">
          <AlertTriangle className="h-7 w-7" aria-hidden />
        </span>
        <h1 className="mt-6 font-display text-3xl font-semibold text-text">Something went wrong</h1>
        <p className="mt-3 text-muted">An unexpected error occurred. Please try again. If the problem continues, contact support.</p>
        {error.digest && <p className="mt-2 font-mono text-xs text-muted">Reference: {error.digest}</p>}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={reset}>Try again</Button>
          <ButtonLink href="/" variant="secondary">
            Go home
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
