import { NextResponse } from "next/server";
import { adminAttention } from "@/lib/admin-attention";
import { db } from "@/lib/db";
import { getCurrentUser, hasRole } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !hasRole(user, "SUPPORT")) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const isAdmin = hasRole(user, "ADMIN");
  const [counts, unread] = await Promise.all([
    adminAttention(isAdmin),
    isAdmin ? db.notification.count({ where: { userId: user.id, audience: "ADMIN", readAt: null } }) : 0,
  ]);
  return NextResponse.json({ ...counts, unread }, { headers: { "Cache-Control": "no-store" } });
}
