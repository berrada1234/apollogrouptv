/**
 * Canonical FAQ set, seeded into the database (admins edit it from /admin/faq afterwards).
 * Grouped into topics that match what people search for. Answers may contain internal links written
 * as [label](/path) — only same-site paths are rendered as links.
 *
 * Rules: describe how this website actually works. Never hard-code prices, refund windows or device
 * limits (they live in the plans table, the refund policy and pack details and are shown on the FAQ
 * page from live data), and never name channels, networks, leagues or studios.
 */
export const FAQ_TOPICS = [
  { name: "About Apollo Group TV", slug: "about", blurb: "What the service is, who runs it and whether it's legitimate" },
  { name: "Plans & Billing", slug: "plans-billing", blurb: "What it costs, how you pay and what renews (nothing does)" },
  { name: "Installation & Setup", slug: "installation-setup", blurb: "Getting the app onto your TV, streaming stick, phone or computer" },
  { name: "Channels & Content", slug: "channels-content", blurb: "What you can watch and how the lineup is organized" },
  { name: "App & Playback", slug: "app-playback", blurb: "How the app behaves once it's installed" },
  { name: "Account & Security", slug: "account-security", blurb: "Signing in, passwords, privacy and keeping your account safe" },
  { name: "Refunds & Cancellation", slug: "refunds-cancellation", blurb: "Refund requests and what happens when a pack ends" },
  { name: "Troubleshooting", slug: "troubleshooting", blurb: "Quick checks that fix most problems when something stops working" },
] as const;

export const FAQ_CATEGORIES = FAQ_TOPICS.map((t) => t.name) as [(typeof FAQ_TOPICS)[number]["name"], ...(typeof FAQ_TOPICS)[number]["name"][]];

export type FaqCategory = (typeof FAQ_TOPICS)[number]["name"];
export type FaqSeed = { category: FaqCategory; question: string; answer: string };

