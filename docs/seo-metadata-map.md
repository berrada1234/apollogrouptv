# SEO metadata map (as implemented)

Canonicals are generated from `NEXT_PUBLIC_SITE_URL` through `metadataBase` in `src/app/layout.tsx`. The language is `en` (`<html lang="en">`, `og:locale` `en_US`). Every public page has a unique title and description (both checked automatically, see QA below). The default social image comes from `src/app/opengraph-image.tsx`.

| URL | Title tag | Meta description | H1 | Indexing | Structured data |
|---|---|---|---|---|---|
| `/` | Apollo Group TV — Live TV & On-Demand Streaming Plans | Apollo Group TV (Apollo TV) brings live channels and on-demand viewing together: clear subscription plans and pricing, verified device setup and real support. | Apollo Group TV: Live TV and On-Demand Streaming, Made Simple | index | Organization, WebSite (`alternateName: Apollo TV`) |
| `/product` | Apollo Group TV Features — How the Service Works | See what Apollo Group TV includes: an organized channel catalog, a self-service account dashboard, ticket support and setup help for verified devices. | Apollo Group TV features, explained | index | BreadcrumbList |
| `/app` | Apollo Group TV App — Devices, Setup & Troubleshooting | How to get the Apollo Group TV app: verified devices, official download links, installation steps and fixes for common sign-in and playback problems. | The Apollo Group TV app | index | BreadcrumbList |
| `/plans` | Apollo Group TV Plans & Pricing | Compare Apollo Group TV plans side by side: price, billing period and what each includes. See how activation and billing work before you sign up. | Apollo Group TV plans and pricing | index | BreadcrumbList |
| `/channels` | Apollo Group TV Channel Guide — Search by Category | Search the Apollo Group TV channel guide by name or browse by category. The catalog lists only authorized, properly licensed content. | Apollo Group TV channel guide | index | BreadcrumbList |
| `/reviews` | Apollo Group TV Reviews — Moderated Customer Feedback | Read moderated Apollo Group TV reviews from registered customers, see how verification works, and share your own experience. | Apollo Group TV reviews | index | BreadcrumbList (**no** AggregateRating) |
| `/refer-a-friend` | Apollo Group TV Referral Program | How the Apollo Group TV referral program works: get a personal link, track sign-ups in your dashboard, and read the program terms. | The Apollo Group TV referral program | index | BreadcrumbList |
| `/faq` | Apollo Group TV FAQ — Plans, Devices, Account & Billing | Answers to common Apollo Group TV questions about plans, devices, sign-in, installation, billing, refunds, privacy and copyright. | Apollo Group TV FAQ | index | BreadcrumbList |
| `/about-us` | About Apollo Group TV | Who Apollo Group TV is for, how the service approaches transparency and support, and where to find plans, policies and help. | About Apollo Group TV | index | BreadcrumbList |
| `/contact` | Contact Apollo Group TV Support | Contact Apollo Group TV: send a message, open a support ticket from your account, or find setup and billing help in our guides and FAQ. | Contact Apollo Group TV | index | BreadcrumbList |
| `/guides` | Apollo Group TV Setup Guides — Devices & Account Help | Step-by-step Apollo Group TV guides for verified devices, account setup and troubleshooting, kept in one place and updated as devices are verified. | Setup guides | index | BreadcrumbList |
| `/guides/account-setup` | Create Your Apollo Group TV Account — Step-by-Step | Set up your Apollo Group TV account in a few minutes: sign up, verify your email, choose a plan and get ready to install the app. | Create and verify your Apollo Group TV account | index | BreadcrumbList |
| `/guides/troubleshooting` | Apollo Group TV Troubleshooting — Sign-In & Playback Fixes | Fix common Apollo Group TV problems: sign-in errors, buffering, outdated apps and device issues, with a checklist to try before contacting support. | Troubleshooting sign-in and playback | index | BreadcrumbList |
| `/guides/[device]` | Set Up Apollo Group TV on {Device} — Step-by-Step | Install Apollo Group TV on {Device} using the official download link, then sign in. Includes requirements, numbered steps and troubleshooting. | Set up Apollo Group TV on {Device} | index, **only for admin-verified devices**; others return 404 | BreadcrumbList |
| `/is-apollo-group-tv-legal` | Is Apollo Group TV Legal? Technology vs. Content Rights | How IPTV technology differs from the rights needed to distribute content, what to check before subscribing to any streaming service, and where our policies live. | Is Apollo Group TV legal? | index | BreadcrumbList |
| `/privacy-policy` | Privacy Policy — Apollo Group TV | How Apollo Group TV collects, uses and protects personal data across the website and account dashboard, and the choices you have. | Privacy Policy | **noindex until approved** | BreadcrumbList |
| `/terms-and-conditions` | Terms and Conditions — Apollo Group TV | The terms that apply to Apollo Group TV accounts, plans, acceptable use and support. *(short; expand once approved)* | Terms and Conditions | **noindex until approved** | BreadcrumbList |
| `/refund-policy` | Refund Policy — Apollo Group TV | How refund requests work for Apollo Group TV plans and how to contact us about billing. | Refund Policy | **noindex until approved** | BreadcrumbList |
| `/dmca` | Copyright and DMCA Policy — Apollo Group TV | How to report suspected copyright infringement to Apollo Group TV and what a valid notice must include. | Copyright and DMCA Policy | **noindex until approved** | BreadcrumbList |

