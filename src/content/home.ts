/**
 * Homepage copy. One H1 (hero) and one H2 per section, each mapped to a search intent.
 * Primary keyword "Apollo Group TV", secondary "Apollo TV": both appear in the title, H1 area,
 * opening paragraph and H2s; body copy uses them where a reader would, not in every sentence.
 * Keep claims factual: prices, ratings, counts and channel names are rendered from the database,
 * never written here. Links use [label](/path), bold uses **text** (see <RichText>).
 */
export const homeCopy = {
  hero: {
    h1: "Apollo Group TV: IPTV Service for Live TV and On-Demand Streaming",
    lead:
      "Apollo Group TV (Apollo TV for short) is an IPTV provider that streams live channels and an on-demand library to the Fire TV stick, phone or computer you already have. You pay once for one to twelve months, follow a step-by-step install guide, and keep every bill and support reply in one dashboard.",
  },

  intro: {
    intent: "Informational — what is it",
    eyebrow: "Start here",
    h2: "What Is Apollo Group TV? The IPTV Service Explained",
    paragraphs: [
      "**Apollo Group TV**, often shortened to **Apollo TV**, is an internet TV service. In place of a cable box on a monthly contract you get an app: live channels sorted by category and region, a library of movies and series to watch when you like, and one online account that holds your pack, payments and support history.",
      "You decide how long you want access, from three months to two years, and pay once. Nothing renews on its own. Our team switches the pack on, and if a device gives you trouble during setup, you keep replying in the same ticket until it works.",
    ],
    tagline: "Pick three months or two years, then watch on the screens you already own.",
    highlights: [
      { title: "HD, Full HD and 4K where available", body: "Channels carry a quality label, so you know what you're getting before you press play." },
      { title: "Pay once, no auto-renewal", body: "A pack covers a fixed number of days. When it ends, access stops and nothing is charged." },
      { title: "A guide for every device", body: "Fire TV, Android, Windows, Mac, iPhone, iPad and Apple TV each have their own install steps." },
      { title: "Activation by a real person", body: "Someone on our team turns your pack on and answers setup questions in writing." },
    ],
  },

  services: {
    intent: "Informational — what a pack includes",
    eyebrow: "Included in every pack",
    h2: "What You Get with Apollo TV",
    description: "Every pack has the same service, whichever length you choose. These are the parts customers rely on most.",
  },

  howItWorks: {
    intent: "Informational — how does it work",
    eyebrow: "How it works",
    h2: "How Apollo TV Works in Four Simple Steps",
    description: "Four steps take you from a new account to your first channel. None of them needs an engineer, a contract or a home visit.",
  },

  plans: {
    intent: "Transactional — pricing",
    eyebrow: "Pricing",
    h2: "Apollo Group TV Subscription Plans & Pricing",
    description:
      "Every pack includes the same channels, library, device allowance and support. Only the length changes, and the longer the pack, the less each month costs. Full prices are shown before you choose.",
  },

  compare: {
    intent: "Commercial investigation — comparison",
    eyebrow: "Cut the cord",
    h2: "Apollo Group TV vs. Cable TV: IPTV Compared for US Viewers",
    description:
      "Thinking about leaving cable? Here is how Apollo Group TV and a typical cable package differ on monthly cost, equipment, commitment and support.",
    footnote: "Cable and streaming terms vary by provider and region. Those columns describe common arrangements, not any specific company.",
  },

  devices: {
    intent: "Navigational / how-to — app & devices",
    eyebrow: "Apps & devices",
    h2: "Apollo TV App: Supported Devices and Installation",
    description:
      "The Apollo TV app runs on Fire TV and Android TV, Android phones and tablets, Windows and macOS. On iPhone, iPad and Apple TV you watch through the UHF player with the player login from your dashboard. Every device has its own install guide.",
    supportedTitle: "Supported devices",
    logos: [
      { name: "Fire TV Stick", src: "/images/devices/apollo-group-tv-fire-tv-stick.webp", width: 379, height: 120, alt: "Amazon Fire TV Stick logo: install Apollo Group TV on Firestick" },
      { name: "Fire TV", src: "/images/devices/apollo-group-tv-fire-tv.webp", width: 316, height: 160, alt: "Amazon Fire TV logo: Apollo Group TV app for Fire TV devices" },
      { name: "Android", src: "/images/devices/apollo-group-tv-android.webp", width: 147, height: 160, alt: "Android logo: Apollo TV app for Android phones, tablets and Android TV" },
      { name: "iPhone & iPad", src: "/images/devices/apollo-group-tv-apple-ios.webp", width: 115, height: 160, alt: "Apple logo: watch Apollo Group TV on iPhone, iPad and Apple TV" },
      { name: "Windows PC", src: "/images/devices/apollo-group-tv-windows.webp", width: 163, height: 160, alt: "Microsoft Windows logo: stream Apollo Group TV on a Windows PC or laptop" },
    ],
    trademarks: "Fire TV, Android, Apple and Windows are trademarks of their respective owners and are shown only to indicate compatibility.",
  },

  legal: {
    intent: "Informational / trust — is it legal and safe",
    eyebrow: "Trust & safety",
    h2: "Is Apollo Group TV Legal and Safe to Use?",
    paragraphs: [
      "Streaming TV over the internet, often called IPTV, is a mainstream and lawful technology. Whether a particular service is lawful depends on its permission to distribute what it offers. Our policy is to list only authorized, properly licensed content and to act on valid copyright notices.",
    ],
    items: [
      { title: "Published policies", body: "Our [terms](/terms-and-conditions), [privacy policy](/privacy-policy), [refund policy](/refund-policy) and [copyright process](/dmca) are public." },
      { title: "Official downloads only", body: "Install from the links in your dashboard, our [setup guides](/guides) or official app stores. Codes and files passed around online aren't from us." },
      { title: "Protect your account", body: "We never ask for your password. Watch out for lookalike sites that borrow the Apollo name." },
    ],
    more: "Read the full explanation: [Is Apollo Group TV legal?](/is-apollo-group-tv-legal) This is general information, not legal advice.",
  },

  reviews: {
    intent: "Trust — reviews",
    eyebrow: "Reviews",
    h2: "Apollo Group TV Reviews from Real Customers",
    description:
      "What customers say after using Apollo Group TV. We publish critical reviews alongside positive ones, and we never pay for testimonials or invent reviewers.",
  },

  support: {
    intent: "Support — help, login, contact",
    eyebrow: "Support",
    h2: "Apollo TV Customer Support That Follows Through",
    description:
      "Every request gets a written reply in a single ticket thread, so you never have to explain the problem twice. Choose the route that matches what you need.",
  },

  faq: {
    intent: "Informational — common questions",
    eyebrow: "FAQ",
    h2: "Apollo Group TV FAQ: What People Ask Before Signing Up",
    description: "Quick answers to the questions we hear most. The [full FAQ](/faq) covers billing, privacy and troubleshooting in more depth.",
  },

  cta: {
    eyebrow: "Get started",
    h2: "Cut the Cord with Apollo Group TV This Week",
    body: "Create your account in about a minute, choose a pack, and our team will get you watching on your own screens.",
  },
};

