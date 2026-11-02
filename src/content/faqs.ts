/**
 * Canonical FAQ set, seeded into the database (admins edit it from /admin/faq afterwards).
 * Answers may contain internal links written as [label](/path) — only same-site paths are rendered as links.
 * Every answer describes how this website actually works; nothing here states prices, refund windows
 * or device support, which live in the plans table, the refund policy and the verified-device list.
 */
export const FAQ_CATEGORIES = [
  "General Information",
  "Plans and Pricing",
  "App and Device Compatibility",
  "Account Access",
  "Installation",
  "Troubleshooting",
  "Billing and Refunds",
  "Privacy and Security",
  "Legal and Copyright Questions",
] as const;

export type FaqSeed = { category: (typeof FAQ_CATEGORIES)[number]; question: string; answer: string };

export const faqSeed: FaqSeed[] = [
  // General Information
  {
    category: "General Information",
    question: "What is Apollo Group TV?",
    answer:
      "Apollo Group TV is a streaming service for live channels and on-demand viewing, managed through one account. On this website you can compare plans, browse the channel catalog, find setup help for verified devices and handle billing and support from your dashboard. The [product overview](/product) walks through each part.",
  },
  {
    category: "General Information",
    question: "Is Apollo TV the same as Apollo Group TV?",
    answer:
      "Many people shorten the name to “Apollo TV” when they search. This website is the Apollo Group TV service. The name Apollo TV is also used by unrelated apps and sites, so check that you're on this website before you create an account or pay — our [About page](/about-us) explains how to recognize official communication.",
  },
  {
    category: "General Information",
    question: "Where can I see everything the service includes?",
    answer:
      "The [Features page](/product) covers the catalog, the account dashboard and support. Each plan's exact inclusions are listed on the [Plans page](/plans).",
  },
  // Plans and Pricing
  {
    category: "Plans and Pricing",
    question: "Where can I find current prices?",
    answer:
      "Current prices are on the [Plans page](/plans), which reads them directly from our plan list. If a price appears anywhere else — including on other websites using a similar name — the Plans page is the one that applies.",
  },
  {
    category: "Plans and Pricing",
    question: "What is the difference between the plans?",
    answer:
      "Plans differ by billing period and by the features listed on each card. The comparison table on the [Plans page](/plans) shows every feature side by side so you can see exactly what changes.",
  },
  {
    category: "Plans and Pricing",
    question: "How do I choose or change a plan?",
    answer:
      "Create an account, then open Dashboard → My Plan and pick a plan. While online checkout is being set up, our team confirms activation with you through a support ticket. To switch later, open a ticket from your [dashboard](/dashboard/support/new).",
  },
  // App and Device Compatibility
  {
    category: "App and Device Compatibility",
    question: "Which devices are supported?",
    answer:
      "The [App page](/app) lists every device we have verified, each with its own setup guide. We add a device only after testing it, so if yours isn't listed yet, [ask us](/contact) before subscribing.",
  },
  {
    category: "App and Device Compatibility",
    question: "Why isn't my device on the list?",
    answer:
      "A device is listed only once we have confirmed it works and have an official download source for it. Not being listed doesn't always mean it won't work — it means we haven't verified it yet. [Contact support](/contact) with the model name and we'll tell you what we know.",
  },
  {
    category: "App and Device Compatibility",
    question: "Where do I download the app?",
    answer:
      "Only from the official links shown in our [setup guides](/guides) or from official app stores. Avoid download codes, mirrors or APK files shared elsewhere; we can't vouch for their safety.",
  },
  // Account Access
  {
    category: "Account Access",
    question: "How do I create an account?",
    answer:
      "Go to [Create account](/create-account), enter your name, email and a password with at least 10 characters including upper- and lowercase letters and a number, then open the verification link we email you.",
  },
  {
    category: "Account Access",
    question: "I didn't get the verification email. What now?",
    answer:
      "Check spam and promotions folders first. Verification links expire after 24 hours; you can request a fresh one on the [Verify email](/verify-email) page.",
  },
  {
    category: "Account Access",
    question: "How do I reset my password?",
    answer:
      "Use “Forgot password?” on the [Sign in](/sign-in) page. The reset link is valid for 30 minutes, and resetting your password signs out your other devices.",
  },
  {
    category: "Account Access",
    question: "What is the client portal?",
    answer:
      "The [client portal](/client-portal) is a quick overview of your account — plan, billing, support and referrals — with shortcuts into the full dashboard.",
  },
  // Installation
  {
    category: "Installation",
    question: "How long does setup take?",
    answer:
      "Creating and verifying an account takes a few minutes. Device setup time depends on the device; each [setup guide](/guides) lists what you need before you start.",
  },
  {
    category: "Installation",
    question: "Can someone help me install the app?",
    answer:
      "Yes. [Open a support ticket](/dashboard/support/new) with your device model and where you got stuck, and our team will walk you through it. Every reply stays in the ticket thread.",
  },
  // Troubleshooting
  {
    category: "Troubleshooting",
    question: "Playback keeps buffering. What should I try?",
    answer:
      "Restart the device and your router, close other apps using bandwidth, and try a wired connection if you can. The [troubleshooting guide](/guides/troubleshooting) has the full checklist.",
  },
  {
    category: "Troubleshooting",
    question: "The app won't sign me in.",
    answer:
      "Make sure your email is verified and you're using the newest version of the app from the official link. If a password reset doesn't fix it, [contact support](/contact).",
  },
  // Billing and Refunds
  {
    category: "Billing and Refunds",
    question: "Where can I see my payments?",
    answer: "Every recorded payment appears under Dashboard → [Billing History](/dashboard/billing), with the date, amount, status and a payment reference.",
  },
  {
    category: "Billing and Refunds",
    question: "What is the refund policy?",
    answer:
      "Refund terms are published on the [Refund Policy](/refund-policy) page. That page is the only place we state refund rules, so it always reflects the current policy.",
  },
  {
    category: "Billing and Refunds",
    question: "Do you store my card details?",
    answer: "No. When online payments are enabled, cards are handled by our payment provider and we keep only a reference to each transaction.",
  },
  // Privacy and Security
  {
    category: "Privacy and Security",
    question: "How is my account protected?",
    answer:
      "Passwords are stored as salted hashes, email verification is required, sign-in attempts are rate-limited, and you can review and sign out of devices under Dashboard → [Security](/dashboard/security).",
  },
  {
    category: "Privacy and Security",
    question: "What personal data do you collect?",
    answer: "Only what the service needs to run your account. The [Privacy Policy](/privacy-policy) lists each type of data and why we keep it.",
  },
  {
    category: "Privacy and Security",
    question: "Will you ever ask for my password?",
    answer: "Never — not by email, chat or phone. If someone asks, don't share it, and let us know through the [contact page](/contact).",
  },
  // Legal and Copyright
  {
    category: "Legal and Copyright Questions",
    question: "Is Apollo Group TV legal?",
    answer:
      "Streaming over the internet is a delivery method; what matters legally is whether the provider has the rights to the content it distributes. We list only authorized, properly licensed content. Our [legal explainer](/is-apollo-group-tv-legal) goes into more detail.",
  },
  {
    category: "Legal and Copyright Questions",
    question: "How do I report a copyright concern?",
    answer: "Follow the notice process on our [Copyright and DMCA page](/dmca). It lists what a complete notice must include.",
  },
];

/** Questions seeded by earlier versions — replaced by the set above. */
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
