/**
 * Promotes an existing, email-verified account to ADMIN.
 *
 * Usage (on the server, with DATABASE_URL set):
 *   npm run admin:create -- you@example.com
 *
 * The person signs up through the normal Create Account flow and verifies
 * their email first, so no password is ever chosen, printed or stored here.
 */
import { PrismaClient } from "@prisma/client";

// Load .env locally; on the server variables come from the hosting panel.
try {
  process.loadEnvFile(".env");
} catch {}

const db = new PrismaClient();

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error("Usage: npm run admin:create -- <email>");
    process.exit(1);
  }
  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`No account found for ${email}. Create the account on the website first.`);
    process.exit(1);
  }
  if (!user.emailVerified) {
    console.error(`${email} has not verified its email address yet. Verify it, then run this again.`);
    process.exit(1);
  }
  await db.$transaction([
    db.user.update({ where: { id: user.id }, data: { role: "ADMIN", status: "ACTIVE" } }),
    db.auditLog.create({
      data: { actorId: null, action: "user.role_change", targetType: "User", targetId: user.id, metadata: { to: "ADMIN", via: "cli" } },
    }),
  ]);
  console.log(`✓ ${email} is now an administrator.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
