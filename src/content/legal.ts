/**
 * Policy content. Written to match what this application actually does (Prisma schema, auth config,
 * proxy cookies, admin actions). Business facts the developer cannot know — legal entity, governing law,
 * refund conditions, DMCA agent, app data practices, hosting region — are {{tokens}} filled from
 * Admin → Settings → Legal & policies (and the refund window from Homepage highlights). Until the owner
 * approves them, pages render a draft banner and are excluded from indexing.
 *
 * Not legal advice. Every policy needs review by a qualified lawyer before publication; clauses that
 * most need it are listed in docs/seo-content-strategy.md.
 */
export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  list?: string[];
};
export type LegalDoc = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  intro: string;
  sections: LegalSection[];
};

export const TOKEN_LABELS: Record<string, string> = {
  entityName: "legal entity name",
  entityAddress: "registered address",
  governingLaw: "governing law and venue",
  officialDomain: "official website domain",
  supportEmail: "support email address",
  dmcaAgentName: "DMCA designated agent",
  dmcaAgentEmail: "DMCA agent email",
  dmcaAgentAddress: "DMCA agent postal address",
  refundWindow: "refund window (days)",
  appDataPractices: "what data the Apollo TV app collects",
  hostingRegion: "where the servers are located",
};

export const privacyPolicy: LegalDoc = {
  slug: "privacy-policy",
  title: "Privacy Policy",
  metaTitle: "Privacy Policy: How Apollo Group TV Handles Your Data",
  description:
    "What personal data Apollo Group TV collects through this website and your account, why, who we share it with, how long we keep it and your rights.",
  intro:
    "This policy explains what personal data Apollo Group TV collects when you use this website and your account dashboard, why we need it, who sees it and what you can do about it. Apollo Group TV is operated by {{entityName}}, which is responsible for your data.",
  sections: [
    {
      heading: "What we collect when you give it to us",
      list: [
        "**Account details:** your name, email address and password. We store only a salted hash of the password, never the password itself.",
        "**Email preferences:** whether you want product updates and offers.",
        "**Support requests:** the tickets and replies you send, and contact-form messages (name, email, topic and message). Anything you choose to include, such as a gift recipient's name, is stored with the ticket.",
        "**Reviews:** the rating and text you submit. Approved reviews show your first name and last initial.",
        "**Referral codes:** a friend's code if you enter it before your first pack.",
      ],
    },
    {
      heading: "What we record while you use the service",
      list: [
        "**Sessions:** when you sign in we store a session with your IP address and browser details, so you can see your signed-in devices and sign them out.",
        "**Security counters:** short-lived request counts, keyed by IP address or account, that limit repeated sign-in attempts and form submissions.",
        "**Packs and payments:** the packs you request, their status and dates, and payment records (amount, currency, status and a reference). We do not store card numbers.",
        "**Player login:** if our team issues you credentials for third-party players, we store them encrypted (AES-256-GCM) and show them only to you and our administrators.",
        "**Account activity:** notifications, referral relationships and the history of your support tickets.",
        "**Staff actions:** when our staff change something on your account (for example activating a pack or replying to a ticket), we log who did it and when, including the staff member's IP address.",
      ],
    },
    {
      heading: "Cookies",
      paragraphs: [
        "We use two essential cookies. A session cookie keeps you signed in for up to 30 days. A referral cookie is set for 30 days when you open someone's referral link, so the referral can be recorded if you sign up.",
        "We don't use advertising or analytics cookies. If we add analytics, we'll update this policy and ask for consent where the law requires it before it goes live. Clearing your cookies signs you out.",
      ],
    },
    {
      heading: "How we use your data",
      list: [
        "To create and secure your account, including email verification and password resets.",
        "To activate your pack, record payments and show your plan and transaction history.",
        "To answer support requests and notify you of replies.",
        "To run the referral program and moderate reviews.",
        "To send service emails, and product or marketing emails only if you've opted in.",
        "To detect abuse, prevent fraud and keep the service secure.",
      ],
    },
    {
      heading: "Legal bases (EU and UK visitors)",
      paragraphs: [
        "We process account, pack and support data to perform our contract with you; security records and staff logs on our legitimate interest in protecting the service; marketing emails on your consent, which you can withdraw at any time; and billing records where accounting and tax law require it.",
      ],
    },
    {
      heading: "Who we share data with",
      paragraphs: [
        "Only providers that help us run the service: our hosting provider, our email delivery provider and any payment provider used for your purchase. They may process data only on our instructions. We do not sell or rent personal data.",
        "Some devices use independent apps, such as the Downloader app on Fire TV or the UHF player on Apple devices. Those apps are run by other companies under their own privacy policies.",
        "We may disclose data when the law requires it, to protect our rights or users' safety, or as part of a business transfer, in which case this policy continues to apply.",
      ],
    },
    {
      heading: "The Apollo TV app",
      paragraphs: [
        "This policy covers this website and your dashboard. About the Apollo TV app: {{appDataPractices}}",
      ],
    },
    {
      heading: "Where your data is stored",
      paragraphs: [
        "Our servers are located in {{hostingRegion}}. If that is outside your country, we use the safeguards the law requires for international transfers.",
      ],
    },
    {
      heading: "How long we keep it",
      list: [
        "Account, pack and support data: while your account is open, and deleted when you ask us to close it, except records we must keep.",
        "Sessions: up to 30 days, or until you sign out. Verification links expire after 24 hours and password-reset links after 30 minutes.",
        "Security counters: minutes to hours, then overwritten.",
        "Payment records: as long as accounting and tax rules require.",
        "Contact-form messages: as long as needed to answer and keep a record, or until you ask us to delete them.",
      ],
    },
    {
      heading: "Your rights",
      list: [
        "Update your name, email preferences and signed-in devices yourself in your dashboard.",
        "Ask for a copy of your data, a correction, deletion or a restriction of processing, or object to processing, by opening a ticket or writing to {{supportEmail}}.",
        "Withdraw marketing consent at any time from My Accounts → Notifications.",
        "If you're in the EU or UK you can complain to your local data-protection authority. Residents of some US states, such as California, have similar rights.",
      ],
      paragraphs: [
        "We answer requests within the time the law sets, and may need to confirm your identity first.",
      ],
    },
    {
      heading: "How we protect it",
      paragraphs: [
        "Passwords are hashed, connections use HTTPS, player credentials are encrypted at rest, sign-in and forms are rate-limited, and staff access is limited by role and logged. No system is perfectly secure; if a breach affects your data, we'll notify you as the law requires.",
      ],
    },
    {
      heading: "Children",
      paragraphs: [
        "The service is for adults. We don't knowingly collect data from children under 16, and we'll delete it if we learn we have.",
      ],
    },
    {
      heading: "Changes and contact",
      paragraphs: [
        "We'll post changes here and update the date at the top; significant changes are also announced in your dashboard. Questions about privacy: {{supportEmail}}, the [contact page](/contact), or {{entityName}}, {{entityAddress}}. How the service itself works is set out in our [Terms and Conditions](/terms-and-conditions).",
      ],
    },
  ],
};