export const faqSeed: FaqSeed[] = [
  // ── About Apollo Group TV ────────────────────────────────────────────────
  {
    category: "About Apollo Group TV",
    question: "What exactly is Apollo Group TV?",
    answer:
      "Apollo Group TV is an internet TV service: live channels and an on-demand library delivered through the Apollo TV app, with your pack, payments and support managed from one online account. It replaces a cable box with an app on devices you already own. The [Features page](/product) walks through each part of the service.",
  },
  {
    category: "About Apollo Group TV",
    question: "Are Apollo TV and Apollo Group TV the same service?",
    answer:
      "People often shorten the name to “Apollo TV”, and this website is the Apollo Group TV service. The same name is also used by unrelated apps and lookalike sites, so make sure you're on this website before creating an account or paying. Our [About page](/about-us) explains how to recognize official communication from us.",
  },
  {
    category: "About Apollo Group TV",
    question: "Is it legal to use Apollo Group TV?",
    answer:
      "Streaming TV over the internet is a mainstream, lawful technology. What matters is whether a provider has permission to distribute what it offers, and our policy is to list only authorized, properly licensed content and to act on valid copyright notices. Our [plain-English explainer](/is-apollo-group-tv-legal) covers the details. This is general information, not legal advice.",
  },
  {
    category: "About Apollo Group TV",
    question: "Is Apollo Group TV a legitimate company, or a scam?",
    answer:
      "You can judge us on what's published: prices shown before you buy, public [terms](/terms-and-conditions), a [privacy policy](/privacy-policy), a [refund policy](/refund-policy) and a [copyright process](/dmca). Accounts are email-verified, payments are recorded in your dashboard, and every support reply is kept in writing. We never ask for your password.",
  },
  {
    category: "About Apollo Group TV",
    question: "How do I report a copyright concern?",
    answer:
      "Rights holders can send a notice through our [copyright and DMCA page](/dmca), which lists exactly what a valid notice needs to include. We review every notice and remove material that shouldn't be listed.",
  },

  // ── Plans & Billing ──────────────────────────────────────────────────────
  {
    category: "Plans & Billing",
    question: "What does an Apollo Group TV subscription cost?",
    answer:
      "It depends on how long you want access for. There are four packs (3, 6, 12 and 24 months), and the longer the pack, the lower the cost per month. Every pack includes the same lineup; there's no cheaper tier with fewer channels. Current prices are shown at the top of this page and on the [Plans page](/plans).",
  },
  {
    category: "Plans & Billing",
    question: "Does my pack renew automatically?",
    answer:
      "No. Each pack is a one-time payment for a fixed period and nothing renews behind your back. When the period ends, access stops until you choose a new pack. You'll see the days remaining in your [dashboard](/dashboard/plan). The [renewal guide](/apollo-group-tv-renewal) walks through adding your next pack.",
  },
  {
    category: "Plans & Billing",
    question: "How do I pay for a pack?",
    answer:
      "Choose your pack from the dashboard and our team confirms the available payment options with you through a support ticket while online checkout is being set up. Every confirmed payment then appears in your billing history with its amount, status and reference.",
  },
  {
    category: "Plans & Billing",
    question: "Can I use a debit or credit card?",
    answer:
      "Our team will tell you which payment methods are available when you request a pack. Please never send card numbers, CVV codes or bank details by email, chat or a support ticket. We will never ask for them that way.",
  },
  {
    category: "Plans & Billing",
    question: "What will appear on my bank or card statement?",
    answer:
      "The payment descriptor depends on the payment method used, and our team confirms it with you before you pay. Each payment is also listed in your [billing history](/dashboard/billing) with a reference you can match against your statement.",
  },
  {
    category: "Plans & Billing",
    question: "Is there a trial before I pay?",
    answer:
      "We don't currently offer a free trial. If you're unsure, the 3-month pack is the shortest commitment, and our [Refund Policy](/refund-policy) explains how refund requests are handled. You can also [ask us](/contact) about your device before buying.",
  },
  {
    category: "Plans & Billing",
    question: "What's the difference between the four packs?",
    answer:
      "Only the access period and the price. Every pack includes the same live channels, on-demand library, device allowance, setup guides and support. Longer packs cost less per month, and the [Plans page](/plans) shows the monthly equivalent and the saving for each.",
  },
  {
    category: "Plans & Billing",
    question: "Can I switch to a longer pack later?",
    answer:
      "Yes. Request the pack you want from [My Plan](/dashboard/plan) and our team will confirm how the change is applied before anything is charged, for example whether the new period starts now or when your current pack ends.",
  },

  // ── Installation & Setup ─────────────────────────────────────────────────
  {
    category: "Installation & Setup",
    question: "How do I set up Apollo Group TV on an Amazon Fire TV Stick?",
    answer:
      "Fire TV setup steps and the official download link are published on the [App page](/app) once the device is verified. Install only from that link or an official app store, then sign in with your Apollo Group TV account. If the guide isn't live yet, [contact us](/contact) and we'll walk you through it.",
  },
  {
    category: "Installation & Setup",
    question: "Is there an Apollo Group TV downloader code?",
    answer:
      "Only for Fire TV and Android TV, where the Apollo TV app installs through the free Downloader app. Use the official code shown in your dashboard under [Apps & Guides](/dashboard/apps). Codes posted on forums, videos or social media aren't from us and can install modified apps that put your device and account at risk.",
  },
  {
    category: "Installation & Setup",
    question: "How do I watch Apollo Group TV on iPhone or iPad?",
    answer:
      "Follow the iPhone & iPad steps on the [App page](/app), which include the official way to install and sign in. The app uses a touch-friendly layout on phones and tablets with the same account and lineup as your TV.",
  },
  {
    category: "Installation & Setup",
    question: "Does it work on Roku or a smart TV?",
    answer:
      "We list a device only after verifying it. Check the [App page](/app) for the current list. If your Roku, Samsung, LG or other smart TV isn't shown, [ask us before subscribing](/contact) and we'll tell you what works today.",
  },
  {
    category: "Installation & Setup",
    question: "Which devices can run the app?",
    answer:
      "The [App page](/app) lists every verified device type, each with its own setup guide. Today that means streaming sticks and TV boxes, Android devices, iPhone and iPad, and Windows computers. New devices are added once they've been tested.",
  },
  {
    category: "Installation & Setup",
    question: "How do I sign in on the app after installing it?",
    answer:
      "Open the app and sign in with the same email and password you use on this website. Your email must be verified and a pack must be active. Both are shown in your [dashboard](/dashboard). One account works on all your devices.",
  },
  {
    category: "Installation & Setup",
    question: "How long does setup take?",
    answer:
      "Creating an account takes about a minute. Installing the app usually takes a few minutes per device once your pack is active. Each [device guide](/guides) lists the steps in order so you can follow along on screen.",
  },

  // ── Channels & Content ───────────────────────────────────────────────────
  {
    category: "Channels & Content",
    question: "How many channels are included?",
    answer:
      "The size of the live lineup and on-demand library is shown on our [homepage](/) and reflects the current catalog, which changes as licensing changes. Every pack includes the full lineup. The [channel guide](/channels) explains how channels are organized.",
  },
  {
    category: "Channels & Content",
    question: "Are major sports leagues and premium movie channels included?",
    answer:
      "Sports and movie channels are among the categories in the lineup, but we don't publish channel, league or network names, because they're trademarks of their owners and availability depends on licensing in your region. If one specific channel or league matters to you, [ask us first](/contact) and we'll confirm.",
  },
  {
    category: "Channels & Content",
    question: "Are there Spanish, Arabic, Indian or other international channels?",
    answer:
      "International and foreign-language programming is one of the channel categories, and where licensing allows channels are grouped by region and language. Availability differs by country, so check the [channel guide](/channels) or [ask us](/contact) about a specific language.",
  },
  {
    category: "Channels & Content",
    question: "Can I watch in 4K?",
    answer:
      "Yes, where available. Channels show HD, Full HD or 4K labels when the broadcast supports it. You'll also need a 4K-capable TV and device and a fast, stable connection. See the requirements on the [App page](/app).",
  },
  {
    category: "Channels & Content",
    question: "Can I record shows or watch them later?",
    answer:
      "We don't currently advertise a recording feature for live TV. The on-demand library lets you watch movies and series whenever you like while your pack is active.",
  },
  {
    category: "Channels & Content",
    question: "Does the lineup change over time?",
    answer:
      "Yes. Channels and titles are added or removed as rights agreements change, which is why the [channel guide](/channels) describes categories rather than a fixed list of names. Customers always see the current lineup in the app.",
  },

  // ── App & Playback ───────────────────────────────────────────────────────
  {
    category: "App & Playback",
    question: "Why does my stream buffer or freeze?",
    answer:
      "Most interruptions come from the connection: busy Wi-Fi, other downloads on the network, or several streams at once. A wired connection, a router restart and the latest app version fix most cases. The [troubleshooting guide](/guides/troubleshooting) walks through each check in order.",
  },
  {
    category: "App & Playback",
    question: "How many devices can stream on one account?",
    answer:
      "Each pack includes a device allowance, listed in the pack details on the [Plans page](/plans) and shown at the top of this page. Sign in with the same account on each device up to that limit. Accounts are for one household, as set out in our [terms](/terms-and-conditions).",
  },
  {
    category: "App & Playback",
    question: "Will it work when I travel abroad?",
    answer:
      "The app works wherever you have a good internet connection, but some channels are licensed for specific regions and may not be available in every country. If you're planning a trip, [ask us](/contact) what to expect.",
  },
  {
    category: "App & Playback",
    question: "Do I need a VPN?",
    answer:
      "No, a VPN isn't required. Channel availability follows licensing for the region you're in, and routing through another country can hide channels or slow playback. Using a VPN to get around regional licensing isn't permitted under our [terms](/terms-and-conditions).",
  },
  {
    category: "App & Playback",
    question: "The TV guide looks empty the first time I open the app. Is that normal?",
    answer:
      "Guide information can take a little time to load on first launch, especially on slower connections. Give it a few minutes, then restart the app. If the guide stays empty, update the app and [open a ticket](/dashboard/support/new) with your device model.",
  },

  // ── Account & Security ───────────────────────────────────────────────────
  {
    category: "Account & Security",
    question: "How do I sign in to my Apollo Group TV account?",
    answer:
      "Use your email and password on the [Sign in](/sign-in) page. If you haven't verified your email yet, signing in sends you a 6-digit code to enter on the [Verify email](/verify-email) page.",
  },
  {
    category: "Account & Security",
    question: "I forgot my password or lost my login details. How do I get back in?",
    answer:
      "Request a reset link from the [Sign in](/sign-in) page; it's valid for 30 minutes. Your website email and password also sign you in to the Apollo TV app. Third-party players use the separate player login shown in [My Accounts](/dashboard/profile). If you no longer have access to your email, [contact support](/contact).",
  },
  {
    category: "Account & Security",
    question: "I didn't receive my verification email.",
    answer:
      "Check your spam or promotions folder first. Verification codes are valid for 10 minutes; if yours expired, request a new one on the [Verify email](/verify-email) page. Still nothing? [Message us](/contact) with the address you signed up with.",
  },
  {
    category: "Account & Security",
    question: "How is my account protected?",
    answer:
      "Passwords are stored as one-way hashes, accounts are email-verified, sign-in attempts are rate-limited, and you can review and sign out of your active sessions from [Security](/dashboard/security). We never ask for your password by email, chat or ticket.",
  },
  {
    category: "Account & Security",
    question: "What personal information do you collect?",
    answer:
      "Only what's needed to run your account: your name and email, your pack and payment records, your support messages, and basic technical data used for security. The [Privacy Policy](/privacy-policy) explains each type, why we keep it and the choices you have.",
  },
  {
    category: "Account & Security",
    question: "Can I delete my account?",
    answer:
      "Yes. [Open a ticket](/dashboard/support/new) asking for deletion and we'll confirm the request. Some records, such as payment history, may need to be kept for a period for legal and accounting reasons, as described in the [Privacy Policy](/privacy-policy).",
  },

  // ── Refunds & Cancellation ───────────────────────────────────────────────
  {
    category: "Refunds & Cancellation",
    question: "How do I ask for a refund?",
    answer:
      "Open a support ticket from your [dashboard](/dashboard/support/new) and include your payment reference. Our [Refund Policy](/refund-policy) sets out the eligibility window, what's covered and how long processing takes. Please read it before you buy.",
  },
  {
    category: "Refunds & Cancellation",
    question: "If I stop using a 12-month pack halfway through, do I get money back?",
    answer:
      "Refunds follow the [Refund Policy](/refund-policy), which doesn't promise a pro-rated refund for unused time. If you're not sure a long pack is right for you, start with a shorter one. You can move to a longer pack later.",
  },
  {
    category: "Refunds & Cancellation",
    question: "How do I cancel Apollo Group TV?",
    answer:
      "There's nothing to cancel: packs don't renew automatically, so access ends when your period runs out. If you also want your account removed, [open a ticket](/dashboard/support/new) and ask for deletion.",
  },

  // ── Troubleshooting ──────────────────────────────────────────────────────
  {
    category: "Troubleshooting",
    question: "Apollo Group TV stopped working. What should I check first?",
    answer:
      "Work through these in order: confirm your pack is active in the [dashboard](/dashboard/plan), restart your device and router, update the app from its official link, then sign out and back in. The [troubleshooting guide](/guides/troubleshooting) covers each step in detail.",
  },
  {
    category: "Troubleshooting",
    question: "What does a 403 or “access denied” error mean?",
    answer:
      "It means the service refused the request, most often because your pack has expired, too many devices are signed in, or the app is out of date. Check your pack status, sign out on devices you don't use from [Security](/dashboard/security), and update the app. If the error continues, [open a ticket](/dashboard/support/new) with a photo of the message.",
  },
  {
    category: "Troubleshooting",
    question: "The sound is out of sync with the picture. How do I fix it?",
    answer:
      "Try another channel first. If only one is affected, it's usually that broadcast. Otherwise, restart the app, turn off any audio processing or surround modes on your TV or soundbar, and check the audio-delay setting on your TV. If it continues across channels, let us know your device model.",
  },
  {
    category: "Troubleshooting",
    question: "Is the service down right now?",
    answer:
      "Check your own connection first by opening another streaming app or website. If everything else works, [open a ticket](/dashboard/support/new) or [message us](/contact) and we'll confirm whether there's an issue on our side and keep you updated in the same thread.",
  },
  {
    category: "Troubleshooting",
    question: "Why does one particular channel keep buffering?",
    answer:
      "When only one channel struggles, the cause is usually that channel's source rather than your setup. Try it again later and compare with a few other channels. If it keeps happening, tell us which category it's in and when it buffers so our team can look into it.",
  },
  {
    category: "Troubleshooting",
    question: "How do I reach support?",
    answer:
      "Customers can [open a ticket](/dashboard/support/new) from the dashboard. Every reply stays in one thread and you're notified when we answer. Not a customer yet? Use the [contact form](/contact) and we'll reply by email.",
  },
];

