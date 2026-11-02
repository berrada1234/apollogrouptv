import "server-only";
import { z } from "zod";
import type { ActionState } from "@/lib/action-state";
import { AuthorizationError } from "@/lib/session";

export type { ActionState };

export function fail(message: string, fieldErrors?: ActionState["fieldErrors"]): ActionState {
  return { ok: false, message, fieldErrors };
}

export function success(message: string): ActionState {
  return { ok: true, message };
}

export function fromZod(error: z.ZodError): ActionState {
  return fail("Please correct the highlighted fields.", z.flattenError(error).fieldErrors as ActionState["fieldErrors"]);
}

/** Converts thrown errors into safe, user-facing messages. */
export function handleActionError(error: unknown): ActionState {
  if (error instanceof AuthorizationError) return fail("You are not allowed to do that.");
  const code = (error as { code?: string })?.code;
  if (code === "P2002") return fail("That value is already in use.");
  if (code === "P2003") return fail("This record is still referenced by other data.");
  console.error("[action]", error instanceof Error ? error.message : error);
  return fail("Something went wrong. Please try again.");
}