export const termsAndConditions: LegalDoc = {
  slug: "terms-and-conditions",
  title: "Terms and Conditions",
  metaTitle: "Terms and Conditions — Apollo Group TV",
  description:
    "The rules for Apollo Group TV accounts and packs: one-time payments, activation, device limits, acceptable use, availability, liability and termination.",
  intro:
    "These terms are the agreement between you and {{entityName}} (“Apollo Group TV”, “we”) for using this website, your account and any pack you buy. By creating an account you accept them. If you don't agree, please don't use the service.",
  sections: [
    {
      heading: "Who can use the service",
      paragraphs: [
        "You must be an adult able to enter a binding contract where you live. You're responsible for making sure the service can be used lawfully in your location.",
      ],
    },
    {
      heading: "Your account",
      list: [
        "Give accurate details and keep your email address current.",
        "Keep your password private. You're responsible for activity on your account.",
        "An account belongs to one person and their household. Tell us straight away if you suspect someone else has access.",
      ],
    },
    {
      heading: "Packs, prices and payment",
      list: [
        "Each pack is a one-time payment for a fixed period. Packs do not renew automatically.",
        "The price, length and inclusions are those shown on the [Plans page](/plans) when you request the pack. We confirm the final amount, including any tax, before you pay.",
        "A pack starts when our team activates it after payment is confirmed. Its start and end dates appear in your dashboard.",
        "Pay only through your account or the payment details our team gives you in your support ticket. We are not responsible for payments sent to anyone else.",
      ],
    },
    {
      heading: "Extending or changing a pack",
      paragraphs: [
        "You can request another pack while one is active. We'll confirm how the extra time is added before you pay.",
      ],
    },
    {
      heading: "Refunds",
      paragraphs: [
        "Refunds are governed only by our [Refund Policy](/refund-policy).",
      ],
    },
    {
      heading: "Devices, apps and player logins",
      list: [
        "Each pack includes the device allowance shown in its details. Using more devices at once than your pack allows isn't permitted.",
        "Install apps only from official sources listed in your dashboard or official app stores.",
        "Third-party apps used with the service, such as Downloader or UHF, are provided by other companies under their own terms. We don't control them.",
        "Player logins we issue are personal to your account. Don't share or publish them; we may reset them if we see misuse.",
      ],
    },
    {
      heading: "Service availability",
      paragraphs: [
        "The service is delivered over the internet, so quality depends on your connection and device. We aim to keep it running continuously but don't guarantee uninterrupted availability, and we may pause it for maintenance or security.",
        "Channels, programs and picture quality can change as rights agreements change and can differ by region. No specific channel or event is guaranteed.",
      ],
    },
    {
      heading: "Acceptable use",
      list: [
        "Don't resell, share, rebroadcast or redistribute the service or any content.",
        "Don't use VPNs or other tools to get around regional licensing restrictions.",
        "Don't attempt to bypass security, rate limits or device limits, or scrape the website.",
        "Don't use the service in a way that breaks the law or infringes anyone's rights.",
        "Don't submit tickets, reviews or messages that are false, abusive or unlawful.",
      ],
    },
    {
      heading: "Content and intellectual property",
      paragraphs: [
        "Channels and programs belong to their rights holders. The Apollo Group TV name, website, design and text belong to us. These terms don't give you any ownership of either. Copyright concerns are handled under our [Copyright and DMCA Policy](/dmca).",
      ],
    },
    {
      heading: "Reviews and referrals",
      paragraphs: [
        "When you submit a review, you allow us to publish it with your first name and last initial; we may reject reviews that break our rules. The referral program follows the rules on the [Refer a Friend page](/refer-a-friend), which we may change or end with notice; self-referrals and duplicate accounts are excluded.",
      ],
    },
    {
      heading: "Suspension and termination",
      paragraphs: [
        "We may suspend or close an account that breaches these terms, after notice where reasonable. You can stop using the service at any time and ask us to close your account. Sections that by their nature should continue after termination, such as liability and governing law, will do so.",
      ],
    },
    {
      heading: "Disclaimers and limitation of liability",
      paragraphs: [
        "The service is provided “as is” and “as available”. To the extent the law allows, we aren't liable for indirect or consequential losses, and our total liability is limited to the amount you paid us in the three months before the claim. Nothing in these terms limits rights you have under consumer-protection law that can't be waived.",
      ],
    },
    {
      heading: "Governing law",
      paragraphs: [
        "These terms are governed by the laws of {{governingLaw}}, without affecting mandatory consumer protections where you live.",
      ],
    },
    {
      heading: "Changes and contact",
      paragraphs: [
        "If we make material changes, we'll tell you in your dashboard before they take effect. How we handle personal data is explained in our [Privacy Policy](/privacy-policy). Questions: {{supportEmail}} or the [contact page](/contact). {{entityName}}, {{entityAddress}}.",
      ],
    },
  ],
};

