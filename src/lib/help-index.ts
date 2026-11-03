import "server-only";
import { paymentGuides } from "@/content/payment-guides";
import { FAQ_TOPICS } from "@/content/faqs";
import { generalGuides } from "@/content/guides";
import { getPosts } from "@/lib/blog";
import { getDeviceGuides } from "@/lib/guides";
import { getPublishedFaqs } from "@/lib/queries";
import { stripRich } from "@/components/rich-text";

/**
 * One searchable index of the site's help content (setup guides, payment guides, blog
 * articles, FAQ answers and key pages), grouped into Help Center topics. Everything here
 * links to a page that already exists; nothing is generated.
 */

export type HelpEntry = {
  title: string;
  href: string;
  kind: "Guide" | "Payment guide" | "Article" | "FAQ" | "Page";
  summary?: string;
  /** Extra words the search matches on (not shown). */
  keywords?: string;
};
export type HelpTopic = { slug: string; title: string; blurb: string; icon: string; entries: HelpEntry[] };

const pg = (slug: string): HelpEntry => {
  const g = paymentGuides.find((x) => x.slug === slug)!;
  return { title: g.title, href: `/payment-guides/${g.slug}`, kind: "Payment guide", summary: g.summary, keywords: `${g.name} ${g.description}` };
};
const faqTopic = (slug: (typeof FAQ_TOPICS)[number]["slug"]): HelpEntry => {
  const t = FAQ_TOPICS.find((x) => x.slug === slug)!;
  return { title: `FAQ: ${t.name}`, href: `/faq#${t.slug}`, kind: "FAQ", summary: t.blurb };
};

export async function getHelpIndex() {
  const [devices, faqs] = await Promise.all([getDeviceGuides(), getPublishedFaqs()]);
  const posts = getPosts();
  const post = (slug: string): HelpEntry[] => {
    const p = posts.find((x) => x.slug === slug);
    return p ? [{ title: p.title, href: `/blog/${p.slug}`, kind: "Article", summary: p.excerpt, keywords: [p.keyword, ...p.secondary, p.description].join(" ") }] : [];
  };
  const general = (slug: string): HelpEntry[] => {
    const g = generalGuides.find((x) => x.slug === slug);
    return g ? [{ title: g.title, href: `/guides/${g.slug}`, kind: "Guide", summary: g.intro, keywords: g.troubleshooting.map((t) => `${t.q} ${t.a}`).join(" ") }] : [];
  };

  const topics: HelpTopic[] = [
    {
      slug: "getting-started",
      title: "Getting started",
      icon: "🚀",
      blurb: "Create your account, choose a pack and get watching.",
      entries: [
        ...general("account-setup"),
        { title: "Apollo Group TV features", href: "/product", kind: "Page", summary: "What the app, dashboard and support include." },
        { title: "Plans and pricing", href: "/plans", kind: "Page", summary: "Compare the packs; every pack is a one-time payment." },
        pg("how-checkout-works"),
        ...post("apollo-group-tv-official-website"),
        faqTopic("about"),
      ],
    },
    {
      slug: "payments-billing",
      title: "Payments & billing",
      icon: "💳",
      blurb: "Ways to pay, invoices, payment problems and refunds.",
      entries: [
        { title: "Accepted payment methods", href: "/payment-methods", kind: "Page", summary: "Every method you can use at checkout." },
        pg("cash-app"),
        pg("venmo"),
        pg("moonpay"),
        pg("credit-card"),
        pg("crypto-wallet"),
        pg("shakepay"),
        pg("zelle"),
        pg("bitcoin-network-fees"),
        { title: "Refund Policy", href: "/refund-policy", kind: "Page", summary: "When and how refunds are given." },
        faqTopic("plans-billing"),
        faqTopic("refunds-cancellation"),
      ],
    },
    {
      slug: "devices-setup",
      title: "Devices & setup",
      icon: "📺",
      blurb: "Install the app on your TV, streaming stick, phone or computer.",
      entries: [
        { title: "All setup guides", href: "/guides", kind: "Page", summary: "Step-by-step instructions for each device." },
        ...devices.map((d) => ({ title: d.title, href: `/guides/${d.slug}`, kind: "Guide" as const, summary: d.description })),
        { title: "The Apollo TV app and supported devices", href: "/app", kind: "Page", summary: "Where the app runs and how to get it." },
        ...post("best-firestick-for-iptv"),
        ...post("update-apollo-tv-firestick"),
        faqTopic("installation-setup"),
      ],
    },
    {
      slug: "logins-playback",
      title: "Logins & playback",
      icon: "🔑",
      blurb: "Player logins, playlists, MAG boxes and how many screens you can use.",
      entries: [
        ...post("xtream-codes-login"),
        ...post("m3u-url-vlc"),
        ...post("mag-box-setup"),
        ...post("iptv-connection-limit"),
        { title: "Channel categories", href: "/channels", kind: "Page", summary: "How the lineup is organized." },
        faqTopic("app-playback"),
        faqTopic("channels-content"),
      ],
    },
    {
      slug: "troubleshooting",
      title: "Troubleshooting",
      icon: "🛠️",
      blurb: "Fix sign-in, buffering, slow devices and payment issues.",
      entries: [
        ...general("troubleshooting"),
        pg("payment-troubleshooting"),
        ...post("clear-cache-firestick"),
        ...post("firestick-ethernet-vs-wifi"),
        ...post("internet-speed-for-iptv"),
        faqTopic("troubleshooting"),
      ],
    },
    {
      slug: "account-security",
      title: "Account & security",
      icon: "🛡️",
      blurb: "Your login details, password and keeping your account safe.",
      entries: [
        { title: "Reset your password", href: "/forgot-password", kind: "Page", summary: "Get a reset link by email." },
        { title: "Privacy Policy", href: "/privacy-policy", kind: "Page", summary: "What we collect and why." },
        { title: "Terms and Conditions", href: "/terms-and-conditions", kind: "Page", summary: "The rules for using your account." },
        { title: "Is Apollo Group TV legal?", href: "/is-apollo-group-tv-legal", kind: "Page", summary: "IPTV, licensing and your rights." },
        faqTopic("account-security"),
      ],
    },
  ];

  // Search also covers every published FAQ question, linked to its topic on the FAQ page.
  const faqEntries: HelpEntry[] = faqs.map((f) => ({
    title: f.question,
    href: `/faq#${FAQ_TOPICS.find((t) => t.name === f.category)?.slug ?? ""}`,
    kind: "FAQ",
    summary: stripRich(f.answer).slice(0, 140),
    keywords: stripRich(f.answer),
  }));
  const seen = new Set<string>();
  const searchable = [...topics.flatMap((t) => t.entries), ...posts.flatMap((p) => post(p.slug)), ...paymentGuides.map((g) => pg(g.slug)), ...faqEntries].filter((e) => {
    const key = `${e.href}|${e.title}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const popular = faqs.filter((f) => f.category === "Plans & Billing" || f.category === "Installation & Setup" || f.category === "Troubleshooting").slice(0, 8);
  return { topics, searchable, popular: popular.map((f) => ({ q: f.question, href: `/faq#${FAQ_TOPICS.find((t) => t.name === f.category)?.slug ?? ""}` })) };
}
