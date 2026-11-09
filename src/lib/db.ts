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

function createClient(): PrismaClient {
  const base = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
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
