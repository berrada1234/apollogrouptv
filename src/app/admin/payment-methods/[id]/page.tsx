import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PaymentMethodForm } from "@/components/admin/payment-method-form";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Edit payment method" };

export default async function EditPaymentMethodPage({
  params,
}: PageProps<"/admin/payment-methods/[id]">) {
  await requireRole("ADMIN");
  const { id } = await params;
  const method = await db.paymentMethod.findUnique({ where: { id } });
  if (!method) notFound();
  return (
    <>
      <Link
        href="/admin/payment-methods"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-text"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden /> All payment methods
      </Link>
      <PageHeader
        title={`Edit ${method.name}`}
        description="Changes apply to new payments. Open invoices keep the details they were shown."
      />
      <Card className="max-w-3xl">
        <CardBody>
          <PaymentMethodForm method={method} />
        </CardBody>
      </Card>
    </>
  );
}
