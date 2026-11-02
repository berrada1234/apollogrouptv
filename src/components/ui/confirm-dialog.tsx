"use client";

import { useEffect, useId, useRef } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Accessible confirmation built on the native <dialog> element:
 * focus is trapped, Escape cancels, and focus returns to the trigger.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  tone = "danger",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  tone?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
      onClick={(e) => e.target === ref.current && onCancel()}
      className="m-auto w-[min(92vw,26rem)] rounded-lg border border-border-strong bg-card p-0 text-text shadow-lg"
    >
      <div className="p-6">
        <div className="flex gap-4">
          <span
            className={
              tone === "danger"
                ? "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-error/10 text-error"
                : "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-accent"
            }
          >
            <AlertTriangle className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h2 id={titleId} className="font-display text-base font-semibold">
              {title}
            </h2>
            {description && (
              <p id={descId} className="mt-1.5 text-sm leading-relaxed text-muted">
                {description}
              </p>
            )}
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onCancel} autoFocus>
            Cancel
          </Button>
          <Button type="button" variant={tone === "danger" ? "danger" : "primary"} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