/** Questions reworded without the brand name (it was repeated in almost every question). The seed renames existing rows. */
export const faqRenames: Record<string, string> = {
  "Does my Apollo Group TV pack renew automatically?": "Does my pack renew automatically?",
  "How do I pay for Apollo Group TV?": "How do I pay for a pack?",
  "Can I use Apollo Group TV on a Roku or Smart TV?": "Does it work on Roku or a smart TV?",
  "Which devices can run the Apollo TV app?": "Which devices can run the app?",
  "How many channels are included with Apollo Group TV?": "How many channels are included?",
  "Does Apollo Group TV include major sports leagues and premium movie channels?": "Are major sports leagues and premium movie channels included?",
  "Will Apollo Group TV work when I travel abroad?": "Will it work when I travel abroad?",
  "Do I need a VPN to use Apollo Group TV?": "Do I need a VPN?",
  "How is my Apollo Group TV account protected?": "How is my account protected?",
  "What personal information does Apollo Group TV collect?": "What personal information do you collect?",
  "How do I reach Apollo Group TV support?": "How do I reach support?",
  "Is the Apollo Group TV service down?": "Is the service down right now?"
};

/** First-generation questions that later sets replaced; the seed removes them so the FAQ doesn't drift. */
export const legacyFaqQuestions = [
  "How do I create an account?",
  "I didn't receive the verification email.",
  "How do I reset my password?",
  "How do I choose or change a plan?",
  "Where can I find my payment history?",
  "Which devices are supported?",
  "The app isn't working. What should I do?",
  "How do I contact support?",
  "How does the referral program work?",
];

/** The second-generation set (nine categories) replaced by the topic-based set above. */
export const previousFaqQuestions = [
  "What is Apollo Group TV?",
  "Is Apollo TV the same as Apollo Group TV?",
  "Where can I see everything the service includes?",
  "Where can I find current prices?",
  "What is the difference between the plans?",
  "How do I choose or change a plan?",
  "How do I create an account?",
  "How do I reset my password?",
  "Which devices are supported?",
  "Why isn't my device on the list?",
  "Where do I download the app?",
  "I didn't get the verification email. What now?",
  "What is the client portal?",
  "How long does setup take?",
  "Can someone help me install the app?",
  "Playback keeps buffering. What should I try?",
  "The app won't sign me in.",
  "Where can I see my payments?",
  "What is the refund policy?",
  "Do you store my card details?",
  "How is my account protected?",
  "What personal data do you collect?",
  "Will you ever ask for my password?",
  "Is Apollo Group TV legal?",
  "How do I report a copyright concern?",
];

export const previousFaqCategories = [
  "General Information",
  "Plans and Pricing",
  "App and Device Compatibility",
  "Account Access",
  "Installation",
  "Troubleshooting",
  "Billing and Refunds",
  "Privacy and Security",
  "Legal and Copyright Questions",
];
