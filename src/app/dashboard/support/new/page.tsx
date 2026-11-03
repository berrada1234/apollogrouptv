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
  const gift = sp.topic === "gift";
  const extend = sp.mode === "extend";
  const plan =
    typeof sp.plan === "string" ? await db.plan.findFirst({ where: { slug: sp.plan, isActive: true }, select: { name: true } }) : null;

  return (
    <>
      <PageHeader title="New support ticket" description="Tell us what you need and we'll get back to you here." />
      <Card className="max-w-3xl">
        <CardBody>
          <NewTicketForm
            defaultSubject={plan ? `${extend ? "Extension request" : "Plan activation request"}: ${plan.name}` : gift ? "Gift pack request" : ""}
            defaultMessage={
              plan
                ? `Hello, I'd like to ${extend ? "add the" : "activate the"} ${plan.name} ${extend ? "to my current access" : "on my account"}.
Promo code (optional): `
                : gift
                  ? "Hello, I'd like to gift a pack. Recipient's name and email: … Pack I'd like to give: …"
                  : ""
            }
          />
        </CardBody>
      </Card>
    </>
  );
}
