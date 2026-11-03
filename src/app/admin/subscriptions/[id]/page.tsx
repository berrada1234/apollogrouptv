import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SubscriptionForm } from "@/components/admin/subscription-form";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { db } from "@/lib/db";
import { decryptSecret } from "@/lib/crypto";
import { invoiceStatusLabels } from "@/lib/checkout/labels";
import { emptyAccess, openAccess, type IptvAccess } from "@/lib/iptv-access";
import { requireRole } from "@/lib/session";
import { formatUsDate, subscriptionDisplay } from "@/lib/subscription-status";
import { formatDateTime, formatMoney } from "@/lib/utils";

export const metadata: Metadata = { title: "Edit Subscription" };

export default async function EditSubscriptionPage({ params }: PageProps<"/admin/subscriptions/[id]">) {
  await requireRole("ADMIN");
  const { id } = await params;
  const sub = await db.subscription.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, email: true } }, plan: true, order: { include: { method: { select: { name: true } } } } },
  });
  if (!sub) notFound();

  // Prefill a new subscription with the customer's existing login (renewals usually keep it).
  let access: IptvAccess = openAccess(sub.accessEnc) ?? emptyAccess;
  let prefilled = false;
  if (!sub.accessEnc) {
    const earlier = await db.subscription.findFirst({ where: { userId: sub.userId, id: { not: sub.id }, accessEnc: { not: null } }, orderBy: { updatedAt: "desc" } });
    const fromEarlier = openAccess(earlier?.accessEnc);
    if (fromEarlier) {
      access = fromEarlier;
      prefilled = true;
    } else {
      const player = await db.playerCredential.findUnique({ where: { userId: sub.userId } });
      if (player) {
        access = {
          ...emptyAccess,
          xtreamServer: player.serverUrl ?? "",
          xtreamUsername: player.username,
          xtreamPassword: decryptSecret(player.passwordEnc) ?? "",
          m3uUrl: player.m3uUrlEnc ? (decryptSecret(player.m3uUrlEnc) ?? "") : "",
        };
        prefilled = true;
      }
    }
  }
  const logs = await db.auditLog.findMany({ where: { targetType: "Subscription", targetId: sub.id }, orderBy: { createdAt: "desc" }, take: 10, include: { actor: { select: { name: true } } } });
  const paid = !sub.order || sub.order.status === "PAID";
  const display = subscriptionDisplay(sub, sub.order?.status);

  const facts: [string, React.ReactNode][] = [
    ["Customer Name", <Link key="n" href={`/admin/users/${sub.user.id}`} className="text-accent hover:text-light-blue">{sub.user.name}</Link>],
    ["Customer Email", sub.user.email],
    ["Invoice ID", sub.order ? <Link key="i" href={`/admin/payments/${sub.order.id}`} className="font-mono text-accent hover:text-light-blue">{sub.order.number}</Link> : "Granted without an invoice"],
    ["Subscription Plan", sub.plan.name],
    ["Payment", sub.order ? `${formatMoney(sub.order.amountCents, sub.order.currency)}${sub.order.method ? ` · ${sub.order.method.name}` : ""}` : "—"],
    ["Payment Status", sub.order ? <StatusBadge key="p" status={sub.order.status} label={invoiceStatusLabels[sub.order.status]} /> : "—"],
  ];

  return (
    <>
      <Link href="/admin/subscriptions" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-text">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Subscriptions Management
      </Link>
      <PageHeader title="Edit Subscription" description={<StatusBadge status={display.key} label={display.label} />} />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="h-fit">
          <CardHeader title="Customer" />
          <CardBody>
            <dl className="space-y-3">
              {facts.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs uppercase tracking-[0.12em] text-subtle">{k}</dt>
                  <dd className="mt-0.5 break-words text-sm text-text">{v}</dd>
                </div>
              ))}
            </dl>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader
            title="Subscription"
            description={prefilled ? "Login prefilled from the customer's previous subscription. Check it before saving." : sub.activatedAt ? `Activated ${formatDateTime(sub.activatedAt)}` : undefined}
          />
          <CardBody>
            <SubscriptionForm
              subscriptionId={sub.id}
              status={sub.status}
              access={access}
              start={formatUsDate(sub.currentPeriodStart)}
              end={formatUsDate(sub.currentPeriodEnd)}
              connectionLimit={sub.connectionLimit}
              paid={paid}
            />
          </CardBody>
        </Card>
      </div>

      {logs.length > 0 && (
        <Card className="mt-6">
          <CardHeader title="Change history" />
          <CardBody>
            <ul className="space-y-2 text-sm">
              {logs.map((l) => (
                <li key={l.id} className="flex flex-wrap justify-between gap-2 text-muted">
                  <span>
                    <span className="font-mono text-xs text-text">{l.action}</span> by {l.actor?.name ?? "System"}
                  </span>
                  <time dateTime={l.createdAt.toISOString()}>{formatDateTime(l.createdAt)}</time>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}
    </>
  );
}
