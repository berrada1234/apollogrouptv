/**
 * Homepage copy. One H1 (in the hero) and one H2 per section, each mapped to a search intent.
 * Keep claims factual: prices, devices, ratings and counts are rendered from the database,
 * never written here. Links use [label](/path) and are rendered by <RichText>.
 */
export type HomeImage = { src: string; alt: string };

const img = (file: string, alt: string): HomeImage => ({ src: `/images/home/${file}.svg`, alt });

export const homeCopy = {
  hero: {
    // H1 — brand + core offer (navigational / brand intent)
    h1: "Apollo Group TV: Live TV and On-Demand Streaming, Made Simple",
    lead:
      "Apollo Group TV brings live channels and on-demand viewing together in one account. Compare plans with prices shown up front, install the Apollo TV app on a verified device, and manage billing and support from a dashboard you control.",
  },

  intro: {
    intent: "Informational — what is it",
    eyebrow: "Start here",
    h2: "What Is Apollo Group TV?",
    paragraphs: [
      "Apollo Group TV is an internet-based streaming service for live television and on-demand programs. Instead of a cable box or satellite dish, you watch through an app on a supported device, and you manage your plan, payments and support requests online.",
      "Many people search for the service as **Apollo TV** — it's the same thing. Because several unrelated websites use similar names, this site is built to be the single place where prices, policies and supported devices are published and kept up to date.",
      "New here? The fastest way to understand the service is to [see what's included](/product), [compare the plans](/plans) and [check whether your device is supported](/app).",
    ],
    image: img("apollo-group-tv-streaming-overview", "Apollo Group TV interface on a television showing a featured program and rows of content"),
  },

  features: {
    intent: "Commercial investigation — features",
    eyebrow: "Key features",
    h2: "Apollo Group TV Features That Make Streaming Simpler",
    description:
      "The parts of Apollo Group TV you'll actually use: a catalog you can search, plans you can understand, guides for verified devices and an account you can manage yourself.",
    image: img("apollo-group-tv-features-dashboard", "Apollo Group TV account dashboard with plan status, renewal date and recent activity"),
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

  catalog: {
    intent: "Informational — what can I watch",
    eyebrow: "Channels",
    h2: "What Can You Watch on Apollo Group TV?",
    paragraphs: [
      "Apollo Group TV combines **live channels**, streamed as they air, with **on-demand programs** you can start whenever you like, where licensing allows. The catalog is organized into categories such as news, sports, movies and kids, and you can search any channel by name.",
      "Channel availability can change as rights agreements change, so the [channel guide](/channels) always reflects what's listed right now. Only authorized, properly licensed content appears in the catalog.",
    ],
    image: img("apollo-group-tv-channel-catalog", "Apollo Group TV channel guide with a search bar, category filters and channel tiles"),
  },

  devices: {
    intent: "Navigational / how-to — app & devices",
    eyebrow: "Apps & devices",
    h2: "Apollo TV App: Supported Devices and Installation",
    description:
      "The Apollo TV app is how you watch on your TV, streaming stick or phone. We list a device only after verifying it, each with an official download link and a step-by-step setup guide.",
    image: img("apollo-tv-app-supported-devices", "Apollo TV app running on a television, a smartphone and a laptop"),
  },

  requirements: {
    intent: "Informational — what do I need",
    eyebrow: "Before you start",
    h2: "What You Need to Start Streaming with Apollo TV",
    paragraphs: ["You don't need special equipment. Before you subscribe, make sure you have these four things in place."],
    items: [
      { title: "A stable internet connection", body: "Streaming quality depends on your connection. A wired connection or strong Wi-Fi gives the smoothest playback, especially at higher resolutions." },
      { title: "A verified device", body: "Check the [App page](/app) for supported devices and use the official download link for yours." },
      { title: "A verified Apollo Group TV account", body: "[Create an account](/create-account) and confirm your email address — it takes about a minute." },
      { title: "An active plan", body: "Choose a plan from your dashboard; once it's active, sign in to the app and start watching." },
    ],
    image: img("apollo-tv-streaming-requirements", "Checklist of what you need to stream with Apollo TV, including an internet connection"),
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

  why: {
    intent: "Commercial investigation — why choose",
    eyebrow: "Why Apollo",
    h2: "Why Choose Apollo Group TV?",
    description: "Not bigger numbers — clearer answers. These are the standards we hold ourselves to, and each one can be checked on this site.",
    image: img("why-choose-apollo-group-tv", "Checklist comparing what to look for in a streaming service with what Apollo Group TV offers"),
  },

  reviews: {
    intent: "Trust — reviews",
    eyebrow: "Reviews",
    h2: "Apollo Group TV Reviews from Real Customers",
    description:
      "Reviews come from registered Apollo Group TV customers and are moderated before they appear. “Verified customer” means the reviewer has a subscription on record.",
    image: img("apollo-group-tv-customer-reviews", "Two Apollo Group TV customer review cards with star ratings and a verified badge"),
  },

  support: {
    intent: "Support — help, login, contact",
    eyebrow: "Support",
    h2: "Apollo TV Customer Support and Account Help",
    paragraphs: ["Whether you're stuck on setup, can't sign in or have a billing question, there's a direct route to the answer."],
    items: [
      { title: "Support tickets", body: "Customers can [open a ticket](/dashboard/support/new) from the dashboard. Every reply stays in one thread, and you're notified when we answer." },
      { title: "Contact form", body: "Not a customer yet? Use the [contact page](/contact) — we reply by email." },
      { title: "Sign-in help", body: "Forgot your password? Reset it from the [Sign in](/sign-in) page; the link is valid for 30 minutes." },
      { title: "Guides and FAQ", body: "Step-by-step [setup guides](/guides) and the [full FAQ](/faq) cover the most common questions." },
    ],
    image: img("apollo-tv-customer-support", "Apollo TV support conversation thread between a customer and the support team"),
  },

  referral: {
    intent: "Transactional — referral",
    eyebrow: "Refer a friend",
    h2: "Share Apollo Group TV with Friends",
    paragraphs: [
      "Every Apollo Group TV account includes a personal referral link. When a friend creates an account through it, the referral appears in your dashboard so you can track its status.",
    ],
    image: img("apollo-group-tv-referral-program", "Two people connected by a referral link with a gift icon between them"),
  },

  faq: {
    intent: "Informational — common questions",
    eyebrow: "FAQ",
    h2: "Apollo Group TV FAQ: Quick Answers to Common Questions",
    description: "Answers to what people ask most before signing up. The [full FAQ](/faq) covers billing, privacy and troubleshooting in more depth.",
    image: img("apollo-group-tv-faq", "Expandable list of frequently asked questions about Apollo Group TV"),
  },

  cta: {
    h2: "Start Watching with Apollo Group TV",
    body: "Compare plans, take a closer look at the features, or sign in to manage your account.",
  },
};

/**
 * Homepage FAQ — written for first-time visitors and phrased differently from /faq (which is canonical
 * and more detailed). Covers price, trial, devices, installation, multi-device, channels, payment,
 * cancellation, legality, support, official site and password questions.
 */
export const homeFaq = [
  {
    q: "What is Apollo Group TV?",
    a: "Apollo Group TV is a streaming service for live channels and on-demand programs that you watch through an app and manage from an online account. See [how it works](/product).",
  },
  {
    q: "Is Apollo TV the same service as Apollo Group TV?",
    a: "Yes. “Apollo TV” is a common shorthand for Apollo Group TV. Because other sites use similar names, rely on the prices and policies published on this website.",
  },
  {
    q: "How much does an Apollo Group TV subscription cost?",
    a: "Prices depend on the plan and billing period you choose. The current price of every plan, including the monthly equivalent of longer periods, is listed on the [Plans page](/plans).",
  },
  {
    q: "Is there an Apollo Group TV free trial?",
    a: "We don't currently advertise a free trial. If an offer becomes available, it will appear on the [Plans page](/plans). The [Refund Policy](/refund-policy) explains how refund requests work.",
  },
  {
    q: "Which devices does the Apollo TV app support?",
    a: "Supported devices are listed on the [App page](/app), each with its own setup guide. We add a device only after verifying it; if yours isn't listed, [ask us](/contact) before subscribing.",
  },
  {
    q: "How do I install Apollo Group TV?",
    a: "Create and verify your account, choose a plan, then follow the guide for your device in our [setup guides](/guides) using the official download link.",
  },
  {
    q: "Can I watch Apollo Group TV on more than one device?",
    a: "What each plan includes is listed on its card on the [Plans page](/plans). If you need a specific number of devices, [contact us](/contact) before you subscribe so we can confirm the right plan.",
  },
  {
    q: "What channels are available on Apollo Group TV?",
    a: "Browse the [channel guide](/channels) to search by name or filter by category. It shows what's listed right now, and availability can change as licensing changes.",
  },
  {
    q: "How do I pay for Apollo Group TV?",
    a: "Choose a plan from your dashboard and our team confirms activation and payment options with you through a support ticket while online checkout is being set up. Never send card numbers by email or chat.",
  },
  {
    q: "Can I cancel my Apollo Group TV subscription?",
    a: "Yes — open a support ticket from your dashboard. Your plan dates are shown under Subscription Details, and the [Refund Policy](/refund-policy) explains when a refund applies.",
  },
  {
    q: "Is Apollo Group TV legal?",
    a: "Internet streaming is a lawful technology; legality depends on distribution rights. We list only authorized, properly licensed content. Read our [plain-English explanation](/is-apollo-group-tv-legal).",
  },
  {
    q: "How do I contact Apollo Group TV support?",
    a: "Customers can open a ticket from the dashboard; anyone can send a message through the [contact page](/contact).",
  },
  {
    q: "How can I tell I'm on the official Apollo Group TV website?",
    a: "Official prices, policies and device guides are published on this site, and account messages appear in your dashboard. We never ask for your password — if a site or message does, don't share it.",
  },
  {
    q: "What if I forget my Apollo Group TV password?",
    a: "Use “Forgot password?” on the [Sign in](/sign-in) page. We'll email you a reset link that's valid for 30 minutes.",
  },
];
