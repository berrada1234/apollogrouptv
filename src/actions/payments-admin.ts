"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { audit, auditData } from "@/lib/audit";
import {
  fail,
  fromZod,
  handleActionError,
  success,
  type ActionState,
} from "@/lib/action";
import { assertRole } from "@/lib/session";
import { settingsSchemas } from "@/lib/settings";
import { isValidBtcAddress } from "@/lib/checkout/bitcoin";
import { finalizePaid, syncAddress } from "@/lib/checkout/service";

const id = z.string().min(1).max(64);
const str = (fd: FormData, key: string) => String(fd.get(key) ?? "");
const optional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => v || null);
const link = z
  .string()
  .trim()
  .max(512)
  .refine(
    (v) => v === "" || /^https:\/\//.test(v) || /^\/[^/\\]/.test(v),
    "Use an https:// link or a path on this site",
  )
  .transform((v) => v || null);

function revalidateCheckout() {
  revalidatePath("/admin/payment-methods");
  revalidatePath("/dashboard/plan");
  revalidatePath("/payment-methods");
}

// ─── Payment methods ────────────────────────────────────────────────────────

const methodSchema = z.object({
  name: z.string().trim().min(2).max(80),
  subtitle: z.string().trim().min(1).max(80),
  country: optional(80),
  description: optional(240),
  kind: z.enum(["BITCOIN", "MANUAL"]),
  logoUrl: link,
  glyph: optional(4),
  accent: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || /^#[0-9a-fA-F]{6}$/.test(v),
      "Use a hex colour like #F7931A",
    )
    .transform((v) => v || null),
  account: optional(255),
  instructions: optional(3000),
  paymentUrl: z
    .string()
    .trim()
    .max(512)
    .refine((v) => v === "" || /^https:\/\//.test(v), "Use an https:// link")
    .transform((v) => v || null),
  network: optional(80),
  isActive: z.boolean(),
  sortOrder: z.coerce.number().int().min(0).max(999),
});

export async function savePaymentMethod(
  _: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    const actor = await assertRole("ADMIN");
    const methodId = str(fd, "id");
    const parsed = methodSchema.safeParse({
      ...Object.fromEntries(
        [
          "name",
          "subtitle",
          "country",
          "description",
          "kind",
          "logoUrl",
          "glyph",
          "accent",
          "account",
          "instructions",
          "paymentUrl",
          "network",
          "sortOrder",
        ].map((k) => [k, str(fd, k)]),
      ),
      isActive: fd.get("isActive") === "on",
    });
    if (!parsed.success) return fromZod(parsed.error);
    if (
      parsed.data.kind === "MANUAL" &&
      parsed.data.isActive &&
      !parsed.data.account
    ) {
      return fail(
        "Add the account customers pay to (for example your $cashtag or Zelle email) before activating a manual method.",
        {
          account: ["Required for an active manual method"],
        },
      );
    }
    const data = parsed.data;
    const saved = methodId
      ? await db.paymentMethod.update({ where: { id: methodId }, data })
      : await db.paymentMethod.create({ data });
    await audit({
      actorId: actor.id,
      action: methodId ? "payment_method.update" : "payment_method.create",
      targetType: "PaymentMethod",
      targetId: saved.id,
      metadata: { ...data, account: data.account ? "[set]" : null },
    });
    revalidateCheckout();
    return success(
      methodId
        ? "Payment method saved."
        : "Payment method added. It now appears on the customer payment page.",
    );
  } catch (e) {
    return handleActionError(e);
  }
}

export async function togglePaymentMethod(
  _: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    const actor = await assertRole("ADMIN");
    const method = await db.paymentMethod.findUniqueOrThrow({
      where: { id: str(fd, "id") },
    });
    if (!method.isActive && method.kind === "MANUAL" && !method.account)
      return fail("Add the payment account first (Edit).");
    await db.$transaction([
      db.paymentMethod.update({
        where: { id: method.id },
        data: { isActive: !method.isActive },
      }),
      db.auditLog.create({
        data: await auditData({
          actorId: actor.id,
          action: method.isActive
            ? "payment_method.deactivate"
            : "payment_method.activate",
          targetType: "PaymentMethod",
          targetId: method.id,
        }),
      }),
    ]);
    revalidateCheckout();
    return success(method.isActive ? "Deactivated." : "Activated.");
  } catch (e) {
    return handleActionError(e);
  }
}

