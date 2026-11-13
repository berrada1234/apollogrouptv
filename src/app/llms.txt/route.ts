import { getPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/site";

/**
 * /llms.txt: a plain-text map of the site for AI tools that read it. Google Search ignores this file;
 * it neither helps nor hurts rankings. Facts here must match the site; no prices (they live on /plans).
 */
export const dynamic = "force-static";

export function GET() {
  const u = (path: string) => `${siteConfig.url}${path}`;
  const posts = getPosts();
  const pages = [
    ["Plans and pricing", "/plans", "Every pack, its length, total price and cost per month. All packs are one-time payments with no automatic renewal."],
    ["Renew your subscription", "/apollo-group-tv-renewal", "How renewal works: sign in, add a pack in Plans & Billing, pay the invoice."],
    ["The Apollo TV app and supported devices", "/app", "Where the app runs and how to install it."],
    ["Setup guides", "/guides", "Step-by-step installation for each supported device."],
    ["Payment methods", "/payment-methods", "The payment methods currently accepted."],
    ["Help Center", "/help", "Every guide and answer, searchable."],
    ["FAQ", "/faq", "Answers about plans, billing, devices, playback and privacy."],
    ["Is Apollo Group TV legal?", "/is-apollo-group-tv-legal", "IPTV, licensing and how to judge any streaming service."],
    ["About Apollo Group TV", "/about-us", "Who runs the service and the practices it follows."],
    ["Contact and support", "/contact", "How to reach support."],
  ];
  const body = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    "## Key facts",
    `- Official website: ${siteConfig.url}`,
    "- Also known as: Apollo TV",
    "- What it is: an internet TV (IPTV) service with live channels and an on-demand library, watched in an app on a supported device.",
    "- Billing: one-time packs from three months to two years; nothing renews automatically.",
    "- Netflix and other streaming services are not included.",
    "- Login details for apps and players are shown in the customer's account (My Account), not sent by email.",
    "",
    "## Main pages",
    ...pages.map(([t, p, d]) => `- [${t}](${u(p)}): ${d}`),
    "",
    "## Articles",
    ...posts.map((p) => `- [${p.title}](${u(`/blog/${p.slug}`)}): ${p.description}`),
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
