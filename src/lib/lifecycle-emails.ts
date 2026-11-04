import "server-only";
import { sendEmail } from "@/lib/email";
import { siteConfig } from "@/lib/site";
import { formatDate } from "@/lib/utils";

/** One public setup guide per device family; the site doesn't record a customer's device, so all are offered. */
const DEVICE_GUIDES = [
  { label: "Fire TV and Android TV", path: "/guides/fire-tv-android-tv" },
  { label: "Android phone or tablet", path: "/guides/android-phone-tablet" },
  { label: "iPhone and iPad", path: "/guides/iphone-ipad" },
  { label: "Apple TV", path: "/guides/apple-tv" },
  { label: "Windows PC", path: "/guides/windows" },
  { label: "Mac", path: "/guides/macos" },
];

/**
 * Sent once, when an admin activates a pack. Login details stay in the dashboard: this email only says
 * where they are, links each device's install guide and explains how to get help.
 */
export async function sendWelcomeEmail(input: { to: string; name: string; planName: string; end: Date | null }) {
  const url = (path: string) => `${siteConfig.url}${path}`;
  const firstName = input.name.split(" ")[0] || "there";
  await sendEmail({
    to: input.to,
    subject: `Welcome to ${siteConfig.name}: your ${input.planName} is active`,
    heading: `You're all set, ${firstName}`,
    body: [
      `Your ${input.planName} is active${input.end ? ` until ${formatDate(input.end)}` : ""}. Your login details are in My Account. That's the only place we show them, so they never travel by email.`,
      "On Fire TV, Android, Windows and Mac you sign in to the Apollo TV app with your website email and password. On iPhone, iPad and Apple TV you use the player login from My Account in the UHF app. Pick your device for the step-by-step guide:",
    ].join("\n\n"),
    links: DEVICE_GUIDES.map((g) => ({ label: g.label, url: url(g.path) })),
    cta: { label: "Open My Account", url: url("/dashboard/subscription") },
    note: `Stuck on a step? The troubleshooting guide (${url("/guides/troubleshooting")}) fixes most setup problems, or open a ticket from your dashboard and our team replies in writing. You can also reply to this email.`,
  });
}

/** "tomorrow", "in 2 days"… counted from now, since the reminder can go out anywhere in the last three days. */
function whenLeft(end: Date) {
  const days = Math.max(1, Math.round((end.getTime() - Date.now()) / 86_400_000));
  return days === 1 ? "tomorrow" : `in ${days} days`;
}

/**
 * Three days before a pack ends: renewing now adds the next period on top, so nothing is lost by acting early.
 * This is account information about an active pack, so it isn't part of the opt-out reminder sequence.
 */
export async function sendExpiringEmail(input: { to: string; name: string; planName: string; planSlug: string | null; end: Date }) {
  const url = (path: string) => `${siteConfig.url}${path}`;
  const firstName = input.name.split(" ")[0] || "there";
  await sendEmail({
    to: input.to,
    subject: `Your ${input.planName} ends on ${formatDate(input.end)}`,
    heading: `Keep watching without a break, ${firstName}`,
    body: [
      `Your ${input.planName} ends on ${formatDate(input.end)}, ${whenLeft(input.end)}.`,
      "Add your next pack now and the new period starts when the current one ends, so you don't lose any days. Your login details stay the same in most cases.",
    ].join("\n\n"),
    cta: {
      label: input.planSlug ? `Renew my ${input.planName}` : "Choose my next pack",
      url: url(input.planSlug ? `/dashboard/plan?plan=${encodeURIComponent(input.planSlug)}` : "/dashboard/plan"),
    },
    note: `The renewal guide (${url("/apollo-group-tv-renewal")}) shows each step. Questions? Reply to this email or open a ticket from your dashboard.`,
  });
}
