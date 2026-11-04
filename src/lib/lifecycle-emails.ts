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
