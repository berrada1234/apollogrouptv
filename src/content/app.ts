/**
 * App page copy (/app). Original wording; describe what the app does in general terms.
 * Never add: download counts, ratings, speed/latency figures, catch-up or DVR promises,
 * film or channel titles, network names, sideloading or downloader codes, or VPN advice.
 * Prices, device limits and catalog sizes are rendered from data, not written here.
 * Links use [label](/path) (see <RichText>).
 */

export const appCopy = {
  hero: {
    eyebrow: "The Apollo TV app",
    h1: "The Apollo Group TV App: One Account, Every Screen",
    lead:
      "The Apollo TV app brings live channels and on-demand viewing to the TV, streaming stick, phone or computer you already use. Sign in once with your Apollo Group TV account and the same lineup follows you from room to room.",
  },

  why: {
    eyebrow: "Why the app",
    h2: "What the Apollo TV App Is Built to Do",
    description:
      "These are the everyday jobs the Apollo TV app is built around: finding a channel, picking up a series and getting back to watching after an update.",
    items: [
      {
        title: "A guide you can actually navigate",
        body: "Live channels are sorted by category and, where licensing allows, by region, so you scroll to Sports or News instead of through one endless list.",
      },
      {
        title: "Picture quality that's labeled",
        body: "Channels show HD, Full HD or 4K labels where the broadcast supports it, so you know what to expect before you press play.",
      },
      {
        title: "One login across your devices",
        body: "Use the same account on each supported device in your household, up to the device limit included with your pack.",
      },
      {
        title: "Help that's one tap away",
        body: "Account status, billing and support tickets live in your Apollo Group TV dashboard, so problems get a written answer instead of a dead end.",
      },
    ],
  },

  library: {
    eyebrow: "On demand",
    h2: "On-Demand Movies and Shows in the Apollo TV App",
    description:
      "Alongside live TV, the app includes an on-demand library you can browse by genre. What's available depends on licensing in your region and changes over time.",
    genres: ["Action & adventure", "Drama", "Comedy", "Family & kids", "Documentary", "Sci-fi & fantasy", "Thriller", "Series box sets"],
    note: "Titles and artwork in the library belong to their respective rights holders.",
  },

  phone: {
    eyebrow: "On your phone",
    h2: "Apollo TV on iPhone, iPad and Android",
    description:
      "On a phone or tablet the app uses a layout made for touch. You keep the same account, lineup and on-demand library.",
    points: ["Same sign-in as your TV", "Touch-friendly browsing", "Portrait and landscape viewing", "Your plan status in the dashboard"],
  },

  inside: {
    eyebrow: "Inside the app",
    h2: "A Quick Tour of the Apollo TV App",
    description: "The four areas most people use every day. The previews below are illustrations of the layout, not screenshots.",
    screens: [
      { title: "Home", body: "One starting point for live TV and on-demand, with every category a step away." },
      { title: "Live TV guide", body: "Browse channels by category, see what's on now and switch with a single selection." },
      { title: "On-demand", body: "Explore movies and series by genre and see title information before you press play." },
      { title: "Sports", body: "Sports channels grouped by sport and region so live games are easy to find." },
    ],
  },

  install: {
    eyebrow: "Install",
    h2: "Install the Apollo TV App on Your Device",
    description:
      "Each verified device gets an official download link and numbered setup steps. Install only from those links or an official app store. Codes and files shared elsewhere aren't ours.",
    notListed: "Don't see your device? [Ask our team](/contact) before subscribing and we'll tell you whether it works.",
  },

  requirements: {
    eyebrow: "Requirements",
    h2: "What You Need to Run the Apollo TV App",
    description:
      "Smooth streaming depends as much on your setup as on ours. Treat these as rules of thumb. Real needs vary with your network, device and how many screens are in use.",
    groups: [
      {
        title: "Internet connection",
        items: [
          "A stable broadband connection",
          "More bandwidth for 4K than for HD",
          "Extra headroom when several people stream at once",
          "Wired Ethernet or 5 GHz Wi-Fi where possible",
        ],
      },
      {
        title: "Your device",
        items: [
          "A device listed in our setup guides",
          "The latest operating system updates installed",
          "Enough free storage for the app and its updates",
          "A 4K-capable screen and device for 4K viewing",
        ],
      },
      {
        title: "Your account",
        items: [
          "An Apollo Group TV account with a verified email",
          "An active pack shown in your dashboard",
          "Devices within your pack's device limit",
          "The latest version of the app",
        ],
      },
    ],
  },

  start: {
    eyebrow: "Get started",
    h2: "Start Watching in Three Steps",
    steps: [
      { title: "Create your account", body: "Sign up with your email and confirm it.", href: "/create-account", cta: "Create account" },
      { title: "Choose a pack", body: "Pick the access period that suits you.", href: "/plans", cta: "See packs" },
      { title: "Follow your device guide", body: "Install the app and sign in.", href: "/guides", cta: "Setup guides" },
    ],
  },

  faq: {
    eyebrow: "App FAQ",
    h2: "Apollo TV App: Questions and Answers",
    description: "Questions about how the app behaves. For billing and account topics, see the [full FAQ](/faq).",
  },

  cta: {
    h2: "Get the Apollo TV App Running Today",
    body: "Choose a pack, install the app on your first device and sign in with your account.",
  },
};

export const appFaq = [
  {
    q: "Which devices does the Apollo TV app support?",
    a: "Supported devices are listed on this page with an official download link and setup steps for each. We add a device only after verifying it. If yours isn't listed, [ask us](/contact) before subscribing.",
  },
  {
    q: "Where should I download the Apollo Group TV app?",
    a: "Only from the official links in your dashboard under Apps & Guides, in our [setup guides](/guides) or from an official app store. On Fire TV and Android TV, use the official Downloader code shown in your dashboard. Codes and files shared on forums or social media aren't from us and can put your device at risk.",
  },
  {
    q: "Can I use the app on more than one device?",
    a: "Yes. Sign in with the same account on each device, up to the device limit included with your pack. You'll find the limit in each pack's details on the [Plans page](/plans).",
  },
  {
    q: "Do I need a separate account for each device?",
    a: "No. One Apollo Group TV account works on all your supported devices. Use the same email and password on each one.",
  },
  {
    q: "Why does the app buffer or freeze?",
    a: "Usually it's the connection: weak Wi-Fi, other heavy downloads, or several streams at once. Try a wired connection, restart your router and device, and update the app. The [troubleshooting guide](/guides/troubleshooting) walks through each step.",
  },
  {
    q: "Can I record live TV in the app?",
    a: "We don't currently advertise a recording feature. On-demand titles in the library can be watched whenever you like while your pack is active.",
  },
  {
    q: "The app won't sign in. What should I check?",
    a: "Make sure your email is verified and your pack shows as active in your [dashboard](/dashboard). If you've forgotten your password, request a reset link from the [Sign in](/sign-in) page.",
  },
  {
    q: "Does the app work without an active pack?",
    a: "You can create an account at any time, but watching requires an active pack. Your dashboard shows your current pack and how many days are left.",
  },
];