export async function deletePaymentMethod(
  _: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    const actor = await assertRole("ADMIN");
    const method = await db.paymentMethod.findUniqueOrThrow({
      where: { id: str(fd, "id") },
    });
    // Invoices keep their history; their link to the method is cleared (onDelete: SetNull).
    await db.$transaction([
      db.paymentMethod.delete({ where: { id: method.id } }),
      db.auditLog.create({
        data: await auditData({
          actorId: actor.id,
          action: "payment_method.delete",
          targetType: "PaymentMethod",
          targetId: method.id,
          metadata: { name: method.name },
        }),
      }),
    ]);
    revalidateCheckout();
    return success("Payment method deleted.");
  } catch (e) {
    return handleActionError(e);
  }
}

/** Saves a new display order from the drag-and-drop list. */
export async function reorderPaymentMethods(
  ids: string[],
): Promise<ActionState> {
  try {
    const actor = await assertRole("ADMIN");
    const parsed = z.array(id).max(100).safeParse(ids);
    if (!parsed.success) return fail("Invalid order.");
    await db.$transaction([
      ...parsed.data.map((methodId, i) =>
        db.paymentMethod.update({
          where: { id: methodId },
          data: { sortOrder: i + 1 },
        }),
      ),
      db.auditLog.create({
        data: await auditData({
          actorId: actor.id,
          action: "payment_method.reorder",
          targetType: "PaymentMethod",
          metadata: { order: parsed.data },
        }),
      }),
    ]);
    revalidateCheckout();
    return success("Order saved.");
  } catch (e) {
    return handleActionError(e);
  }
}

// ─── Crypto wallet settings ─────────────────────────────────────────────────

export async function saveCryptoSettings(
  _: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    const actor = await assertRole("ADMIN");
    const parsed = settingsSchemas.crypto.safeParse(
      Object.fromEntries(
        [
          "btcAddress",
          "network",
          "priceProvider",
          "quoteMinutes",
          "reservationMinutes",
          "minimumUsd",
          "confirmations",
          "tolerancePct",
        ].map((k) => [k, str(fd, k)]),
      ),
    );
    if (!parsed.success) return fromZod(parsed.error);
    const value = parsed.data;
    if (
      value.btcAddress &&
      !isValidBtcAddress(value.btcAddress, value.network)
    ) {
      return fail(
        "That doesn't look like a valid Bitcoin address for the selected network.",
        { btcAddress: ["Check the address and network"] },
      );
    }
    const previous = await db.siteSetting.findUnique({
      where: { key: "crypto" },
    });
    const before = (previous?.value ?? {}) as { btcAddress?: string };
    await db.$transaction([
      db.siteSetting.upsert({
        where: { key: "crypto" },
        create: { key: "crypto", value },
        update: { value },
      }),
      db.auditLog.create({
        data: await auditData({
          actorId: actor.id,
          action: "settings.update",
          targetType: "SiteSetting",
          targetId: "crypto",
          metadata: {
            ...value,
            walletChanged: before.btcAddress !== value.btcAddress,
          },
        }),
      }),
    ]);
    revalidateCheckout();
    return success("Crypto settings saved.");
  } catch (e) {
    return handleActionError(e);
  }
}

// ─── Orders ─────────────────────────────────────────────────────────────────

