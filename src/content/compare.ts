/**
 * Comparison pages: Apollo Group TV vs YouTube TV, Sling TV, Hulu + Live TV, DIRECTV STREAM and Philo.
 * Every competitor figure comes from the source listed with it, checked on the date in CHECKED. Update the
 * numbers and the date together whenever a service changes its prices. Apollo figures are never written here:
 * pages read them from the plans in the database, so a price change in Admin updates every comparison.
 * Apollo facts used in copy are the verified ones: one-time packs with no auto-renewal, the same service on
 * every pack, team activation, guides for every supported device, written ticket support, no free trial,
 * no recording feature advertised, and refund requests under the Refund Policy.
 */

export const CHECKED = "November 4, 2026";

export type Rival = {
  slug: string;
  path: string;
  name: string;
  /** The plan compared and its regular monthly price, before promotions, taxes and fees. */
  planName: string;
  monthlyCents: number;
  otherPrices: string;
  screens: string;
  dvr: string;
  trial: string;
  extras: string;
  source: { label: string; href: string };
  keyword: string;
  seo: { title: string; description: string };
  intro: string;
  story: string[];
  theyWin: string[];
  weWin: string[];
  verdict: string;
  faqs: { q: string; a: string }[];
};

export const rivals: Rival[] = [
  {
    slug: "youtube-tv",
    path: "/apollo-group-tv-vs-youtube-tv",
    name: "YouTube TV",
    planName: "YouTube TV Base Plan",
    monthlyCents: 8299,
    otherPrices: "YouTube TV also sells smaller genre plans, such as Entertainment and Sports, and runs introductory discounts that return to the regular price afterwards.",
    screens: "3 streams at once",
    dvr: "Unlimited cloud DVR",
    trial: "Introductory offers vary",
    extras: "100+ channels, apps from Google on most devices",
    source: { label: "YouTube TV official website (tv.youtube.com): Base Plan $82.99/mo regular price, 100+ channels, 3 streams, unlimited DVR", href: "https://tv.youtube.com/welcome/" },
    keyword: "apollo group tv vs youtube tv",
    seo: {
      title: "Apollo Group TV vs YouTube TV: Yearly Cost Compared",
      description: "YouTube TV's Base Plan is $82.99 a month. See how Apollo Group TV compares on yearly cost, billing, screens, DVR and setup, with a source for every figure.",
    },
    intro: "YouTube TV is the live TV service many people try first after cable. It's a polished product, and at $82.99 a month it's also one of the more expensive ways to watch. Here's how the two compare over a full year.",
    story: [
      "Most people comparing the two want to know one thing: is YouTube TV worth close to a thousand dollars a year, or is there a cheaper way to keep live TV?",
      "YouTube TV does a lot well. The app is fast, unlimited cloud DVR is included, and it runs on almost every device. The cost is the catch: $82.99 every month, billed until you cancel, which comes to $995.88 over twelve months before taxes.",
      "Apollo Group TV works differently. You choose how long you want access, from three months to two years, and pay once. Nothing renews on its own, and the twelve-month pack costs a fraction of a year of YouTube TV.",
    ],
    theyWin: [
      "Unlimited cloud DVR: record shows and watch them later. Apollo Group TV doesn't advertise a recording feature.",
      "Official apps from Google on smart TVs, streaming sticks and consoles.",
      "Smaller genre plans if you only want one type of channel.",
    ],
    weWin: [
      "A year costs a small part of what YouTube TV charges, using the prices in the table.",
      "One payment per pack, and nothing renews automatically.",
      "Live channels and an on-demand library on every pack, with no add-on tiers to decide between.",
      "A setup guide for every supported device and written support in one ticket.",
    ],
    verdict: "If cloud DVR is essential and the price doesn't worry you, YouTube TV is a strong service. If you want live TV without a bill of around $83 every month, Apollo Group TV is the better value for most homes.",
    faqs: [
      { q: "Is Apollo Group TV cheaper than YouTube TV?", a: "Yes, over a year by a wide margin. YouTube TV's Base Plan is $82.99 a month, $995.88 for twelve months. Apollo Group TV's twelve-month pack price is shown in the table above, straight from our current prices." },
      { q: "Does Apollo Group TV have a DVR like YouTube TV?", a: "No. Apollo Group TV doesn't advertise a recording feature for live TV. The on-demand library lets you watch films and series whenever you like while your pack is active." },
      { q: "Do I need a contract for either service?", a: "Neither has a contract. YouTube TV bills you monthly until you cancel; an Apollo Group TV pack is paid once and ends when its period is over." },
      { q: "Can I use Apollo Group TV on the same devices as YouTube TV?", a: "On many of them. Apollo Group TV runs on Fire TV and Android TV, Android phones and tablets, Windows and Mac, and on iPhone, iPad and Apple TV through a player app. It isn't available on Roku or directly on Samsung and LG TVs." },
    ],
  },
  {
    slug: "sling-tv",
    path: "/apollo-group-tv-vs-sling-tv",
    name: "Sling TV",
    planName: "Sling Orange",
    monthlyCents: 4599,
    otherPrices: "Sling Blue is also $45.99 a month and Orange & Blue together are $60.99. Prices can be higher where Sling carries local channels.",
    screens: "Orange: 1 stream · Blue: 3 · Orange & Blue: 4",
    dvr: "50 hours of cloud DVR included",
    trial: "Promotions vary",
    extras: "Add-on packs for extra channels",
    source: { label: "CableTV.com Sling TV plans and prices, October 2026 data (sling.com doesn't load from every location; check it for today's price)", href: "https://www.cabletv.com/sling-tv" },
    keyword: "apollo group tv vs sling tv",
    seo: {
      title: "Apollo Group TV vs Sling TV: Prices and Screens Compared",
      description: "Sling Orange is $45.99 a month for one screen. Compare Sling TV with Apollo Group TV on yearly cost, screens, DVR and billing, with a source for every figure.",
    },
    intro: "Sling TV has a reputation as the budget choice in live TV streaming. Once you choose between Orange and Blue, count your screens and look at the add-ons, the yearly total tells a different story.",
    story: [
      "Sling's starting price is what brings most people in. Then come the choices: Orange or Blue, whether one screen is enough, which add-on packs you need.",
      "Sling Orange is $45.99 a month and lets you watch on one screen at a time. Blue is the same price with three screens but a different channel set, and both together cost $60.99. Over a year, Orange alone is $551.88.",
      "Apollo Group TV keeps it to one decision: how long you want access. Every pack has the same live channels and on-demand library, you pay once, and it doesn't renew.",
    ],
    theyWin: [
      "Cloud DVR is included, with 50 hours on the base plans.",
      "Official apps on most smart TVs and streaming devices.",
      "Frequent first-month promotions and short-term options.",
    ],
    weWin: [
      "Lower yearly cost than even Sling's cheapest plan, using the prices in the table.",
      "Up to 5 devices per account on every pack, so the family isn't limited to one screen.",
      "No Orange-or-Blue choice and no add-on packs to work out.",
      "One payment per pack, with nothing renewing automatically.",
    ],
    verdict: "If you want a recognised brand, need DVR and only watch on one screen, Sling Orange works. For a household that watches on several screens and wants a lower yearly cost, Apollo Group TV is the better pick.",
    faqs: [
      { q: "Is Apollo Group TV cheaper than Sling TV?", a: "Over a year, yes. Sling Orange is $45.99 a month, $551.88 for twelve months on a single screen. Apollo Group TV's yearly price is shown in the table above, from our current prices." },
      { q: "How many screens does each service allow?", a: "Sling Orange allows one stream at a time, Blue three and Orange & Blue four. Apollo Group TV packs list up to 5 devices per account." },
      { q: "Does Sling TV have a DVR?", a: "Yes, Sling includes 50 hours of cloud DVR on its base plans, with more available for an extra fee. Apollo Group TV doesn't advertise a recording feature." },
      { q: "Does either service need a contract?", a: "No. Sling bills monthly until you cancel, and an Apollo Group TV pack is a single payment for a fixed period." },
    ],
  },
  {
    slug: "hulu-live-tv",
    path: "/apollo-group-tv-vs-hulu-live-tv",
    name: "Hulu + Live TV",
    planName: "Hulu + Live TV, Disney+ and ESPN Select (with ads)",
    monthlyCents: 9999,
    otherPrices: "The no-ads version is $109.99 a month, and Live TV Only (without the Hulu library or Disney+) is $98.99. These prices apply to new subscriptions from September 23, 2026.",
    screens: "Screen limits apply; check Hulu's plan details",
    dvr: "Cloud DVR included",
    trial: "Check Hulu's site for current offers",
    extras: "Includes the Hulu library, Disney+ and ESPN Select",
    source: { label: "Hulu Help Center, “Hulu plans and prices”: Hulu + Live TV $99.99/mo with ads, $109.99/mo without ads, Live TV Only $98.99/mo (new subscriptions from September 23, 2026)", href: "https://help.hulu.com/article/hulu-how-much-does-hulu-cost" },
    keyword: "apollo group tv vs hulu live tv",
    seo: {
      title: "Apollo Group TV vs Hulu + Live TV: Price Comparison",
      description: "Hulu + Live TV now costs $99.99 a month. Compare it with Apollo Group TV on yearly cost, billing and what's included, using Hulu's published prices.",
    },
    intro: "Hulu + Live TV bundles live channels with the Hulu library, Disney+ and ESPN Select. Since September 2026 that bundle costs $99.99 a month. Here's what that means next to Apollo Group TV.",
    story: [
      "Hulu + Live TV is a big package: live channels, Hulu's on-demand catalog, Disney+ and ESPN Select in one subscription. If your household uses all of it, that's a lot of entertainment in one bill.",
      "The bill is the part to look at. For new subscribers since September 23, 2026, the plan with ads is $99.99 a month and the no-ads version $109.99. A year with ads comes to $1,199.88 before taxes.",
      "Apollo Group TV is for people who mainly want live channels and an on-demand library at a much lower yearly cost: one payment for the length you choose, and no automatic renewal.",
    ],
    theyWin: [
      "Disney+, the Hulu library and ESPN Select are part of the price.",
      "Cloud DVR and official apps from a major media company.",
      "A good fit if the family already watches a lot of Disney and Hulu originals.",
    ],
    weWin: [
      "A year of Apollo Group TV costs a small fraction of a year of Hulu + Live TV, using the prices in the table.",
      "One payment per pack instead of a monthly bill that keeps running.",
      "The same service on every pack: you only choose the length.",
      "Written support in a single ticket, with a guide for every supported device.",
    ],
    verdict: "If your household lives in Disney and Hulu originals, Hulu + Live TV's bundle has real value. If live channels are what you're paying for, Apollo Group TV gets you there for far less over a year.",
    faqs: [
      { q: "Is Apollo Group TV cheaper than Hulu + Live TV?", a: "Yes, by a wide margin. A year of Hulu + Live TV with ads is $1,199.88 at the September 2026 price. Apollo Group TV's yearly price is in the table above, from our current prices." },
      { q: "Does Apollo Group TV include Disney+ or the Hulu library?", a: "No. Apollo Group TV doesn't include other companies' streaming services. Our article on whether Apollo Group TV includes Netflix explains how separate services fit together." },
      { q: "Why did Hulu + Live TV get more expensive?", a: "Hulu set new prices for new subscriptions from September 23, 2026, and existing subscribers see the change from October 21, 2026, according to Hulu's help center." },
      { q: "Can I keep Disney+ and use Apollo Group TV?", a: "Yes. Both run side by side on the same Fire TV, Android TV, Google TV, iPhone, iPad or Apple TV, each with its own account." },
    ],
  },
  {
    slug: "directv-stream",
    path: "/apollo-group-tv-vs-directv-stream",
    name: "DIRECTV STREAM",
    planName: "DIRECTV Entertainment (streaming)",
    monthlyCents: 8999,
    otherPrices: "DIRECTV's streaming packages also include Choice ($94.99/mo), Ultimate ($129.99/mo) and Premier ($174.99/mo) at regular prices; first-month offers are lower and required fees apply. Regional sports come with higher packages, depending on location.",
    screens: "Unlimited streams at home",
    dvr: "Cloud DVR included",
    trial: "5-day free trial",
    extras: "90+ channels on Entertainment; local channels in many markets",
    source: { label: "DIRECTV official website (directv.com/stream, now “Streaming Live TV from DIRECTV”): Entertainment $89.99/mo regular price, Choice $94.99, Ultimate $129.99, Premier $174.99, 5-day free trial", href: "https://www.directv.com/stream/" },
    keyword: "apollo group tv vs directv stream",
    seo: {
      title: "Apollo Group TV vs DIRECTV STREAM: Price and Billing",
      description: "DIRECTV's Entertainment streaming package is $89.99 a month at the regular price. See how Apollo Group TV compares on yearly cost, fees and billing.",
    },
    intro: "DIRECTV STREAM, now sold as streaming live TV from DIRECTV, brings a satellite-style lineup to the internet, and satellite-style prices with it. Here's the full-year picture next to Apollo Group TV.",
    story: [
      "DIRECTV's streaming service is where many people land when they give up the satellite dish: familiar channels, a familiar brand, nothing on the roof.",
      "The price is familiar too. The Entertainment package is $89.99 a month at the regular price, and the first number you see is usually a one-month offer. Required fees come on top, and regional sports networks need a higher package. Twelve months of Entertainment is $1,079.88 before taxes and fees.",
      "Apollo Group TV has one price per pack, paid once, with no introductory rate that rises later and nothing renewing on its own.",
    ],
    theyWin: [
      "Local channels in many markets and regional sports on higher packages.",
      "Unlimited streams inside your home.",
      "A 5-day free trial before you pay.",
    ],
    weWin: [
      "A fraction of the yearly cost, using the prices in the table.",
      "No introductory price that jumps after the first month.",
      "One payment per pack, and nothing renews automatically.",
      "Every pack includes the same channels and library, so there's no upgrade ladder to climb.",
    ],
    verdict: "If your regional sports network is a must and cost isn't the main concern, DIRECTV's higher packages can make sense. For everyday live TV at a price that doesn't climb after the first month, Apollo Group TV is the better value.",
    faqs: [
      { q: "How much is DIRECTV STREAM a month?", a: "DIRECTV's website lists the Entertainment streaming package at $89.99 a month regular price, with Choice at $94.99, Ultimate at $129.99 and Premier at $174.99. First-month offers are lower, and required fees apply." },
      { q: "Is Apollo Group TV cheaper than DIRECTV STREAM?", a: "Yes. Twelve months of DIRECTV Entertainment at the regular price is $1,079.88 before fees. Apollo Group TV's yearly price is shown in the table above, from our current prices." },
      { q: "Is DIRECTV STREAM still called DIRECTV STREAM?", a: "DIRECTV now presents it as streaming live TV from DIRECTV, formerly DIRECTV STREAM. The packages and prices compared here come from that page." },
      { q: "Does Apollo Group TV have a free trial like DIRECTV?", a: "No. The 3-month pack is the shortest commitment, and refund requests are handled under our Refund Policy." },
    ],
  },
  {
    slug: "philo",
    path: "/apollo-group-tv-vs-philo",
    name: "Philo",
    planName: "Philo Essential",
    monthlyCents: 2500,
    otherPrices: "Philo also sells a Bundle+ plan at $33 a month. Check Philo's channel list for what each plan includes.",
    screens: "Up to 3 devices at once",
    dvr: "Unlimited DVR, recordings kept up to a year",
    trial: "7-day free trial",
    extras: "Entertainment-focused channel lineup",
    source: { label: "Philo official website (philo.com): Essential $25/mo, Bundle+ $33/mo, 3 streams at once, unlimited DVR, 7-day free trial", href: "https://www.philo.com/" },
    keyword: "apollo group tv vs philo",
    seo: {
      title: "Apollo Group TV vs Philo: Monthly and Yearly Cost",
      description: "Philo Essential is $25 a month. Compare Philo with Apollo Group TV on yearly cost, screens, DVR and free trials, using Philo's own published prices.",
    },
    intro: "Philo is one of the cheapest live TV services month to month. Over a full year, and once you look at what each includes, the comparison with Apollo Group TV becomes more interesting.",
    story: [
      "Philo's appeal is simple: a low monthly price for an entertainment-focused lineup, with a free trial and generous DVR.",
      "Philo Essential is $25 a month. The difference shows over time: twelve months of Philo Essential is $300, while Apollo Group TV's twelve-month pack is about half that.",
      "So the answer depends on how long you'll watch. For a month or two, the two cost about the same. For a year, Apollo Group TV costs less, and the pack doesn't renew on its own.",
    ],
    theyWin: [
      "Unlimited DVR, with recordings kept for up to a year.",
      "A 7-day free trial before you pay.",
      "About the same price as Apollo Group TV for a single month.",
    ],
    weWin: [
      "Roughly half the yearly cost of Philo Essential, using the prices in the table.",
      "Up to 5 devices per account, compared with Philo's 3.",
      "Live channels by category and region plus an on-demand library on every pack.",
      "One payment per pack, with nothing renewing automatically.",
    ],
    verdict: "For a month of entertainment channels with DVR and a free trial, Philo is a fair choice. For a full year of live TV on more screens, Apollo Group TV costs less.",
    faqs: [
      { q: "Is Apollo Group TV cheaper than Philo?", a: "Over a year, yes. Twelve months of Philo Essential is $300; Apollo Group TV's yearly price, shown in the table above, is about half that. For a single month, the two cost about the same." },
      { q: "Does Philo have a free trial?", a: "Yes, Philo lists a 7-day free trial. Apollo Group TV doesn't offer a free trial; the 3-month pack is the shortest commitment." },
      { q: "How many screens does each allow?", a: "Philo lists up to 3 devices at once. Apollo Group TV packs list up to 5 devices per account." },
      { q: "Does Apollo Group TV include sports like Philo's lineup?", a: "Apollo Group TV organizes live channels by category and region, including sports categories; our channels page lists them. Philo's lineup focuses on entertainment channels." },
    ],
  },
];

export const getRival = (slug: string) => rivals.find((r) => r.slug === slug)!;

/** Hub and guide pages that sit alongside the comparisons. */
export const comparePages = [
  { href: "/why-apollo-group-tv", label: "Why Apollo Group TV" },
  { href: "/choosing-an-iptv-service", label: "Choosing an IPTV service" },
  ...rivals.map((r) => ({ href: r.path, label: `Apollo Group TV vs ${r.name}` })),
];
