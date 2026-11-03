import type { Metadata } from "next";
import Link from "next/link";
import { CreditCard } from "lucide-react";
import { CheckoutSection } from "@/components/checkout/checkout-section";
import { CtaBand, PageHero } from "@/components/marketing/sections";
import { cardClass, Section } from "@/components/section";
import { EmptyState } from "@/components/ui/misc";
import { getCustomerMethods } from "@/lib/checkout/methods";
import { getSettings } from "@/lib/settings";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const title =
  "Apollo Group TV Payment Methods: Bitcoin, Cash App, Zelle & More";
const description =
  "How to pay for an Apollo Group TV pack: the payment methods we accept, how each one works, and when your pack activates.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/payment-methods" },
  openGraph: { title, description, url: "/payment-methods" },
};

const steps = [
  {
    t: "Choose a pack",
    b: "Pick a pack on the Plans page. We create an invoice and hold the price while you pay.",
  },
  {
    t: "Pick a payment method",
    b: "Open the method's payment window for the exact amount and where to send it.",
  },
  {
    t: "Your pack activates",
    b: "Bitcoin payments activate automatically once confirmed on the blockchain; other methods after our team confirms receipt.",
  },
];

export default async function PaymentMethodsPage() {
  const settings = await getSettings();
  const methods = await getCustomerMethods(settings);

  return (
    <>
      <PageHero
        eyebrow="Payments"
        title="Payment Methods"
        description="Pay once for a fixed period, nothing renews. Choose the method that suits you; every payment is tied to an invoice in your account."
        crumbs={[{ href: "/payment-methods", label: "Payment Methods" }]}
      />
      <Section>
        {methods.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="Payment methods are being set up"
            description="Choose a pack and our team will confirm how to pay in an activation ticket."
          />
        ) : (
          <CheckoutSection
            id="methods"
            methods={methods}
            orderId={null}
            supportHours={settings.general.supportHours}
            payHref="/dashboard/plan#checkout"
          />
        )}

        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.t} className={cn(cardClass, "p-6")}>
              <span className="font-display text-sm font-bold text-accent">
                Step {i + 1}
              </span>
              <h2 className="mt-2 font-display text-lg font-bold text-text">
                {s.t}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">{s.b}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-sm text-muted">
          New to any of these? The{" "}
          <Link href="/payment-guides" className="text-accent hover:text-light-blue">
            payment guides
          </Link>{" "}
          walk you through each method step by step. Only pay through your Apollo Group TV account. Refunds follow our{" "}
          <Link
            href="/refund-policy"
            className="text-accent hover:text-light-blue"
          >
            refund policy
          </Link>
          , and pack prices are on the{" "}
          <Link href="/plans" className="text-accent hover:text-light-blue">
            Plans page
          </Link>
          .
        </p>
      </Section>
      <CtaBand
        title="Ready to choose a pack?"
        description="Compare the packs, create your account and pay with the method that suits you."
      />
    </>
  );
}
