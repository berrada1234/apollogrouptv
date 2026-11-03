"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FormMessage } from "@/components/ui/form";
import { idle, type ActionState } from "@/lib/action-state";
import { cn } from "@/lib/utils";

type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

export type Confirm = string | { title: string; description?: string; confirmLabel?: string; tone?: "danger" | "primary" };

/**
 * Form for admin server actions.
 * Shows the action's message and the first error of each invalid field;
 * destructive actions can require confirmation through an accessible dialog.
 */
export function ActionForm({
  action,
  children,
  submitLabel = "Save",
  submitVariant = "primary",
  className,
  resetOnSuccess,
  confirm,
  inline,
}: {
  action: Action;
  children?: React.ReactNode;
  submitLabel?: string;
  submitVariant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  className?: string;
  resetOnSuccess?: boolean;
  confirm?: Confirm;
  inline?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, idle);
  const [asking, setAsking] = useState(false);
  const confirmed = useRef(false);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok && resetOnSuccess) ref.current?.reset();
  }, [state, resetOnSuccess]);

  const c = typeof confirm === "string" ? { title: "Are you sure?", description: confirm } : confirm;
  const errors = state.fieldErrors ? Object.entries(state.fieldErrors).filter(([, v]) => v?.length) : [];

  return (
    <>
      <form
        ref={ref}
        // Submitted through a transition rather than `action`, so React doesn't clear what
        // the admin typed when the server rejects it; resetOnSuccess clears it explicitly.
        onSubmit={(e) => {
          e.preventDefault();
          if (c && !confirmed.current) {
            setAsking(true);
            return;
          }
          confirmed.current = false;
          const data = new FormData(e.currentTarget);
          startTransition(() => formAction(data));
        }}
        className={cn(inline ? "inline-flex flex-wrap items-center gap-2" : "space-y-4", className)}
      >
        {children}
        {!inline && errors.length > 0 && (
          <ul className="space-y-1 rounded-xl border border-error/30 bg-error/5 px-3.5 py-2.5 text-xs text-error" role="alert">
            {errors.map(([field, msgs]) => (
              <li key={field}>
                <span className="font-medium capitalize">{field}</span>: {msgs![0]}
              </li>
            ))}
          </ul>
        )}
        {!inline && <FormMessage ok={state.ok} message={state.message} />}
        <Button type="submit" variant={submitVariant} size={inline ? "sm" : "md"} loading={pending}>
          {submitLabel}
        </Button>
        {inline && state.message && (
          <span role="status" className={cn("text-xs", state.ok ? "text-success" : "text-error")}>
            {state.message}
          </span>
        )}
      </form>
      {c && (
        <ConfirmDialog
          open={asking}
          title={c.title}
          description={c.description}
          confirmLabel={c.confirmLabel ?? submitLabel}
          tone={c.tone ?? (submitVariant === "danger" ? "danger" : "primary")}
          onCancel={() => setAsking(false)}
          onConfirm={() => {
            setAsking(false);
            confirmed.current = true;
            ref.current?.requestSubmit();
          }}
        />
      )}
    </>
  );
}
