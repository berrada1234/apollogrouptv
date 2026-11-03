/**
 * Loads the Apps & Guides content from prisma/data/app-guide.json into Admin → Settings → App platforms.
 *
 * Usage (locally or on the server, with DATABASE_URL set):
 *   npm run guide:load            # only if no platforms are configured yet
 *   npm run guide:load -- --force # replace what's configured
 *
 * Everything stays editable in the admin afterwards. Only load links and codes you control.
 */
import { readFileSync } from "node:fs";
import { PrismaClient, type Prisma } from "@prisma/client";

try {
  process.loadEnvFile(".env");
} catch {}

const db = new PrismaClient();

async function main() {
  const force = process.argv.includes("--force");
  const data = JSON.parse(readFileSync("prisma/data/app-guide.json", "utf8")) as Prisma.InputJsonObject & { platforms: unknown[] };
  const current = await db.siteSetting.findUnique({ where: { key: "apps" } });
  const existing = (current?.value as { platforms?: unknown[] } | null)?.platforms ?? [];
  if (existing.length > 0 && !force) {
    console.log(`• ${existing.length} platform(s) already configured — nothing changed. Use --force to replace them.`);
    return;
  }
  await db.siteSetting.upsert({ where: { key: "apps" }, create: { key: "apps", value: data }, update: { value: data } });
  await db.auditLog.create({ data: { actorId: null, action: "settings.update", targetType: "SiteSetting", targetId: "apps", metadata: { via: "cli:guide:load", platforms: data.platforms.length } } });
  console.log(`✓ Apps & Guides loaded: ${data.platforms.length} platforms.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