**Private routes** (`/dashboard/*`, `/admin/*`, `/account`, `/client-portal`, `/sign-in`, `/create-account`, password and verification pages) send `X-Robots-Tag: noindex, nofollow`, carry `robots` metadata, are disallowed in `robots.txt` and are excluded from the sitemap. **Access control is enforced separately on the server.** Indexing directives are not relied on for security.

## Redirects (308, permanent)

`/terms` → `/terms-and-conditions` · `/privacy` → `/privacy-policy` · `/about` → `/about-us` · `/support` → `/contact` · `/legal` → `/is-apollo-group-tv-legal` · `/pricing` → `/plans` · `/referral` → `/refer-a-friend` · `/login`, `/signin` → `/sign-in` · `/register`, `/signup` → `/create-account`.

## Structured data decisions

- **Used:** Organization (name, URL, logo, and contactPoint only when a support email is configured), WebSite, and BreadcrumbList on content pages.
- **Not used:** AggregateRating and Review (self-serving reviews are not eligible, and none may be fabricated), Product with price (prices change in the database, so add it only alongside a live checkout), FAQPage (Google limits FAQ rich results to authoritative government and health sites), and Person or Article on marketing pages (inaccurate).
- **Validation:** the JSON-LD is generated from code and confirmed to serialize. Run the public URL through Google's Rich Results Test after deployment. That external check has **not** been done.

## QA performed (2026-11-02, local production build)

An automated crawl (Playwright and Edge) of all 18 public pages: HTTP 200, exactly one H1, `lang=en`, self-canonical, descriptions 70–170 characters, `og:title` present, every `<img>` has alt text, no heading-level skips, drafts noindex and others indexable, unique titles and descriptions, every internal link resolves (no 404s and no unnecessary redirect hops), redirects return 308 to the correct target, private routes redirect anonymous visitors to sign-in, the sitemap includes new pages and excludes drafts and private routes, an unknown guide returns 404, and the contact form submits (saved row confirmed in the database) and shows validation errors. **Result: 180/180 checks passed.**

## Homepage H2 outline (search intent → section)

| H2 | Intent |
|---|---|
| What Is Apollo Group TV? | Informational: what it is, brand disambiguation (Apollo TV) |
| Apollo Group TV Features That Make Streaming Simpler | Commercial investigation |
| How Apollo TV Works in Four Simple Steps | Informational: how it works |
| Apollo Group TV Subscription Plans & Pricing | Transactional: price, plans |
| What Can You Watch on Apollo Group TV? | Informational: channels, live vs on-demand |
| Apollo TV App: Supported Devices and Installation | Navigational / how-to: app, devices |
| What You Need to Start Streaming with Apollo TV | Informational: requirements |
| Is Apollo Group TV Legal and Safe to Use? | Trust / safety |
| Why Choose Apollo Group TV? | Commercial investigation |
| Apollo Group TV Reviews from Real Customers | Trust: reviews |
| Apollo TV Customer Support and Account Help | Support: contact, login help |
| Share Apollo Group TV with Friends | Transactional: referral |
| Apollo Group TV FAQ: Quick Answers to Common Questions | Informational: price, trial, devices, install, multi-device, channels, payment, cancel, legal, support, official site, password |
| Start Watching with Apollo Group TV | Conversion |

Each section has an original SVG illustration in `public/images/home/` with a descriptive, keyword-aware file name and alt text. Regenerate them with `node scripts/generate-home-illustrations.mjs`. Homepage copy lives in `src/content/home.ts`.
