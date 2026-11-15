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
    title: "Apollo Group TV on Roku, Smart TVs, Google TV and Firestick",
    description: "Which devices run Apollo Group TV: Roku, Samsung and LG smart TVs, Google TV, choosing a Firestick and wired versus Wi-Fi connections.",
    intro: "Device-by-device articles: what works, what needs a workaround and how to pick and connect the screen you watch on.",
    hub: { href: "/guides", label: "All device setup guides" },
  },
  {
    slug: "fire-tv",
    name: "Fire TV",
    title: "Fire TV Articles: Downloader Code, App Updates and Cache",
    description: "Fire TV articles for Apollo Group TV: the Downloader code, how to update the Apollo TV app on a Firestick and how to clear cache for smoother streaming.",
    intro: "Most of our customers watch on a Fire TV device. These articles keep yours fast, updated and connected.",
    hub: { href: "/guides/fire-tv-android-tv", label: "Fire TV and Android TV setup guide" },
  },
  {
    slug: "players-logins",
    name: "Players & Logins",
    title: "IPTV Players and Logins: M3U, Xtream Codes and MAG Boxes",
    description: "How to sign in to Apollo Group TV in other players with an M3U URL, Xtream Codes login or a MAG box, and how subtitles work.",
    intro: "Using a player other than the Apollo TV app? Here is how each login type works, where to enter your details and how to turn on subtitles.",
    hub: { href: "/app", label: "The Apollo TV app" },
  },
  {
    slug: "streaming-tech",
    name: "Streaming Tech",
    title: "Streaming Tech: What IPTV Is, Internet Speed and Limits",
    description: "Streaming tech articles: what IPTV is and how it works, the internet speed you need, IPTV connection limits and IPTV vs cable TV compared.",
    intro: "The technology behind your stream, explained without jargon, so you can pick the right pack and connection.",
    hub: { href: "/choosing-an-iptv-service", label: "How to choose an IPTV service" },
  },
  {
    slug: "troubleshooting",
    name: "Troubleshooting",
    title: "Apollo Group TV Troubleshooting: Errors and Install Fixes",
    description: "Fixes for common Apollo Group TV problems: status code 404, checking whether the service is down and apps that won't install on Android.",
    intro: "Something not working? Start with these fixes for the problems customers ask us about most.",
    hub: { href: "/guides/troubleshooting", label: "Full troubleshooting guide" },
  },
  {
    slug: "trust-safety",
    name: "Trust & Safety",
    title: "Trust & Safety: The Official Website and Using a VPN",
    description: "Trust and safety articles: the Apollo Group TV official website, how to spot fake Apollo TV sites, and whether you need a VPN to stream safely.",
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