export const refundPolicy: LegalDoc = {
  slug: "refund-policy",
  title: "Refund Policy",
  metaTitle: "Refund Policy: Apollo Group TV Refund Window and Process",
  description:
    "When Apollo Group TV packs can be refunded, how to request a refund, how long it takes, and what to do about payment problems.",
  intro:
    "This page is the only place our refund rules are set. If a different refund promise appears anywhere else, including on other websites with a similar name, this page is the one that applies to your account here.",
  sections: [
    // The refund window and the owner's eligibility conditions are rendered by the page (see refund-policy/page.tsx).
    {
      heading: "How to request a refund",
      list: [
        "Open a support ticket from your dashboard with the subject “Refund request”, within the refund window.",
        "Include the email on your account, your order number (the payment reference shown in Transactions) and the date your pack was activated.",
        "Tell us briefly why you're asking. If something isn't working, we may first offer to fix it.",
      ],
    },
    {
      heading: "What happens next",
      paragraphs: [
        "We review each request individually, reply with our decision in the same ticket and notify you when we do. If the refund is approved, the pack it covers is deactivated and the refund is recorded in your Transactions.",
      ],
    },
    {
      heading: "How refunds are paid",
      paragraphs: [
        "Approved refunds go back through the method you paid with wherever possible. Processing times depend on that payment provider or your bank, and we'll tell you in the ticket what to expect.",
      ],
    },
    {
      heading: "Cancelling a pack",
      paragraphs: [
        "Packs are one-time payments and never renew, so there is nothing to cancel to avoid future charges. Your access simply ends on the date shown in Plans & Billing.",
      ],
    },
    {
      heading: "Payment problems",
      list: [
        "**Charged twice or the wrong amount:** open a ticket with both payment references and we'll investigate and correct it.",
        "**Paid but not activated:** send the payment reference in your activation ticket. We'll check and activate the pack or explain what's missing.",
        "**A payment you don't recognise:** contact us before disputing it with your bank, so we can check it quickly.",
      ],
    },
    {
      heading: "Questions",
      paragraphs: [
        "Write to {{supportEmail}} or use the [contact page](/contact). Pack prices and lengths are on the [Plans page](/plans).",
      ],
    },
  ],
};

