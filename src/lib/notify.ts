import "server-only";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

type Client = Prisma.TransactionClient | typeof db;
type Message = { title: string; body: string; href?: string };

/** A notification in one customer's own bell. */
export async function notifyUser(userId: string, message: Message, client: Client = db) {
  await client.notification.create({ data: { userId, audience: "USER", ...message } });
}

/** One copy per administrator, shown in the admin bell (separate from their personal notifications). */
export async function notifyAdmins(message: Message, client: Client = db) {
  const admins = await client.user.findMany({ where: { role: "ADMIN", status: "ACTIVE" }, select: { id: true } });
  if (admins.length === 0) return;
  await client.notification.createMany({ data: admins.map((a) => ({ userId: a.id, audience: "ADMIN" as const, ...message })) });
}
