import "server-only";
import { headers } from "next/headers";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

const SENSITIVE = /pass(word)?|secret|token|key|hash/i;

/** Strips anything that looks like a secret before it reaches the log. */
export function redact(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redact);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [
        k,
        SENSITIVE.test(k) ? "[redacted]" : redact(v),
      ]),
    );
  }
  return value;
}

type AuditEntry = {
  actorId: string;
  action: string;
  targetType: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
};

/** Builds a redacted audit row. Pass it to `tx.auditLog.create` to log inside the same transaction as the change. */
export async function auditData(
  entry: AuditEntry,
): Promise<Prisma.AuditLogUncheckedCreateInput> {
  const h = await headers();
  // x-real-ip is set by the hosting proxy; x-forwarded-for can carry client-supplied values.
  const ip = h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  return {
    actorId: entry.actorId,
    action: entry.action,
    targetType: entry.targetType,
    targetId: entry.targetId,
    metadata: entry.metadata
      ? (redact(entry.metadata) as Prisma.InputJsonValue)
      : undefined,
    ipAddress: ip,
  };
}

export async function audit(entry: AuditEntry) {
  await db.auditLog.create({ data: await auditData(entry) });
}
