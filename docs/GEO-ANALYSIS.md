# GEO analysis: apollogroupr.tv (November 2026)

Google's own guidance is that optimizing for AI search is still SEO, so this report treats GEO as SEO fundamentals applied to AI answer surfaces. **Verified** means checked on the live site or in the code on 4 November 2026. **Assumption** means not measurable without a tool or account that isn't connected (Search Console, Bing Webmaster Tools, an AI-visibility tracker).

## GEO readiness score: 68 / 100 (after this round's changes)

| Area (weight) | Score | Basis |
|---|---|---|
| Citability (25) | 19 | Every article now opens with a self-contained quick answer; 4 more had a "short answer" section already. No original data yet. |
| Structure (20) | 18 | One H1 per page, clean H2/H3, tables and lists throughout, FAQ sections on all articles (from the SEO audit). |
| Multi-modal (15) | 5 | Text, tables and generated covers only. No video, screenshots or diagrams. |
| Authority & brand (20) | 9 | Consistent business facts, dated articles with real `dateModified`, official sources cited. No named author, no reviews, no off-site brand presence verified. |
| Technical access (20) | 17 | Server-rendered HTML, AI search crawlers allowed, sitemap, canonical, linked entity schema. Two items need confirming (see below). |

Platform scores aren't given: no AI-visibility tool (DataForSEO, SE Ranking, Profound) is connected, so citation rates in Google AI Overviews, AI Mode, ChatGPT or Perplexity weren't measured.

## AI crawler access (verified, robots.txt and live requests)

robots.txt allows all user agents on public pages (`User-Agent: * / Allow: /`) and blocks only private areas (dashboard, admin, sign-in flows, API). No AI crawler is named, so all follow the `*` rule.

| User agent | Governs | robots.txt | Live request from our IP |
|---|---|---|---|
| Googlebot | Google Search, AI Overviews, AI Mode | Allowed | 403 (see note) |
| Google-Extended | Gemini/Vertex training and grounding only, not Search | Allowed | not a crawler |
| Bingbot | Bing, Microsoft Copilot | Allowed | 403 (see note) |
| OAI-SearchBot | ChatGPT Search citations | Allowed | 200 |
| GPTBot | OpenAI model training only | Allowed | 200 |
| PerplexityBot | Perplexity answers | Allowed | 200 |
| Claude-SearchBot | Claude search citations | Allowed | 200 |
| ClaudeBot | Anthropic model training only | Allowed | not tested |
| Applebot / Applebot-Extended | Siri/Spotlight search / Apple Intelligence training opt-out | Allowed | not tested |

**Note on the 403s:** Hostinger's CDN (`Server: hcdn`) returns 403 to requests that claim to be Googlebot or Bingbot but don't come from Google's or Microsoft's IP ranges. That is fake-bot protection, and genuine crawlers should pass. **Confirm** with URL Inspection in Google Search Console and the URL inspection tool in Bing Webmaster Tools; if either reports "blocked", ask Hostinger support to allow verified search crawlers.

Training crawlers (GPTBot, ClaudeBot, Google-Extended, CCBot) are a licensing choice, not a visibility one. They're currently allowed; block them in robots.txt only if you don't want the content used for model training. That won't affect search citations.

## llms.txt

Added at `/llms.txt` (key facts, main pages, every article). Google states it doesn't use this file and that it neither helps nor hurts rankings; some other AI tools may read it. It's maintained automatically from the article list.

## Server-side rendering (verified)

Raw HTML fetched without JavaScript, as OAI-SearchBot and PerplexityBot see it, contains the full article text, the homepage definition ("Apollo Group TV, often shortened to Apollo TV, is an internet TV service…") and the FAQ answers. The leftover client loading screen on /channels was removed in the SEO audit. No key content depends on JavaScript.

## Brand presence and the competitive picture (verified by web search, 4 Nov 2026)

What AI tools currently learn about "Apollo Group TV" comes mostly from:

- **Press-release and affiliate pages** (Newswire, AccessNewswire, Barchart, TechBullion, local news "sponsored" posts) making unverified claims such as "8K", "100K channels", "lifetime plans" and "Netflix integration", with prices and channel counts that contradict each other.
- **Lookalike domains** (apollogroup.tv, apollogroup.cc, apollogroupstv.co, apollotvsgroup.com) and Trustpilot pages for those domains.

AI summaries built from these sources come out inconsistent and cautious. That's the opportunity: a site that states the same facts the same way everywhere, answers questions directly and cites official sources is the most dependable source available. The Netflix article, for example, directly answers the "does it include Netflix" question that the press releases get wrong.

Not verified: presence on Wikipedia/Wikidata, Reddit, YouTube or LinkedIn under this brand. No official social profiles are set in Admin → Settings → Social, so `sameAs` is empty.

## Changes made in this round

