import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { CryptoSettingsForm } from "@/components/admin/payment-method-form";
import { PaymentMethodsList } from "@/components/admin/payment-methods-list";
import { PageHeader } from "@/components/page-header";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Notice } from "@/components/ui/misc";
import { db } from "@/lib/db";
import { paymentsSandbox } from "@/lib/checkout/chain";
import { isBitcoinReady } from "@/lib/checkout/methods";
import { requireRole } from "@/lib/session";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Payment Methods" };

export default async function AdminPaymentMethodsPage() {
  await requireRole("ADMIN");
  const [methods, settings] = await Promise.all([
    db.paymentMethod.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
    getSettings(),
  ]);
  const btcReady = isBitcoinReady(settings);

  return (
    <>
      <PageHeader
        title="Payment Methods"
        description="Manage what customers see at checkout."
        actions={
          <ButtonLink href="/admin/payment-methods/new">
            <Plus className="h-4 w-4" aria-hidden /> Add Method
          </ButtonLink>
        }
      />
      {paymentsSandbox && (
        <div className="mb-6">
          <Notice tone="warning" title="Payments sandbox is on">
            Bitcoin prices and payments are simulated (PAYMENTS_SANDBOX). This
            only works on localhost and never on a deployed site.
          </Notice>
        </div>
      )}

      <PaymentMethodsList
        methods={methods.map((m) => ({
          id: m.id,
          name: m.name,
          subtitle: m.subtitle,
          kind: m.kind,
          logoUrl: m.logoUrl,
          glyph: m.glyph,
          accent: m.accent,
          isActive: m.isActive,
          setupIssue:
            m.kind === "BITCOIN"
              ? btcReady
                ? null
                : "add your Bitcoin wallet below"
              : m.account
                ? null
                : "no payment account set (Edit)",
        }))}
      />

      <Card className="mt-8">
        <CardHeader
          title="Crypto wallet"
          description="The Bitcoin wallet, price source and confirmation rules used by Bitcoin, Shakepay and MoonPay methods."
        />
        <CardBody>
          <CryptoSettingsForm crypto={settings.crypto} />
        </CardBody>
      </Card>
    </>
  );
}
