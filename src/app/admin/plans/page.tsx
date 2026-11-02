import type { Metadata } from "next";
import Link from "next/link";
import { togglePlan } from "@/actions/admin";
import { ActionForm } from "@/components/admin/action-form";
import { DataTable, EmptyRow, Td } from "@/components/admin/table";
import { PlanForm } from "@/components/admin/plan-form";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { formatMoney, intervalLabels } from "@/lib/utils";

export const metadata: Metadata = { title: "Plans" };

export default async function AdminPlansPage() {
  await requireRole("ADMIN");
  const plans = await db.plan.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    include: { _count: { select: { subscriptions: { where: { status: "ACTIVE" } } } } },
  });

  return (
    <>
      <PageHeader title="Plans" description="Plans and prices shown on the website come from here." />
      <DataTable head={["Plan", "Price", "Interval", "Active subscribers", "Status", ""]}>
        {plans.length === 0 ? (
          <EmptyRow colSpan={6}>No plans yet. Create your first plan below.</EmptyRow>
        ) : (
          plans.map((p) => (
            <tr key={p.id}>
              <Td>
                <Link href={`/admin/plans/${p.id}`} className="font-medium text-text hover:text-light-blue">
                  {p.name}
                </Link>
                {p.highlighted && <Badge tone="blue" className="ml-2">Recommended</Badge>}
              </Td>
              <Td className="text-text">{formatMoney(p.priceCents, p.currency)}</Td>
              <Td className="text-muted">{intervalLabels[p.interval]}</Td>
              <Td className="text-muted">{p._count.subscriptions}</Td>
              <Td>
                <StatusBadge status={p.isActive ? "ACTIVE" : "INACTIVE"} />
              </Td>
              <Td className="text-right">
                <ActionForm
                  action={togglePlan}
                  inline
                  submitLabel={p.isActive ? "Deactivate" : "Activate"}
                  submitVariant="ghost"
                  confirm={p.isActive ? { title: `Deactivate ${p.name}?`, description: "It will disappear from the website. Existing subscriptions are not affected.", tone: "danger" } : undefined}
                >
                  <input type="hidden" name="id" value={p.id} />
                </ActionForm>
              </Td>
            </tr>
          ))
        )}
      </DataTable>
      <Card className="mt-8 max-w-3xl">
        <CardHeader title="Create a plan" />
        <CardBody>
          <PlanForm />
        </CardBody>
      </Card>
    </>
  );
}
