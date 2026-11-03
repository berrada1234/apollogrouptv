"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** A value the customer types into another app (a code or server address) with a one-tap copy button. */
export function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="rounded-xl border border-border bg-inset p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-subtle">{label}</p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <code className="min-w-0 break-all font-mono text-lg font-semibold text-text">{value}</code>
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
          {copied ? <Check className="h-4 w-4 text-success" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
          <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
    </div>
  );
}
