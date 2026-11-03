import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PaymentMethodForm } from "@/components/admin/payment-method-form";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Add payment method" };

export default async function NewPaymentMethodPage() {
  await requireRole("ADMIN");
  const last = await db.paymentMethod.aggregate({ _max: { sortOrder: true } });
  return (
    <>
      <Link
        href="/admin/payment-methods"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-text"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden /> All payment methods
      </Link>
      <PageHeader
        title="Add payment method"
        description="Saved methods appear on the customer payment page straight away."
      />
      <Card className="max-w-3xl">
        <CardBody>
          <PaymentMethodForm nextOrder={(last._max.sortOrder ?? 0) + 1} />
        </CardBody>
      </Card>
    </>
  );
}
