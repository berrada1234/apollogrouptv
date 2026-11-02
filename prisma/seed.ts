/**
 * Development seed.
 *
 *  - FAQ entries describing how the platform works are always upserted.
 *  - Owner-approved plans are always ensured. Demo categories and channels are created only outside production
 *    (or with SEED_DEMO=true). They are clearly labelled “Demo” — replace them
 *    with your real, licensed catalog and approved prices before launch.
 *  - No user or administrator is ever created here. See scripts/create-admin.ts.
 */
import { PrismaClient } from "@prisma/client";
import { faqSeed, legacyFaqQuestions, previousFaqCategories, previousFaqQuestions } from "../src/content/faqs";

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
  // Retire the nine-category set that the topic-based FAQ replaces (admin-created entries are kept).
  const retired = await db.faq.deleteMany({ where: { question: { in: previousFaqQuestions }, category: { in: previousFaqCategories } } });
  let created = 0;
  for (const [i, f] of faqSeed.entries()) {
    const existing = await db.faq.findFirst({ where: { question: f.question } });
    if (!existing) {
      await db.faq.create({ data: { ...f, sortOrder: i } });
      created++;
    }
  }
  console.log(`✓ FAQ: ${created} added, ${removed.count + retired.count} older entries replaced (${faqSeed.length} in the canonical set)`);
}

/**
 * Owner-approved packs (prices supplied by the site owner on 2026-11-03).
 * Created once; later edits made in Admin → Plans are never overwritten.
 * Features list only what the service can stand behind — add further claims in the admin
 * once they are verified.
 */
const packFeatures = [
  "Up to 5 devices per account",
  "Live channels and on-demand library",
  "HD, Full HD and 4K where available",
  "Setup guides for verified devices",
  "Account dashboard with billing history",
  "Ticket-based customer support",
];

const packs = [
  { slug: "starter", name: "Starter Pack", interval: "MONTHLY", priceCents: 2499, sortOrder: 1, description: "One month of access — the easiest way to get started." },
  { slug: "silver", name: "Silver Pack", interval: "QUARTERLY", priceCents: 5499, sortOrder: 2, description: "Three months of access at a lower monthly cost." },
  { slug: "elite", name: "Elite Pack", interval: "SEMIANNUAL", priceCents: 9999, sortOrder: 3, description: "Six months of access for regular viewers." },
  { slug: "platinum", name: "Platinum Pack", interval: "YEARLY", priceCents: 14999, sortOrder: 4, description: "A full year of access with the lowest monthly cost." },
] as const;

async function seedPlans() {
  for (const p of packs) {
    await db.plan.upsert({
      where: { slug: p.slug },
      update: {},
      create: { ...p, currency: "USD", oneTime: true, highlighted: false, isActive: true, features: packFeatures },
    });
  }
  // Retire the development placeholders now that real packs exist.
  const retired = await db.plan.updateMany({ where: { slug: { startsWith: "demo-" }, isActive: true }, data: { isActive: false } });
  console.log(`✓ Plans: ${packs.length} packs ensured, ${retired.count} demo plans deactivated`);
}

async function seedDemo() {
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
  console.log("✓ Demo categories and channels ensured (labelled “Demo”)");
}

async function main() {
  await seedFaqs();
  await seedPlans();
  if (process.env.NODE_ENV !== "production" || process.env.SEED_DEMO === "true") await seedDemo();
  else console.log("• Skipping demo data in production (set SEED_DEMO=true to force)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
