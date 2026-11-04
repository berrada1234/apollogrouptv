import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Account", "Verify", "Choose pack"];

/** Three-step progress for sign-up: shows where the customer is and what's left. */
export function AuthSteps({ current, last }: { current: 1 | 2 | 3; last?: string }) {
  const steps = last ? [...STEPS.slice(0, 2), last] : STEPS;
  return (
    <ol className="mb-8 flex items-center gap-2 text-xs" aria-label={`Step ${current} of ${steps.length}`}>
      {steps.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <li key={label} className="flex min-w-0 flex-1 items-center gap-2" aria-current={active ? "step" : undefined}>
            <span
              className={cn(
                "grid h-6 w-6 shrink-0 place-items-center rounded-full border font-semibold",
                done && "border-success/50 bg-success/15 text-success",
                active && "border-primary bg-primary/15 text-accent",
                !done && !active && "border-border text-subtle",
              )}
            >
              {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden /> : n}
            </span>
            <span className={cn("truncate", active ? "font-semibold text-text" : "text-muted")}>{label}</span>
            {n < steps.length && <span className="h-px min-w-3 flex-1 bg-border" aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}