export const dmcaPolicy: LegalDoc = {
  slug: "dmca",
  title: "Copyright and DMCA Policy",
  metaTitle: "Copyright and DMCA Policy — Apollo Group TV",
  description:
    "How rights holders report suspected copyright infringement to Apollo Group TV, what a valid notice and counter-notice must contain, and what happens next.",
  intro:
    "Apollo Group TV respects intellectual property and our policy is to list only content we're authorized to provide. If you own the rights to material that you believe is available through the service without permission, use the process below. It follows the US Digital Millennium Copyright Act, and we accept notices from rights holders in any country.",
  sections: [
    {
      heading: "What a notice must include",
      list: [
        "Your physical or electronic signature, as the rights owner or someone authorized to act for them.",
        "Identification of the copyrighted work you believe is infringed.",
        "Identification of the material you want removed, with enough detail for us to find it, such as the channel name and category.",
        "Your name, postal address, telephone number and email address.",
        "A statement that you believe in good faith that the use isn't authorized by the copyright owner, its agent or the law.",
        "A statement that the information in the notice is accurate and, under penalty of perjury, that you're authorized to act for the owner.",
      ],
    },
    {
      heading: "Where to send it",
      paragraphs: [
        "Designated agent: {{dmcaAgentName}}. Email: {{dmcaAgentEmail}}. Postal address: {{dmcaAgentAddress}}.",
      ],
    },
    {
      heading: "What happens next",
      paragraphs: [
        "We review complete notices promptly and remove or disable access to the material where appropriate. We may share the notice with the party that supplied the material. Incomplete notices can delay action, and we'll tell you what's missing.",
      ],
    },
    {
      heading: "Counter-notices",
      paragraphs: [
        "If material you supplied was removed and you believe that was a mistake or misidentification, you can send a counter-notice to the same agent containing:",
      ],
      list: [
        "Your physical or electronic signature, name, address and telephone number.",
        "Identification of the material that was removed and where it appeared before removal.",
        "A statement under penalty of perjury that you believe in good faith it was removed by mistake or misidentification.",
        "Your consent to the jurisdiction of the appropriate court and to accept service from the person who sent the original notice.",
      ],
    },
    {
      heading: "Repeat infringers",
      paragraphs: [
        "We may suspend or close the accounts of users or suppliers who repeatedly infringe copyright.",
      ],
    },
    {
      heading: "Misrepresentation",
      paragraphs: [
        "Knowingly claiming that material infringes, or that it was removed by mistake, can create legal liability. If you're unsure whether material infringes your rights, consult a lawyer first. Our general explanation of [how IPTV and content rights relate](/is-apollo-group-tv-legal) may also help.",
      ],
    },
  ],
};

