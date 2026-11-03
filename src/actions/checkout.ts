"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  fail,
  handleActionError,
  success,
  type ActionState,
} from "@/lib/action";
import { rateLimit } from "@/lib/rate-limit";
import { assertUser } from "@/lib/session";
import {
  cancelInvoice,
  CheckoutError,
  createInvoice,
  getRequestView,
  startPayment,
  submitPaymentReview,
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

export type ReviewResult = { ok: true; href: string } | { ok: false; message: string };

/** "I Have Paid": sends the invoice for payment review and returns the Payment Under Review page. */
export async function submitPaymentReviewAction(orderId: string, requestId: string | null, reference: string): Promise<ReviewResult> {
  try {
    const user = await assertUser();
    const input = z.object({ orderId: id, requestId: id.nullable(), reference: z.string().trim().max(120) }).safeParse({ orderId, requestId, reference });
    if (!input.success) return { ok: false, message: "Keep the reference under 120 characters." };
    if (!(await rateLimit(`review:${user.id}`, 10, 60 * 10)).ok) return { ok: false, message: "Too many attempts. Please wait a few minutes." };
    await submitPaymentReview(user.id, input.data.orderId, { requestId: input.data.requestId, reference: input.data.reference });
    revalidatePath("/dashboard", "layout");
    return { ok: true, href: `/dashboard/payment-review/${input.data.orderId}` };
  } catch (e) {
    return { ok: false, message: checkoutFail(e).message ?? "Something went wrong. Please try again." };
  }
}
