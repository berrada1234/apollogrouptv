import "server-only";
import { db } from "@/lib/db";
import { isEmailConfigured, sendEmail, type Mail } from "@/lib/email";
import { accessLabel } from "@/lib/pricing";
import { getActivePlans } from "@/lib/queries";
import { nextReminder, nextWinBack, signReminderToken, type ReminderKind } from "@/lib/reminder-schedule";
import { siteConfig } from "@/lib/site";
import { formatDate, formatMoney } from "@/lib/utils";

const HOUR = 60 * 60 * 1000;
/** Most emails each sequence (sign-up reminders, win-back) sends per run, to stay well inside the mailbox's sending limits. */
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
          `You created your account but haven't chosen a pack yet. Every pack has the same channels, on-demand library and support. Only the length changes, from three months to two years${ctx.allOneTime ? ", and you pay once with nothing renewing by itself" : ""}.`,
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

  // Its own limit, so a busy day of sign-up reminders can never crowd out win-back emails.
  const winBack = await sweepWinBack(now, MAX_PER_RUN, allOneTime);
  return { sent, failed, winBack };
}

/**
 * Win-back for customers whose pack expired 1 and 7 days ago and who haven't renewed or paid since.
 * Each email is claimed per subscription ("winback1:<id>"), so it goes out once for that pack.
 */
async function sweepWinBack(now: Date, budget: number, allOneTime: boolean) {
  if (budget <= 0) return { sent: 0, failed: 0 };
  const lapsed = await db.subscription.findMany({
    where: {
      status: "EXPIRED",
      currentPeriodEnd: { gte: new Date(now.getTime() - 14 * 24 * HOUR), lte: new Date(now.getTime() - 24 * HOUR) },
      user: { status: "ACTIVE", remindersOptOut: false, role: "USER" },
    },
    select: {
      id: true,
      userId: true,
      currentPeriodEnd: true,
      plan: { select: { name: true, slug: true, isActive: true } },
      user: { select: { name: true, email: true, emailReminders: { where: { kind: { startsWith: "winback" } }, select: { kind: true } } } },
    },
    orderBy: { currentPeriodEnd: "asc" },
    take: 200,
  });
  let sent = 0;
  let failed = 0;
  for (const sub of lapsed) {
    if (sent >= budget) break;
    const end = sub.currentPeriodEnd!;
    // Renewed, or paid / reported a payment since this pack ended: nothing to win back.
    const renewed = await db.subscription.count({ where: { userId: sub.userId, id: { not: sub.id }, OR: [{ status: "ACTIVE" }, { createdAt: { gt: end } }] } });
    const paying = await db.order.count({ where: { userId: sub.userId, createdAt: { gt: end }, status: { in: [...PAID_OR_REPORTED] } } });
    if (renewed || paying) continue;

    const sentForThis = new Set(sub.user.emailReminders.filter((r) => r.kind.endsWith(`:${sub.id}`)).map((r) => r.kind.split(":")[0]));
    const kind = nextWinBack({ hoursSinceEnd: (now.getTime() - end.getTime()) / HOUR, sent: sentForThis });
    if (!kind) continue;

    const claim = await db.emailReminder.create({ data: { userId: sub.userId, kind: `${kind}:${sub.id}` } }).catch(() => null);
    if (!claim) continue;
    try {
      const firstName = sub.user.name.split(" ")[0] || "there";
      // Offer the same pack when it's still sold; otherwise the plans page lets them pick another length.
      const renewPath = sub.plan.isActive ? `/dashboard/plan?plan=${encodeURIComponent(sub.plan.slug)}` : "/dashboard/plan";
      const mail: Omit<Mail, "to" | "unsubscribe"> =
        kind === "winback1"
          ? {
              subject: `Your ${siteConfig.name} access has ended`,
              heading: `Pick up where you left off, ${firstName}`,
              body: [
                `Your ${sub.plan.name} ended on ${formatDate(end)}. Renew the same pack in one click and our team switches it back on as soon as payment is confirmed${allOneTime ? ". You pay once, and nothing renews by itself" : ""}.`,
                "Your account and history are still here.",
              ].join("\n\n"),
              cta: { label: `Renew my ${sub.plan.name}`, url: `${siteConfig.url}${renewPath}` },
            }
          : {
              subject: "Still want live TV?",
              heading: "Your account is still here",
              body: [
                `It's been a week since your ${sub.plan.name} ended. If you'd like to come back, the same pack is one click away, or you can choose a different length.`,
                "If something didn't work for you, reply and tell us. We read every message.",
              ].join("\n\n"),
              cta: { label: "See my renewal options", url: `${siteConfig.url}${renewPath}` },
            };
      await sendEmail({ ...mail, to: sub.user.email, unsubscribe: unsubscribeLinks(sub.userId) });
      sent++;
    } catch (e) {
      failed++;
      await db.emailReminder.delete({ where: { id: claim.id } }).catch(() => undefined);
      console.error("[reminders] win-back send failed", kind, e instanceof Error ? e.message : e);
    }
  }
  return { sent, failed };
}

/** Turns the sequence off for one customer (from the email link or the one-click header). */
export async function optOutOfReminders(userId: string) {
  const res = await db.user.updateMany({ where: { id: userId }, data: { remindersOptOut: true } });
  return res.count > 0;
}
