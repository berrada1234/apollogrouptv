/**
 * Payment guides (/payment-guides). Each guide walks a customer from "I have this app or card"
 * to a paid Apollo Group TV invoice. Third-party apps change their screens and fees often,
 * so steps describe what to look for rather than quoting fees or exact button positions.
 * Inline links and bold use the RichText syntax: [label](/path) and **bold**.
 */

/** A screenshot for a step. `phone` frames are tall app screens shown narrow, `panel` a tall website form or window, `screen` a wide website crop. */
export type StepImage = { src: string; alt: string; width: number; height: number; kind: "phone" | "panel" | "screen" };

export type PayStep = { title: string; body: string; tip?: string; note?: string; image?: StepImage };

export type PaymentGuide = {
  slug: string;
  /** Short name for cards and the guide list. */
  name: string;
  glyph: string;
  accent: string;
  /** The page H1. */
  title: string;
  metaTitle: string;
  description: string;
  /** One line under the name on guide cards. */
  summary: string;
  minutes: number;
  region: string;
  updated: string;
  intro: string[];
  needs: string[];
  /** The money trail, drawn as a diagram at the top of the guide. */
  flow: string[];
  /** Optional walkthrough video shown above the steps (self-hosted in /public/videos). */
  video?: { src: string; poster: string; width: number; height: number; title: string; description: string; duration: string; uploaded: string };
  sections: { heading: string; intro?: string; steps: PayStep[] }[];
  /** Extra explainer blocks after the steps (fees, comparisons, safety). */
  extras?: { heading: string; paragraphs: string[]; list?: string[] }[];
  after: string[];
  faqs: { q: string; a: string }[];
  related: string[];
};

const UPDATED = "2026-11-03";
const IMG = "/images/payment-guides/cash-app";

// Shared closing paragraph for Bitcoin-based guides: what happens after the coins leave the customer's app.
const afterBitcoin = [
  "The payment window checks the Bitcoin network every 15 seconds. When your transaction appears it changes to **Payment detected**, and once the network confirms it the invoice is marked paid. You can close the window at any time; the check keeps running on our side.",
  "Paid invoices go to our team for activation. We create your IPTV login, and it appears in [My Account](/dashboard/subscription) with your username, password, playlist links and expiry date. You'll also get a notification in your dashboard. If you pressed **I Have Paid**, the [Payment Under Review](/dashboard/plan) page updates on its own while you wait.",
];

