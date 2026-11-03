import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { safeRedirect } from "@/lib/utils";

export const dynamic = "force-dynamic";

/** Opening a notification marks it read, then goes to its details page. Only the recipient can open it. */
export async function GET(req: Request, ctx: RouteContext<"/api/notifications/[id]">) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.redirect(new URL("/sign-in", req.url));
  const { id } = await ctx.params;
  const n = await db.notification.findFirst({ where: { id, userId: user.id } });
  const list = n?.audience === "ADMIN" ? "/admin/notifications" : "/dashboard/notifications";
  if (!n) return NextResponse.redirect(new URL("/dashboard/notifications", req.url));
  if (!n.readAt) await db.notification.update({ where: { id: n.id }, data: { readAt: new Date() } });
  return NextResponse.redirect(new URL(n.href ? safeRedirect(n.href, list) : list, req.url));
}
