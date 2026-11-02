/**
 * Policy content. Written to match what this application actually does (see SECURITY.md and the
 * Prisma schema). Business facts the developer cannot know — legal entity, governing law, refund
 * rules, DMCA agent — are {{tokens}} filled from Admin → Settings → Legal & policies. Until the owner
 * approves them, pages render a draft banner and are excluded from indexing.
 *
 * Not legal advice. Have a qualified lawyer review before publication.
 */
export type LegalSection = { heading: string; paragraphs?: string[]; list?: string[] };
export type LegalDoc = { slug: string; title: string; metaTitle: string; description: string; intro: string; sections: LegalSection[] };

export const TOKEN_LABELS: Record<string, string> = {
  entityName: "legal entity name",
  entityAddress: "registered address",
  governingLaw: "governing law and venue",
  officialDomain: "official website domain",
  supportEmail: "support email address",
  dmcaAgentName: "DMCA designated agent",
  dmcaAgentEmail: "DMCA agent email",
  dmcaAgentAddress: "DMCA agent postal address",
};

export const privacyPolicy: LegalDoc = {
  slug: "privacy-policy",
  title: "Privacy Policy",
  metaTitle: "Privacy Policy — Apollo Group TV",
  description: "How Apollo Group TV collects, uses and protects personal data across the website and account dashboard, and the choices you have.",
  intro:
    "This policy explains what personal data Apollo Group TV (operated by {{entityName}}) collects when you use this website and your account, why we need it, and the choices you have.",
  sections: [
    {
      heading: "Information you give us",
      list: [
        "Account details: your name, email address and a password (we store only a salted hash, never the password itself).",
        "Preferences: whether you want product updates or marketing emails.",
        "Support conversations: the tickets and replies you send, and messages submitted through the contact form.",
        "Reviews you choose to submit, which are published under your first name and last initial once approved.",
      ],
    },
    {
      heading: "Information collected automatically",
      list: [
        "Session data: when you sign in we store a session record with your IP address and browser user agent so you can see and sign out of devices.",
        "Security records: request counts used to rate-limit sign-in and form submissions.",
        "Account activity: plan, subscription status, notification history and referral relationships.",
      ],
      paragraphs: ["We do not run advertising trackers. If analytics are added later, this policy will be updated before they go live."],
    },
    {
      heading: "Cookies",
      paragraphs: [
        "We use essential cookies only: a session cookie that keeps you signed in, and a referral cookie set for 30 days when you open someone's referral link. You can clear cookies at any time; doing so signs you out.",
      ],
    },
    {
      heading: "How we use information",
      list: [
        "To create and secure your account, including email verification and password resets.",
        "To provide your plan, show billing history and respond to support requests.",
        "To moderate reviews and run the referral program.",
        "To send service emails, and product or marketing emails only if you opted in.",
        "To detect abuse and protect the service.",
      ],
    },
    {
      heading: "Service providers",
      paragraphs: [
        "We share data only with providers that help us run the service: our hosting provider, our email delivery provider and — once online checkout is enabled — our payment provider. Payment card details are handled by the payment provider; we store only a transaction reference. We do not sell personal data.",
      ],
    },
    {
      heading: "Retention",
      paragraphs: [
        "We keep account data while your account is active. Expired sessions and verification tokens are removed automatically. Billing records may be kept longer where accounting or tax rules require it. You can ask us to delete your account at any time.",
      ],
    },
    {
      heading: "Your choices and rights",
      list: [
        "View and edit your name and email preferences in your dashboard.",
        "Sign out of other devices from Dashboard → Security.",
        "Ask for a copy of your data, a correction or deletion by contacting {{supportEmail}}.",
        "Depending on where you live, you may have additional rights under local law (for example, in California or the EU).",
      ],
    },
    {
      heading: "Security",
      paragraphs: [
        "We use hashed passwords, encrypted connections (HTTPS), rate limiting and role-based access for staff. No system is perfectly secure, so we can't guarantee absolute security, but we work to protect your data and will notify you as required by law if a breach affects you.",
      ],
    },
    {
      heading: "Children",
      paragraphs: ["The service is not directed to children under 13, and we do not knowingly collect their personal data."],
    },
    {
      heading: "Changes and contact",
      paragraphs: [
        "We'll post updates here and change the date at the top. Questions? Write to {{supportEmail}} or use our [contact page](/contact). Postal address: {{entityAddress}}.",
      ],
    },
  ],
};

