# Reference site audit: apollogrouptvs.com

**Date:** 2026-11-02
**Method:** Headless Microsoft Edge (Playwright), desktop 1366×900 and mobile 375×812. Collected per page: title, meta description, canonical, robots, `lang`, heading outline, navigation and footer links, CTA labels, structured-data types and word count.
**Scope rule:** This audit records **structure only**. No body copy, FAQs, testimonials, prices or images were copied into the Apollo Group TV project. Prices and figures are quoted below only to show which claims the reference makes. They are not used anywhere in our site.

## Pages inspected (21, all HTTP 200)

| Path | Purpose / intent | H1 (paraphrased) | Section sequence (H2s, paraphrased) | Main CTAs | Structured data |
|---|---|---|---|---|---|
| `/tv/` (home) | Brand / commercial | Brand + "streaming service for live TV, sports & 4K" | What it is → built for how you watch → plans & pricing → vs cable → live sports → reviews → 24/7 support → FAQ → final CTA | Start watching, Subscribe, See how it works, plan-duration buttons | Organization, EntertainmentBusiness, WebSite, WebPage, BreadcrumbList |
| `/plans/` | Commercial / pricing | Pricing & plans | Plans → "no tier gates" → card or crypto payment → pre-purchase questions → pick a plan | Plan buttons, Subscribe, inline FAQ toggles | Product, BreadcrumbList |
| `/app/` | App / navigational | One app for every screen | Differentiators → library → networks → mobile layout → preview → device list → requirements → device guides → app FAQ → try it | Start watching, See plans | SoftwareApplication, BreadcrumbList |
| `/channels/` | Informational / catalog | Channel lineup | How the lineup works → by category → by region → CTA | See pricing | CollectionPage |
| `/reviews/` | Trust | Reviews | What customers say → "risk-free" CTA | See pricing | Article, Person |
| `/faq/` | Support | Frequently asked | Cost & renewal → device install → content → app behaviour → account & security → refunds → troubleshooting → still stuck | Accordion questions | **FAQPage** |
| `/about/` | Trust | About | What we do → differentiators → by the numbers → company details → help → policies → CTA | Start watching | AboutPage |
| `/ClientPortal` | Account | Client portal (sign-in form) | — | Sign in, Forgot password | none (`noindex`) |
| `/signup` | Account | Create account | — | Sign up | none (`noindex`) |
| `/referral/` | Referral | "Send to a friend, get a free month" | How it works → fine print → not a subscriber | Get my referral link | BreadcrumbList |
| `/contact-support/` | Support | Contact & support | How to reach us → specialized contacts | — | ContactPage |
| `/legal/` | Trust / informational | Is it legal? | What "legal IPTV" means → vs pirate services → legal for viewers → by country → rumours → FAQ | — | Article, Person |
| `/privacy-policy/` | Legal | Privacy Policy | 14 numbered sections (collection, use, disclosure, cookies, analytics, protection, retention, rights, California, children…) | — | WebPage |
| `/terms-and-conditions/` | Legal | Terms & Conditions | Definitions → acknowledgment → links → termination → liability → as-is → governing law → disputes… | — | WebPage |
| `/refund-policy/` | Legal | Refund Policy | Overview → eligibility period → conditions → non-refundable → cancellation → contact → amendments | — | WebPage |
| `/dmca-disclaimer/` | Legal | DMCA Disclaimer | Content disclaimer → OSP role → claims procedure → contact → misrepresentation | — | WebPage |
| `/firestick/` | How-to | Install on Firestick | Needs → developer mode → Downloader → **downloader code** → APK install → sign in → troubleshooting → tips → FAQ → related | — | Article |
| `/android-tv/` | How-to | Install on Android TV | Same sideloading flow as Firestick + device notes | — | Article |
| `/guides/` | How-to (payments) | Pay with crypto | Pay invoice → buy Bitcoin with… → subscribe | See pricing | WebPage |
| `/guides/how-to-buy-bitcoin-with-moonpay/` | How-to (payments) | Buy Bitcoin with MoonPay | Needs → steps → next → FAQ → other guides | Subscribe | Article |
| `/blog/` | Content hub | Reviews & guides | Featured review → more articles → CTA | — | WebPage |

**Navigation:** Home, App, Plans, Blog, Reviews, FAQ, Sign in, "Start Watching" (→ plans).
**Footer:** social (X, Telegram, Reddit) · Product (App, Plans, Channels, Reviews, Refer, FAQ) · Account (Client Portal, Sign in, Create account) · Help (About, Firestick setup, Android TV guide, Contact, Is it legal?) · Legal (Privacy, Terms, Refund, DMCA, Site index).
**Mobile (375px):** No horizontal overflow on any of the seven primary pages.
**Technical SEO:** Self-referencing canonicals, `index, follow` on public pages, `noindex` on account pages, `lang="en"`, breadcrumbs on every content page.

## Patterns worth adopting (structure only)

1. One distinct search intent per page (pricing, app, catalog, trust, support, legal), each with its own H1.
2. Breadcrumbs plus BreadcrumbList on content pages.
3. Device guides as standalone pages with a fixed outline: requirements → steps → troubleshooting → FAQ → related guides.
4. Help, legal and account destinations grouped clearly in the footer.
5. A short in-page FAQ on commercial pages, answering pre-purchase objections.
6. A dedicated legality explainer page, which matches a real query people search for.

## Patterns deliberately **not** adopted

| Reference pattern | Why we don't use it |
|---|---|
| Headline figures (channel and title counts, subscriber counts, "45+ countries") | Not verifiable for this project. We only show counts computed from our own database. |
| "#1 streaming service", "vs cable" comparisons | Unsupported superlatives and competitor comparisons. |
| Fixed money-back window in titles and descriptions | No approved refund rule has been supplied. The refund page is a marked draft. |
| Legality page asserting the service is licensed in many countries | We can't verify licensing. Our page explains technology vs. distribution rights and makes no blanket claim. |
| Sideloading guides with "downloader codes" and APK installs | No verified app, package or download source exists. Device guides publish only for platforms an admin marks as verified, with official links. |
| Crypto payment guides | Not part of this project's payment plan (no provider integrated). |
| Article and Person schema on marketing pages, FAQPage schema | Person and Article are inaccurate for marketing pages. FAQ rich results are limited to authoritative government and health sites, so the markup adds no eligibility (see `seo-metadata-map.md`). |

## Limitations

- Content behind sign-in (the client portal after login) was not accessible.
- `/sitemap/` (HTML site index) and individual blog articles were not inspected.
- The audit is a snapshot from 2026-11-02. The reference site may change.
- Search research (brand SERP sampling) found many lookalike domains, press-release spam and conflicting claims for the same brand name, such as three different refund windows. This shapes our strategy: be consistent and verifiable (see `seo-keyword-map.md`).
