import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PlanForm } from "@/components/admin/plan-form";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Edit plan" };

export default async function EditPlanPage({ params }: PageProps<"/admin/plans/[id]">) {
  await requireRole("ADMIN");
  const { id } = await params;
  const plan = await db.plan.findUnique({ where: { id } });
  if (!plan) notFound();
  return (
    <>
      <Link href="/admin/plans" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-text">
        <ArrowLeft className="h-4 w-4" aria-hidden /> All plans
      </Link>
      <PageHeader title={`Edit ${plan.name}`} description="Price changes apply to new subscriptions." />
      <Card className="max-w-3xl">
        <CardBody>
          <PlanForm plan={plan} />
        </CardBody>
      </Card>
    </>
  );
}
