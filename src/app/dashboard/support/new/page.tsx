import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { NewTicketForm } from "@/components/forms/support-forms";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "New Support Ticket" };

export default async function NewTicketPage({ searchParams }: PageProps<"/dashboard/support/new">) {
  await requireUser("/dashboard/support/new");
  const sp = await searchParams;
  const plan =
    typeof sp.plan === "string" ? await db.plan.findFirst({ where: { slug: sp.plan, isActive: true }, select: { name: true } }) : null;

  return (
    <>
      <PageHeader title="New support ticket" description="Tell us what you need and we'll get back to you here." />
      <Card className="max-w-3xl">
        <CardBody>
          <NewTicketForm
            defaultSubject={plan ? `Plan activation request: ${plan.name}` : ""}
            defaultMessage={plan ? `Hello, I'd like to activate the ${plan.name} plan on my account.` : ""}
          />
        </CardBody>
      </Card>
    </>
  );
}
