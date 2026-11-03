import { Headphones, Lock, Zap } from "lucide-react";
import {
  MethodGrid,
  type CheckoutMethod,
} from "@/components/checkout/checkout-client";

/** "Secure Checkout" block: trust points, then the payment method cards. */
export function CheckoutSection({
  methods,
  orderId,
  sandbox,
  supportHours,
  id = "checkout",
  payHref,
}: {
  methods: CheckoutMethod[];
  orderId: string | null;
  sandbox: boolean;
  supportHours: string;
  id?: string;
  payHref?: string;
}) {
  const points = [
    { icon: Lock, label: "Secure Checkout" },
    {
      icon: Zap,
      label: methods.some((m) => m.kind === "BITCOIN")
        ? "Automatic activation"
        : "Fast activation",
    },
    {
      icon: Headphones,
      label: supportHours ? `Support ${supportHours}` : "Ticket support",
    },
  ];
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-24">
      <ul className="flex flex-wrap gap-2.5" aria-label="Checkout">
        {points.map((p) => (
          <li
            key={p.label}
            className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/[0.07] px-3.5 py-1.5 text-sm font-medium text-light-blue"
          >
            <p.icon className="h-4 w-4" aria-hidden /> {p.label}
          </li>
        ))}
      </ul>
      <h2
        id={`${id}-heading`}
        className="mt-5 font-display text-2xl font-bold text-text"
      >
        Payment Methods
      </h2>
      <p className="mt-1 text-sm text-muted">
        Choose your preferred payment method below.
      </p>
      <MethodGrid
        methods={methods}
        orderId={orderId}
        sandbox={sandbox}
        payHref={payHref}
      />
    </section>
  );
}
