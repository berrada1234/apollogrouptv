# Content quality and E-E-A-T audit: apollogroupr.tv (4 November 2026)

Live site crawled (89 URLs, 73 indexable pages in the sitemap) plus a readability and repetition analysis of all 24 articles. Scores are this audit's heuristics, not Google signals; Search Console isn't connected, so rankings weren't measured.

## Scores

**Content quality: 66 / 100** (strong writing and structure, weak experience and authority signals)

| Factor | Score | Key signals |
|---|---|---|
| Experience | 7 / 20 | No screenshots, photos or video in any article or guide; no original data; 13 "Example" sections are written as real customer stories but are illustrative |
| Expertise | 16 / 25 | Accurate, specific steps; official sources cited (Amazon, Google, Apple, Roku, Netflix, FCC, FTC); no named author or credentials ("Apollo Group TV Editorial Team") |
| Authoritativeness | 9 / 25 | New domain; no published reviews; no verified external mentions or links; brand search results dominated by press-release spam and lookalike domains |
| Trustworthiness | 22 / 30 | HTTPS, published policies and disclaimer, contact details, dates and update dates, transparent sourced pricing, honest comparisons; minus broken downloads, an empty payment-methods page and zero reviews |

**AI citation readiness: 80 / 100.** Quick answer at the top of every article, answer-first sections, comparison tables, key-facts table on the homepage, linked Organization/WebSite/BlogPosting entities, server-rendered HTML.

## Metrics

| Page type | Pages | Words (min / median / max) | Internal links per 1,000 words |
|---|---|---|---|
| Blog articles | 24 | 2,243 / 2,354 / 2,469 | 8.3 |
| Device setup guides | 8 | 397 / 417 / 570 | 32 |
| Payment guides | 10 | 846 / 951 / 1,331 | 11.4 |
| Compare pages | 8 | 378 / 790 / 1,595 | 16.8 |
| Legal pages | 5 | 392 / 641 / 1,002 | 14 |
| Other pages | 18 | 155 / 711 / 2,822 | 18.9 |

- **Readability:** average Flesch Reading Ease 67.6 (range 63 to 73; target 60 to 70), 15.9 words per sentence, paragraphs over four sentences are rare (9 of 960).
- **Repetition:** only 4 sentences of 10+ words repeat across articles (short cross-links). No repeated openers.
- **Template uniformity:** 24/24 articles end with "Frequently asked questions" and "Conclusion"; 23/24 have an "Example" section; 18/24 open with a story intro followed by "This guide…".

## Issues found

| Priority | Issue | Evidence |
|---|---|---|
| High | Illustrative examples presented as real customer stories | 13 articles: "A customer reported…", "A customer typed the code…" (VPN, Is it down, Downloader, MAG, Xtream, 404, subtitles, Samsung, Android, Firestick update, Roku, Netflix, internet speed) |
| High | Installer downloads return 404 | Linked from /app, /guides/android-phone-tablet, /guides/macos, /guides/windows |
| High | /payment-methods is thin on the live site (155 words) | No payment method is configured in production, so the page shows an empty state |
| Medium | Device setup guides are short for money keywords | ~400 words each for queries like "install Apollo Group TV on Firestick"; no screenshots |
| Medium | No first-hand media anywhere in articles or guides | 0 images in 24 articles |
| Medium | No named author or reviewer | Organization byline only |
| Medium | No published reviews | /reviews shows "No reviews yet" |
| Low | Uniform article skeleton | Same section order on almost every article |
| Low | Business address should be verified as real | About page and Organization schema use "123 Sunset Boulevard, Los Angeles, CA 90028" |

## Recommendations

1. **Relabel the example sections as illustrative scenarios** (heading "Example scenario" plus a one-line note), or replace them with real, anonymised support cases. Inventing first-hand experience is the fastest way to lose trust.
2. **Fix the installer downloads** (upload the files or redirect to the old domain).
3. **Configure payment methods in production**, which also fills /payment-methods.
4. **Expand the device guides** with screenshots of each step, a troubleshooting section per device and device-specific FAQs.
5. **Add first-hand media**: screenshots from a real Fire TV, Android phone and Apple TV in the guides and the most-read articles; short setup videos.
6. **Name an author or reviewer** with a short bio and Person schema; an About-the-author box on articles.
7. **Collect genuine reviews** after activation.
8. **Vary future article structures** (not every article needs Example, FAQ and Conclusion in the same order).
