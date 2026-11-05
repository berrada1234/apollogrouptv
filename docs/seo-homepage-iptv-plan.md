# Homepage SEO Plan (30 days)

**Focus keywords for `/`:** **Apollo Group TV** (primary) and **Apollo TV** (secondary).
**Supporting keywords:** IPTV, IPTV USA, IPTV service, IPTV provider. They describe what the brand is and are
added once or twice each, never ahead of the brand.

Written 2026-11-05 from the current code (`src/app/(marketing)/page.tsx`, `src/content/home.ts`).

## 1. Where the homepage stands

| Place | Current text | Apollo Group TV | Apollo TV | IPTV terms |
|---|---|---|---|---|
| `<title>` | Apollo Group TV (Apollo TV) Official Site: Live TV & Movies | ✅ first | ✅ | ❌ |
| Meta description | Apollo Group TV streams live TV, sports and movies… | ✅ first | ❌ | ❌ |
| H1 | Apollo Group TV: Live TV and On-Demand Streaming Without a Cable Box | ✅ first | ❌ | ❌ |
| Hero lead (first 100 words) | Apollo Group TV (Apollo TV for short) streams… | ✅ | ✅ | ❌ |
| 15 section H2s | 9 use "Apollo Group TV", 6 use "Apollo TV" | ✅ | ✅ | ❌ |
| Organization / WebSite schema | `name` + `alternateName: "Apollo TV"` | ✅ | ✅ | ❌ |
| Homepage FAQ (14 Qs) | all phrased with "Apollo Group TV" | ✅ | ❌ | ❌ |

**Conclusion:** on-page targeting for the two focus keywords is already strong. Title, H1, first sentence,
H2s and schema all lead with the brand. Rewriting more headings around the brand would add little and risk
over-optimization (the H1 and all 15 H2s already contain it).

The gaps are:
1. **No category signal.** Google doesn't see the words "IPTV service" or "IPTV provider" on the page, so it
   has less evidence that this site *is* the service people mean when they search the brand.
2. **"Apollo TV" is thin outside the title and lead.** It's missing from the H1 and the meta description.
3. **Off-page.** For a brand query, the result is decided mostly by which domain the web treats as the real
   Apollo Group TV: links, mentions, profiles and review sites pointing to it. That's where the month should go.

## 2. Realistic expectations for 1 month

| Keyword | What decides it | Realistic in 30 days |
|---|---|---|
| Apollo Group TV | brand authority: links, mentions, profiles, competing sites using the name | top 10, top 3 if competing sites are weak |
| Apollo TV | shared name (other "Apollo TV" products and apps exist) | top 20 |
| Apollo Group TV + modifier (login, price, app, Firestick, legal) | the existing guides and FAQ | top 5 for several |
| Apollo IPTV / Apollo Group TV IPTV | adding IPTV wording to the homepage | top 3 |

Check positions in Search Console first (Performance → Queries filtered to "apollo"); the plan's targets assume
the site is already indexed.

## 3. On-page changes (week 1): small, brand-first

Keep the brand in front everywhere; add IPTV terms once each as the description of what the brand is.

### Title (55 characters)
```
Apollo Group TV (Apollo TV): Official IPTV Service USA
```
Keeps both focus keywords first and the "official" signal, and adds IPTV / IPTV service / IPTV USA once at the end.
If you prefer to keep the current title untouched, this is the one optional change.

### Meta description (about 150 characters)
```
Apollo Group TV (Apollo TV) is an IPTV service for live TV, sports and movies on Fire TV, Android, iPhone and PC. One-time packs from {price}/month.
```
Adds "Apollo TV" and "IPTV service". Google bolds both when they match the search.

### H1 (`homeCopy.hero.h1`)
```
Apollo Group TV: IPTV Service for Live TV and On-Demand Streaming
```
Brand first, then the category. Leave "Apollo TV" to the lead paragraph, which already has it in the first sentence.

