import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { getRequestView, refreshRequest } from "@/lib/checkout/service";

export const dynamic = "force-dynamic";

/** Polled by the payment window: re-checks the blockchain (throttled) and returns the request's status. */
export async function GET(
  _: Request,
  ctx: RouteContext<"/api/checkout/requests/[id]">,
) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const { id } = await ctx.params;
  const refreshed = await refreshRequest(user.id, id);
  if (!refreshed)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(await getRequestView(user.id, id), {
    headers: { "cache-control": "no-store" },
  });
}
