/**
 * Homepage copy. One H1 (hero) and one H2 per section, each mapped to a search intent.
 * Keep claims factual: prices, devices, ratings, counts and channel names are rendered from
 * the database, never written here. Links use [label](/path), bold uses **text** (see <RichText>).
 */
export type HomeImage = { src: string; alt: string };

const img = (file: string, alt: string): HomeImage => ({ src: `/images/home/${file}.svg`, alt });

export const homeCopy = {
  hero: {
    h1: "Apollo Group TV: Live TV and On-Demand Streaming, Made Simple",
    lead:
      "Apollo Group TV brings live channels and on-demand viewing together in one account. Compare plans with prices shown up front, install the Apollo TV app on a verified device, and manage billing and support from a dashboard you control.",
  },

  intro: {
    intent: "Informational — what is it",
    eyebrow: "Start here",
    h2: "What Is Apollo Group TV?",
    paragraphs: [
      "**Apollo Group TV** — often shortened to **Apollo TV** — is an internet-based alternative to a cable package. Live channels and on-demand programs stream through an app on the devices you already own, and your plan, payments and support live in one online account.",
      "Instead of a set-top box and a monthly bill, you choose a pack, pay once for the period you want, and follow a step-by-step guide to get the app running. If you get stuck, our team picks up the thread in your dashboard.",
    ],
    tagline: "One account. Your screens. Pay once. No contracts.",
    highlights: [
      { title: "HD, Full HD and 4K where available", body: "Picture quality adapts to each channel's broadcast and your connection." },
      { title: "Pay once, no auto-renewal", body: "Every pack covers a fixed period — nothing renews behind your back." },
      { title: "Verified devices only", body: "Each supported device comes with an official download link and a setup guide." },
      { title: "Activation confirmed by people", body: "Our team activates your pack and stays reachable through support tickets." },
    ],
    image: img("apollo-group-tv-streaming-overview", "Apollo Group TV interface on a television showing a featured program and rows of content"),
  },

  howItWorks: {
    intent: "Informational — how does it work",
    eyebrow: "How it works",
    h2: "How Apollo TV Works in Four Simple Steps",
    description: "From creating an account to pressing play, here's what getting started with Apollo TV looks like.",
    image: img("apollo-tv-how-it-works", "Four numbered steps showing how to get started with Apollo TV"),
  },

  plans: {
    intent: "Transactional — pricing",
    eyebrow: "Pricing",
    h2: "Apollo Group TV Subscription Plans & Pricing",
    description:
      "Pick the pack that matches how much you watch. Every Apollo Group TV pack shows its full price, the access period and what's included — and the longer the pack, the less you pay per month.",
  },

  compare: {
    intent: "Commercial investigation — comparison",
    eyebrow: "Cut the cord",
    h2: "Apollo Group TV vs. Cable TV: How They Compare",
    description:
      "Thinking about leaving cable? Here's how the Apollo Group TV model differs from a typical cable package — without invented numbers.",
    footnote: "Cable terms vary by provider and region. The cable column describes common arrangements, not any specific company.",
    image: img("why-choose-apollo-group-tv", "Checklist comparing Apollo Group TV with a typical cable TV package"),
  },

  devices: {
    intent: "Navigational / how-to — app & devices",
    eyebrow: "Apps & devices",
    h2: "Apollo TV App: Supported Devices and Installation",
    description:
      "The Apollo TV app is how you watch on your TV, streaming stick or phone. We list a device only after verifying it, each with an official download link and a step-by-step setup guide.",
    image: img("apollo-tv-app-supported-devices", "Apollo TV app running on a television, a smartphone and a laptop"),
    supportedTitle: "Supported devices",
    logos: [
      { name: "Fire TV Stick", src: "/images/devices/apollo-group-tv-firestick.webp", width: 379, height: 120, alt: "Amazon Fire TV Stick logo — install Apollo Group TV on Firestick" },
      { name: "Fire TV", src: "/images/devices/apollo-group-tv-fire-tv.webp", width: 316, height: 160, alt: "Amazon Fire TV logo — Apollo Group TV app for Fire TV devices" },
      { name: "Android", src: "/images/devices/apollo-group-tv-android.webp", width: 147, height: 160, alt: "Android logo — Apollo TV app for Android phones, tablets and Android TV" },
      { name: "iPhone & iPad", src: "/images/devices/apollo-group-tv-apple-ios.webp", width: 115, height: 160, alt: "Apple logo — watch Apollo Group TV on iPhone, iPad and Apple TV" },
      { name: "Windows PC", src: "/images/devices/apollo-group-tv-windows.webp", width: 163, height: 160, alt: "Microsoft Windows logo — stream Apollo Group TV on a Windows PC or laptop" },
    ],
    trademarks: "Fire TV, Android, Apple and Windows are trademarks of their respective owners and are shown only to indicate compatibility.",
  },

  legal: {
    intent: "Informational / trust — is it legal and safe",
    eyebrow: "Trust & safety",
    h2: "Is Apollo Group TV Legal and Safe to Use?",
    paragraphs: [
      "Streaming TV over the internet — often called IPTV — is a mainstream, lawful technology. What determines whether a service is lawful is whether it has permission to distribute the content it offers. Apollo Group TV's policy is to list only authorized, properly licensed content and to act on valid copyright notices.",
    ],
    items: [
      { title: "Published policies", body: "Our [terms](/terms-and-conditions), [privacy policy](/privacy-policy), [refund policy](/refund-policy) and [copyright process](/dmca) are public." },
      { title: "Official downloads only", body: "Install the app only from the links in our [setup guides](/guides) or official app stores — never from shared codes or files." },
      { title: "Protect your account", body: "We never ask for your password. Be cautious with lookalike sites using similar names." },
    ],
    more: "Read the full explanation: [Is Apollo Group TV legal?](/is-apollo-group-tv-legal) This is general information, not legal advice.",
    image: img("is-apollo-group-tv-legal-safe", "Security shield with a check mark representing a safe and legal Apollo Group TV service"),
  },

  reviews: {
    intent: "Trust — reviews",
    eyebrow: "Reviews",
    h2: "Apollo Group TV Reviews from Real Customers",
    description:
      "Every review comes from a registered Apollo Group TV account and is moderated before it appears — no paid testimonials, no invented names. “Verified customer” means the reviewer has a subscription on record.",
  },

  support: {
    intent: "Support — help, login, contact",
    eyebrow: "Support",
    h2: "Apollo TV Customer Support That Follows Through",
    description:
      "Real people, a written record of every reply, and guides for the questions that come up most. Pick the route that fits what you need.",
    image: img("apollo-tv-customer-support", "Apollo TV support conversation thread between a customer and the support team"),
  },

  faq: {
    intent: "Informational — common questions",
    eyebrow: "FAQ",
    h2: "Apollo Group TV FAQ: Straight Answers to Common Questions",
    description: "What people ask most before and after signing up. The [full FAQ](/faq) goes deeper on billing, privacy and troubleshooting.",
  },

  cta: {
    eyebrow: "Get started",
    h2: "Ready to Cut the Cord with Apollo Group TV?",
    body: "Choose a pack, create your account in about a minute, and let our team get you watching.",
  },
};