export const paymentGuides: PaymentGuide[] = [
  {
    slug: "cash-app",
    name: "Cash App",
    glyph: "💵",
    accent: "#00D632",
    title: "How to Buy Bitcoin with Cash App and Pay for Apollo Group TV",
    metaTitle: "Pay for Apollo Group TV with Cash App Bitcoin: Step-by-Step",
    description: "Pay for Apollo Group TV with Cash App, with a screenshot for every step: choose your pack, open your invoice, buy Bitcoin in Cash App and send the exact amount.",
    summary: "Buy Bitcoin in the app, then send it to your invoice.",
    minutes: 12,
    region: "US only",
    updated: "2026-11-14",
    intro: [
      "Cash App is the quickest route to Bitcoin for most people in the United States: you probably already have it on your phone, it links to a normal debit card, and it can send Bitcoin straight to another wallet. That last part is what you need here.",
      "This guide follows the whole trip in order, with a screenshot for every step: choosing your pack on Apollo Group TV, opening your invoice, getting Cash App ready, buying the Bitcoin and sending it. If Cash App is already verified for Bitcoin on your phone, skip Part 2 and you'll be done in a few minutes.",
    ],
    needs: [
      "An iPhone or Android phone with Cash App installed",
      "A US debit card or bank account linked to Cash App",
      "Your legal name, date of birth, address and the last 4 digits of your SSN (Cash App asks for these before it enables Bitcoin)",
      "An email address for your Apollo Group TV account (you create it in Part 1)",
    ],
    flow: ["Choose your pack on Apollo", "Buy Bitcoin in Cash App", "Send it to your invoice address", "Login appears in My Account"],
    video: {
      src: "/videos/apollo-cash-app-guide.mp4",
      poster: "/videos/apollo-cash-app-guide-poster.webp",
      width: 1920,
      height: 1080,
      title: "How to pay for Apollo Group TV with Cash App",
      description: "The whole journey in under two minutes: choosing a pack on apollogroupr.tv, creating your account, opening your invoice, buying and sending Bitcoin in Cash App, and confirming your payment.",
      duration: "PT1M59S",
      uploaded: "2026-11-14",
    },
    sections: [
      {
        heading: "Part 1: Choose your pack and create your account",
        intro: "Start on the Apollo Group TV website. Your invoice tells you exactly how much Bitcoin to send, so set it up before you open Cash App.",
        steps: [
          {
            title: "Pick how long you want access",
            body: "Open the [Plans page](/plans) and choose a period: Quarterly, Semi-Annual, Annual or 2-Year. Every pack has the same channels and library; only the length and the price change. Press the **Get** button under the price to continue.",
            image: { src: `${IMG}/apollo-plans-2-year-pack.webp`, alt: "Apollo Group TV Plans page with the 2-Year option selected, showing the Diamond Pack at $199 and the Get Diamond button", width: 1200, height: 338, kind: "screen" },
          },
          {
            title: "Create your free account",
            body: "Enter your full name, your email and a password, tick the box to accept the Terms, and press **Create account**. The pack you picked stays selected while you sign up. Then type the 6-digit code we email you to confirm your address.",
            tip: "Use an email you can open on your phone. The code and your activation notice both go there.",
            image: { src: `${IMG}/apollo-create-account.webp`, alt: "Apollo Group TV Create your account form with the selected Diamond Pack shown above the name, email and password fields", width: 720, height: 1169, kind: "panel" },
          },
          {
            title: "Confirm your pack in Plans & Billing",
            body: "You land in your dashboard. Open **Plans & Billing** and press **Subscribe** on the pack you want. This creates your invoice.",
            image: { src: `${IMG}/apollo-choose-pack.webp`, alt: "Plans & Billing in the Apollo Group TV dashboard with Silver, Elite, Platinum and Diamond packs and a Subscribe button on each", width: 1200, height: 390, kind: "screen" },
          },
          {
            title: "Open your invoice",
            body: "Your unpaid invoice appears at the top of the page with its price and a reservation timer. Press **Continue Payment**.",
            image: { src: `${IMG}/apollo-unpaid-invoice.webp`, alt: "Unpaid invoice card for the Diamond Pack, $199.00, with Pending Payment and reservation timer badges and a Continue Payment button", width: 1000, height: 209, kind: "screen" },
          },
          {
            title: "Choose Bitcoin Wallet and press Pay Now",
            body: "Under **Payment Methods**, press **Pay Now** on **Bitcoin Wallet**. Cash App sends ordinary Bitcoin, so this is the option to use (or **Cash App**, if it's listed with a Bitcoin address).",
            image: { src: `${IMG}/apollo-payment-methods.webp`, alt: "Payment Methods section with Bitcoin Wallet, Shakepay and MoonPay cards, each with a How to pay link and a Pay Now button", width: 1200, height: 577, kind: "screen" },
          },
          {
            title: "Keep the payment window open",
            body: "The window shows the three things you'll use in Cash App: the **Wallet Address**, the **Amount to Send (BTC)** and a QR code. The price is locked for the time shown at the top. Leave this window open on your computer, or keep this tab open on your phone.",
            tip: "The last few digits of the BTC amount are unique to your invoice. They're how our system recognizes your payment, so don't round them.",
            image: { src: `${IMG}/apollo-bitcoin-payment-window.webp`, alt: "Bitcoin Wallet Payment window with the price lock timer, QR code, wallet address and Amount to Send in BTC, each with a Copy button (address and QR blurred in this example)", width: 720, height: 1092, kind: "panel" },
          },
        ],
      },
      {
        heading: "Part 2: Get Cash App ready for Bitcoin",
        intro: "New to Cash App? Do this once. If you already buy Bitcoin in Cash App, skip to Part 3.",
        steps: [
          { title: "Install Cash App and sign up", body: "Download Cash App from the App Store or Google Play. Sign up with your phone number or email and enter the code Cash App texts you." },
          { title: "Link a debit card or bank", body: "Add the debit card you'll use to pay. Cash App uses it to top up your balance or to pay for the Bitcoin directly." },
          { title: "Verify your identity for Bitcoin", body: "Cash App asks for your full name, date of birth, address and the last 4 digits of your Social Security number before it unlocks buying and sending Bitcoin. Some accounts are also asked for a photo of a government ID.", note: "Verification can be instant or take a while on new accounts. Finish it before your invoice's price lock runs out, or press **Get a new quote** in the payment window when you're ready." },
          { title: "Set a PIN or turn on Face ID", body: "Cash App confirms every Bitcoin purchase and withdrawal with your PIN or biometrics. Set one now so you're not stuck mid-payment." },
        ],
      },
      {
        heading: "Part 3: Buy the Bitcoin in Cash App",
        intro: "The images below are simplified illustrations, not real screenshots of Cash App. The blue circle shows where to tap; your app's screens may look a little different.",
        steps: [
          {
            title: "Open the Money tab",
            body: "On Cash App's home screen, tap the **Money** icon (the bank symbol) at the bottom left.",
            image: { src: `${IMG}/cash-app-illustration-money-tab.webp`, alt: "Illustration of a payment app home screen with the Money tab highlighted in the bottom bar", width: 480, height: 931, kind: "phone" },
          },
          {
            title: "Tap Bitcoin",
            body: "Tap the **Bitcoin** tile. It shows how much Bitcoin you already hold.",
            image: { src: `${IMG}/cash-app-illustration-bitcoin-tile.webp`, alt: "Illustration of the Money tab with the Bitcoin tile highlighted", width: 480, height: 931, kind: "phone" },
          },
          {
            title: "Press Buy",
            body: "On the Bitcoin screen, press the blue **Buy** button under the price chart.",
            image: { src: `${IMG}/cash-app-illustration-buy-button.webp`, alt: "Illustration of the Bitcoin screen with the Buy button highlighted", width: 480, height: 931, kind: "phone" },
          },
          {
            title: "Choose a custom amount",
            body: "Tap **…** to type your own dollar amount, then press **Next**. Enter a little more than your invoice total, so a small price move or a faster withdrawal fee doesn't leave you short.",
            note: "The video uses $1 only as a demonstration. Buy enough to cover your invoice, for example about $205 to $210 for a $199 pack.",
            image: { src: `${IMG}/cash-app-illustration-buy-amount.webp`, alt: "Illustration of the Buy bitcoin screen with an example custom amount and the Next button highlighted", width: 480, height: 931, kind: "phone" },
          },
          {
            title: "Confirm the purchase",
            body: "Check the summary: funding source, Bitcoin amount, exchange rate and Cash App's fee. Press **Confirm**, then approve with your PIN or Face ID.",
            image: { src: `${IMG}/cash-app-illustration-confirm-purchase.webp`, alt: "Illustration of the purchase review screen with the Confirm button highlighted", width: 480, height: 931, kind: "phone" },
          },
          {
            title: "Press Done",
            body: "Cash App shows how much Bitcoin you bought. Press **Done**. The Bitcoin is in your Cash App balance straight away.",
          },
        ],
      },
      {
        heading: "Part 4: Send the Bitcoin to your invoice",
        steps: [
          {
            title: "Tap the send and receive button",
            body: "Back on the Bitcoin screen, tap the button with two arrows, next to Buy and Sell.",
            image: { src: `${IMG}/cash-app-illustration-send-receive-button.webp`, alt: "Illustration of the Bitcoin screen with the two-arrow send and receive button highlighted", width: 480, height: 931, kind: "phone" },
          },
          {
            title: "Choose Send bitcoin",
            body: "In the menu that opens, tap **Send bitcoin**.",
            image: { src: `${IMG}/cash-app-illustration-send-bitcoin.webp`, alt: "Illustration of the Send or receive menu with Send bitcoin highlighted", width: 480, height: 931, kind: "phone" },
          },
          {
            title: "Switch to BTC and enter the exact amount",
            body: "Tap the small **BTC ⇅** label under the amount so you type in Bitcoin instead of dollars. Enter the **Amount to Send (BTC)** from your Apollo payment window, every digit, then press **Send**.",
            tip: "On a phone, press **Copy** next to the amount in the Apollo window and paste it, so no digit gets lost.",
            image: { src: `${IMG}/cash-app-illustration-enter-btc-amount.webp`, alt: "Illustration of the Send bitcoin keypad switched to BTC with a pasted amount", width: 480, height: 931, kind: "phone" },
          },
          {
            title: "Paste the wallet address",
            body: "Tap the **To** field and paste the **Wallet Address** from your Apollo payment window (press **Copy** there first), or tap the scanner at the top and scan the QR code. Check that the first and last four characters match, then press **Next**.",
            note: "Bitcoin payments can't be reversed. Always paste or scan the address from your own invoice window; never type it from a screenshot.",
            image: { src: `${IMG}/cash-app-illustration-paste-address.webp`, alt: "Illustration of the Send to screen with a pasted Bitcoin address and the Paste button highlighted", width: 480, height: 931, kind: "phone" },
          },
          {
            title: "Pick a withdrawal speed",
            body: "Choose how fast Cash App sends it: **Priority** (about 20 minutes), **Rush** (about 2 hours) or **Standard** (about 24 hours, free, with a minimum amount). Faster speeds cost a fee and get your invoice confirmed sooner. Press **Next**, check the summary and confirm with your PIN.",
            note: "Make sure the amount arriving at the address still equals the BTC amount on your invoice. If the fee comes out of that amount, raise what you send by the fee.",
            image: { src: `${IMG}/cash-app-illustration-withdrawal-speed.webp`, alt: "Illustration of the withdrawal speed choices Priority, Rush and Standard, with Next highlighted", width: 480, height: 931, kind: "phone" },
          },
          {
            title: "Keep your receipt",
            body: "When Cash App shows that the Bitcoin was sent, take a screenshot. The payment also stays in your Cash App activity. Keep it until your pack is active, in case our support team asks for it.",
            image: { src: `${IMG}/cash-app-illustration-receipt.webp`, alt: "Illustration of a Bitcoin sent confirmation with the amount, status and transaction ID rows", width: 480, height: 931, kind: "phone" },
          },
          {
            title: "Press I Have Paid",
            body: "Go back to the Apollo payment window and press **I Have Paid**. This tells our team to look for your payment and opens the Payment Under Review page. The blockchain check keeps running either way, so you can close the window.",
          },
        ],
      },
    ],
    extras: [
      {
        heading: "Cash App limits worth knowing",
        paragraphs: [
          "Cash App sets its own weekly limits on Bitcoin purchases and withdrawals, and new accounts usually start lower. If a withdrawal is refused, the in-app message normally says which limit you hit. Larger packs may need a fully verified account.",
          "Cash App also shows its own fees on the purchase and withdrawal screens. They change, so always read the summary before confirming instead of relying on a number from a guide.",
        ],
      },
    ],
    after: afterBitcoin,
    faqs: [
      { q: "Can I pay Apollo Group TV with my Cash App balance in dollars?", a: "Only if Cash App appears at checkout with a $Cashtag instead of a Bitcoin address. Otherwise buy Bitcoin as shown here; it's the method our system can confirm automatically." },
      { q: "Why does Cash App ask for my SSN?", a: "US rules require Cash App to verify who you are before you can buy or send Bitcoin. Apollo Group TV never sees this information." },
      { q: "My price lock ran out before I sent. What now?", a: "Don't send to the old amount. Press **Get a new quote** in the payment window to lock a fresh BTC amount, then send that. If you already sent, don't send again; press I Have Paid and our team will match it." },
      { q: "I sent slightly more than the invoice. Is that a problem?", a: "No. A small overpayment is accepted and noted on your invoice. Sending less than the amount marks the invoice as underpaid until it's sorted out with support." },
      { q: "How long until my subscription is ready?", a: "Your invoice is marked paid once the Bitcoin network confirms the transaction. Our team then sets up your login, and you'll find it in My Account." },
    ],
    related: ["venmo", "moonpay", "bitcoin-network-fees", "payment-troubleshooting"],
  },
  {
    slug: "venmo",
    name: "Venmo",
    glyph: "📱",
    accent: "#3D95CE",
    title: "How to Pay for Apollo Group TV with Venmo Crypto",
    metaTitle: "Pay for Apollo Group TV with Venmo: Buy and Send Bitcoin",
    description: "Use the Crypto tab in Venmo to buy Bitcoin and send it to your Apollo Group TV invoice. Requirements, step-by-step sending, and how to avoid a short payment.",
    summary: "Buy Bitcoin in the Crypto tab and transfer it out.",
    minutes: 12,
    region: "US only",
    updated: UPDATED,
    intro: [
      "If you split dinner bills on Venmo, you already have most of what you need. Venmo's Crypto tab lets US users buy Bitcoin with their Venmo balance, bank or debit card, and transfer it to an outside address such as your Apollo Group TV invoice.",
      "The one thing that catches Venmo users out is the transfer step: Venmo treats sending crypto outside the app as a separate feature, and it may ask for extra verification the first time. This guide walks through it so you can plan around it.",
    ],
    needs: [
      "A personal Venmo account in the US (business profiles can't use crypto)",
      "Money in Venmo, a linked bank account or a debit card",
      "Identity verification completed in Venmo (it asks when you first open Crypto)",
      "Your Apollo Group TV invoice open in [Plans & Billing](/dashboard/plan)",
    ],
    flow: ["Venmo balance, bank or card", "Buy Bitcoin in the Crypto tab", "Transfer to the Apollo address", "Login appears in My Account"],
    sections: [
      {
        heading: "Step 1: Turn on crypto in Venmo",
        steps: [
          { title: "Open the Crypto tab", body: "Update Venmo to the latest version, open it and tap **Crypto** (on some versions it sits under the menu or the Me tab)." },
          { title: "Accept the crypto terms and verify", body: "Venmo asks you to agree to its crypto terms and confirm your identity. Have your legal name, address, date of birth and SSN ready. If Venmo asks for a photo ID, finish that before moving on." },
        ],
      },
      {
        heading: "Step 2: Get your Apollo amount and address",
        steps: [
          { title: "Create your invoice", body: "On Apollo Group TV, choose a pack in [Plans & Billing](/dashboard/plan). Your unpaid invoice appears with a reservation timer." },
          { title: "Open the Bitcoin payment window", body: "Press **Continue Payment**, choose **Bitcoin Wallet** (or Venmo if it's listed with a Bitcoin address) and press **Pay Now**. Note the **Amount to Send (BTC)** and leave the window open.", tip: "Copy the BTC amount into your phone's notes. Switching between apps is easier when you're not trying to remember eight decimal places." },
        ],
      },
      {
        heading: "Step 3: Buy Bitcoin",
        steps: [
          { title: "Choose Bitcoin and tap Buy", body: "In the Crypto tab, select **Bitcoin** and tap **Buy**." },
          { title: "Buy a little more than the invoice", body: "Enter a dollar amount slightly above your Apollo invoice. Prices move between buying and sending, and Venmo may charge a network fee on the transfer." },
          { title: "Pick how to pay and confirm", body: "Choose your Venmo balance, bank or card, review Venmo's fee and the Bitcoin you'll get, then confirm." },
        ],
      },
      {
        heading: "Step 4: Transfer to Apollo Group TV",
        steps: [
          { title: "Tap Transfer, then Send to external address", body: "On your Bitcoin page in Venmo, tap **Transfer** (or **Send**) and choose the option to send to an outside wallet or address." },
          { title: "Scan the QR code or paste the address", body: "Scan the QR code in your Apollo payment window, or paste the wallet address you copied. Venmo may ask you to confirm you trust this address." },
          { title: "Enter the BTC amount", body: "Type the exact **Amount to Send** from your invoice. Venmo shows the network fee and the total leaving your account.", note: "The address must receive the full invoice amount. If Venmo subtracts the fee from what you enter, raise the amount by that fee." },
          { title: "Review and send", body: "Check the address, amount and fee, then confirm. Venmo may hold the first transfer for a security review; if it does, it tells you in the app." },
          { title: "Press I Have Paid", body: "Back in the Apollo window, press **I Have Paid**. You'll see the Payment Under Review page, which updates on its own." },
        ],
      },
    ],
    extras: [
      {
        heading: "How Venmo's crypto works behind the scenes",
        paragraphs: ["Bitcoin you buy on Venmo is held for you by Venmo and its crypto partner until you transfer it out. That's why the transfer step exists and why Venmo checks it: once Bitcoin leaves Venmo, it's on the public Bitcoin network and can't be pulled back.","Venmo builds its price and fees into each purchase and shows them on the review screen. The figure that matters for Apollo Group TV is the BTC amount that reaches your invoice address, so compare that with your payment window before you confirm the transfer."],
      },
      {
        heading: "If Venmo won't let you transfer",
        paragraphs: [
          "Venmo can restrict crypto transfers on new accounts, accounts with recent changes, or after a first purchase. The app explains the restriction and when it lifts. While you wait, your Apollo price lock may expire; that's fine. Open the payment window again later and press **Get a new quote** before sending.",
          "If you'd rather not wait, [MoonPay](/payment-guides/moonpay) can send Bitcoin directly to your invoice address with a card.",
        ],
      },
    ],
    after: afterBitcoin,
    faqs: [
      { q: "Can I send Venmo dollars to Apollo Group TV?", a: "Only if Venmo is listed at checkout with a Venmo username to pay. Otherwise use the Crypto tab to buy and send Bitcoin as described here." },
      { q: "Is Venmo crypto available in my state?", a: "Venmo controls where crypto is offered. If you don't see the Crypto tab after updating the app, it may not be available to your account yet." },
      { q: "Why was my Venmo transfer held?", a: "Venmo reviews some crypto transfers for security, especially the first one. The app shows the status. Our system detects the payment as soon as it reaches the Bitcoin network." },
      { q: "What address type does Apollo use?", a: "The address in your payment window is a standard Bitcoin address. Send on the Bitcoin network only, never through a different network or token." },
      { q: "What if I send the wrong amount?", a: "Slightly more is fine. If you sent less, your invoice is marked underpaid; contact support with your transaction ID and we'll help you complete it." },
      { q: "Can I cancel a Venmo crypto transfer?", a: "Not once it's sent to the Bitcoin network. Venmo may let you cancel while a transfer is still under review; after that it's final." },
      { q: "Do I need to keep any Bitcoin in Venmo afterwards?", a: "No. Any small amount left over from rounding stays in your Venmo crypto balance, and you can sell it or keep it." },
    ],
    related: ["cash-app", "credit-card", "bitcoin-network-fees", "how-checkout-works"],
  },
  {
    slug: "shakepay",
    name: "Shakepay",
    glyph: "🇨🇦",
    accent: "#009FFF",
    title: "How to Pay for Apollo Group TV with Shakepay in Canada",
    metaTitle: "Pay for Apollo Group TV with Shakepay: Canadian Bitcoin Guide",
    description: "Canadian customers: fund Shakepay with Interac e-Transfer, buy Bitcoin and send the exact amount to your Apollo Group TV invoice. Full walkthrough and tips.",
    summary: "Canadian users: Interac e-Transfer, buy Bitcoin, send.",
    minutes: 15,
    region: "Canada only",
    updated: UPDATED,
    intro: [
      "Shakepay is a Canadian app built around buying Bitcoin with money from your bank. You move Canadian dollars in with Interac e-Transfer, buy Bitcoin, and send it to any Bitcoin address, which is exactly how you pay an Apollo Group TV invoice from Canada.",
      "The slowest part is usually the first deposit. Interac transfers often arrive quickly, but a new account or a large amount can take longer. Fund Shakepay before you open your invoice and the rest takes a few minutes.",
    ],
    needs: [
      "A Canadian bank account with Interac e-Transfer",
      "The Shakepay app and a verified Shakepay account (photo ID and selfie)",
      "Your Apollo Group TV invoice in [Plans & Billing](/dashboard/plan)",
    ],
    flow: ["Canadian bank (Interac)", "Buy Bitcoin in Shakepay", "Send to the Apollo invoice address", "Login appears in My Account"],
    sections: [
      {
        heading: "Before you pay: set up and fund Shakepay",
        steps: [
          { title: "Create and verify your account", body: "Install Shakepay, sign up and complete identity verification. Shakepay asks for a government photo ID and a selfie, and checks them before you can deposit." },
          { title: "Deposit Canadian dollars by Interac", body: "Tap **Add funds**, choose **Interac e-Transfer** and send money from your bank to the details Shakepay shows you. Use the exact email and message Shakepay gives you, or the deposit can get stuck.", tip: "Deposit a bit more than your pack's price. Bitcoin's price in CAD moves, and you'll want room for the network fee." },
          { title: "Wait for the deposit to land", body: "Your Shakepay balance updates when the transfer arrives. Shakepay may hold new deposits before they can be sent out as Bitcoin; the app tells you if so." },
        ],
      },
      {
        heading: "Get your invoice details",
        steps: [
          { title: "Open your invoice", body: "Choose a pack on Apollo Group TV. Press **Continue Payment** on your invoice." },
          { title: "Choose Shakepay and press Pay Now", body: "Select **Shakepay** (or **Bitcoin Wallet**). The payment window shows the wallet address, the exact **Amount to Send (BTC)** and how long that amount is locked." },
        ],
      },
      {
        heading: "Buy and send the Bitcoin",
        steps: [
          { title: "Buy Bitcoin", body: "In Shakepay, tap **Buy**, choose **Bitcoin** and enter a CAD amount slightly above your invoice. Shakepay shows the rate it's offering for the next few seconds; review it and confirm before it refreshes. The Bitcoin appears in your Shakepay wallet right away." },
          { title: "Tap Send and choose Bitcoin", body: "From your wallet screen, tap **Send** and select **Bitcoin**." },
          { title: "Paste the Apollo address", body: "Paste the wallet address from the payment window, or scan the QR code. Shakepay may ask for two-factor confirmation for new addresses." },
          { title: "Enter the BTC amount exactly", body: "Enter the **Amount to Send (BTC)** from your invoice. Make sure you're entering BTC, not CAD.", note: "If Shakepay deducts a network fee from the amount, add that fee so the address still receives the full invoice amount." },
          { title: "Confirm the send", body: "Check the address and amount, then confirm. Shakepay shows the transaction in your history once it's broadcast." },
          { title: "Press I Have Paid", body: "Return to the Apollo window and press **I Have Paid** so our team knows to watch for your payment." },
        ],
      },
    ],
    extras: [
      {
        heading: "Shakepay habits that save time",
        paragraphs: ["A few small habits make Shakepay payments painless, especially the first time:"],
        list: ["Turn on two-factor authentication; Shakepay asks for it on new send addresses anyway.","Copy the Interac deposit details from the app each time instead of from an old email.","Fund your account a day ahead for larger packs, in case the first deposit is held.","Keep the Apollo payment window open on your computer and use Shakepay on your phone, so the QR code is easy to scan."],
      },
      {
        heading: "Paying in CAD, priced in USD",
        paragraphs: [
          "Apollo Group TV packs are priced in US dollars. The payment window converts that price to Bitcoin at the moment you open it. Shakepay converts your Canadian dollars to Bitcoin at its own rate. Buying a few dollars extra covers the difference between the two.",
        ],
      },
    ],
    after: afterBitcoin,
    faqs: [
      { q: "Can I pay Apollo Group TV directly by Interac?", a: "Not at the moment. Interac is how you fund Shakepay; the payment itself reaches us as Bitcoin." },
      { q: "My Interac deposit hasn't appeared in Shakepay.", a: "Check you used the exact deposit details Shakepay gave you. Deposits can take longer on new accounts. Shakepay support can trace a missing e-Transfer." },
      { q: "Does Shakepay charge a fee to send Bitcoin?", a: "Shakepay shows any network fee on the send screen before you confirm. Read it there, since fees change with network demand." },
      { q: "I sent from Shakepay but the window still says waiting.", a: "Transactions can take a few minutes to appear and longer to confirm. Keep the window open or press I Have Paid; our system keeps checking." },
      { q: "Can I use Shakepay's Bitcoin if I bought it weeks ago?", a: "Yes. Any Bitcoin in your Shakepay wallet works. Just open a fresh payment window on Apollo so the BTC amount is current, and send that amount." },
      { q: "Will my bank see a payment to Apollo Group TV?", a: "Your bank sees an Interac e-Transfer to Shakepay. The payment to us happens in Bitcoin from your Shakepay wallet." },
    ],
    related: ["crypto-wallet", "moonpay", "bitcoin-network-fees", "payment-troubleshooting"],
  },
  {
    slug: "moonpay",
    name: "MoonPay",
    glyph: "🌙",
    accent: "#7D00FF",
    title: "How to Pay for Apollo Group TV with MoonPay",
    metaTitle: "Pay for Apollo Group TV with MoonPay: Card, Apple Pay, Google Pay",
    description: "Buy Bitcoin with a debit card, credit card, Apple Pay or Google Pay through MoonPay and have it delivered straight to your Apollo Group TV invoice address.",
    summary: "Card, Apple Pay or Google Pay, delivered to your invoice.",
    minutes: 8,
    region: "Most countries",
    updated: UPDATED,
    intro: [
      "MoonPay is the shortest path if you don't own any Bitcoin and don't want to install a new app. You buy Bitcoin with a card or a phone wallet, and MoonPay sends it straight to the address you give it. Give it your Apollo Group TV invoice address and the purchase and the payment happen in one go.",
      "Because the Bitcoin never sits in an account of yours, there's no separate send step. You do need to pass MoonPay's identity check, which is usually quick if your ID and card details match.",
    ],
    needs: [
      "A debit or credit card, Apple Pay or Google Pay",
      "A photo ID for MoonPay's verification",
      "Your Apollo Group TV invoice with the payment window open",
    ],
    flow: ["Card, Apple Pay or Google Pay", "MoonPay buys the Bitcoin", "Delivered to the Apollo invoice address", "Login appears in My Account"],
    sections: [
      {
        heading: "Get your invoice ready",
        steps: [
          { title: "Choose a pack", body: "Sign in, open [Plans & Billing](/dashboard/plan) and choose a pack. Press **Continue Payment** on your invoice." },
          { title: "Select MoonPay and press Pay Now", body: "Choose **MoonPay** (or **Bitcoin Wallet**). The window shows the wallet address and the exact BTC amount. If an **Open MoonPay** button appears, it takes you to the right place." },
        ],
      },
      {
        heading: "Buy through MoonPay",
        steps: [
          { title: "Choose Bitcoin (BTC)", body: "On MoonPay, select **BTC** on the Bitcoin network as the currency to buy." },
          { title: "Set the amount you receive", body: "Where MoonPay lets you enter the crypto amount you get, enter the **Amount to Send (BTC)** from your invoice. If it only accepts a currency amount, enter a little more than your invoice so the delivered Bitcoin covers it.", tip: "What matters is the BTC that arrives at the address. MoonPay shows its fees and the network fee separately before you pay." },
          { title: "Paste the Apollo address as the destination", body: "When MoonPay asks for your wallet address, paste the address from the Apollo window. Double-check it; MoonPay sends to whatever you enter." },
          { title: "Verify your identity", body: "First-time buyers confirm their email and upload an ID. Use the same name as on your card to avoid delays." },
          { title: "Pay", body: "Choose card, Apple Pay or Google Pay and approve the payment. Your bank may show a 3-D Secure check; approve it in your banking app." },
          { title: "Press I Have Paid", body: "Once MoonPay shows the order as processing or complete, go back to the Apollo window and press **I Have Paid**." },
        ],
      },
    ],
    extras: [
      {
        heading: "Avoid the usual MoonPay delays",
        paragraphs: ["Most hold-ups with MoonPay come from verification or the card check, not from the Bitcoin network. Before you start:"],
        list: ["Use a card in your own name, matching the name on your ID.","Photograph your ID in good light with all four corners visible.","Keep your banking app handy for the card approval prompt.","Leave the MoonPay page open until the order shows as sent."],
      },
      {
        heading: "Following your order",
        paragraphs: ["MoonPay shows each stage of your order: payment received, processing, then sent. Once it's sent, MoonPay displays a transaction ID. A few minutes later your Apollo payment window shows **Payment detected**, then the invoice is confirmed when the network adds the transaction to a block."],
      },
      {
        heading: "Debit or credit?",
        paragraphs: [
          "Debit cards and phone wallets linked to debit cards usually go through without extra charges from your bank. Some credit card issuers treat any crypto purchase as a cash advance, which can mean an extra fee and interest from day one. If you're unsure, use debit or check with your card issuer. The [credit and debit card guide](/payment-guides/credit-card) compares the options.",
        ],
      },
    ],
    after: afterBitcoin,
    faqs: [
      { q: "Is MoonPay available where I live?", a: "MoonPay supports many countries but not all, and payment options differ by country. Its site shows what's available after you enter your details." },
      { q: "My card was declined on MoonPay.", a: "Some banks block crypto purchases. Try a debit card, Apple Pay or Google Pay, or call your bank to allow the payment." },
      { q: "How long does MoonPay take to deliver?", a: "MoonPay sends the Bitcoin after your payment clears and your ID is verified. You can follow the order on MoonPay; our window shows Payment detected when it arrives." },
      { q: "Do I need my own crypto wallet?", a: "No. Use your Apollo invoice address as the destination and MoonPay delivers there directly." },
      { q: "Can someone else pay for me through MoonPay?", a: "Yes. They open MoonPay, use your invoice address as the destination and buy the exact BTC amount. You then press I Have Paid on your invoice." },
      { q: "What if less Bitcoin arrives than I expected?", a: "MoonPay's fees are taken from what you pay, so the delivered BTC can be a little lower than a rough estimate. If your invoice shows Underpaid, contact support with the MoonPay order and transaction ID." },
    ],
    related: ["credit-card", "cash-app", "how-checkout-works", "payment-troubleshooting"],
  },
  {
    slug: "credit-card",
    name: "Credit / Debit Card",
    glyph: "💳",
    accent: "#F59E0B",
    title: "How to Pay for Apollo Group TV with a Credit or Debit Card",
    metaTitle: "Pay for Apollo Group TV with a Credit or Debit Card",
    description: "Three ways to pay for Apollo Group TV with a card: MoonPay, Cash App or Venmo, or a crypto exchange. Which to pick, what each costs to watch, and the steps.",
    summary: "Compare the card options and take the quickest path.",
    minutes: 6,
    region: "Worldwide",
    updated: UPDATED,
    intro: [
      "Apollo Group TV doesn't charge cards directly. Instead, your card buys Bitcoin through a service you choose, and that Bitcoin pays your invoice. It sounds like an extra step, but in practice it's one or two screens more than a normal checkout.",
      "This guide helps you pick the right service for your card and country, then sends you to the detailed guide for it.",
    ],
    needs: [
      "A debit or credit card in your name",
      "A photo ID (every card-to-Bitcoin service asks for one)",
      "Your Apollo Group TV invoice open on another tab or device",
    ],
    flow: ["Your card", "A service buys Bitcoin for you", "Sent to the Apollo invoice address", "Login appears in My Account"],
    sections: [
      {
        heading: "Pick your route",
        intro: "All three routes end the same way: Bitcoin arrives at your invoice address. They differ in where the Bitcoin passes through.",
        steps: [
          { title: "Fastest overall: MoonPay", body: "Pay with your card and MoonPay delivers Bitcoin straight to your invoice address. No account to fund, no send step. Best if you just want this done. [Follow the MoonPay guide](/payment-guides/moonpay)." },
          { title: "Already use Cash App or Venmo: buy there", body: "In the US, link your debit card in Cash App or Venmo, buy Bitcoin, then send it to your invoice. A good choice if those apps are already verified on your phone. See the [Cash App](/payment-guides/cash-app) and [Venmo](/payment-guides/venmo) guides." },
          { title: "Have an exchange account: buy and withdraw", body: "If you already use a crypto exchange, buy Bitcoin with your card there and withdraw it to your invoice address. Watch the exchange's withdrawal fee. The [crypto wallet guide](/payment-guides/crypto-wallet) explains withdrawing correctly." },
        ],
      },
      {
        heading: "Paying, whichever route you chose",
        steps: [
          { title: "Open your invoice first", body: "Choose your pack and press **Continue Payment**, then **Pay Now** on a Bitcoin option. Note the exact BTC amount and the time it's locked for." },
          { title: "Make sure the full amount arrives", body: "Fees are charged by the service you use, not by us. Whatever the service takes, the address must receive the BTC amount on your invoice. Buy a little extra to be safe; small overpayments are fine." },
          { title: "Send only on the Bitcoin network", body: "If the service asks which network, choose **Bitcoin** (sometimes shown as BTC or on-chain). Never choose Lightning, a token on another chain, or wrapped Bitcoin." },
          { title: "Press I Have Paid", body: "When the service shows the Bitcoin as sent, press **I Have Paid** in the Apollo window." },
        ],
      },
    ],
    extras: [
      {
        heading: "Which route suits you",
        paragraphs: ["A quick way to decide:"],
        list: ["**You want it done in one go**: MoonPay. One purchase, delivered to your invoice.","**Cash App or Venmo is already verified on your phone**: buy there and send.","**You already trade crypto**: use your exchange and withdraw to the invoice.","**You're outside the US**: MoonPay, or an exchange that operates in your country."],
      },
      {
        heading: "Keep your card details safe",
        paragraphs: ["Enter your card only inside the official MoonPay, Cash App, Venmo or exchange app or website. Apollo Group TV never asks for card numbers by email, chat or phone, and no one from our team needs them to activate your account."],
      },
      {
        heading: "Credit cards and cash-advance fees",
        paragraphs: [
          "Many card issuers classify crypto purchases as cash advances. That can add a cash-advance fee and start interest straight away, even if you pay your balance in full each month. Debit cards don't have this problem. If you want to use a credit card, check your issuer's policy first.",
        ],
      },
      {
        heading: "Why we use Bitcoin for card payments",
        paragraphs: [
          "Routing card payments through Bitcoin lets our system confirm payment on the blockchain without storing your card details. Your card information stays with the service you chose; Apollo Group TV only ever sees the Bitcoin transaction.",
        ],
      },
    ],
    after: afterBitcoin,
    faqs: [
      { q: "Can I enter my card number on Apollo Group TV?", a: "No. We don't take card details. Use MoonPay, Cash App, Venmo or an exchange to turn your card payment into Bitcoin." },
      { q: "Which option is cheapest?", a: "It depends on your country, card and the day's network fees. Each service shows its total before you pay, so compare the final amount rather than the advertised fee." },
      { q: "Can I use a prepaid or gift card?", a: "Most crypto services reject prepaid cards. A debit card in your own name works best." },
      { q: "Is a refund possible if I paid by card?", a: "Refunds follow our [Refund Policy](/refund-policy) and are arranged with our team. Card disputes go to the service you bought the Bitcoin from, not to Apollo Group TV." },
      { q: "Why does my statement show a different company?", a: "The charge comes from the service that sold you the Bitcoin, such as MoonPay or Cash App, not from Apollo Group TV." },
      { q: "Can I pay with PayPal?", a: "PayPal isn't a checkout option. If a service you use lets you buy Bitcoin with PayPal, you can send that Bitcoin to your invoice like any other." },
    ],
    related: ["moonpay", "cash-app", "venmo", "crypto-wallet"],
  },
  {
    slug: "crypto-wallet",
    name: "Crypto Wallet",
    glyph: "🔐",
    accent: "#22D3EE",
    title: "How to Pay for Apollo Group TV from Your Own Crypto Wallet or Exchange",
    metaTitle: "Pay for Apollo Group TV from a Bitcoin Wallet or Exchange",
    description: "Already hold Bitcoin? Pay your Apollo Group TV invoice from a mobile wallet, hardware wallet or exchange. Scan the QR, pick a fee, avoid the wrong network.",
    summary: "Send from a wallet you control or from an exchange.",
    minutes: 5,
    region: "Worldwide",
    updated: UPDATED,
    intro: [
      "If you already have Bitcoin, paying is a single transaction. Open your wallet, scan the QR code in your Apollo payment window, confirm, and you're done. The QR code carries the address and the amount together, so most wallets fill everything in for you.",
      "Exchanges work too, with one difference that trips people up: many exchanges take their withdrawal fee out of the amount you send. This guide shows how to handle that.",
    ],
    needs: [
      "Bitcoin in a wallet (mobile, desktop or hardware) or on an exchange",
      "Enough to cover your invoice plus the network fee",
      "Your Apollo Group TV invoice with the payment window open",
    ],
    flow: ["Your wallet or exchange", "Scan the QR or paste the address", "Bitcoin network confirms", "Login appears in My Account"],
    sections: [
      {
        heading: "From a wallet you control",
        intro: "Mobile wallets, desktop wallets and hardware wallets all follow the same pattern.",
        steps: [
          { title: "Open your invoice and payment window", body: "Choose a pack, press **Continue Payment**, select **Bitcoin Wallet** and press **Pay Now**." },
          { title: "Tap Send and scan the QR code", body: "In your wallet, choose **Send** and scan the QR code. The address and the exact BTC amount are filled in automatically in most wallets.", tip: "If your wallet only reads the address, type the amount from **Amount to Send (BTC)** yourself." },
          { title: "Choose a network fee", body: "Your wallet offers fee levels. A higher fee confirms faster; a low fee can take hours when the network is busy. The fee is paid on top, so the invoice amount still arrives in full." },
          { title: "Check and confirm", body: "Compare the first and last characters of the address with the payment window, confirm the amount, then sign. Hardware wallets show the address on the device; check it there." },
          { title: "Press I Have Paid", body: "Press **I Have Paid** in the payment window if you'd like our team to look out for it. The window also detects your transaction on its own." },
        ],
      },
      {
        heading: "From an exchange",
        steps: [
          { title: "Go to Withdraw or Send", body: "On your exchange, open **Withdraw** for Bitcoin (BTC)." },
          { title: "Paste the address and choose the Bitcoin network", body: "Paste the wallet address from your invoice. When asked for a network, choose **Bitcoin** (BTC). Exchanges often list other networks; using one of them can lose your payment." },
          { title: "Add the withdrawal fee to the amount", body: "Look at the line that says what the recipient gets. If the exchange subtracts its fee from your amount, increase the amount until the received figure matches your invoice.", note: "This is the most common cause of underpaid invoices from exchanges." },
          { title: "Confirm with your security checks", body: "Approve the withdrawal by email, authenticator app or SMS. Some exchanges hold first withdrawals to new addresses for a short time." },
          { title: "Press I Have Paid", body: "When the exchange shows the withdrawal as sent, press **I Have Paid** in the Apollo window." },
        ],
      },
    ],
    extras: [
      {
        heading: "Exchange withdrawal checklist",
        paragraphs: ["Run through this before you press Withdraw:"],
        list: ["Asset: BTC. Network: Bitcoin.","Address pasted from your Apollo payment window, first and last characters checked.","Received amount equals the BTC amount on your invoice.","Your exchange's security checks are ready (email, authenticator or SMS)."],
      },
      {
        heading: "Protect yourself from address swaps",
        paragraphs: ["Some malware replaces copied crypto addresses with the attacker's own. After pasting, compare the beginning and end of the address with your payment window. On a hardware wallet, always confirm the address on the device's own screen before approving."],
      },
      {
        heading: "Networks to avoid",
        paragraphs: ["Your invoice can only be paid on the Bitcoin network. These look similar but won't reach us:"],
        list: [
          "Lightning Network payments or invoices",
          "BTC tokens on other chains, such as BEP-20, ERC-20 or TRC-20",
          "Wrapped Bitcoin (WBTC) or other Bitcoin-pegged tokens",
          "Bitcoin Cash (BCH) or Bitcoin SV (BSV), which are different coins",
        ],
      },
    ],
    after: afterBitcoin,
    faqs: [
      { q: "Can I reuse the address for my next payment?", a: "Always open a fresh payment window for each invoice. The BTC amount is unique to each invoice, and that's how we recognize your payment." },
      { q: "My transaction is stuck unconfirmed.", a: "A low fee can leave a transaction waiting. Many wallets let you bump the fee (Replace-By-Fee). Your invoice stays in Pending Confirmation in the meantime; it won't expire while the payment is detected." },
      { q: "Can I pay from two wallets?", a: "Please send one transaction for the full amount. Split payments can't be matched automatically. If it's already happened, press I Have Paid and contact support with both transaction IDs." },
      { q: "Do you support Lightning?", a: "Not yet. Please send on-chain Bitcoin only." },
      { q: "Does the QR code work in every wallet?", a: "The QR code follows the standard Bitcoin payment format, which most wallets read, including the amount. If your wallet only fills in the address, type the amount yourself." },
      { q: "Which address format do you use?", a: "A standard modern Bitcoin address. Current wallets and exchanges can send to it." },
    ],
    related: ["bitcoin-network-fees", "payment-troubleshooting", "shakepay", "how-checkout-works"],
  },
  {
    slug: "zelle",
    name: "Zelle",
    glyph: "🏦",
    accent: "#6D1ED4",
    title: "How to Pay for Apollo Group TV with Zelle",
    metaTitle: "Pay for Apollo Group TV with Zelle: Bank-to-Bank Guide",
    description: "When Zelle is offered at checkout, pay from your US bank app, add your invoice number, then press I Have Paid. What to send, what to write and how review works.",
    summary: "Bank-to-bank in dollars when it's offered at checkout.",
    minutes: 5,
    region: "US only",
    updated: UPDATED,
    intro: [
      "Zelle moves dollars between US bank accounts in minutes, straight from your bank's app. When Zelle appears as a payment method at checkout, you can pay your Apollo Group TV invoice without touching Bitcoin at all.",
      "Zelle payments are checked by our team instead of the blockchain, so two details matter more than usual: the invoice number in your memo, and pressing **I Have Paid** when you're done.",
    ],
    needs: [
      "A US bank account enrolled in Zelle (inside your bank's app)",
      "Zelle listed as a payment method on your Apollo checkout",
      "Your Apollo Group TV invoice open in [Plans & Billing](/dashboard/plan)",
    ],
    flow: ["Your bank app", "Zelle in US dollars", "Our team confirms receipt", "Login appears in My Account"],
    sections: [
      {
        heading: "Pay with Zelle",
        steps: [
          { title: "Open your invoice and choose Zelle", body: "Choose your pack, press **Continue Payment**, select **Zelle** and press **Pay Now**. The window shows the amount in USD, the Zelle recipient and your invoice number." },
          { title: "Open Zelle in your bank app", body: "Sign in to your bank's app and choose **Send money with Zelle**." },
          { title: "Add the recipient exactly as shown", body: "Use the email or phone number from the payment window. Before sending, Zelle shows the recipient's registered name; check it looks right.", note: "Only send to the details shown in your Apollo payment window. We will never ask you to pay a different Zelle contact by email or message." },
          { title: "Enter the amount and your invoice number", body: "Send the exact USD amount. In the memo, paste your invoice number (it starts with AGT-). That's how we match the payment to your account." },
          { title: "Send and copy your confirmation", body: "Confirm the payment. Your bank shows a confirmation or reference number; copy it." },
          { title: "Press I Have Paid", body: "In the Apollo window, paste the confirmation number into the reference field and press **I Have Paid**. Your invoice moves to Pending Confirmation." },
        ],
      },
    ],
    extras: [
      {
        heading: "Getting the details right",
        paragraphs: ["Zelle payments are matched by hand, so clear details mean a faster review:"],
        list: ["Send the exact amount on your invoice, in one payment.","Put only your invoice number (AGT-…) in the memo.","Check the recipient name Zelle shows before confirming.","Keep your bank's confirmation number until your subscription is active."],
      },
      {
        heading: "Zelle and safety",
        paragraphs: ["Zelle itself advises sending money only to people and businesses you trust, because payments to enrolled recipients are usually final. That's why we only ever show Zelle details inside your own payment window. If anyone contacts you with different Zelle details claiming to be Apollo Group TV, don't pay and let our support team know."],
      },
      {
        heading: "Limits, timing and first-time recipients",
        paragraphs: [
          "Every bank sets its own Zelle limits, often lower for new users or new recipients. If your bank refuses the amount, it will tell you the limit; choose another payment method for larger packs rather than splitting the payment.",
          "Payments to someone already enrolled in Zelle usually arrive within minutes. The first time you pay a new recipient, some banks add a short security delay or ask you to confirm by text. That's normal, and it doesn't affect your invoice once you've pressed I Have Paid.",
        ],
      },
      {
        heading: "How Zelle payments are reviewed",
        paragraphs: [
          "Our team checks the incoming payment against your invoice amount and memo, then confirms it. You're notified when it's approved, and your IPTV login is added to [My Account](/dashboard/subscription) as soon as your subscription is activated.",
          "Zelle payments generally can't be cancelled once the recipient is enrolled, so take a moment to check the amount and recipient before you send.",
        ],
      },
    ],
    after: [
      "After you press I Have Paid, the Payment Under Review page shows your invoice details and updates on its own. Once our team confirms the money arrived, the invoice is marked paid.",
      "We then set up your IPTV account. Your username, password, links and expiry date appear in [My Account](/dashboard/subscription), and you'll get a dashboard notification.",
    ],
    faqs: [
      { q: "I don't see Zelle at checkout.", a: "Zelle is only offered when it's switched on for checkout. Use one of the other methods, such as [Cash App](/payment-guides/cash-app) or [MoonPay](/payment-guides/moonpay)." },
      { q: "I forgot to add the invoice number.", a: "Press I Have Paid and put your bank confirmation number in the reference field. That's usually enough to match it; if not, contact support." },
      { q: "My bank has a Zelle limit.", a: "Banks set daily and monthly Zelle limits. If your pack is above your limit, choose another payment method." },
      { q: "Does pressing I Have Paid activate my subscription?", a: "No. It tells our team to check for your payment. Activation follows once the payment is confirmed." },
      { q: "How long does a Zelle review take?", a: "Our team checks Zelle payments as they come in. You'll get a notification as soon as yours is approved, and the Payment Under Review page updates on its own." },
      { q: "Can I split a payment between Zelle and Bitcoin?", a: "Please pay each invoice with one method. Split payments can't be matched to a single invoice." },
    ],
    related: ["how-checkout-works", "cash-app", "payment-troubleshooting", "credit-card"],
  },
  {
    slug: "bitcoin-network-fees",
    name: "Bitcoin Network Fees",
    glyph: "⛽",
    accent: "#F7931A",
    title: "Bitcoin Network Fees Explained: Make Sure Your Payment Arrives in Full",
    metaTitle: "Bitcoin Network Fees Explained for Apollo Group TV Payments",
    description: "Who pays the Bitcoin network fee, why the full invoice amount must arrive, how fee levels affect speed, and how to fix a payment stuck with a low fee.",
    summary: "Who pays the fee, and how to avoid a short payment.",
    minutes: 7,
    region: "Worldwide",
    updated: UPDATED,
    intro: [
      "Every Bitcoin transaction pays a small fee to the miners who add it to the blockchain. That fee isn't charged by Apollo Group TV, and it doesn't go to us. It's the cost of moving Bitcoin, and it's paid by whoever sends.",
      "Understanding one rule saves most payment problems: **the address has to receive the full BTC amount on your invoice**. How you make sure of that depends on whether your app adds the fee on top or takes it out of what you send.",
    ],
    needs: ["Your Apollo Group TV payment window open", "The app or wallet you'll send from"],
    flow: ["Your app adds a network fee", "Miners include the transaction", "Full invoice amount arrives", "Invoice marked paid"],
    sections: [
      {
        heading: "Getting the amount right",
        steps: [
          { title: "Find the received amount in your app", body: "Before confirming, every app and exchange shows a summary. Look for the line that says what the recipient gets or what's being sent to the address." },
          { title: "Fee added on top? Send the invoice amount", body: "Most wallets add the fee on top. Enter the exact **Amount to Send (BTC)** and the fee comes from the rest of your balance." },
          { title: "Fee taken out? Add it back", body: "Some exchanges and apps deduct the fee from the amount you type. Increase your amount by the fee so the received figure still matches your invoice.", note: "Arriving short marks your invoice as underpaid. Arriving slightly over is accepted." },
        ],
      },
      {
        heading: "Choosing a fee level",
        steps: [
          { title: "Higher fee, faster confirmation", body: "Miners pick the transactions that pay the most first. When the network is quiet, even a low fee confirms quickly. When it's busy, low-fee transactions can wait for hours." },
          { title: "Use the app's suggested fast option when in doubt", body: "Fast or priority options are tuned to current demand. They cost a little more, and your invoice is confirmed sooner." },
        ],
      },
    ],
    extras: [
      {
        heading: "An example with numbers",
        paragraphs: ["Say your invoice asks for 0.00150000 BTC and the network fee is 0.00002000 BTC. These numbers are only an illustration:"],
        list: ["**Fee added on top**: you spend 0.00152000 BTC, the address receives 0.00150000 BTC. Correct.","**Fee taken out**: you enter 0.00150000 BTC, the address receives 0.00148000 BTC. Short, so the invoice is underpaid.","**Fee taken out, corrected**: you enter 0.00152000 BTC, the address receives 0.00150000 BTC. Correct."],
      },
      {
        heading: "Why the price is locked",
        paragraphs: ["Bitcoin's price moves all day. When you open the payment window, we convert your pack's US dollar price to Bitcoin and lock that BTC amount for a limited time, shown at the top of the window. Inside that time, the amount won't change. If it runs out, press **Get a new quote** for a fresh amount."],
      },
      {
        heading: "Why the BTC amount has so many decimals",
        paragraphs: [
          "Your payment window locks a BTC price for your invoice and adds a tiny unique amount at the end. Those last digits identify your payment among others arriving at the same address, which is why the amount should be sent exactly, in one transaction.",
        ],
      },
      {
        heading: "If your transaction is stuck",
        paragraphs: [
          "A transaction with a low fee sits in the mempool (the queue of waiting transactions) until a miner includes it. Your options:",
        ],
        list: [
          "Wait. Most stuck transactions confirm once demand drops.",
          "Bump the fee with Replace-By-Fee (RBF), if your wallet supports it.",
          "Ask your exchange or app; some can speed up their own withdrawals.",
          "Press I Have Paid and send support the transaction ID so we can watch for it.",
        ],
      },
    ],
    after: [
      "Once the transaction is detected, your invoice shows **Pending Confirmation**, and it won't expire while it waits. After the network confirms it, the invoice is marked paid and our team activates your subscription. Your login then appears in [My Account](/dashboard/subscription).",
    ],
    faqs: [
      { q: "Does Apollo Group TV charge a payment fee?", a: "No. You pay your pack's price. Network fees and any fees from the app you use are separate and go to them, not to us." },
      { q: "How much is a Bitcoin network fee?", a: "It changes with demand, from cents to several dollars. Your app shows the fee before you confirm." },
      { q: "Can I get the fee back if I overpaid?", a: "Network fees can't be refunded by anyone, because miners receive them. Overpayments to your invoice can be discussed with support under our [Refund Policy](/refund-policy)." },
      { q: "What's a confirmation?", a: "A transaction is confirmed when it's included in a block. New blocks arrive about every ten minutes on average, though the gap varies." },
      { q: "Should I always pick the cheapest fee?", a: "Only if you don't mind waiting. The cheapest option can take hours on a busy day, and your subscription can't be confirmed until the transaction is." },
      { q: "Can I see my transaction on the blockchain?", a: "Yes. Paste your transaction ID into a block explorer such as mempool.space. Once your payment is detected, the payment window also shows a View transaction link." },
    ],
    related: ["crypto-wallet", "payment-troubleshooting", "cash-app", "how-checkout-works"],
  },
  {
    slug: "how-checkout-works",
    name: "How Checkout Works",
    glyph: "🧾",
    accent: "#34D399",
    title: "How Apollo Group TV Checkout Works, from Invoice to Login Details",
    metaTitle: "How Apollo Group TV Checkout Works: Invoice, Payment, Activation",
    description: "Apollo Group TV checkout step by step: choosing a pack, your invoice and timer, the payment window, I Have Paid, review, and where your login appears.",
    summary: "Every step from choosing a pack to your login details.",
    minutes: 6,
    region: "All customers",
    updated: UPDATED,
    intro: [
      "Paying for Apollo Group TV takes four stages: you choose a pack, pay your invoice, we confirm the payment, and your login appears in your account. This page explains each stage and what you'll see, so nothing on the way is a surprise.",
      "Every pack is a one-time payment for a fixed period. Nothing renews automatically, and you only ever pay through your own account.",
    ],
    needs: ["An Apollo Group TV account ([create one free](/create-account))", "A payment method from the [payment guides](/payment-guides)"],
    flow: ["Choose a pack", "Pay your invoice", "We confirm the payment", "Login appears in My Account"],
    sections: [
      {
        heading: "Stage 1: Your invoice",
        steps: [
          { title: "Choose a pack", body: "Pick a pack on the [Plans page](/plans) or in [Plans & Billing](/dashboard/plan). If you choose before signing up, the pack is kept while you create your account." },
          { title: "Your invoice is created", body: "An invoice with its own number (starting AGT-) appears at the top of Plans & Billing, showing the pack, price and status **Pending Payment**." },
          { title: "The reservation timer", body: "The invoice holds your price for a limited time, shown on the timer. If it runs out, the invoice expires and you choose the pack again." },
          { title: "Continue Payment or Cancel Invoice", body: "**Continue Payment** takes you to the payment methods. **Cancel Invoice** releases the reservation if you change your mind." },
        ],
      },
      {
        heading: "Stage 2: Paying",
        steps: [
          { title: "Choose a method and press Pay Now", body: "Each method card has **How to pay** instructions and a **Pay Now** button that opens your payment window." },
          { title: "Bitcoin methods", body: "The window shows a wallet address, an exact BTC amount, a QR code and how long the BTC price is locked. Send that amount in one transaction. If the lock runs out before you send, press **Get a new quote**." },
          { title: "Bank and app methods", body: "For methods like Zelle, the window shows the USD amount, who to pay and your invoice number to put in the memo." },
          { title: "Press I Have Paid", body: "When you've sent the payment, press **I Have Paid**. Your invoice moves to **Pending Confirmation** and you're taken to the Payment Under Review page.", note: "Pressing I Have Paid asks us to check your payment. It doesn't mark the invoice paid by itself." },
        ],
      },
      {
        heading: "Stage 3: Confirmation and activation",
        steps: [
          { title: "We confirm the payment", body: "Bitcoin payments are confirmed on the blockchain automatically. Other methods are checked by our team. You get a **Payment Approved** notification when it's done." },
          { title: "We activate your subscription", body: "Our team creates your IPTV login and sets your start and expiry dates." },
          { title: "Get your login info", body: "Press **Get Your Login Info** on the review page, or open [My Account](/dashboard/subscription). You'll see your status, username, password, M3U and MAG links, Xtream details and expiry date, each with a copy button." },
        ],
      },
    ],
    extras: [
      {
        heading: "Buying for someone else",
        paragraphs: ["Each Apollo Group TV account belongs to one person, and the login details appear in that person's own dashboard. To buy a pack as a present, use **Gift a pack** in your dashboard sidebar and our team will set it up with you."],
      },
      {
        heading: "Extending an active subscription",
        paragraphs: ["Bought a new pack while your current one is still running? The new period is normally set to begin when your current access ends, so you don't lose any days. Your new expiry date shows in My Account once the extension is activated."],
      },
      {
        heading: "Invoice statuses at a glance",
        paragraphs: ["You'll see these labels on your invoice:"],
        list: [
          "**Pending Payment**: waiting for you to pay, with the reservation timer running.",
          "**Pending Confirmation**: you've pressed I Have Paid or your Bitcoin payment was detected.",
          "**Paid**: payment confirmed; activation is on its way.",
          "**Underpaid**: less than the invoice amount arrived; support will help you complete it.",
          "**Expired** or **Cancelled**: no payment was made; choose a pack to start again.",
        ],
      },
    ],
    after: [
      "Next, set up your device with the [setup guides](/guides) and the login details from My Account. If you ever need to add time, choose a new pack and the extension starts when your current access ends.",
    ],
    faqs: [
      { q: "Can I change packs after creating an invoice?", a: "Yes, while it's unpaid. Choose a different pack and the old invoice is replaced." },
      { q: "Does anything renew automatically?", a: "No. Every pack is a one-time payment. You choose whether to buy again." },
      { q: "Where do I see my past payments?", a: "Confirmed payments are listed under Transactions in your dashboard." },
      { q: "What if I paid but the invoice expired?", a: "Don't pay again. Bitcoin payments that arrive after expiry are still matched to your invoice. For other methods, press I Have Paid if you still can, or contact support with your payment reference." },
      { q: "Can I pay in a currency other than US dollars?", a: "Packs are priced in US dollars. Bitcoin methods convert that price when you open the payment window, and Shakepay lets Canadians fund the purchase in CAD." },
      { q: "Do you store my payment details?", a: "We don't take card details. We keep a record of each invoice and payment reference so your account history is complete." },
    ],
    related: ["payment-troubleshooting", "crypto-wallet", "zelle", "bitcoin-network-fees"],
  },
  {
    slug: "payment-troubleshooting",
    name: "Payment Troubleshooting",
    glyph: "🛠️",
    accent: "#F472B6",
    title: "Apollo Group TV Payment Troubleshooting: Fix Common Payment Problems",
    metaTitle: "Apollo Group TV Payment Problems: Underpaid, Expired, Pending",
    description: "Fixes for Apollo Group TV payment problems: underpaid invoices, expired quotes, pending transactions, wrong networks, rejected addresses, double payments.",
    summary: "Underpaid, expired, stuck or rejected: what to do.",
    minutes: 8,
    region: "All customers",
    updated: UPDATED,
    intro: [
      "Most payment problems have a quick fix, and almost none of them mean your money is lost. Find your situation below and follow the steps. If you're still stuck, open a ticket from [Support](/dashboard/support/new) with your invoice number and, for Bitcoin, the transaction ID.",
      "One rule first: **if you've already sent a payment, don't send it again** until you've checked the status. A second payment is harder to sort out than a late first one.",
    ],
    needs: ["Your invoice number (starts with AGT-)", "Your transaction ID or payment reference, if you've paid"],
    flow: ["Spot the problem", "Check your invoice status", "Apply the fix", "Contact support if needed"],
    sections: [
      {
        heading: "Before you've paid",
        steps: [
          { title: "The price lock ran out", body: "Press **Get a new quote** in the payment window. A fresh BTC amount is locked for you. Send the new amount, not the old one." },
          { title: "The reservation timer ended", body: "Your invoice expired because no payment arrived in time. Choose your pack again in [Plans & Billing](/dashboard/plan) to get a new invoice." },
          { title: "My app says the address isn't valid", body: "Copy the address again with the **Copy** button rather than typing it, and check you're sending Bitcoin on the Bitcoin network. If the app still refuses, try another method such as [MoonPay](/payment-guides/moonpay) and let support know which app rejected it." },
          { title: "A payment method isn't listed", body: "Only methods that are set up for checkout appear. Choose another; the [payment guides](/payment-guides) cover each one." },
        ],
      },
      {
        heading: "After you've paid",
        steps: [
          { title: "The window still says Waiting for Payment", body: "New transactions can take a few minutes to appear. Check your app shows the transaction as sent. Press **I Have Paid** so our team watches for it, and keep your transaction ID handy." },
          { title: "My invoice says Underpaid", body: "Less than the invoice amount arrived, usually because a fee was taken out of the amount sent. Don't start a new invoice. Open a support ticket with your transaction ID; we'll tell you how to complete or refund it." },
          { title: "My transaction is stuck unconfirmed", body: "A low network fee can delay confirmation. Your invoice stays in Pending Confirmation and won't expire. See [Bitcoin network fees](/payment-guides/bitcoin-network-fees) for ways to speed it up." },
          { title: "I sent on the wrong network", body: "Payments sent on another network, as a token or as Lightning don't reach your invoice address. Contact the app or exchange you sent from first; recovery depends on them. Then open a ticket with us." },
          { title: "I paid twice", body: "Don't worry; open a ticket with both transaction IDs. Extra payments are handled under our [Refund Policy](/refund-policy) or can be applied to an extension." },
          { title: "My invoice is Paid but there's no login yet", body: "Your payment is confirmed and our team is activating your subscription. Your login appears in [My Account](/dashboard/subscription) as soon as it's ready, and you'll get a notification." },
        ],
      },
    ],
    extras: [
      {
        heading: "Watch out for impersonators",
        paragraphs: ["Payment problems attract scammers. Keep these rules in mind:"],
        list: ["Only pay using the details in your own Apollo Group TV payment window.","Our team never asks for your password, card number or a payment by direct message.","Support conversations happen in tickets inside your dashboard.","If someone offers to fix a payment for an extra fee, it isn't us."],
      },
      {
        heading: "Information that speeds up support",
        paragraphs: ["Include these in your ticket and we can usually resolve it in one reply:"],
        list: [
          "Your invoice number (AGT-…)",
          "The app or wallet you paid from",
          "The amount you sent and the time",
          "The Bitcoin transaction ID, or your bank or app confirmation number",
        ],
      },
    ],
    after: [
      "Once the issue is fixed, your invoice moves to Paid and your subscription is activated as usual. Your login details appear in [My Account](/dashboard/subscription).",
    ],
    faqs: [
      { q: "Where do I find my Bitcoin transaction ID?", a: "In the transaction details of the app you sent from. It's a long string of letters and numbers, sometimes called TXID or hash." },
      { q: "Can a Bitcoin payment be reversed?", a: "No. Bitcoin transactions are final once sent, which is why checking the address and amount before confirming matters." },
      { q: "Will my invoice expire while my payment is confirming?", a: "No. Once your payment is detected or you've pressed I Have Paid, the invoice waits for confirmation." },
      { q: "Someone messaged me with different payment details.", a: "Don't pay. Only use the details in your own Apollo Group TV payment window. Report the message to support." },
      { q: "Can I get a refund?", a: "Refunds follow our [Refund Policy](/refund-policy), including the time window and conditions. Open a ticket from your dashboard to request one." },
      { q: "The payment page won't load.", a: "Refresh the page and check your connection. If it still won't load, open a support ticket with your invoice number; don't send a payment until you can see your payment window." },
    ],
    related: ["bitcoin-network-fees", "how-checkout-works", "crypto-wallet", "cash-app"],
  },
];

export function getPaymentGuide(slug: string) {
  return paymentGuides.find((g) => g.slug === slug);
}
