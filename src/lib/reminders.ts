import "server-only";
import { db } from "@/lib/db";
import { isEmailConfigured, sendEmail, type Mail } from "@/lib/email";
import { accessLabel } from "@/lib/pricing";
import { getActivePlans } from "@/lib/queries";
import { nextReminder, signReminderToken, type ReminderKind } from "@/lib/reminder-schedule";
import { siteConfig } from "@/lib/site";
import { formatMoney } from "@/lib/utils";

const HOUR = 60 * 60 * 1000;
/** Most reminder emails sent per run, to stay well inside the mailbox's sending limits. */
const MAX_PER_RUN = 20;
/** Orders in these states mean the customer has paid or is waiting on us, so the sequence stops. */
const PAID_OR_REPORTED = ["PAID", "PENDING_CONFIRMATION", "UNDERPAID"] as const;

function secret() {
  return process.env.BETTER_AUTH_SECRET ?? "";
}

export function unsubscribeLinks(userId: string) {
  const qs = new URLSearchParams({ u: userId, t: signReminderToken(userId, secret()) });
  return {
    pageUrl: `${siteConfig.url}/email-preferences?${qs}`,
    oneClickUrl: `${siteConfig.url}/api/reminders/unsubscribe?${qs}`,
  };
}

type Invoice = { status: string; plan: { name: string; slug: string; interval: Parameters<typeof accessLabel>[0] }; amountCents: number; currency: string };

function buildReminder(kind: ReminderKind, ctx: { firstName: string; invoice: Invoice | null; allOneTime: boolean }): Omit<Mail, "to" | "unsubscribe"> {
  const url = (path: string) => `${siteConfig.url}${path}`;
  switch (kind) {
    case "invoice": {
      const inv = ctx.invoice!;
      const pending = inv.status === "PENDING";
      return {
        subject: `Your ${inv.plan.name} order is still open`,
        heading: "Your pack is one step away",
        body: [
          `You started an order for the ${inv.plan.name} (${accessLabel(inv.plan.interval)}, ${formatMoney(inv.amountCents, inv.currency)}) but haven't paid yet. ${pending ? "Your invoice and the payment options are waiting in your account." : "The invoice has expired, but you can reopen the same pack in one click."}`,
          "If something stopped you, like a payment question or whether your device works, reply to this email and our team will help.",
        ].join("\n\n"),
        cta: { label: "Finish my order", url: url(pending ? "/dashboard/plan" : `/dashboard/plan?plan=${encodeURIComponent(inv.plan.slug)}`) },
      };
    }
    case "day1":
      return {
        subject: `Your ${siteConfig.name} account is ready`,
        heading: `Welcome, ${ctx.firstName}. One step left`,
        body: [
          `You created your account but haven't chosen a pack yet. Every pack has the same channels, on-demand library and support. Only the length changes, from one to twelve months${ctx.allOneTime ? ", and you pay once with nothing renewing by itself" : ""}.`,
          "Your account shows the packs and exactly what happens after you choose.",
        ].join("\n\n"),
        cta: { label: "Choose my pack", url: url("/dashboard/get-started") },
      };
    case "day3":
      return {
        subject: `Will ${siteConfig.name} work on your device?`,
        heading: "Check your device in a minute",
        body: [
          "The Apollo TV app runs on Fire TV and Android TV, Android phones and tablets, Windows and Mac. On iPhone, iPad and Apple TV you watch through the UHF player. Each device has its own step-by-step install guide.",
          "Newer Fire TV models run Vega OS, which can't install the app, so it's worth checking yours before you buy. The guides show you how.",
        ].join("\n\n"),
        cta: { label: "See the setup guides", url: url("/guides") },
      };
    case "day7":
      return {
        subject: "Any questions before you choose?",
        heading: "Still thinking it over?",
        body: [
          "This is the last reminder we'll send about finishing your sign-up. If you have a question about packs, payment or setup, reply to this email or open a ticket from your account and our team will answer in writing.",
          "Your account stays open, so you can choose a pack whenever you're ready.",
        ].join("\n\n"),
        cta: { label: "View the packs", url: url("/dashboard/plan") },
      };
  }
}

/**
 * Sends the next due reminder to verified customers who have never bought a pack.
 * Runs from the payments cron. A reminder row is written before sending, so overlapping runs
 * can't send the same email twice; if sending fails the row is removed and it's retried next run.
 */
export async function sweepReminders(now = new Date()) {
  if (process.env.NODE_ENV === "production" && !isEmailConfigured()) return { sent: 0, skipped: "email not configured" };

  const candidates = await db.user.findMany({
    where: {
      role: "USER",
      status: "ACTIVE",
      emailVerified: true,
      remindersOptOut: false,
      createdAt: { gte: new Date(now.getTime() - 14 * 24 * HOUR) },
      subscriptions: { none: {} },
      orders: { none: { status: { in: [...PAID_OR_REPORTED] } } },
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      emailReminders: { select: { kind: true, sentAt: true } },
      orders: {
        where: { status: { in: ["PENDING", "EXPIRED"] } },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { status: true, createdAt: true, amountCents: true, currency: true, plan: { select: { name: true, slug: true, interval: true } } },
      },
    },
    orderBy: { createdAt: "asc" },
    take: 500,
  });
  if (candidates.length === 0) return { sent: 0 };

  const plans = await getActivePlans();
  const allOneTime = plans.length > 0 && plans.every((p) => p.oneTime);
  let sent = 0;
  let failed = 0;

  for (const user of candidates) {
    if (sent >= MAX_PER_RUN) break;
    const invoice = user.orders[0] ?? null;
    const last = user.emailReminders.reduce<Date | null>((a, r) => (!a || r.sentAt > a ? r.sentAt : a), null);
    const kind = nextReminder({
      accountAgeHours: (now.getTime() - user.createdAt.getTime()) / HOUR,
      invoiceAgeHours: invoice ? (now.getTime() - invoice.createdAt.getTime()) / HOUR : null,
      sent: new Set(user.emailReminders.map((r) => r.kind)),
      hoursSinceLastReminder: last ? (now.getTime() - last.getTime()) / HOUR : null,
    });
    if (!kind) continue;

    // Claim the step first; the unique (userId, kind) index makes a concurrent run fail here instead of double-sending.
    const claim = await db.emailReminder.create({ data: { userId: user.id, kind } }).catch(() => null);
    if (!claim) continue;
    try {
      const mail = buildReminder(kind, { firstName: user.name.split(" ")[0] || "there", invoice, allOneTime });
      await sendEmail({ ...mail, to: user.email, unsubscribe: unsubscribeLinks(user.id) });
      sent++;
    } catch (e) {
      failed++;
      await db.emailReminder.delete({ where: { id: claim.id } }).catch(() => undefined);
      console.error("[reminders] send failed", kind, e instanceof Error ? e.message : e);
    }
  }
  return { sent, failed };
}

/** Turns the sequence off for one customer (from the email link or the one-click header). */
export async function optOutOfReminders(userId: string) {
  const res = await db.user.updateMany({ where: { id: userId }, data: { remindersOptOut: true } });
  return res.count > 0;
}
