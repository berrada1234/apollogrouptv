"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  fail,
  handleActionError,
  success,
  type ActionState,
} from "@/lib/action";
import { rateLimit } from "@/lib/rate-limit";
import { assertUser } from "@/lib/session";
import { paymentsSandbox } from "@/lib/checkout/chain";
import {
  cancelInvoice,
  CheckoutError,
  createInvoice,
  getRequestView,
  refreshRequest,
  reportManualPayment,
  startPayment,
  type RequestView,
} from "@/lib/checkout/service";

const id = z.string().min(1).max(64);
const slug = z.string().trim().min(1).max(80);

function checkoutFail(e: unknown): ActionState {
  return e instanceof CheckoutError ? fail(e.message) : handleActionError(e);
}

export async function createInvoiceAction(
  _: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    const user = await assertUser();
    const plan = slug.safeParse(fd.get("plan"));
    if (!plan.success) return fail("Choose a pack first.");
    if (!(await rateLimit(`invoice:${user.id}`, 10, 60 * 10)).ok)
      return fail("Too many attempts. Please wait a few minutes.");
    await createInvoice(user.id, plan.data);
    revalidatePath("/dashboard/plan");
    return success("Invoice created. Choose how you'd like to pay.");
  } catch (e) {
    return checkoutFail(e);
  }
}

export async function cancelInvoiceAction(
  _: ActionState,
  fd: FormData,
): Promise<ActionState> {
  try {
    const user = await assertUser();
    const orderId = id.safeParse(fd.get("orderId"));
    if (!orderId.success) return fail("Invoice not found.");
    await cancelInvoice(user.id, orderId.data);
    revalidatePath("/dashboard/plan");
    return success("Invoice cancelled.");
  } catch (e) {
    return checkoutFail(e);
  }
}

export type PayResult =
  { ok: true; view: RequestView } | { ok: false; message: string };

function payFail(e: unknown): PayResult {
  return {
    ok: false,
    message:
      checkoutFail(e).message ?? "Something went wrong. Please try again.",
  };
}

export async function beginPayment(
  orderId: string,
  methodId: string,
): Promise<PayResult> {
  try {
    const user = await assertUser();
    const input = z
      .object({ orderId: id, methodId: id })
      .safeParse({ orderId, methodId });
    if (!input.success) return { ok: false, message: "Invalid request." };
    if (!(await rateLimit(`pay:${user.id}`, 20, 60 * 10)).ok)
      return {
        ok: false,
        message: "Too many attempts. Please wait a few minutes.",
      };
    const request = await startPayment(
      user.id,
      input.data.orderId,
      input.data.methodId,
    );
    const view = await getRequestView(user.id, request.id);
    return view
      ? { ok: true, view }
      : { ok: false, message: "Something went wrong. Please try again." };
  } catch (e) {
    return payFail(e);
  }
}

export async function reportPayment(
  requestId: string,
  reference: string,
): Promise<PayResult> {
  try {
    const user = await assertUser();
    const input = z
      .object({ requestId: id, reference: z.string().trim().max(120) })
      .safeParse({ requestId, reference });
    if (!input.success)
      return { ok: false, message: "Keep the reference under 120 characters." };
    await reportManualPayment(
      user.id,
      input.data.requestId,
      input.data.reference,
    );
    revalidatePath("/dashboard/plan");
    const view = await getRequestView(user.id, input.data.requestId);
    return view
      ? { ok: true, view }
      : { ok: false, message: "Something went wrong. Please try again." };
  } catch (e) {
    return payFail(e);
  }
}

/** Local sandbox only: pretends the customer's wallet broadcast a transaction, or that a block confirmed it. */
export async function sandboxPay(
  requestId: string,
  mode: "exact" | "under" | "over" | "confirm",
): Promise<PayResult> {
  try {
    if (!paymentsSandbox)
      return { ok: false, message: "The payments sandbox is off." };
    const user = await assertUser();
    const request = await db.paymentRequest.findFirst({
      where: { id: requestId, order: { userId: user.id }, kind: "BITCOIN" },
    });
    if (!request?.address || !request.amountSats)
      return { ok: false, message: "No Bitcoin payment to simulate." };
    if (mode === "confirm") {
      if (!request.txid)
        return { ok: false, message: "Send a sandbox payment first." };
      await db.sandboxTransaction.updateMany({
        where: { txid: request.txid },
        data: { confirmations: { increment: 1 } },
      });
    } else {
      const value =
        mode === "exact"
          ? request.amountSats
          : mode === "under"
            ? Math.floor(request.amountSats * 0.8)
            : Math.ceil(request.amountSats * 1.2);
      const txid = `sandbox-${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 10)}`;
      await db.sandboxTransaction.create({
        data: { address: request.address, txid, valueSats: value },
      });
    }
    await db.paymentRequest.update({
      where: { id: request.id },
      data: { lastCheckedAt: null },
    });
    await refreshRequest(user.id, request.id);
    const view = await getRequestView(user.id, request.id);
    return view ? { ok: true, view } : { ok: false, message: "Not found." };
  } catch (e) {
    return payFail(e);
  }
}