/** An admin confirms a payment they verified in their own account (manual methods, or a Bitcoin payment the matcher couldn't attribute). */
export async function confirmOrderPayment(
  _: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    const actor = await assertRole("ADMIN");
    const parsed = z
      .object({
        orderId: id,
        transactionId: z
          .string()
          .trim()
          .min(3, "Enter the transaction ID you verified")
          .max(120),
      })
      .safeParse({
        orderId: str(fd, "orderId"),
        transactionId: str(fd, "transactionId"),
      });
    if (!parsed.success) return fromZod(parsed.error);
    const order = await db.order.findUniqueOrThrow({
      where: { id: parsed.data.orderId },
      include: { method: true },
    });
    if (order.status === "PAID") return fail("This invoice is already paid.");
    const provider =
      order.method?.kind === "BITCOIN"
        ? "bitcoin"
        : (order.method?.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") ??
          "manual");
    // One namespace for every manual confirmation, so a transaction ID can never be counted twice whatever method the invoice shows.
    const reference =
      provider === "bitcoin"
        ? parsed.data.transactionId
        : `manual:${parsed.data.transactionId}`;
    try {
      await finalizePaid(order.id, {
        provider,
        reference,
        actorId: actor.id,
        note: `Confirmed manually by an admin (${parsed.data.transactionId}).`,
      });
    } catch (e) {
      if ((e as { code?: string })?.code === "P2002")
        return fail(
          "That transaction ID is already recorded on another payment.",
        );
      throw e;
    }
    await db.paymentRequest.updateMany({
      where: {
        orderId: order.id,
        status: { in: ["AWAITING", "REPORTED", "DETECTED", "UNDERPAID"] },
      },
      data: { status: "CONFIRMED" },
    });
    revalidatePath(`/admin/payments/${order.id}`);
    revalidatePath("/admin/payments");
    return success("Payment confirmed and the pack is now active.");
  } catch (e) {
    return handleActionError(e);
  }
}

export async function checkOrderNow(
  _: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    await assertRole("ADMIN");
    const orderId = str(fd, "orderId");
    const addresses = await db.paymentRequest.findMany({
      where: { orderId, kind: "BITCOIN", address: { not: null } },
      distinct: ["address"],
      select: { address: true },
    });
    if (addresses.length === 0)
      return fail("This invoice has no Bitcoin payment to check.");
    for (const a of addresses) await syncAddress(a.address!);
    revalidatePath(`/admin/payments/${orderId}`);
    return success("Blockchain checked.");
  } catch (e) {
    if (e instanceof Error && /lookup failed/i.test(e.message))
      return fail("The blockchain service didn't respond. Try again shortly.");
    return handleActionError(e);
  }
}

export async function setOrderStatus(
  _: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    const actor = await assertRole("ADMIN");
    const parsed = z
      .object({
        orderId: id,
        status: z.enum(["FAILED", "CANCELED"]),
        note: z.string().trim().max(500),
      })
      .safeParse({
        orderId: str(fd, "orderId"),
        status: str(fd, "status"),
        note: str(fd, "note"),
      });
    if (!parsed.success) return fromZod(parsed.error);
    const order = await db.order.findUniqueOrThrow({
      where: { id: parsed.data.orderId },
    });
    if (order.status === "PAID")
      return fail(
        "Paid invoices can't be changed here. Refunds are handled with the customer in a support ticket.",
      );
    const data: Prisma.OrderUpdateInput = {
      status: parsed.data.status,
      ...(parsed.data.note ? { note: parsed.data.note } : {}),
    };
    await db.$transaction([
      db.order.update({ where: { id: order.id }, data }),
      db.paymentRequest.updateMany({
        where: { orderId: order.id, status: { in: ["AWAITING", "REPORTED"] } },
        data: { status: "SUPERSEDED" },
      }),
      db.auditLog.create({
        data: await auditData({
          actorId: actor.id,
          action: "invoice.status_change",
          targetType: "Order",
          targetId: order.id,
          metadata: {
            from: order.status,
            to: parsed.data.status,
            note: parsed.data.note,
          },
        }),
      }),
    ]);
    revalidatePath(`/admin/payments/${order.id}`);
    return success("Invoice updated.");
  } catch (e) {
    return handleActionError(e);
  }
}
