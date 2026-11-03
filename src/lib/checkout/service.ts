import "server-only";
import { randomBytes, randomInt } from "node:crypto";
import type { OrderStatus, PaymentRequest, Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { monthsFor } from "@/lib/pricing";
import { getSettings, type Settings } from "@/lib/settings";
import { notifyAdmins, notifyUser } from "@/lib/notify";
import { absoluteUrl } from "@/lib/site";
import { isValidBtcAddress, usdToSats } from "@/lib/checkout/bitcoin";
import { addressTransactions, fetchBtcUsd } from "@/lib/checkout/chain";
import {
  matchTransactions,
  outcomeFor,
  type ChainTx,
} from "@/lib/checkout/match";

/**
 * Checkout lifecycle. Amounts always come from the database (the plan price
 * copied onto the invoice), never from the browser. An invoice becomes PAID
 * only through `finalizePaid`: from an on-chain match with enough
 * confirmations, or from an admin confirming a manual payment.
 */

export class CheckoutError extends Error {}

/** Statuses that block starting a new invoice. */
export const OPEN_STATUSES: OrderStatus[] = [
  "PENDING",
  "PENDING_CONFIRMATION",
  "UNDERPAID",
];

// Payments detected up to a day after a quote or reservation lapsed are still honoured.
const LATE_PAYMENT_WINDOW_MS = 24 * 60 * 60 * 1000;
const CHECK_THROTTLE_MS = 10_000;

const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
function invoiceNumber() {
  return `AGT-${[...randomBytes(8)].map((b) => ALPHABET[b % ALPHABET.length]).join("")}`;
}

function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

async function systemAudit(
  tx: Prisma.TransactionClient,
  action: string,
  targetId: string,
  metadata: Record<string, unknown>,
  actorId: string | null = null,
) {
  await tx.auditLog.create({
    data: {
      actorId,
      action,
      targetType: "Order",
      targetId,
      metadata: metadata as Prisma.InputJsonValue,
    },
  });
}

/** Marks lapsed reservations as expired. Invoices with a payment detected or reported are left alone. */
export async function expireStale(userId?: string) {
  const now = new Date();
  const stale = await db.order.findMany({
    where: {
      status: "PENDING",
      expiresAt: { lt: now },
      ...(userId ? { userId } : {}),
    },
    select: {
      id: true,
      requests: {
        where: { status: "AWAITING", expiresAt: { gt: now } },
        select: { id: true },
      },
    },
  });
  // A live Bitcoin quote keeps the invoice open until the quote ends.
  const ids = stale.filter((o) => o.requests.length === 0).map((o) => o.id);
  if (ids.length === 0) return;
  await db.$transaction([
    db.order.updateMany({
      where: { id: { in: ids }, status: "PENDING" },
      data: { status: "EXPIRED" },
    }),
    db.paymentRequest.updateMany({
      where: { orderId: { in: ids }, status: "AWAITING" },
      data: { status: "EXPIRED" },
    }),
  ]);
}

export async function getOpenInvoice(userId: string) {
  await expireStale(userId);
  return db.order.findFirst({
    where: { userId, status: { in: OPEN_STATUSES } },
    orderBy: { createdAt: "desc" },
    include: {
      plan: true,
      method: true,
      requests: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
}

export async function createInvoice(userId: string, planSlug: string) {
  const [plan, settings] = await Promise.all([
    db.plan.findFirst({ where: { slug: planSlug, isActive: true } }),
    getSettings(),
  ]);
  if (!plan) throw new CheckoutError("That pack is no longer available.");
  if (plan.priceCents < settings.crypto.minimumUsd * 100)
    throw new CheckoutError("This pack is below the minimum payment amount.");

  const open = await getOpenInvoice(userId);
  if (open && open.status !== "PENDING")
    throw new CheckoutError(
      "A payment for your current invoice is being confirmed. Please wait for it to finish first.",
    );
  if (open?.planId === plan.id) return open;

  const order = await db.$transaction(async (tx) => {
    if (open) {
      await tx.order.update({
        where: { id: open.id },
        data: { status: "CANCELED", note: "Replaced by a new invoice." },
      });
      await tx.paymentRequest.updateMany({
        where: { orderId: open.id, status: "AWAITING" },
        data: { status: "SUPERSEDED" },
      });
    }
    const created = await tx.order.create({
      data: {
        number: invoiceNumber(),
        userId,
        planId: plan.id,
        amountCents: plan.priceCents,
        currency: plan.currency,
        status: "PENDING",
        expiresAt: new Date(
          Date.now() + settings.crypto.reservationMinutes * 60_000,
        ),
      },
    });
    await systemAudit(
      tx,
      "invoice.create",
      created.id,
      {
        number: created.number,
        plan: plan.slug,
        amountCents: plan.priceCents,
        replaced: open?.number,
      },
      userId,
    );
    await notifyAdmins(
      {
        title: "New Subscription Order",
        body: `${created.number} · ${plan.name} · ${(plan.priceCents / 100).toFixed(2)} ${plan.currency} · awaiting payment`,
        href: `/admin/payments/${created.id}`,
      },
      tx,
    );
    return created;
  });
  return order;
}

export async function cancelInvoice(userId: string, orderId: string) {
  const order = await db.order.findFirst({ where: { id: orderId, userId } });
  if (!order) throw new CheckoutError("Invoice not found.");
  if (order.status !== "PENDING")
    throw new CheckoutError("Only unpaid invoices can be cancelled.");
  await db.$transaction(async (tx) => {
    const { count } = await tx.order.updateMany({
      where: { id: order.id, status: "PENDING" },
      data: { status: "CANCELED" },
    });
    if (count === 0)
      throw new CheckoutError(
        "This invoice changed. Refresh the page and try again.",
      );
    await tx.paymentRequest.updateMany({
      where: { orderId: order.id, status: "AWAITING" },
      data: { status: "SUPERSEDED" },
    });
    await systemAudit(
      tx,
      "invoice.cancel",
      order.id,
      { number: order.number },
      userId,
    );
  });
}

/** Picks a satoshi amount no other open request on this wallet uses, so payments match unambiguously. */
async function uniqueAmount(address: string, base: number) {
  const taken = new Set(
    (
      await db.paymentRequest.findMany({
        where: {
          address,
          status: { in: ["AWAITING", "DETECTED", "UNDERPAID"] },
        },
        select: { amountSats: true },
      })
    ).map((r) => r.amountSats),
  );
  for (let i = 0; i < 50; i++) {
    const candidate = base + randomInt(1, 1000);
    if (!taken.has(candidate)) return candidate;
  }
  throw new CheckoutError(
    "Checkout is busy right now. Please try again in a minute.",
  );
}

export async function startPayment(
  userId: string,
  orderId: string,
  methodId: string,
) {
  const [order, method, settings] = await Promise.all([
    db.order.findFirst({ where: { id: orderId, userId } }),
    db.paymentMethod.findFirst({ where: { id: methodId, isActive: true } }),
    getSettings(),
  ]);
  if (!order || order.status !== "PENDING")
    throw new CheckoutError(
      "This invoice can no longer be paid. Choose a pack to create a new one.",
    );
  if (order.expiresAt && order.expiresAt < new Date())
    throw new CheckoutError(
      "Your reservation has expired. Choose a pack to create a new invoice.",
    );
  if (!method) throw new CheckoutError("That payment method isn't available.");

  const now = new Date();
  const reusable = await db.paymentRequest.findFirst({
    where: {
      orderId: order.id,
      methodId: method.id,
      status: "AWAITING",
      expiresAt: { gt: new Date(now.getTime() + 60_000) },
    },
    orderBy: { createdAt: "desc" },
  });
  if (reusable) return reusable;

  let data: Prisma.PaymentRequestUncheckedCreateInput;
  if (method.kind === "BITCOIN") {
    const { btcAddress, network, priceProvider, quoteMinutes } =
      settings.crypto;
    if (!btcAddress || !isValidBtcAddress(btcAddress, network))
      throw new CheckoutError(
        "Bitcoin payments aren't set up yet. Please choose another method or contact support.",
      );
    let quote: { rate: number; source: string };
    try {
      quote = await fetchBtcUsd(priceProvider);
    } catch (e) {
      console.error("[checkout] price", e instanceof Error ? e.message : e);
      throw new CheckoutError(
        "We couldn't get a live Bitcoin price. Please try again in a moment.",
      );
    }
    data = {
      orderId: order.id,
      methodId: method.id,
      kind: "BITCOIN",
      usdCents: order.amountCents,
      rateUsd: quote.rate.toFixed(2),
      priceSource: quote.source,
      amountSats: await uniqueAmount(
        btcAddress,
        usdToSats(order.amountCents, quote.rate),
      ),
      address: btcAddress,
      network,
      expiresAt: new Date(now.getTime() + quoteMinutes * 60_000),
    };
  } else {
    if (!method.account)
      throw new CheckoutError("That payment method isn't available.");
    data = {
      orderId: order.id,
      methodId: method.id,
      kind: "MANUAL",
      usdCents: order.amountCents,
      expiresAt: order.expiresAt ?? now,
    };
  }

  return db.$transaction(async (tx) => {
    await tx.paymentRequest.updateMany({
      where: { orderId: order.id, status: "AWAITING" },
      data: { status: "SUPERSEDED" },
    });
    await tx.order.update({
      where: { id: order.id },
      data: { methodId: method.id },
    });
    const request = await tx.paymentRequest.create({ data });
    await systemAudit(
      tx,
      "payment.start",
      order.id,
      {
        method: method.name,
        kind: method.kind,
        amountSats: data.amountSats,
        rateUsd: data.rateUsd,
        source: data.priceSource,
      },
      userId,
    );
    return request;
  });
}

/**
 * "I Have Paid": the customer asks us to review their payment. This never marks the
 * invoice paid; it moves it to Pending Confirmation for an admin (Bitcoin payments
 * keep being checked on-chain in the background).
 */
export async function submitPaymentReview(userId: string, orderId: string, opts: { requestId?: string | null; reference?: string }) {
  const order = await db.order.findFirst({ where: { id: orderId, userId }, include: { plan: true, user: { select: { name: true, email: true } } } });
  if (!order || order.status !== "PENDING") throw new CheckoutError("This invoice can't be sent for review. Refresh the page and try again.");
  const request = opts.requestId ? await db.paymentRequest.findFirst({ where: { id: opts.requestId, orderId: order.id }, include: { method: true } }) : null;
  const reference = opts.reference?.trim() || null;
  const now = new Date();

  await db.$transaction(async (tx) => {
    if (request?.kind === "MANUAL" && request.status === "AWAITING") {
      await tx.paymentRequest.update({ where: { id: request.id }, data: { status: "REPORTED" } });
    }
    const { count } = await tx.order.updateMany({
      where: { id: order.id, status: "PENDING" },
      data: { status: "PENDING_CONFIRMATION", reportedAt: now, customerReference: reference, ...(request?.methodId ? { methodId: request.methodId } : {}) },
    });
    if (count === 0) throw new CheckoutError("This invoice changed. Refresh the page and try again.");
    await systemAudit(tx, "payment.report", order.id, { method: request?.method?.name ?? null, reference }, userId);
    await notifyUser(
      userId,
      {
        title: "Payment Confirmation Received",
        body: `Your payment for invoice ${order.number} is under review. We'll notify you as soon as it's verified.`,
        href: `/dashboard/payment-review/${order.id}`,
      },
      tx,
    );
    await notifyAdmins(
      {
        title: "Customer Submitted Payment Confirmation",
        body: `${order.user.name} (${order.user.email}) · ${order.number} · ${order.plan.name} · ${(order.amountCents / 100).toFixed(2)} ${order.currency}${request?.method ? ` via ${request.method.name}` : ""}${reference ? ` · Ref ${reference}` : ""}`,
        href: `/admin/payments/${order.id}`,
      },
      tx,
    );
  });

  const settings = await getSettings();
  if (settings.notifications.adminEmail) {
    await sendEmail({
      to: settings.notifications.adminEmail,
      subject: `Payment to confirm: ${order.number}`,
      heading: "A customer submitted a payment for review",
      body: `Invoice ${order.number} (${(order.amountCents / 100).toFixed(2)} ${order.currency}) via ${request?.method?.name ?? "an unspecified method"}. Reference: ${reference ?? "none given"}. Check your account, then confirm it in Orders & Payments.`,
      cta: { label: "Open the invoice", url: absoluteUrl(`/admin/payments/${order.id}`) },
    }).catch((e) => console.error("[checkout] admin email", e instanceof Error ? e.message : e));
  }
}

/**
 * Marks an invoice paid, exactly once, and opens a subscription waiting for an admin
 * to add the IPTV login and activate it. Default dates follow the pack length;
 * extensions start when the customer's current access ends. `reference` must be unique per real
 * payment (txid or provider transaction ID), which blocks double-counting.
 */
export async function finalizePaid(
  orderId: string,
  opts: {
    provider: string;
    reference: string;
    actorId: string | null;
    note?: string;
  },
) {
  const result = await db.$transaction(async (tx) => {
    const order = await tx.order.findUniqueOrThrow({
      where: { id: orderId },
      include: {
        plan: true,
        user: { select: { id: true, email: true, name: true } },
      },
    });
    if (order.status === "PAID") return null;
    const { count } = await tx.order.updateMany({
      where: { id: order.id, status: { not: "PAID" } },
      data: {
        status: "PAID",
        paidAt: new Date(),
        ...(opts.note ? { note: opts.note } : {}),
      },
    });
    if (count === 0) return null;

    const now = new Date();
    const current = await tx.subscription.findFirst({
      where: {
        userId: order.userId,
        status: "ACTIVE",
        currentPeriodEnd: { gt: now },
      },
      orderBy: { currentPeriodEnd: "desc" },
    });
    const start = current?.currentPeriodEnd ?? now;
    const months = monthsFor(order.plan.interval);
    const end = months > 0 ? addMonths(start, months) : null;
    const subscription = await tx.subscription.create({
      data: {
        userId: order.userId,
        planId: order.planId,
        status: "PENDING",
        currentPeriodStart: start,
        currentPeriodEnd: end,
      },
    });
    await tx.order.update({
      where: { id: order.id },
      data: { subscriptionId: subscription.id },
    });
    await tx.payment.create({
      data: {
        userId: order.userId,
        orderId: order.id,
        subscriptionId: subscription.id,
        amountCents: order.amountCents,
        currency: order.currency,
        status: "SUCCEEDED",
        provider: opts.provider.slice(0, 40),
        providerReference: opts.reference.slice(0, 255),
      },
    });
    await notifyUser(
      order.userId,
      {
        title: "Payment Approved",
        body: `Invoice ${order.number} is paid. We're setting up your ${order.plan.name}; your IPTV login details will appear in My Subscription as soon as it's active.`,
        href: "/dashboard/subscription",
      },
      tx,
    );
    await notifyAdmins(
      {
        title: "Subscription Waiting for Activation",
        body: `${order.user.name} (${order.user.email}) · ${order.number} · ${order.plan.name} is paid. Add the IPTV login and activate it.`,
        href: `/admin/subscriptions/${subscription.id}`,
      },
      tx,
    );
    await systemAudit(
      tx,
      "invoice.paid",
      order.id,
      {
        number: order.number,
        provider: opts.provider,
        reference: opts.reference,
        subscriptionId: subscription.id,
      },
      opts.actorId,
    );
    return { order, end };
  });

  if (result) {
    await sendEmail({
      to: result.order.user.email,
      subject: `Payment confirmed: ${result.order.plan.name}`,
      heading: "Payment Successful!",
      body: `Your payment for invoice ${result.order.number} has been confirmed. We're activating your ${result.order.plan.name} now; your login details will appear in My Subscription on your dashboard.`,
      cta: {
        label: "Open your dashboard",
        url: absoluteUrl("/dashboard/subscription"),
      },
    }).catch((e) =>
      console.error(
        "[checkout] receipt email",
        e instanceof Error ? e.message : e,
      ),
    );
  }
  return Boolean(result);
}

async function applyTx(
  request: PaymentRequest,
  tx: ChainTx,
  settings: Settings,
) {
  const outcome = outcomeFor(
    tx.valueSats,
    request.amountSats ?? 0,
    settings.crypto.tolerancePct,
  );
  if (outcome === "under") {
    await db.$transaction(async (t) => {
      await t.paymentRequest.update({
        where: { id: request.id },
        data: {
          status: "UNDERPAID",
          txid: tx.txid,
          receivedSats: tx.valueSats,
          confirmations: tx.confirmations,
        },
      });
      await t.order.updateMany({
        where: { id: request.orderId, status: { not: "PAID" } },
        data: {
          status: "UNDERPAID",
          note: `Underpaid: received ${tx.valueSats} of ${request.amountSats} sats (tx ${tx.txid}).`,
        },
      });
      await systemAudit(t, "payment.underpaid", request.orderId, {
        txid: tx.txid,
        receivedSats: tx.valueSats,
        amountSats: request.amountSats,
      });
    });
    return;
  }
  const note =
    outcome === "over"
      ? `Overpaid: received ${tx.valueSats} of ${request.amountSats} sats (tx ${tx.txid}).`
      : undefined;
  if (tx.confirmations >= settings.crypto.confirmations) {
    await db.paymentRequest.update({
      where: { id: request.id },
      data: {
        status: "CONFIRMED",
        txid: tx.txid,
        receivedSats: tx.valueSats,
        confirmations: tx.confirmations,
      },
    });
    await finalizePaid(request.orderId, {
      provider: "bitcoin",
      reference: tx.txid,
      actorId: null,
      note,
    });
  } else {
    await db.$transaction(async (t) => {
      await t.paymentRequest.update({
        where: { id: request.id },
        data: {
          status: "DETECTED",
          txid: tx.txid,
          receivedSats: tx.valueSats,
          confirmations: tx.confirmations,
        },
      });
      await t.order.updateMany({
        where: { id: request.orderId, status: { in: ["PENDING", "EXPIRED"] } },
        data: { status: "PENDING_CONFIRMATION", ...(note ? { note } : {}) },
      });
      if (request.status !== "DETECTED")
        await systemAudit(t, "payment.detected", request.orderId, {
          txid: tx.txid,
          receivedSats: tx.valueSats,
          confirmations: tx.confirmations,
        });
    });
  }
}

/** Checks the blockchain for every open Bitcoin request on one wallet and updates their invoices. */
export async function syncAddress(address: string) {
  const settings = await getSettings();
  const since = new Date(Date.now() - LATE_PAYMENT_WINDOW_MS);
  const requests = await db.paymentRequest.findMany({
    where: {
      address,
      kind: "BITCOIN",
      OR: [
        { status: { in: ["AWAITING", "DETECTED"] } },
        {
          status: { in: ["EXPIRED", "SUPERSEDED"] },
          expiresAt: { gt: since },
          txid: null,
        },
      ],
      order: { status: { not: "PAID" } },
    },
  });
  if (requests.length === 0) return;
  const txs = await addressTransactions(
    address,
    (requests[0].network as "mainnet" | "testnet4") ?? settings.crypto.network,
  );
  await db.paymentRequest.updateMany({
    where: { id: { in: requests.map((r) => r.id) } },
    data: { lastCheckedAt: new Date() },
  });

  // Already-attributed payments: just follow their confirmations.
  for (const req of requests.filter((r) => r.txid)) {
    const tx = txs.find((t) => t.txid === req.txid);
    if (tx) await applyTx(req, tx, settings);
  }

  const claimed = new Set(
    (
      await db.paymentRequest.findMany({
        where: { txid: { in: txs.map((t) => t.txid) } },
        select: { txid: true },
      })
    ).map((r) => r.txid!),
  );
  const unmatched = requests.filter((r) => !r.txid && r.amountSats);
  // Live requests compete for ambiguous amounts; lapsed ones only get exact matches.
  const live = unmatched.filter((r) => r.status === "AWAITING");
  const matches = [
    ...matchTransactions(
      live.map((r) => ({
        id: r.id,
        amountSats: r.amountSats!,
        createdAt: r.createdAt,
      })),
      txs,
      claimed,
      settings.crypto.tolerancePct,
    ),
  ];
  const used = new Set([...claimed, ...matches.map((m) => m.tx.txid)]);
  for (const r of unmatched.filter((r) => r.status !== "AWAITING")) {
    const tx = txs.find(
      (t) => !used.has(t.txid) && t.valueSats === r.amountSats,
    );
    if (tx) {
      matches.push({ requestId: r.id, tx, outcome: "exact" });
      used.add(tx.txid);
    }
  }
  for (const m of matches) {
    const req = requests.find((r) => r.id === m.requestId)!;
    await applyTx(req, m.tx, settings);
  }
}

/** Customer polling entry point: re-checks the chain at most every few seconds per request. */
export async function refreshRequest(userId: string, requestId: string) {
  const request = await db.paymentRequest.findFirst({
    where: { id: requestId, order: { userId } },
  });
  if (!request) return null;
  const open = request.status === "AWAITING" || request.status === "DETECTED";
  if (
    request.kind === "BITCOIN" &&
    request.address &&
    open &&
    (!request.lastCheckedAt ||
      Date.now() - request.lastCheckedAt.getTime() > CHECK_THROTTLE_MS)
  ) {
    try {
      await syncAddress(request.address);
    } catch (e) {
      console.error("[checkout] sync", e instanceof Error ? e.message : e);
    }
  }
  await expireStale(userId);
  return db.paymentRequest.findUnique({
    where: { id: request.id },
    include: { order: { select: { status: true, number: true } } },
  });
}

/** Background sweep for a cron job: checks every wallet with open requests and expires stale invoices. */
export async function sweepPayments() {
  const addresses = await db.paymentRequest.findMany({
    where: {
      kind: "BITCOIN",
      address: { not: null },
      OR: [
        { status: { in: ["AWAITING", "DETECTED"] } },
        {
          status: "EXPIRED",
          txid: null,
          expiresAt: { gt: new Date(Date.now() - LATE_PAYMENT_WINDOW_MS) },
        },
      ],
    },
    distinct: ["address"],
    select: { address: true },
  });
  const errors: string[] = [];
  for (const { address } of addresses) {
    try {
      await syncAddress(address!);
    } catch (e) {
      errors.push(e instanceof Error ? e.message : String(e));
    }
  }
  await expireStale();
  return { addresses: addresses.length, errors };
}

/** What the payment window needs, safe to send to the invoice owner. */
export type RequestView = {
  id: string;
  orderId: string;
  kind: "BITCOIN" | "MANUAL";
  status: string;
  orderStatus: OrderStatus;
  invoiceNumber: string;
  usdCents: number;
  amountSats: number | null;
  rateUsd: string | null;
  address: string | null;
  network: string | null;
  expiresAt: string;
  confirmations: number;
  required: number;
  receivedSats: number | null;
  txid: string | null;
  method: {
    name: string;
    account: string | null;
    instructions: string | null;
    paymentUrl: string | null;
    networkLabel: string | null;
  } | null;
};

export async function getRequestView(
  userId: string,
  requestId: string,
): Promise<RequestView | null> {
  const [request, settings] = await Promise.all([
    db.paymentRequest.findFirst({
      where: { id: requestId, order: { userId } },
      include: {
        order: { select: { status: true, number: true } },
        method: true,
      },
    }),
    getSettings(),
  ]);
  if (!request) return null;
  return {
    id: request.id,
    orderId: request.orderId,
    kind: request.kind,
    status: request.status,
    orderStatus: request.order.status,
    invoiceNumber: request.order.number ?? "",
    usdCents: request.usdCents,
    amountSats: request.amountSats,
    rateUsd: request.rateUsd?.toFixed(2) ?? null,
    address: request.address,
    network: request.network,
    expiresAt: request.expiresAt.toISOString(),
    confirmations: request.confirmations,
    required: settings.crypto.confirmations,
    receivedSats: request.receivedSats,
    txid: request.txid,
    method: request.method
      ? {
          name: request.method.name,
          account:
            request.method.kind === "MANUAL" ? request.method.account : null,
          instructions: request.method.instructions,
          paymentUrl: request.method.paymentUrl,
          networkLabel: request.method.network,
        }
      : null,
  };
}
