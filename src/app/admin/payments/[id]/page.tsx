import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import {
  checkOrderNow,
  confirmOrderPayment,
  sandboxSimulate,
  setOrderStatus,
} from "@/actions/payments-admin";
import { ActionForm } from "@/components/admin/action-form";
import { DataTable, EmptyRow, Td } from "@/components/admin/table";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/form";
import { db } from "@/lib/db";
import {
  explorerTxUrl,
  formatBtc,
  type BtcNetwork,
} from "@/lib/checkout/bitcoin";
import { paymentsSandbox } from "@/lib/checkout/chain";
import { invoiceStatusLabels } from "@/lib/checkout/labels";
import { requireRole } from "@/lib/session";
import { formatDateTime, formatMoney, humanize } from "@/lib/utils";

export const metadata: Metadata = { title: "Invoice" };

export default async function AdminInvoicePage({
  params,
}: PageProps<"/admin/payments/[id]">) {
  await requireRole("ADMIN");
  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      plan: true,
      method: true,
      requests: {
        orderBy: { createdAt: "desc" },
        include: { method: { select: { name: true } } },
      },
      payments: true,
    },
  });
  if (!order) notFound();
  const logs = await db.auditLog.findMany({
    where: { targetType: "Order", targetId: order.id },
    orderBy: { createdAt: "desc" },
    take: 30,
    include: { actor: { select: { name: true } } },
  });
  const open = order.status !== "PAID";
  const hasBitcoin = order.requests.some((r) => r.kind === "BITCOIN");

  const facts: [string, React.ReactNode][] = [
    [
      "Customer",
      <Link
        key="c"
        href={`/admin/users/${order.user.id}`}
        className="text-accent hover:text-light-blue"
      >
        {order.user.name} · {order.user.email}
      </Link>,
    ],
    ["Plan", order.plan.name],
    ["Amount", formatMoney(order.amountCents, order.currency)],
    ["Payment method", order.method?.name ?? "Not chosen yet"],
    ["Created", formatDateTime(order.createdAt)],
    [
      "Reservation ends",
      order.expiresAt ? formatDateTime(order.expiresAt) : "—",
    ],
    ["Paid", order.paidAt ? formatDateTime(order.paidAt) : "—"],
    ["Customer reference", order.customerReference ?? "—"],
    [
      "Subscription",
      order.subscriptionId ? (
        <Link
          key="s"
          href={`/admin/users/${order.user.id}`}
          className="text-accent"
        >
          Active pack created
        </Link>
      ) : (
        "—"
      ),
    ],
  ];

  return (
    <>
      <Link
        href="/admin/payments"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-text"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden /> Orders & Payments
      </Link>
      <PageHeader
        title={<span className="font-mono">{order.number ?? order.id}</span>}
        description={
          <StatusBadge
            status={order.status}
            label={invoiceStatusLabels[order.status]}
          />
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Invoice details" />
          <CardBody>
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {facts.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs uppercase tracking-[0.12em] text-subtle">
                    {k}
                  </dt>
                  <dd className="mt-0.5 break-words text-sm text-text">{v}</dd>
                </div>
              ))}
            </dl>
            {order.note && (
              <p className="mt-5 rounded-xl border border-warning/30 bg-warning/5 p-3 text-sm text-warning">
                {order.note}
              </p>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Actions" />
          <CardBody className="space-y-6">
            {hasBitcoin && open && (
              <ActionForm
                action={checkOrderNow}
                submitLabel="Check blockchain now"
                submitVariant="secondary"
              >
                <input type="hidden" name="orderId" value={order.id} />
              </ActionForm>
            )}
            {paymentsSandbox && hasBitcoin && open && (
              <ActionForm action={sandboxSimulate} submitLabel="Simulate" submitVariant="secondary">
                <input type="hidden" name="orderId" value={order.id} />
                <Field label="Local sandbox (no real Bitcoin)" htmlFor="sim" hint="Only available on localhost with PAYMENTS_SANDBOX on.">
                  <Select id="sim" name="mode" defaultValue="exact">
                    <option value="exact">Customer sends the exact amount</option>
                    <option value="under">Customer sends 80% (underpaid)</option>
                    <option value="over">Customer sends 120% (overpaid)</option>
                    <option value="confirm">Add one block confirmation</option>
                  </Select>
                </Field>
              </ActionForm>
            )}
            {open ? (
              <>
                <ActionForm
                  action={confirmOrderPayment}
                  submitLabel="Confirm payment"
                  confirm={{
                    title: "Confirm this payment?",
                    description:
                      "Only confirm after you've seen the money arrive in your account. The customer's pack activates immediately.",
                    confirmLabel: "Confirm and activate",
                    tone: "primary",
                  }}
                >
                  <input type="hidden" name="orderId" value={order.id} />
                  <Field
                    label="Transaction ID you verified"
                    htmlFor="txn"
                    hint="From your Cash App, Zelle or wallet history. Each ID can be used once."
                  >
                    <Input
                      id="txn"
                      name="transactionId"
                      required
                      maxLength={120}
                      autoComplete="off"
                    />
                  </Field>
                </ActionForm>
                <ActionForm
                  action={setOrderStatus}
                  submitLabel="Update status"
                  submitVariant="secondary"
                >
                  <input type="hidden" name="orderId" value={order.id} />
                  <Field label="Mark as" htmlFor="st">
                    <Select id="st" name="status" defaultValue="FAILED">
                      <option value="FAILED">Failed</option>
                      <option value="CANCELED">Cancelled</option>
                    </Select>
                  </Field>
                  <Field label="Note (optional)" htmlFor="note">
                    <Input id="note" name="note" maxLength={500} />
                  </Field>
                </ActionForm>
              </>
            ) : (
              <p className="text-sm text-muted">
                This invoice is paid and the pack is active. Refunds are handled
                with the customer in a support ticket.
              </p>
            )}
          </CardBody>
        </Card>
      </div>

      <h2 className="mb-3 mt-8 font-display text-lg font-semibold text-text">
        Payment attempts
      </h2>
      <DataTable
        head={[
          "Started",
          "Method",
          "Status",
          "Amount",
          "Rate",
          "Received",
          "Confirmations",
          "Transaction",
        ]}
        minWidth={980}
      >
        {order.requests.length === 0 ? (
          <EmptyRow colSpan={8}>
            The customer hasn&apos;t opened a payment window yet.
          </EmptyRow>
        ) : (
          order.requests.map((r) => (
            <tr key={r.id}>
              <Td className="whitespace-nowrap text-muted">
                {formatDateTime(r.createdAt)}
              </Td>
              <Td className="text-muted">
                {r.method?.name ?? humanize(r.kind)}
              </Td>
              <Td>
                <StatusBadge status={r.status} />
              </Td>
              <Td className="font-mono text-xs text-text">
                {r.amountSats
                  ? `${formatBtc(r.amountSats)} BTC`
                  : formatMoney(r.usdCents)}
              </Td>
              <Td className="text-xs text-muted">
                {r.rateUsd
                  ? `${formatMoney(Math.round(Number(r.rateUsd) * 100))} (${r.priceSource})`
                  : "—"}
              </Td>
              <Td className="font-mono text-xs text-muted">
                {r.receivedSats !== null
                  ? `${formatBtc(r.receivedSats)} BTC`
                  : "—"}
              </Td>
              <Td className="text-muted">
                {r.kind === "BITCOIN" ? r.confirmations : "—"}
              </Td>
              <Td className="max-w-[200px] truncate font-mono text-xs">
                {r.txid ? (
                  r.txid.startsWith("sandbox") ? (
                    <span className="text-muted">{r.txid}</span>
                  ) : (
                    <a
                      href={explorerTxUrl(
                        r.txid,
                        (r.network ?? "mainnet") as BtcNetwork,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-accent"
                    >
                      {r.txid.slice(0, 16)}…{" "}
                      <ExternalLink className="h-3 w-3" aria-hidden />
                    </a>
                  )
                ) : (
                  "—"
                )}
              </Td>
            </tr>
          ))
        )}
      </DataTable>

      <h2 className="mb-3 mt-8 font-display text-lg font-semibold text-text">
        Activity
      </h2>
      <DataTable head={["When", "Action", "By", "Details"]}>
        {logs.length === 0 ? (
          <EmptyRow colSpan={4}>No activity yet.</EmptyRow>
        ) : (
          logs.map((l) => (
            <tr key={l.id}>
              <Td className="whitespace-nowrap text-muted">
                {formatDateTime(l.createdAt)}
              </Td>
              <Td className="font-mono text-xs text-text">{l.action}</Td>
              <Td className="text-muted">
                {l.actor?.name ??
                  (l.actorId === order.userId ? "Customer" : "System")}
              </Td>
              <Td className="max-w-[420px] truncate font-mono text-xs text-muted">
                {l.metadata ? JSON.stringify(l.metadata) : ""}
              </Td>
            </tr>
          ))
        )}
      </DataTable>
    </>
  );
}
