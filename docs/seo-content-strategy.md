# Apollo Group TV — content audit and SEO strategy (2026-11-03)

Scope: every public page. Source of truth for facts is the codebase and Admin → Settings; nothing in this
plan relies on information the owner hasn't supplied. Items marked **OWNER** need business input.

## 1. Audit summary (before this pass)

| Page | Words | Main problems found |
|---|---|---|
| `/product` | 558 | Mockup shows "Quarterly · Renews in 54 days" (packs never renew); says plans differ by features (all identical); describes a public channel search that no longer exists; FAQ contradicts pricing |
| `/about-us` | 500 | Generic mission copy, a navigation block posing as content, negation lists; title only 21 chars |
| `/is-apollo-group-tv-legal` | 472 | Good and balanced; needs polish and Article markup |
| `/privacy-policy` | 596 | Missing player logins (encrypted), staff audit records, referral claims, third-party apps (UHF, Downloader), the Apollo TV app's own data practices, legal bases, transfers |
| `/terms-and-conditions` | 428 | Missing one-time packs / no renewal, activation, availability, device limits, player-login sharing, third-party apps, VPN rule, referral rules; description 84 chars |
| `/refund-policy` | 220 | Thin; no window, timing, payment-problem process or cancellation explanation |
| `/dmca` | 360 | No repeat-infringer policy, counter-notice requirements as a list, scope |
| `/contact`, `/refer-a-friend` | ~300 | Short, generic titles (31–32 chars) |
| `/app`, `/plans`, `/channels`, `/faq`, guides | — | Descriptions over 160 chars; only breadcrumb structured data |

Technical baseline was already sound: 200s, one H1 per page, canonicals, OG tags, sitemap, robots.txt,
no broken internal links. Legal pages are intentionally `noindex` until the owner approves them.

## 2. Page strategy

| Page | Primary keyword | Secondary | Intent | Title | Structured data |
|---|---|---|---|---|---|
| `/` | apollo group tv | apollo tv, apollo tv subscription | Navigational / commercial | Apollo Group TV (Apollo TV): Live TV & On-Demand Streaming | Organization, WebSite |
| `/product` | apollo group tv features | apollo tv service, how apollo tv works | Commercial investigation | Apollo Group TV Features: App, Account Dashboard & Support | Breadcrumb |
| `/app` | apollo tv app | apollo group tv app download, devices | Navigational / how-to | Apollo Group TV App: Devices, Install Guide & Features | SoftwareApplication, Breadcrumb |
| `/plans` | apollo group tv plans | apollo tv price, subscription cost | Transactional | Apollo Group TV Plans & Pricing: One-Time Packs Compared | Service + Offers (live prices), Breadcrumb |
| `/channels` | apollo group tv channels | apollo tv channel list, sports channels | Informational | Apollo Group TV Channels: Live TV Categories & Lineup Guide | Breadcrumb |
| `/guides` + device guides | install apollo tv on [device] | apollo group tv firestick, downloader | How-to | Install Apollo Group TV on [Device]: … Guide | Breadcrumb |
| `/faq` | apollo group tv faq | apollo tv questions | Informational | Apollo Group TV FAQ: Plans, Setup, Channels & Support | FAQPage, Breadcrumb |
| `/is-apollo-group-tv-legal` | is apollo group tv legal | is apollo tv legit, iptv legal | Informational / trust | Is Apollo Group TV Legal? IPTV, Licensing and Your Rights | Article, Breadcrumb |
| `/about-us` | about apollo group tv | apollo tv company | Navigational / trust | About Apollo Group TV: How We Run the Service | AboutPage, Breadcrumb |
| `/contact` | apollo group tv support | apollo tv contact, customer service | Support | Contact Apollo Group TV Support: Tickets, Billing & Setup Help | ContactPage, Breadcrumb |
| `/reviews` | apollo group tv reviews | apollo tv review | Commercial investigation | Apollo Group TV Reviews from Registered Customers | Breadcrumb (no self-serving review markup) |
| `/refer-a-friend` | apollo group tv referral | refer a friend | Transactional | Apollo Group TV Referral Program: Invite Friends | Breadcrumb |
| Legal pages | — | — | Trust | [Policy] — Apollo Group TV | Breadcrumb; noindex until approved |

## 3. Internal linking plan

Plans → Product, App, Refund Policy · Product → App, Plans, Channels, Guides · App → device guides, Contact ·
Channels → Product, Plans · Guides → Contact, troubleshooting · Privacy ↔ Terms · Refund → Contact, Plans ·
About → Product, Is It Legal · Refer a Friend → Plans · Is It Legal → DMCA, Terms.

## 4. OWNER — information needed before launch

- Legal entity name, registered address, governing law and venue.
- Support email (and phone/hours if offered) — only shown once set.
- DMCA designated agent name, email and postal address (and US Copyright Office registration if serving the US).
- Refund eligibility conditions and exclusions (the 7-day window is set; the conditions are not).
- What data the Apollo TV app itself collects (it isn't part of this codebase).
- Hosting location (for the international-transfer clause) and age threshold.
- Official domain; confirmation that download links and the player server belong to the business.
- Payment methods actually accepted.