/**
 * Homepage FAQ — answers the questions people actually search (price, downloader codes, Fire TV,
 * card payments, outages, buffering, log-in, sharing…) in wording distinct from /faq.
 */
export const homeFaq = [
  {
    q: "Is Apollo Group TV legal?",
    a: "Internet TV delivery is lawful technology; what matters is whether the provider has rights to the content. We list only authorized, properly licensed content. Read our [plain-English explanation](/is-apollo-group-tv-legal).",
  },
  {
    q: "Is Apollo Group TV legit and safe to use?",
    a: "Everything you need to judge us is public: prices, [terms](/terms-and-conditions), a [privacy policy](/privacy-policy) and a [copyright process](/dmca). Accounts use email verification, hashed passwords and session controls — and we never ask for your password.",
  },
  {
    q: "How much does Apollo Group TV cost?",
    a: "It depends on the pack. Each one is a one-time payment for a fixed period, and longer packs cost less per month. Current prices are always on the [Plans page](/plans).",
  },
  {
    q: "Do I need an Apollo Group TV downloader code?",
    a: "No. We don't distribute the app through downloader codes or shared files. Install it only from the official links in our [setup guides](/guides) or from official app stores — codes found elsewhere aren't from us.",
  },
  {
    q: "How do I install Apollo Group TV on Fire TV or Firestick?",
    a: "Device guides are published on the [App page](/app) once a device has been verified. If Fire TV isn't listed yet, [ask us](/contact) before subscribing and we'll tell you what works today.",
  },
  {
    q: "Can I pay for Apollo Group TV with a credit card?",
    a: "Choose your pack from the dashboard and our team confirms the available payment options with you through a support ticket while online checkout is being set up. Never send card numbers by email or chat.",
  },
  {
    q: "Is Apollo Group TV down right now?",
    a: "If the app won't load, first check your internet connection and restart the device. Then [open a ticket](/dashboard/support/new) or [message us](/contact) — we'll confirm whether the issue is on our side.",
  },
  {
    q: "Why is Apollo Group TV not working on my device?",
    a: "Most problems come from an outdated app, an unverified email or a weak connection. Work through the [troubleshooting guide](/guides/troubleshooting); if it still fails, support can help.",
  },
  {
    q: "How do I log in to Apollo Group TV?",
    a: "Use the email and password of your account on the [Sign in](/sign-in) page or in the app. Forgot your password? Request a reset link — it's valid for 30 minutes.",
  },
  {
    q: "What devices does Apollo Group TV work on?",
    a: "Supported devices are listed on the [App page](/app), each with its own setup guide. We only list a device after verifying it.",
  },
  {
    q: "Is there an Apollo Group TV free trial?",
    a: "We don't currently advertise a free trial. Any offer will appear on the [Plans page](/plans), and the [Refund Policy](/refund-policy) explains how refund requests work.",
  },
  {
    q: "Will Apollo Group TV buffer or freeze?",
    a: "Smooth playback depends mostly on your connection and device. A wired connection, an up-to-date app and fewer devices streaming at once make the biggest difference — the [troubleshooting guide](/guides/troubleshooting) covers the rest.",
  },
  {
    q: "Can more than one person use an Apollo Group TV account?",
    a: "Each pack lists the number of devices it includes on the [Plans page](/plans). Accounts belong to one person; sharing access beyond your pack isn't allowed under our [terms](/terms-and-conditions).",
  },
  {
    q: "How do I contact Apollo Group TV support?",
    a: "Customers can open a ticket from the dashboard; anyone can send a message through the [contact page](/contact).",
  },
];
