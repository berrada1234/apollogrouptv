/**
 * Blog categories. Each one gets its own indexable page at /blog/category/{slug}, and each points readers to the
 * main site page that covers the same topic in depth (the hub its articles support).
 * The `name` must match the `category:` line in the articles' front matter.
 */
export type BlogCategory = {
  slug: string;
  name: string;
  title: string;
  description: string;
  intro: string;
  hub: { href: string; label: string };
};

export const blogCategories: BlogCategory[] = [
  {
    slug: "getting-started",
    name: "Getting Started",
    title: "Getting Started with Apollo Group TV: Articles for New Customers",
    description: "How to get Apollo Group TV, keep the app up to date and how it fits alongside services like Netflix, explained for new customers.",
    intro: "New here? These articles cover getting the app, keeping it updated and how Apollo Group TV sits next to the services you already use.",
    hub: { href: "/guides/account-setup", label: "Account setup guide" },
  },
  {
    slug: "devices",
    name: "Devices",
    title: "Apollo Group TV on Your Devices: Roku, Smart TVs, Google TV and Firestick",
    description: "Which devices run Apollo Group TV: Roku, Samsung and LG smart TVs, Google TV, choosing a Firestick and wired versus Wi-Fi connections.",
    intro: "Device-by-device articles: what works, what needs a workaround and how to pick and connect the screen you watch on.",
    hub: { href: "/guides", label: "All device setup guides" },
  },
  {
    slug: "fire-tv",
    name: "Fire TV",
    title: "Fire TV and Firestick Articles: Setup, Updates and Performance",
    description: "Firestick care for Apollo Group TV viewers: the Downloader code, updating the app and clearing the cache to keep it running smoothly.",
    intro: "Most of our customers watch on a Fire TV device. These articles keep yours fast, updated and connected.",
    hub: { href: "/guides/fire-tv-android-tv", label: "Fire TV and Android TV setup guide" },
  },
  {
    slug: "players-logins",
    name: "Players & Logins",
    title: "IPTV Players and Logins: M3U, Xtream Codes, MAG Boxes and Subtitles",
    description: "How to sign in to Apollo Group TV in other players with an M3U URL, Xtream Codes login or a MAG box, and how subtitles work.",
    intro: "Using a player other than the Apollo TV app? Here is how each login type works, where to enter your details and how to turn on subtitles.",
    hub: { href: "/app", label: "The Apollo TV app" },
  },
  {
    slug: "streaming-tech",
    name: "Streaming Tech",
    title: "Streaming Tech Explained: IPTV, Internet Speed and Connection Limits",
    description: "Plain-English explanations of how IPTV works, how fast your internet needs to be, connection limits and how IPTV compares with cable.",
    intro: "The technology behind your stream, explained without jargon, so you can pick the right pack and connection.",
    hub: { href: "/choosing-an-iptv-service", label: "How to choose an IPTV service" },
  },
  {
    slug: "troubleshooting",
    name: "Troubleshooting",
    title: "Apollo Group TV Troubleshooting: Errors, Outages and Install Problems",
    description: "Fixes for common Apollo Group TV problems: status code 404, checking whether the service is down and apps that won't install on Android.",
    intro: "Something not working? Start with these fixes for the problems customers ask us about most.",
    hub: { href: "/guides/troubleshooting", label: "Full troubleshooting guide" },
  },
  {
    slug: "trust-safety",
    name: "Trust & Safety",
    title: "Trust and Safety: The Official Website, VPNs and Streaming Safely",
    description: "How to recognise the official Apollo Group TV website and avoid copies, and what to know about using a VPN with the service.",
    intro: "Straight answers about finding the real site, privacy and VPNs, so you pay the right people and stream safely.",
    hub: { href: "/is-apollo-group-tv-legal", label: "Is Apollo Group TV legal?" },
  },
];

export function categoryByName(name: string) {
  return blogCategories.find((c) => c.name === name);
}

export function categoryBySlug(slug: string) {
  return blogCategories.find((c) => c.slug === slug);
}

export function categoryPath(name: string) {
  const c = categoryByName(name);
  return c ? `/blog/category/${c.slug}` : "/blog";
}
