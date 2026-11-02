"use client";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Mirrors passwordSchema in src/lib/validators.ts.
const rules = [
  { label: "At least 10 characters", test: (v: string) => v.length >= 10 },
  { label: "An uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "A lowercase letter", test: (v: string) => /[a-z]/.test(v) },
  { label: "A number", test: (v: string) => /[0-9]/.test(v) },
];

export function PasswordStrength({ value, id }: { value: string; id?: string }) {
  const passed = rules.filter((r) => r.test(value)).length;
  const label = value.length === 0 ? "" : passed <= 1 ? "Weak" : passed <= 3 ? "Almost there" : "Strong";
  const color = passed <= 1 ? "bg-error" : passed <= 3 ? "bg-warning" : "bg-success";

  return (
    <div id={id} className="mt-2.5">
      <div className="flex items-center gap-3">
        <div className="grid flex-1 grid-cols-4 gap-1" aria-hidden>
          {rules.map((_, i) => (
            <span key={i} className={cn("h-1 rounded-full transition-colors", value && i < passed ? color : "bg-border")} />
          ))}
        </div>
        <span className="w-24 text-right text-xs text-muted" aria-live="polite">
          {label}
        </span>
      </div>
      <ul className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1">
        {rules.map((r) => {
          const ok = r.test(value);
          return (
            <li key={r.label} className={cn("flex items-center gap-1.5 text-xs", ok ? "text-success" : "text-subtle")}>
              {ok ? <Check className="h-3.5 w-3.5" aria-hidden /> : <X className="h-3.5 w-3.5" aria-hidden />}
              {r.label}
              <span className="sr-only">{ok ? "(met)" : "(not met)"}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
