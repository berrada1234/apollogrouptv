"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, GripVertical, Pencil } from "lucide-react";
import {
  deletePaymentMethod,
  reorderPaymentMethods,
  togglePaymentMethod,
} from "@/actions/payments-admin";
import { ActionForm } from "@/components/admin/action-form";
import { MethodLogo } from "@/components/checkout/method-logo";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type AdminMethod = {
  id: string;
  name: string;
  subtitle: string;
  kind: "BITCOIN" | "MANUAL";
  logoUrl: string | null;
  glyph: string | null;
  accent: string | null;
  isActive: boolean;
  /** Why customers can't see it even though it's active, if anything. */
  setupIssue: string | null;
};

export function PaymentMethodsList({ methods }: { methods: AdminMethod[] }) {
  const [items, setItems] = useState(methods);
  const [dragging, setDragging] = useState<string | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(
    null,
  );
  const [pending, start] = useTransition();

  const save = (next: AdminMethod[]) => {
    setItems(next);
    start(async () => {
      const r = await reorderPaymentMethods(next.map((m) => m.id));
      setMessage({ ok: r.ok, text: r.message ?? "" });
    });
  };
  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length || from === to) return;
    const next = [...items];
    const [m] = next.splice(from, 1);
    next.splice(to, 0, m);
    save(next);
  };

  return (
    <>
      <p className="mb-3 text-sm text-muted" aria-live="polite">
        Drag to reorder — changes reflect instantly on the customer payment
        page.
        {pending ? (
          <span className="ml-2 text-subtle">Saving…</span>
        ) : (
          message && (
            <span
              className={cn("ml-2", message.ok ? "text-success" : "text-error")}
            >
              {message.text}
            </span>
          )
        )}
      </p>
      <ul className="space-y-2.5">
        {items.map((m, i) => (
          <li
            key={m.id}
            draggable
            onDragStart={(e) => {
              setDragging(m.id);
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragEnd={() => setDragging(null)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const from = items.findIndex((x) => x.id === dragging);
              if (from >= 0) move(from, i);
              setDragging(null);
            }}
            className={cn(
              "flex flex-wrap items-center gap-3 rounded-[14px] border bg-card p-3 pr-4 transition-colors sm:flex-nowrap",
              dragging === m.id
                ? "border-primary/60 opacity-60"
                : "border-border hover:border-border-strong",
            )}
          >
            <span className="flex items-center text-subtle">
              <GripVertical className="h-5 w-5 cursor-grab" aria-hidden />
              <span className="flex flex-col">
                <button
                  type="button"
                  onClick={() => move(i, i - 1)}
                  disabled={i === 0}
                  className="rounded p-0.5 hover:text-text disabled:opacity-30"
                  aria-label={`Move ${m.name} up`}
                >
                  <ChevronUp className="h-3.5 w-3.5" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, i + 1)}
                  disabled={i === items.length - 1}
                  className="rounded p-0.5 hover:text-text disabled:opacity-30"
                  aria-label={`Move ${m.name} down`}
                >
                  <ChevronDown className="h-3.5 w-3.5" aria-hidden />
                </button>
              </span>
            </span>
            <MethodLogo {...m} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-text">{m.name}</p>
              <p className="text-xs text-muted">
                {m.subtitle} ·{" "}
                {m.kind === "BITCOIN"
                  ? "Bitcoin, verified on-chain"
                  : "Manual, admin confirms"}
              </p>
              {m.isActive && m.setupIssue && (
                <p className="mt-1 text-xs text-warning">
                  Hidden from customers: {m.setupIssue}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge
                tone={
                  m.isActive
                    ? m.setupIssue
                      ? "warning"
                      : "success"
                    : "neutral"
                }
              >
                {m.isActive ? "Active" : "Inactive"}
              </Badge>
              <ActionForm
                action={togglePaymentMethod}
                submitLabel={m.isActive ? "Deactivate" : "Activate"}
                submitVariant="ghost"
                inline
              >
                <input type="hidden" name="id" value={m.id} />
              </ActionForm>
              <Link
                href={`/admin/payment-methods/${m.id}`}
                className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-inset hover:text-text"
                aria-label={`Edit ${m.name}`}
              >
                <Pencil className="h-4 w-4" aria-hidden />
              </Link>
              <ActionForm
                action={deletePaymentMethod}
                submitLabel="Delete"
                submitVariant="ghost"
                inline
                confirm={{
                  title: `Delete ${m.name}?`,
                  description:
                    "Customers will no longer see it. Past invoices keep their records.",
                  confirmLabel: "Delete",
                  tone: "danger",
                }}
              >
                <input type="hidden" name="id" value={m.id} />
              </ActionForm>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
