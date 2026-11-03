"use client";

import { useState } from "react";
import { Check, Copy, Eye, EyeOff } from "lucide-react";

/** One My Account row: shows "—" when empty, with copy and (for secrets) show/hide. */
export function AccountField({ label, value, secret = false }: { label: string; value: string; secret?: boolean }) {
  const [shown, setShown] = useState(!secret);
  const [copied, setCopied] = useState(false);
  const button = "grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border-strong text-muted transition-colors hover:border-primary/40 hover:text-text";
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-subtle">{label}</p>
        <p className="mt-1 break-all font-mono text-sm font-semibold text-text">{value ? (shown ? value : "••••••••••") : "—"}</p>
      </div>
      {value && secret && (
        <button type="button" onClick={() => setShown((v) => !v)} className={button} aria-label={shown ? `Hide ${label}` : `Show ${label}`}>
          {shown ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
        </button>
      )}
      {value && (
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
          className={button}
          aria-label={copied ? `${label} copied` : `Copy ${label}`}
        >
          {copied ? <Check className="h-4 w-4 text-success" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
        </button>
      )}
    </div>
  );
}
