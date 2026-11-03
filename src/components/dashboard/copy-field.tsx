"use client";

import { useState } from "react";
import { Check, Copy, Eye, EyeOff } from "lucide-react";

/** A value the customer types into another app (a code or server address) with a one-tap copy button. */
export function CopyField({
  label,
  value,
  secret = false,
  compact = false,
}: {
  label: string;
  value: string;
  /** Masked until the owner reveals it. */ secret?: boolean;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [shown, setShown] = useState(!secret);
  return (
    <div
      className={
        compact
          ? "rounded-xl border border-border bg-inset px-4 py-3"
          : "rounded-xl border border-border bg-inset p-4"
      }
    >
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-subtle">
        {label}
      </p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <code
          className={`min-w-0 break-all font-mono font-semibold text-text ${compact ? "text-sm" : "text-lg"}`}
        >
          {shown ? value : "••••••••••"}
        </code>
        <div className="flex shrink-0 gap-2">
          {secret && (
            <button
              type="button"
              onClick={() => setShown((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border-strong px-3 py-1.5 text-sm font-medium text-text transition-colors hover:border-primary/40"
              aria-label={shown ? `Hide ${label}` : `Show ${label}`}
            >
              {shown ? (
                <EyeOff className="h-4 w-4" aria-hidden />
              ) : (
                <Eye className="h-4 w-4" aria-hidden />
              )}
            </button>
          )}
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(value);
                setCopied(true);
                setTimeout(() => setCopied(false), 1800);
              } catch {
                setCopied(false);
              }
            }}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border-strong px-3 py-1.5 text-sm font-medium text-text transition-colors hover:border-primary/40"
            aria-label={`Copy ${label}`}
          >
            {copied ? (
              <Check className="h-4 w-4 text-success" aria-hidden />
            ) : (
              <Copy className="h-4 w-4" aria-hidden />
            )}
            <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