export const disclaimer: LegalDoc = {
  slug: "disclaimer",
  title: "Disclaimer",
  metaTitle: "Disclaimer — Apollo Group TV",
  description:
    "The limits of the information on the Apollo Group TV website: general guidance, sourced comparisons, trademarks, external links and service availability.",
  intro:
    "This disclaimer explains how to read the information published on {{officialDomain}}, operated by {{entityName}}. It applies to every page, guide, article and comparison on the site, alongside our [Terms and Conditions](/terms-and-conditions), which govern your use of the service itself.",
  sections: [
    {
      heading: "General information only",
      paragraphs: [
        "Our guides, articles, comparisons and help pages are written to help you understand and use the service. We check them carefully and update them when things change, but they're general information. Devices, apps, prices and third-party services change without notice, so some details may be out of date by the time you read them.",
      ],
    },
    {
      heading: "Not legal, financial or professional advice",
      paragraphs: [
        "Nothing on this website is legal, financial, tax or other professional advice. Pages that discuss topics such as IPTV and content licensing, VPNs or payment methods explain them in general terms. If you need advice about your own situation, consult a qualified professional where you live.",
      ],
    },
    {
      heading: "Content and licensing",
      paragraphs: [
        "Our policy is to list only authorized, properly licensed content. Channel availability depends on rights, which vary by region and change over time, and individual programmes and events can move between channels. If you're a rights holder and believe material is available without permission, please use our [copyright and DMCA process](/dmca).",
      ],
    },
    {
      heading: "Comparisons and third-party prices",
      paragraphs: [
        "Our comparison pages describe other services using information those services publish, such as their official pricing pages, with the source and the date we checked it shown on each page. We compare regular prices before taxes, fees and promotions unless a page says otherwise. Other companies can change their prices, plans and features at any time, so check their websites for current details before deciding. Comparisons reflect our own assessment and are not statements by the companies compared.",
      ],
    },
    {
      heading: "Trademarks and no affiliation",
      paragraphs: [
        "Names and logos of other companies and products that appear on this site, including streaming services, device makers and app stores, are trademarks of their respective owners. We use them only to identify those products, for example to describe compatibility or to make a comparison. Their use doesn't mean those companies endorse, sponsor or are affiliated with Apollo Group TV.",
      ],
    },
    {
      heading: "Links to other websites",
      paragraphs: [
        "We link to other websites, such as device makers' support pages and official documentation, because they help explain a topic. We don't control those sites and aren't responsible for their content, availability or privacy practices. A link isn't an endorsement.",
      ],
    },
    {
      heading: "Devices, apps and compatibility",
      paragraphs: [
        "The devices listed on our [app page](/app) are the ones we've verified. Manufacturers update their systems and stores, and those updates can affect whether or how an app installs, as with Fire TV models that run Vega OS. Settings menus differ between brands and versions, so the steps in our guides may look slightly different on your device.",
      ],
    },
    {
      heading: "Service availability",
      paragraphs: [
        "Streaming depends on many things outside our control, including your internet connection, home network, device and the networks between us and you. We work to keep the service running smoothly but can't promise that it will be uninterrupted or error-free at all times. The [Terms and Conditions](/terms-and-conditions) set out what applies to your subscription, and the [Refund Policy](/refund-policy) explains how refund requests are handled.",
      ],
    },
    {
      heading: "Our official website",
      paragraphs: [
        "Our only official website is {{officialDomain}}. Other sites that use the Apollo name, copy our content or ask you to pay outside the invoice in your own account aren't operated by us, and we can't be responsible for them. Our guide to the [official Apollo Group TV website](/blog/apollo-group-tv-official-website) explains how to tell the difference.",
      ],
    },
    {
      heading: "Changes to this disclaimer",
      paragraphs: [
        "We may update this disclaimer as the website and service change. The date at the top of this page shows when it was last updated.",
      ],
    },
    {
      heading: "Contact",
      paragraphs: [
        "If you spot something on the site that's out of date or incorrect, please tell us at {{supportEmail}} or through our [contact page](/contact).",
      ],
    },
  ],
};

export const legalDocs = [
  privacyPolicy,
  termsAndConditions,
  refundPolicy,
  dmcaPolicy,
  disclaimer,
];
