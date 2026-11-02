import "server-only";
import { db } from "@/lib/db";

/**
 * Fixed-window limiter stored in the database, so it works across multiple
 * Node.js processes. Keys are namespaced with "app:" to stay clear of the
 * auth library's own entries in the same table.
 */
export async function rateLimit(key: string, max: number, windowSeconds: number) {
  const id = `app:${key}`;
  const now = Date.now();
  const windowStart = now - windowSeconds * 1000;
  return db.$transaction(async (tx) => {
    const row = await tx.rateLimit.findUnique({ where: { key: id } });
    if (!row || Number(row.lastRequest) < windowStart) {
      await tx.rateLimit.upsert({
        where: { key: id },
        create: { id, key: id, count: 1, lastRequest: BigInt(now) },
        update: { count: 1, lastRequest: BigInt(now) },
      });
      return { ok: true as const };
    }
    if (row.count >= max) return { ok: false as const };
    await tx.rateLimit.update({ where: { key: id }, data: { count: { increment: 1 } } });
    return { ok: true as const };
  });
}
