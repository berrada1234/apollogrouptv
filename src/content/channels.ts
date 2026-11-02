/**
 * Channels page copy. Deliberately brand-free: no channel, network, league or broadcaster names and
 * no logos — those are third-party trademarks and lineups change with licensing. Describe genres,
 * program types and regions only. Links use [label](/path) (see <RichText>).
 */

export const channelsCopy = {
  hero: {
    eyebrow: "Channel guide",
    h1: "Apollo Group TV Channels: Live TV by Category and Region",
    lead:
      "Apollo Group TV organizes live channels by what you like to watch and where it comes from — sports, news, movies, series, kids, documentaries and more. Here's how the lineup is structured and what each category typically covers.",
  },

  categories: {
    eyebrow: "Categories",
    h2: "What You Can Watch on Apollo TV",
    description:
      "Every live channel sits in a clear category so you can jump straight to what you want. Category contents depend on licensing in your region and can change over time.",
  },

  regions: {
    eyebrow: "Regions & languages",
    h2: "Apollo Group TV Channels Organized by Region",
    description:
      "Where licensing allows, channels are also grouped by country and language, so local programming and international viewing are each a few clicks away.",
    note: "Regional availability depends on rights agreements and can differ from one area to another. Ask us before subscribing if a region matters to you.",
  },

  guide: {
    eyebrow: "Finding a channel",
    h2: "How the Apollo TV Channel Guide Works",
  },

  names: {
    eyebrow: "About channel listings",
    h2: "Why This Page Describes Categories Instead of Channel Names",
    paragraphs: [
      "Channel names and logos are trademarks of their respective owners, and the channels available in any lineup change as rights agreements change. Publishing a fixed list of names would quickly go out of date — and could suggest an affiliation that doesn't exist.",
      "So this page describes what each category covers. Customers see the current lineup in the Apollo TV app. If one specific channel is the reason you're signing up, [ask us first](/contact) and we'll tell you honestly whether it's available in your region.",
    ],
    more: "Rights holders can reach us through our [copyright process](/dmca). We act on valid notices.",
  },

  faq: {
    eyebrow: "Channel FAQ",
    h2: "Apollo Group TV Channels: Common Questions",
  },

  cta: {
    h2: "Ready to Explore the Apollo Group TV Lineup?",
    body: "Pick a pack, install the app on a verified device, and browse every category from one place.",
  },
};

export type ChannelCategory = { key: string; title: string; summary: string; covers: string[] };

/** Genre categories — program types only, never channel or brand names. */
export const channelCategories: ChannelCategory[] = [
  {
    key: "sports",
    title: "Sports",
    summary: "Live matches, studio shows and replays across major sports, organized by sport and by region.",
    covers: ["Live games", "Pre- and post-match analysis", "Combat sports", "Motorsport", "Highlights"],
  },
  {
    key: "news",
    title: "News",
    summary: "Round-the-clock coverage from local headlines to world events, plus markets and weather.",
    covers: ["National news", "International news", "Business & markets", "Weather", "Politics & debate"],
  },
  {
    key: "movies",
    title: "Movies",
    summary: "Film channels spanning genres and decades, from recent releases where licensed to timeless classics.",
    covers: ["Action & thriller", "Drama", "Comedy", "Family films", "Classic cinema"],
  },
  {
    key: "series",
    title: "Entertainment & Series",
    summary: "The shows people talk about — scripted series, reality formats, talk shows and game shows.",
    covers: ["Drama series", "Sitcoms", "Reality TV", "Talk shows", "Game shows"],
  },
  {
    key: "kids",
    title: "Kids & Family",
    summary: "Age-appropriate channels for younger viewers and programming the whole family can watch together.",
    covers: ["Preschool", "Animation", "Educational shows", "Family entertainment", "Teen programming"],
  },
  {
    key: "documentary",
    title: "Documentary & Factual",
    summary: "Real stories and big ideas — the natural world, history, science and investigative journalism.",
    covers: ["Nature & wildlife", "History", "Science & technology", "True crime", "Travel & exploration"],
  },
  {
    key: "music",
    title: "Music",
    summary: "Music video channels and concert programming across genres, from the latest hits to the classics.",
    covers: ["Music videos", "Live concerts", "Pop & hip-hop", "Rock & alternative", "Regional music"],
  },
  {
    key: "lifestyle",
    title: "Lifestyle",
    summary: "Inspiration for everyday life — cooking, home and garden, health, fashion and travel.",
    covers: ["Food & cooking", "Home & garden", "Health & fitness", "Fashion & beauty", "Travel"],
  },
  {
    key: "international",
    title: "International & Culture",
    summary: "Programming from around the world in many languages, including cultural and faith-based channels.",
    covers: ["Foreign-language channels", "Cultural programming", "Faith & inspiration", "World cinema", "Diaspora TV"],
  },
];

/** Regions channels are grouped by where licensing allows. Names of places only — no broadcasters. */
export const channelRegions = [
  { name: "United States", detail: "Local-style news, sports and entertainment" },
  { name: "Canada", detail: "English- and French-language programming" },
  { name: "United Kingdom & Ireland", detail: "News, sport, drama and factual" },
  { name: "Europe", detail: "Channels grouped by country and language" },
  { name: "Latin America", detail: "Spanish- and Portuguese-language channels" },
  { name: "Middle East & North Africa", detail: "Arabic-language news and entertainment" },
  { name: "Asia", detail: "Channels across several languages" },
  { name: "Africa", detail: "Regional news, music and entertainment" },
];

/** How the in-app guide helps viewers find something to watch. Describes behaviour, not channel names. */
export const channelGuideSteps = [
  { title: "Browse by category", body: "Open a category like Sports or Kids and see every channel listed in it." },
  { title: "Filter by region", body: "Narrow the lineup to a country or language where regional grouping is available." },
  { title: "Check picture quality", body: "Channels show HD, Full HD or 4K labels where the broadcast supports it." },
  { title: "Watch on any verified device", body: "The same lineup is available on every device listed in our setup guides." },
];

export const channelFaq = [
  {
    q: "What channels does Apollo Group TV have?",
    a: "Apollo Group TV offers live channels across sports, news, movies, series, kids, documentaries, music, lifestyle and international programming. The exact lineup depends on licensing in your region and is shown in the app.",
  },
  {
    q: "Does Apollo Group TV have sports channels?",
    a: "Yes. Sports channels are grouped by sport and by region, covering live games, studio analysis and highlights. See the live sports section below for the categories.",
  },
  {
    q: "Can I watch channels from my country on Apollo TV?",
    a: "Where licensing allows, channels are grouped by country and language. Availability differs by region, so [ask us](/contact) before subscribing if a specific country's channels matter to you.",
  },
  {
    q: "Are Apollo Group TV channels in HD or 4K?",
    a: "Many channels are available in HD or Full HD, and some in 4K where the broadcast supports it. Picture quality also depends on your internet connection and device.",
  },
  {
    q: "Do all Apollo Group TV packs include the same channels?",
    a: "Yes. Every pack includes the same live channel lineup and on-demand library — packs differ only by access period. Compare them on the [Plans page](/plans).",
  },
  {
    q: "Why doesn't this page list channel names?",
    a: "Channel names and logos belong to their owners and lineups change with rights agreements, so we describe categories instead. If you need one particular channel, [contact us](/contact) and we'll confirm availability.",
  },
];