1. **Quick answer on all 24 articles.** A 2–4 sentence, self-contained answer to the article's main question sits at the top of each article, above the cover image. Every answer restates the article's own content; no new claims.
2. **Real modification dates.** Articles carry an `updated` date when their content changes; it appears as "Updated <date>" and feeds `dateModified` (previously always equal to the publish date). Four articles were dated in the future (5 Nov); now 4 Nov.
3. **Linked entities.** The Organization now has an `@id`, `alternateName` ("Apollo TV") and description, and is referenced as publisher from the WebSite and every BlogPosting, so search systems can connect the brand, the site and its articles. `sameAs` is added automatically once official social profiles are entered in Admin.
4. **IndexNow.** Key file published and `npm run indexnow` submits every sitemap URL to IndexNow (Bing, Yandex and others), so Bing and Copilot learn about new or changed pages within minutes instead of waiting for a recrawl.
5. **llms.txt** (see above).

## Structured data status

| Type | Where | Status |
|---|---|---|
| Organization + WebSite | Home | Linked with @id; address and support email from settings |
| BreadcrumbList | Every page | Valid |
| BlogPosting | Articles | datePublished, dateModified, publisher @id, image, keywords |
| Article | Legal page | Valid |
| Service + Offer | Plans | Prices from the database |
| SoftwareApplication | App page | Valid |
| HowTo | Renewal | Valid; Google retired HowTo rich results in 2023, harmless |
| FAQPage | Several pages | Matches visible Q&A; Google shows FAQ rich results only for government and health sites |
| Person | none | Needs a real named author (see plan) |
| Review / AggregateRating | none | Correctly absent: no published reviews to mark up |
| LocalBusiness | none | Not appropriate unless customers visit a real premises |

## Prioritized action plan

**Critical**
- Verify the site in **Google Search Console** and **Bing Webmaster Tools**, submit the sitemap, and run URL Inspection on the homepage in both to confirm the crawlers aren't blocked by the CDN.
- Fix the **three installer downloads that return 404** (from the SEO audit); answer engines send users to pages whose main action is broken.

**High**
- **Run `npm run indexnow`** after each deploy that adds or changes pages.
- **Name a real author or reviewer** with relevant experience (an About-the-author box plus Person schema). Anonymous "editorial team" content is weaker for experience and expertise signals.
- **Official brand profiles:** create YouTube (setup videos per device) and other official profiles, enter them in Admin → Settings → Social so they appear in `sameAs`. YouTube mentions correlate strongly with AI citations in third-party studies (Ahrefs, Dec 2025); treat that as a correlation, not a guarantee.
- **Collect genuine reviews** on the site, and only then consider review markup.

**Medium**
- **Screenshots and short videos** in the device guides (alt text, captions). They help readers and multi-modal answers.
- **A facts page or section** ("Apollo Group TV: key facts") linking to the official domain, billing model, devices, and what isn't included, to give answer engines one consistent reference against the conflicting press releases.
- **Refresh schedule:** review each article every 3 months, update facts, and bump `updated`. Third-party studies (SE Ranking) associate recent updates with more AI citations.

**Low**
- Decide whether to block training-only crawlers (GPTBot, ClaudeBot, Google-Extended, CCBot) on licensing grounds; this doesn't change search visibility.
- Add RSL licensing terms if you want machine-readable reuse terms.

## Question-style queries the site now answers directly

| Intent | Question | Page |
|---|---|---|
| Informational | What is Apollo Group TV? | Home ("What Is Apollo Group TV?") |
| Informational | What is IPTV? | /blog/what-is-iptv |
| Commercial | Is Apollo Group TV legit / the official site? | /blog/apollo-group-tv-official-website |
| Commercial | Is Apollo Group TV legal? | /is-apollo-group-tv-legal |
| Commercial | Does Apollo Group TV include Netflix? | /blog/apollo-group-tv-netflix |
| Transactional | How much does Apollo Group TV cost? | /plans |
| Transactional | How do I renew Apollo Group TV? | /apollo-group-tv-renewal |
| Navigational | How do I install Apollo TV on Firestick? | /guides/fire-tv-android-tv, /blog/apollo-tv-downloader-code |
| Support | Does it work on Roku / Samsung / Google TV? | the three device articles |
| Support | Is Apollo TV down? Status code 404? | /blog/is-apollo-tv-down, /blog/apollo-group-tv-status-code-404 |

Gaps worth writing next (check against the reserved-keyword list first): a channel-guide/EPG explainer, a "how many devices / screens" pack comparison if the connection limit differs by pack, and a setup video page per device.

## KPIs

Measured (once connected):

| KPI | Source |
|---|---|
| Impressions, clicks, CTR, average position for brand and question queries | Google Search Console, Bing Webmaster Tools |
| Indexed pages vs sitemap (64) | Search Console Page indexing report |
| AI referral sessions (chatgpt.com, perplexity.ai, copilot.microsoft.com, gemini.google.com) | Google Analytics 4 referrals |
| Organic conversions (account created, invoice paid) | GA4 events |
| IndexNow submissions accepted | `npm run indexnow` output, Bing Webmaster Tools |

Estimated (manual or with a paid tracker):

| KPI | Method |
|---|---|
| Brand mentioned or site cited in AI answers | Ask the same 20 questions monthly in ChatGPT, Perplexity, Gemini, Copilot and Google AI Mode; record whether apollogroupr.tv is cited |
| Accuracy of AI answers about the brand | Same monthly check: does the answer repeat the press-release claims or the site's facts? |

No ranking or AI citation is guaranteed; these numbers show whether the work is moving in the right direction.
