/**
 * General setup guides. These describe this website's own flows, so they are verifiable.
 * Device-specific guides are NOT written here: they are generated from platforms an admin
 * marks as verified in Admin → Settings → App platforms (official link + steps).
 */
export type GuideStep = { title: string; body: string };
export type Guide = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  intro: string;
  requirements: string[];
  steps: GuideStep[];
  troubleshooting: { q: string; a: string }[];
  security: string[];
  faqCategories: string[];
};

export const generalGuides: Guide[] = [
  {
    slug: "account-setup",
    title: "Create and verify your Apollo Group TV account",
    metaTitle: "Create Your Apollo Group TV Account — Step-by-Step",
    description: "Set up your Apollo Group TV account in a few minutes: sign up, verify your email, choose a plan and get ready to install the app.",
    intro:
      "Everything starts with your account: it holds your plan, your billing history and your support tickets. Here's how to set it up properly the first time.",
    requirements: ["An email address you can access right now", "A password with at least 10 characters, including upper- and lowercase letters and a number"],
    steps: [
      { title: "Open the sign-up page", body: "Go to [Create account](/create-account). If a friend shared a referral link, open that link instead so the referral is recorded." },
      { title: "Enter your details", body: "Add your full name, email and password, confirm the password and accept the terms. The checklist under the password field shows which rules are met." },
      { title: "Verify your email", body: "Open the email we send and select the verification link. It's valid for 24 hours; if it expires, request a new one on the [Verify email](/verify-email) page." },
      { title: "Choose a plan", body: "In your dashboard, open My Plan, compare the options and request the one you want. Our team confirms activation in a support ticket." },
      { title: "Install the app", body: "Once your plan is active, follow the guide for your device from the [setup guides](/guides)." },
    ],
    troubleshooting: [
      { q: "The verification email hasn't arrived", a: "Check spam and promotions folders, wait a couple of minutes, then request a new link. Make sure the email address was typed correctly." },
      { q: "“Too many attempts” appears", a: "Sign-up and sign-in are rate-limited to protect accounts. Wait a minute and try again." },
      { q: "I can't sign in after verifying", a: "Use “Forgot password?” on the Sign in page to set a new password, then try again." },
    ],
    security: ["Use a password you don't use anywhere else.", "We will never ask for your password by email, chat or phone.", "Review signed-in devices any time under Dashboard → Security."],
    faqCategories: ["Account & Security", "Plans & Billing"],
  },
  {
    slug: "troubleshooting",
    title: "Troubleshooting sign-in and playback",
    metaTitle: "Apollo Group TV Troubleshooting — Sign-In & Playback Fixes",
    description: "Fix common Apollo Group TV problems: sign-in errors, buffering, outdated apps and device issues, with a checklist to try before contacting support.",
    intro: "Most problems have a quick fix. Work through these checks in order — each one rules out a common cause before you need to contact us.",
    requirements: ["Your account email", "Access to your device and your internet router"],
    steps: [
      { title: "Confirm your account is ready", body: "Sign in on this website. Check that your email is verified and that your plan shows as Active under [My Plan](/dashboard/plan)." },
      { title: "Restart the device and router", body: "Power both off for about 30 seconds, then turn the router on first and the device once the connection is back." },
      { title: "Check the connection", body: "If you can, use a wired connection or move closer to the router. Pause other downloads or streams on the same network." },
      { title: "Update the app", body: "Install the latest version from the official link in your device's guide. Old versions can fail to sign in or play." },
      { title: "Reinstall if needed", body: "Uninstall the app, restart the device and install it again from the official link, then sign in." },
      { title: "Contact support", body: "Still stuck? [Open a ticket](/dashboard/support/new) with your device model, the app version and what you see on screen." },
    ],
    troubleshooting: [
      { q: "The app says my credentials are wrong", a: "Reset your password from the Sign in page, then sign in again on the device with the new password." },
      { q: "Video starts, then keeps buffering", a: "This usually points to the network. Try a wired connection, a router restart, or fewer devices streaming at once." },
      { q: "A channel won't play but others do", a: "Content availability can change. Let us know in a ticket which channel and when, so we can check." },
    ],
    security: ["Only install the app from official links or app stores.", "Avoid “fixes” that ask you to install unknown files or share your password."],
    faqCategories: ["Troubleshooting", "App & Playback"],
  },
];

export function deviceGuideCopy(name: string) {
  return {
    title: `Set up Apollo Group TV on ${name}`,
    metaTitle: `Set Up Apollo Group TV on ${name} — Step-by-Step`,
    description: `Install Apollo Group TV on ${name} using the official download link, then sign in. Includes requirements, numbered steps and troubleshooting.`,
    intro: `This guide covers installing the Apollo Group TV app on ${name}. We've verified this device and list only the official download source, so follow these steps rather than instructions found elsewhere.`,
  };
}
