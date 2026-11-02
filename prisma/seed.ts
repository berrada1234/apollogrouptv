/**
 * Development seed.
 *
 *  - FAQ entries describing how the platform works are always upserted.
 *  - Demo plans, categories and channels are created only outside production
 *    (or with SEED_DEMO=true). They are clearly labelled “Demo” — replace them
 *    with your real, licensed catalog and approved prices before launch.
 *  - No user or administrator is ever created here. See scripts/create-admin.ts.
 */
import { PrismaClient } from "@prisma/client";
import { faqSeed, legacyFaqQuestions } from "../src/content/faqs";

// Load .env locally; on the server variables come from the hosting panel.
try {
  process.loadEnvFile(".env");
} catch {}

const db = new PrismaClient();

async function seedFaqs() {
  // Remove the first-generation FAQ entries (old category names) that the new set replaces.
  const removed = await db.faq.deleteMany({
    where: { question: { in: legacyFaqQuestions }, category: { in: ["Account", "Billing", "App & Devices", "Support", "Referrals"] } },
  });
  let created = 0;
  for (const [i, f] of faqSeed.entries()) {
    const existing = await db.faq.findFirst({ where: { question: f.question } });
    if (!existing) {
      await db.faq.create({ data: { ...f, sortOrder: i } });
      created++;
    }
  }
  console.log(`✓ FAQ: ${created} added, ${removed.count} legacy entries replaced (${faqSeed.length} in the canonical set)`);
}

async function seedDemo() {
  const plans = [
    { slug: "demo-monthly", name: "Demo Monthly", interval: "MONTHLY", priceCents: 1000, sortOrder: 1, highlighted: false },
    { slug: "demo-quarterly", name: "Demo Quarterly", interval: "QUARTERLY", priceCents: 2700, sortOrder: 2, highlighted: true },
    { slug: "demo-yearly", name: "Demo Yearly", interval: "YEARLY", priceCents: 9600, sortOrder: 3, highlighted: false },
  ] as const;
  for (const p of plans) {
    await db.plan.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...p,
        description: "DEMO PLAN — placeholder for development. Replace with your approved plan and price.",
        currency: "USD",
        features: ["Demo feature A", "Demo feature B", "Ticket-based support"],
      },
    });
  }

  const categories = ["Demo News", "Demo Sports", "Demo Movies", "Demo Kids", "Demo Documentary"];
  for (const [i, name] of categories.entries()) {
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const cat = await db.channelCategory.upsert({ where: { slug }, update: {}, create: { name, slug, sortOrder: i } });
    for (let n = 1; n <= 4; n++) {
      const chSlug = `${slug}-${n}`;
      await db.channel.upsert({
        where: { slug: chSlug },
        update: {},
        create: {
          slug: chSlug,
          name: `${name} Channel ${n}`,
          description: "Demonstration catalog entry. Replace with an authorized, licensed channel.",
          categoryId: cat.id,
          isHd: n % 2 === 0,
          language: "English",
        },
      });
    }
  }
  console.log("✓ Demo plans, categories and channels ensured (labelled “Demo”)");
}

async function main() {
  await seedFaqs();
  if (process.env.NODE_ENV !== "production" || process.env.SEED_DEMO === "true") await seedDemo();
  else console.log("• Skipping demo data in production (set SEED_DEMO=true to force)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
