import { NextResponse } from "next/server";
import { adminAttention, SIGNUP_ALERT_TITLE } from "@/lib/admin-attention";
import { siteConfig } from "@/lib/site";
import { db } from "@/lib/db";
import { getCurrentUser, hasRole } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !hasRole(user, "SUPPORT")) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const isAdmin = hasRole(user, "ADMIN");
  const [counts, unread] = await Promise.all([
    adminAttention(user.id, isAdmin),
    isAdmin ? db.notification.count({ where: { userId: user.id, audience: "ADMIN", readAt: null } }) : 0,
  ]);
  return NextResponse.json({ ...counts, unread }, { headers: { "Cache-Control": "no-store" } });
}

/** Marks this admin's new sign-up alerts as seen (called when "Not purchased" opens). */
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || !hasRole(user, "ADMIN")) return NextResponse.json({ error: "Not found" }, { status: 404 });
  // Same-origin only, so another site can't clear the alerts.
  const origin = req.headers.get("origin");
  if (origin && origin !== new URL(req.url).origin && origin !== siteConfig.url) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = (await req.json().catch(() => null)) as { seen?: string } | null;
  if (body?.seen !== "signups") return NextResponse.json({ error: "Bad request" }, { status: 400 });
  const { count } = await db.notification.updateMany({
    where: { userId: user.id, audience: "ADMIN", readAt: null, title: SIGNUP_ALERT_TITLE },
    data: { readAt: new Date() },
  });
  return NextResponse.json({ cleared: count });
}
