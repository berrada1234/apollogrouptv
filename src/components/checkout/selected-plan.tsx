import { Package } from "lucide-react";
import { db } from "@/lib/db";
import { accessLabel } from "@/lib/pricing";
import { formatMoney } from "@/lib/utils";

/** Reads a plan slug from a query value, accepting only active packs. */
export async function findSelectedPlan(value: unknown) {
  const slug = typeof value === "string" ? value.trim().slice(0, 80) : "";
  if (!slug) return null;
  return db.plan.findFirst({ where: { slug, isActive: true } });
}

/** Where to send a customer after sign-up or sign-in so their chosen pack is waiting. */
export function checkoutPath(slug: string) {
  return `/dashboard/plan?plan=${encodeURIComponent(slug)}`;
}

/** The pack a visitor chose on the Plans page, shown on the sign-up and sign-in screens. */
export function SelectedPlanCard({
  plan,
}: {
  plan: {
    name: string;
    priceCents: number;
    currency: string;
    interval: Parameters<typeof accessLabel>[0];
    oneTime: boolean;
  };
}) {
  return (
    <div className="mt-6 flex items-center gap-4 rounded-[14px] border border-primary/35 bg-primary/[0.07] p-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[10px] bg-primary/15 text-accent">
        <Package className="h-5 w-5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
          Your selected pack
        </p>
        <p className="mt-0.5 truncate font-semibold text-text">{plan.name}</p>
        <p className="text-sm text-muted">
          {accessLabel(plan.interval)} ·{" "}
          {plan.oneTime ? "One-time payment" : "Renews each period"}
        </p>
      </div>
      <p className="font-display text-xl font-extrabold text-text">
        {formatMoney(plan.priceCents, plan.currency)}
      </p>
    </div>
  );
}
