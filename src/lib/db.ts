import "server-only";
import { Prisma, PrismaClient } from "@prisma/client";

/*
 * Brief database interruptions (the hosting MySQL restarting, a dropped socket) surface as connection errors
 * such as P1001 "Can't reach database server". Those are retried a couple of times with a short pause before
 * the error reaches a page, so a few seconds of downtime doesn't show visitors the error screen.
 * Only connection failures are retried: the query never ran, so repeating it is safe.
 */
const RETRYABLE = new Set(["P1001", "P1002", "P1008", "P1017"]);
const DELAYS_MS = [300, 1200];

function isConnectionError(error: unknown) {
  if (error instanceof Prisma.PrismaClientInitializationError) return true;
  return error instanceof Prisma.PrismaClientKnownRequestError && RETRYABLE.has(error.code);
}

/*
 * Connection pool limits and timeouts, added to DATABASE_URL here so they don't depend on editing the hosting
 * environment. Without them a dropped MySQL socket could leave queries waiting with no end, and every page that
 * reads the database hung until the app was restarted. With them a stuck query fails after a few seconds (the
 * retry above handles brief blips) and the pool recovers on its own. Any value already in DATABASE_URL wins.
 */
const POOL_PARAMS: Record<string, string> = {
  connection_limit: "5",
  connect_timeout: "10",
  pool_timeout: "10",
  socket_timeout: "30",
};

/** Appends the missing parameters to the end of the URL; the credentials part is never re-encoded. */
export function withPoolParams(raw: string | undefined) {
  if (!raw || raw.includes("#")) return raw;
  const query = raw.includes("?") ? raw.slice(raw.indexOf("?") + 1) : "";
  const present = new Set(query.split("&").map((p) => p.split("=")[0]).filter(Boolean));
  const missing = Object.entries(POOL_PARAMS).filter(([key]) => !present.has(key));
  if (!missing.length) return raw;
  const extra = missing.map(([key, value]) => `${key}=${value}`).join("&");
  return raw + (raw.includes("?") ? (raw.endsWith("?") || raw.endsWith("&") ? "" : "&") : "?") + extra;
}

function createClient(): PrismaClient {
  const url = withPoolParams(process.env.DATABASE_URL);
  const base = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    ...(url ? { datasources: { db: { url } } } : {}),
  });
  // A query-only extension leaves every model and result type unchanged, so the client keeps its PrismaClient
  // type (the extended type would not be assignable to Prisma.TransactionClient where helpers expect it).
  return base.$extends({
    query: {
      async $allOperations({ args, query }) {
        for (let attempt = 0; ; attempt++) {
          try {
            return await query(args);
          } catch (error) {
            if (attempt >= DELAYS_MS.length || !isConnectionError(error)) throw error;
            await new Promise((resolve) => setTimeout(resolve, DELAYS_MS[attempt]));
          }
        }
      },
    },
  }) as unknown as PrismaClient;
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