export const termsAndConditions: LegalDoc = {
  slug: "terms-and-conditions",
  title: "Terms and Conditions",
  metaTitle: "Terms and Conditions — Apollo Group TV",
  description: "The terms that apply to Apollo Group TV accounts, plans, acceptable use and support.",
  intro:
    "These terms are an agreement between you and {{entityName}} (“Apollo Group TV”, “we”) covering your use of this website, your account and any plan you hold. By creating an account you accept them.",
  sections: [
    {
      heading: "Your account",
      list: [
        "Provide accurate details and keep your email address current.",
        "Keep your password private; you are responsible for activity on your account.",
        "One person per account. Tell us promptly if you suspect unauthorized access.",
      ],
    },
    {
      heading: "Plans and billing",
      paragraphs: [
        "The price, billing period and inclusions of each plan are those shown on the [Plans page](/plans) when you subscribe. A plan becomes active once we confirm activation; its dates appear in your dashboard. Refunds are covered by the [Refund Policy](/refund-policy).",
      ],
    },
    {
      heading: "Acceptable use",
      list: [
        "Don't resell, share or redistribute access to the service.",
        "Don't attempt to bypass security controls, rate limits or account restrictions.",
        "Don't use the service in a way that breaks the law or infringes others' rights.",
        "Don't submit reviews, tickets or messages that are false, abusive or unlawful.",
      ],
    },
    {
      heading: "Content",
      paragraphs: [
        "We list only content we are authorized to provide. Availability can change as rights agreements change, and specific channels or programs are not guaranteed. Copyright concerns are handled under our [Copyright and DMCA Policy](/dmca).",
      ],
    },
    {
      heading: "Suspension and termination",
      paragraphs: [
        "We may suspend or close accounts that breach these terms. You can close your account at any time by contacting support. Sections that by their nature should survive termination will do so.",
      ],
    },
    {
      heading: "Disclaimers and liability",
      paragraphs: [
        "The service is provided on an “as is” and “as available” basis. To the extent the law allows, we are not liable for indirect or consequential losses, and our total liability is limited to the amount you paid us in the three months before the claim. Nothing in these terms limits rights you have under consumer-protection law that cannot be waived.",
      ],
    },
    {
      heading: "Governing law",
      paragraphs: ["These terms are governed by the laws of {{governingLaw}}."],
    },
    {
      heading: "Changes and contact",
      paragraphs: [
        "If we make material changes, we'll notify you in your dashboard before they take effect. Questions: {{supportEmail}} or our [contact page](/contact). {{entityName}}, {{entityAddress}}.",
      ],
    },
  ],
};

export const refundPolicy: LegalDoc = {
  slug: "refund-policy",
  title: "Refund Policy",
  metaTitle: "Refund Policy — Apollo Group TV",
  description: "How refund requests work for Apollo Group TV plans and how to contact us about billing.",
  intro:
    "This page is the single source of truth for Apollo Group TV refund rules. If a refund window or guarantee appears anywhere else, including on other websites using a similar name, this page is the one that applies to your account here.",
  sections: [
    // The approved terms are injected from settings at render time (see RefundTerms in the page).
    {
      heading: "How to request a refund",
      list: [
        "Open a support ticket from your dashboard with the subject “Refund request”.",
        "Include the email on your account and, if available, the payment reference from Billing History.",
        "We reply in the ticket thread; you'll be notified when we do.",
      ],
    },
    {
      heading: "Payments made through a provider",
      paragraphs: [
        "When online checkout is enabled, approved refunds are issued through the same payment provider used for the purchase. Processing times depend on that provider and your bank.",
      ],
    },
    {
      heading: "Questions",
      paragraphs: ["Contact {{supportEmail}} or use the [contact page](/contact). For plan details see the [Plans page](/plans)."],
    },
  ],
};

export const dmcaPolicy: LegalDoc = {
  slug: "dmca",
  title: "Copyright and DMCA Policy",
  metaTitle: "Copyright and DMCA Policy — Apollo Group TV",
  description: "How to report suspected copyright infringement to Apollo Group TV and what a valid notice must include.",
  intro:
    "Apollo Group TV respects intellectual property rights and lists only content it is authorized to provide. If you believe material available through the service infringes your copyright, send a notice using the process below.",
  sections: [
    {
      heading: "What a notice must include",
      list: [
        "Your physical or electronic signature, as the rights owner or someone authorized to act for them.",
        "Identification of the copyrighted work you believe is infringed.",
        "Identification of the material you want removed, with enough detail for us to locate it (for example, the channel or page URL).",
        "Your name, postal address, telephone number and email address.",
        "A statement that you have a good-faith belief the use is not authorized by the copyright owner, its agent or the law.",
        "A statement that the information in the notice is accurate and, under penalty of perjury, that you are authorized to act on the owner's behalf.",
      ],
    },
    {
      heading: "Where to send notices",
      paragraphs: ["Designated agent: {{dmcaAgentName}} · Email: {{dmcaAgentEmail}} · Postal address: {{dmcaAgentAddress}}."],
    },
    {
      heading: "What happens next",
      paragraphs: [
        "We review complete notices promptly, remove or disable access to material where appropriate, and may share the notice with the party that supplied the material. Incomplete notices may delay action.",
      ],
    },
    {
      heading: "Counter-notices",
      paragraphs: [
        "If material you supplied was removed and you believe that was a mistake, you may send a counter-notice to the same agent with your contact details, identification of the removed material, a statement under penalty of perjury that you believe it was removed in error, and your consent to the appropriate jurisdiction.",
      ],
    },
    {
      heading: "Misrepresentation",
      paragraphs: ["Knowingly misrepresenting that material is infringing, or that it was removed by mistake, can create legal liability. If you're unsure, consult a lawyer before sending a notice."],
    },
  ],
};

export const legalDocs = [privacyPolicy, termsAndConditions, refundPolicy, dmcaPolicy];