/**
 * Homepage FAQ — answers the questions people actually search (price, downloader codes, Fire TV,
 * card payments, outages, buffering, log-in, sharing…) in wording distinct from /faq.
 * Questions keep the brand because that's how people search; answers mostly don't repeat it.
 */
export const homeFaq = [
  {
    q: "Is Apollo Group TV the same as Apollo TV?",
    a: "Yes. Apollo TV is the short name for Apollo Group TV: one service, one account and one official website. The [official site guide](/blog/apollo-group-tv-official-website) shows how to tell it apart from lookalike sites.",
  },
  {
    q: "Is Apollo Group TV an IPTV service?",
    a: "Yes. IPTV means TV delivered over the internet instead of cable or satellite. You watch live channels and an on-demand library in an app on your own device. [What is IPTV?](/blog/what-is-iptv) explains how it works.",
  },
  {
    q: "Is Apollo Group TV legal?",
    a: "Internet TV delivery is a lawful technology. What matters is whether the provider has rights to the content, and we list only authorized, properly licensed content. Our [plain-English explanation](/is-apollo-group-tv-legal) goes further.",
  },
  {
    q: "Is Apollo Group TV legit and safe to use?",
    a: "Everything you need to judge us is public: prices, [terms](/terms-and-conditions), a [privacy policy](/privacy-policy) and a [copyright process](/dmca). Accounts use email verification, hashed passwords and session controls, and we never ask for your password.",
  },
  {
    q: "How much does Apollo Group TV cost?",
    a: "Each pack is a single payment for a fixed period, from three months to two years, and longer packs cost less per month. The [Plans page](/plans) shows every current price with the cost per month.",
  },
  {
    q: "Do I need an Apollo Group TV downloader code?",
    a: "Only on Fire TV and Android TV, where the app installs through the free Downloader app. The official code is in your dashboard under Apps & Guides, and codes posted elsewhere aren't ours. Other devices use a direct download or an app store, as the [setup guides](/guides) explain.",
  },
  {
    q: "How do I install Apollo Group TV on Fire TV or Firestick?",
    a: "Install the free Downloader app, enter the official code from your dashboard and choose Install. The [Fire TV & Android TV guide](/guides/fire-tv-android-tv) covers each step, including how to reveal the hidden Developer options menu.",
  },
  {
    q: "Can I pay for Apollo Group TV with a credit card?",
    a: "Choose your pack from the dashboard and our team confirms the available payment options with you in a support ticket while online checkout is being set up. Never send card numbers by email or chat.",
  },
  {
    q: "Is Apollo Group TV down right now?",
    a: "If the app won't load, check your internet connection and restart the device first. Then [open a ticket](/dashboard/support/new) or [message us](/contact), and we'll confirm whether the problem is on our side.",
  },
  {
    q: "Why is Apollo Group TV not working on my device?",
    a: "Most problems come from an outdated app, the wrong login or a weak connection. Work through the [troubleshooting guide](/guides/troubleshooting); if it still fails, support can help.",
  },
  {
    q: "How do I log in to Apollo Group TV?",
    a: "Use your account email and password on the [Sign in](/sign-in) page and in the Apollo TV app. On iPhone, iPad and Apple TV, the UHF player uses the separate player login shown in your dashboard. Forgot your password? A reset link lasts 30 minutes.",
  },
  {
    q: "What devices does Apollo Group TV work on?",
    a: "Fire TV and Android TV, Android phones and tablets, Windows PCs and Macs run the Apollo TV app. iPhone, iPad and Apple TV use the UHF player. The [App page](/app) links to a setup guide for each one.",
  },
  {
    q: "Is there an Apollo Group TV free trial?",
    a: "We don't currently offer a free trial. The 3-month pack is the shortest commitment, and the [Refund Policy](/refund-policy) explains how refund requests work.",
  },
  {
    q: "Will Apollo Group TV buffer or freeze?",
    a: "Smooth playback depends mostly on your connection and device. A wired connection, an up-to-date app and fewer streams running at once make the biggest difference, and the [troubleshooting guide](/guides/troubleshooting) covers the rest.",
  },
  {
    q: "Can more than one person use an Apollo Group TV account?",
    a: "Each pack lists the number of devices it includes on the [Plans page](/plans). An account belongs to one household; sharing access beyond your pack isn't allowed under our [terms](/terms-and-conditions).",
  },
  {
    q: "How do I contact Apollo Group TV support?",
    a: "Customers can open a ticket from the dashboard. Anyone can send a message through the [contact page](/contact).",
  },
];
