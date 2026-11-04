export const siteConfig = {
  name: "Apollo Group TV",
  shortName: "Apollo TV",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  description:
    "Apollo Group TV is a digital entertainment platform with flexible plans, an organized channel catalog, multi-device apps and responsive customer support.",
};

/** True for localhost URLs. Local-only testing switches check this so they can never affect a deployed site. */
export function isLocalUrl(url: string | undefined) {
  try {
    return ["localhost", "127.0.0.1", "[::1]"].includes(new URL(url ?? "").hostname);
  } catch {
    return false;
  }
}

/**
 * Header: the seven sections people come for, in buying order. Reviews, FAQ and Refer a Friend live in the
 * footer and inside the Help Center. `match` keeps a section highlighted on the pages that belong to it.
 */
export const mainNav: { href: string; label: string; match?: string[] }[] = [
  { href: "/product", label: "Product" },
  { href: "/app", label: "App" },
  { href: "/plans", label: "Plans", match: ["/apollo-group-tv-renewal", "/payment-methods", "/payment-guides"] },
  { href: "/channels", label: "Channels" },
  { href: "/guides", label: "Setup Guides" },
  { href: "/compare", label: "Compare", match: ["/apollo-group-tv-vs-", "/why-apollo-group-tv", "/choosing-an-iptv-service"] },
  { href: "/help", label: "Help Center", match: ["/faq", "/blog", "/contact", "/reviews"] },
];

/** Shown under the main links in the phone menu, so pages that left the header stay one tap away. */
export const secondaryNav = [
  { href: "/reviews", label: "Reviews" },
  { href: "/faq", label: "FAQ" },
  { href: "/blog", label: "Blog" },
  { href: "/refer-a-friend", label: "Refer a Friend" },
  { href: "/contact", label: "Contact" },
];

/** Whether a header item should show as the current section for this path. */
export function isNavActive(item: (typeof mainNav)[number], pathname: string) {
  const within = (prefix: string) => pathname === prefix || pathname.startsWith(prefix.endsWith("-") ? prefix : `${prefix}/`);
  return within(item.href) || Boolean(item.match?.some(within));
}

export const footerNav = [
  {
    title: "Platform",
    links: [
      { href: "/product", label: "Product" },
      { href: "/app", label: "App" },
      { href: "/plans", label: "Plans" },
      { href: "/payment-methods", label: "Payment Methods" },
      { href: "/payment-guides", label: "Payment Guides" },
      { href: "/channels", label: "Channels" },
    ],
  },
  {
    title: "Compare",
    links: [
      { href: "/compare", label: "All comparisons" },
      { href: "/why-apollo-group-tv", label: "Why Apollo Group TV" },
      { href: "/choosing-an-iptv-service", label: "Choosing an IPTV service" },
      { href: "/apollo-group-tv-vs-youtube-tv", label: "vs YouTube TV" },
      { href: "/apollo-group-tv-vs-sling-tv", label: "vs Sling TV" },
      { href: "/apollo-group-tv-vs-hulu-live-tv", label: "vs Hulu + Live TV" },
      { href: "/apollo-group-tv-vs-directv-stream", label: "vs DIRECTV STREAM" },
      { href: "/apollo-group-tv-vs-philo", label: "vs Philo" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "/reviews", label: "Reviews" },
      { href: "/refer-a-friend", label: "Refer a Friend" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/sign-in", label: "Sign In" },
      { href: "/create-account", label: "Create Account" },
      { href: "/apollo-group-tv-renewal", label: "Renew Subscription" },
      { href: "/client-portal", label: "Client Portal" },
      { href: "/account", label: "Account" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about-us", label: "About Us" },
      { href: "/contact", label: "Contact & Support" },
      { href: "/help", label: "Help Center" },
      { href: "/guides", label: "Setup Guides" },
      { href: "/blog", label: "Blog" },
      { href: "/is-apollo-group-tv-legal", label: "Is It Legal?" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms-and-conditions", label: "Terms and Conditions" },
      { href: "/refund-policy", label: "Refund Policy" },
      { href: "/dmca", label: "Copyright and DMCA" },
      { href: "/disclaimer", label: "Disclaimer" },
      { href: "/site-index", label: "Site Index" },
    ],
  },
];

/** Public, indexable routes — used by the sitemap. */
export const publicRoutes = [
  "/",
  "/product",
  "/app",
  "/plans",
  "/apollo-group-tv-renewal",
  "/compare",
  "/why-apollo-group-tv",
  "/choosing-an-iptv-service",
  "/apollo-group-tv-vs-youtube-tv",
  "/apollo-group-tv-vs-sling-tv",
  "/apollo-group-tv-vs-hulu-live-tv",
  "/apollo-group-tv-vs-directv-stream",
  "/apollo-group-tv-vs-philo",
  "/payment-methods",
  "/payment-guides",
  "/blog",
  "/help",
  "/site-index",
  "/channels",
  "/reviews",
  "/refer-a-friend",
  "/faq",
  "/about-us",
  "/contact",
  "/guides",
  "/guides/account-setup",
  "/guides/troubleshooting",
  "/is-apollo-group-tv-legal",
];

/** Policy pages — listed in the sitemap only after the owner approves them. */
export const policyRoutes = ["/privacy-policy", "/terms-and-conditions", "/refund-policy", "/dmca", "/disclaimer"];

/** Route prefixes that are private and must never be indexed. */
export const privatePrefixes = [
  "/dashboard",
  "/admin",
  "/account",
  "/client-portal",
  "/sign-in",
  "/create-account",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/api",
];

export function absoluteUrl(path = "/") {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