### Hero lead: one word change
```
Apollo Group TV (Apollo TV for short) is an IPTV provider that streams live channels and an on-demand library…
```

### Section H2s: change only two, keep the rest

| Section | Current H2 | New H2 | Why |
|---|---|---|---|
| intro | What Is Apollo Group TV? | What Is Apollo Group TV? The IPTV Service Explained | answers the top brand question and adds the category |
| compare | Apollo Group TV vs. Cable TV: How They Compare | Apollo Group TV vs. Cable TV: IPTV Compared for US Viewers | adds IPTV and USA once |

Everything else stays. Those headings already match how people search the brand.

### Homepage FAQ: two additions
- **Is Apollo Group TV the same as Apollo TV?** Yes, Apollo TV is the short name; one service, one official site. This
  is a real search pattern and it ties the two focus keywords together for Google.
- **Is Apollo Group TV an IPTV service?** Two sentences explaining it, link to `/blog/what-is-iptv`.

### Schema
- Organization node: add `"knowsAbout": ["IPTV", "Internet television"]`.
- Fill `sameAs` with real profiles (Admin → Settings → Social). This is the strongest on-page brand signal still
  missing, and the code already supports it.

### Guardrails
- Only true claims. Don't invent US channel counts or networks.
- Keep the existing legal wording about licensed content.
- Don't add more "Apollo Group TV" repetitions; the page is already at a natural maximum.

## 4. Internal links (week 1 to 2)

Point the guides and blog at the homepage with brand anchors. Vary them:

| Anchor | Example pages |
|---|---|
| Apollo Group TV | `/blog/apollo-group-tv-official-website`, `/is-apollo-group-tv-legal` |
| Apollo TV | device guides (Fire TV, Android, Windows) |
| official Apollo Group TV site | `/blog/is-apollo-tv-down`, `/blog/how-to-get-apollo-tv` |
| Apollo Group TV IPTV service | `/blog/what-is-iptv`, `/choosing-an-iptv-service` |

## 5. Off-page (weeks 1 to 4): what moves brand rankings

1. **Search Console:** submit the sitemap, request indexing of `/` after the change, and check which other
   domains show up for "apollo group tv".
2. **Bing Webmaster Tools:** same; Bing also feeds ChatGPT search.
3. **Brand profiles with the same name, logo and URL:** X, Facebook, Instagram, YouTube, Reddit, Telegram,
   Trustpilot. Then list them in `sameAs`. These pages often rank on page 1 for brand searches themselves.
4. **Directory listings (10 to 20):** use the `/directory-submissions` skill. Many reject IPTV, so expect a lower acceptance rate.
5. **Reviews on third-party sites** (Trustpilot first): brand searches show review stars and review sites.
6. **Avoid bought link packages** sold to IPTV sites; they're the main cause of IPTV domain penalties.

## 6. 30-day timeline

| Week | Work | Done when |
|---|---|---|
| 1 | Title, meta, H1, lead, 2 H2s, 2 FAQs, schema; deploy (push to `main`) | live page shows the new text |
| 1 | Search Console + Bing: sitemap, request indexing | new title visible in results |
| 1 to 2 | Social profiles created and added to `sameAs` | profiles live, schema shows them |
| 2 | Internal links from 6 to 8 pages | links live |
| 2 to 3 | 10 to 20 directory listings, Trustpilot profile | list tracked in a sheet |
| 4 | Search Console: positions for both focus keywords; tune copy for any brand query sitting at positions 4 to 15 | report |

## 7. KPIs

| Metric | Now | Day 30 | Month 3 |
|---|---|---|---|
| Position, "apollo group tv" | check in GSC | top 10 | top 3 |
| Position, "apollo tv" | check in GSC | top 20 | top 10 |
| Brand queries with clicks (GSC) | check in GSC | +50% | x3 |
| Referring domains | check in GSC Links | +10 to 20 | +40 |
| Brand profiles in `sameAs` | 0 unless set in admin | 5+ | 7+ |
