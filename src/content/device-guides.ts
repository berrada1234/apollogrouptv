/**
 * Device-specific guide content. Each device type explains its own install method, the problems people
 * actually hit on that platform and how to solve them — so every guide page is useful on its own.
 * Download links, codes and numbered steps still come from Admin → Settings → App platforms.
 */
export type DeviceProfile = {
  key: string;
  match: RegExp;
  metaTitle: (name: string) => string;
  description: (name: string) => string;
  intro: string;
  /** One line for the public App page: how this device gets the app. */
  summary: string;
  requirements: string[];
  /** Final step after the admin's numbered steps. */
  finish: { title: string; body: string };
  troubleshooting: { q: string; a: string }[];
  security: string[];
  faqs: { q: string; a: string }[];
};

/** Account sign-in step with a practical tip for the device. */
const accountSignIn = (tip: string) => ({
  title: "Sign in with your account",
  body: `Open the app and sign in with the same email and password you use on this website — ${tip} Watching needs an active pack ([Plans & Billing](/dashboard/plan)).`,
});

const playerSignIn = {
  title: "Sign in with your player login",
  body: "Use the server URL, username and password shown under [My Accounts → Player login](/dashboard/profile#player-login) — not your website email and password.",
};

// Order matters: the first matching profile wins.
export const deviceProfiles: DeviceProfile[] = [
  {
    key: "firetv",
    match: /fire|android\s*tv|google\s*tv/i,
    metaTitle: (n) => `Install Apollo Group TV on ${n}: Downloader Setup Guide`,
    description: (n) =>
      `Put the Apollo TV app on ${n} with the free Downloader app in about five minutes — enabling installs, entering the code, fixing common Fire TV errors.`,
    summary:
      "Installs once through the free Downloader app with an official code; later updates arrive inside the app.",
    intro:
      "Fire TV sticks, Fire TV Cubes and Android TV boxes don't list the Apollo TV app in their own stores, so it installs through Downloader — a free, widely used installer app. You only do this once: after that, updates arrive inside the Apollo TV app.",
    requirements: [
      "A Fire TV device, or an Android TV / Google TV box, connected to the internet",
      "Your remote (or the Fire TV mobile app as a remote)",
      "The Downloader code from your dashboard under [Apps & Guides](/dashboard/apps)",
      "Your account email and password (an active pack is needed to watch)",
    ],
    finish: accountSignIn(
      "the Fire TV mobile app's keyboard is quicker than typing with the remote.",
    ),
    troubleshooting: [
      {
        q: "I can't find “Developer options” on my Fire TV",
        a: "On newer Fire TV software it's hidden. Go to Settings → My Fire TV → About, highlight your device name and press Select seven times — Developer options then appears in the My Fire TV menu.",
      },
      {
        q: "Downloader says the code doesn't exist",
        a: "Check each digit against the code in your dashboard, then try the full web address shown under it instead. If both fail, open a ticket — the code may have been replaced.",
      },
      {
        q: "Installation fails or the TV runs out of space",
        a: "Uninstall apps you don't use and clear the cache of large apps under Settings → Applications → Manage installed applications, then run Downloader again.",
      },
      {
        q: "The app closes as soon as it opens",
        a: "Unplug the device for 30 seconds, plug it back in and open the app again. If it still closes, uninstall it and reinstall with the official code to get the latest version.",
      },
    ],
    security: [
      "Enter only the official code from your dashboard. Codes from videos, forums or social media can install modified apps.",
      "Once the app is installed you can switch “Install unknown apps” back off for Downloader.",
      "Never install builds labelled “mod”, “premium unlocked” or similar — they aren't ours.",
    ],
    faqs: [
      {
        q: "Do I repeat these steps for every update?",
        a: "No. The Downloader step is a one-off — new versions are offered and installed from inside the Apollo TV app.",
      },
      {
        q: "Can I delete Downloader afterwards?",
        a: "Yes. The Apollo TV app keeps working without it. Keep it only if you want to reinstall quickly later.",
      },
      {
        q: "Will it run on an older or entry-level Fire TV stick?",
        a: "Lower-powered sticks can run the app in HD. For 4K you need a 4K-capable Fire TV device, a 4K TV and a fast, stable connection.",
      },
    ],
  },
  {
    key: "android-mobile",
    match: /android/i,
    metaTitle: (n) => `Install Apollo Group TV on ${n}: APK Setup Guide`,
    description: (n) =>
      `Download the official Apollo TV APK on your ${n}, allow the one-time install permission, handle Play Protect prompts and sign in.`,
    summary:
      "A direct APK download — allow your browser to install it once, and the app keeps itself up to date.",
    intro:
      "On Android phones and tablets the Apollo TV app installs from an APK file you download directly — no store account needed. Android asks once for permission to install apps from your browser; after that, the app updates itself.",
    requirements: [
      "An Android phone or tablet with a recent Android version",
      "Enough free storage for the app and its updates",
      "Wi-Fi recommended — streaming uses a lot of mobile data",
      "Your account login — you'll only need to type it once",
    ],
    finish: accountSignIn(
      "your login stays saved, so you won't be asked again.",
    ),
    troubleshooting: [
      {
        q: "Android blocks the install",
        a: "Open Settings → Apps → Special app access → Install unknown apps, choose the browser you downloaded with and allow it. Menu names vary slightly between phone makers.",
      },
      {
        q: "“There was a problem parsing the package”",
        a: "The download was probably interrupted. Delete the file from Downloads, download it again on a stable connection and reopen it.",
      },
      {
        q: "Play Protect shows a warning",
        a: "Play Protect flags apps installed from outside Google Play. If you downloaded from the official link in your dashboard, you can choose to install anyway; if you got the file anywhere else, don't.",
      },
    ],
    security: [
      "Download the APK only from the official link in your dashboard.",
      "Delete the APK file from Downloads after installing — you don't need it any more.",
      "Lock your phone if other people use it: the app stays signed in to your account.",
    ],
    faqs: [
      {
        q: "Does the same file work on tablets?",
        a: "Yes. The phone APK adapts to tablet screens — install it the same way.",
      },
      {
        q: "How much data does streaming use?",
        a: "It depends on picture quality and how long you watch; HD and 4K use far more than standard definition. Use Wi-Fi where you can.",
      },
    ],
  },
  {
    key: "macos",
    match: /mac/i,
    metaTitle: (n) =>
      `Install Apollo Group TV on ${n}: DMG Setup & Gatekeeper Fix`,
    description: (n) =>
      `Install the Apollo TV app on ${n} from the official DMG, get past the “app is damaged” message once, and sign in.`,
    summary:
      "A universal DMG for macOS 12 or later. One Terminal command lets the unsigned app open the first time.",
    intro:
      "On a Mac the Apollo TV app comes as a DMG disk image. Because the app isn't signed with an Apple Developer ID, macOS blocks the first launch — a single Terminal command (or a click in System Settings) tells your Mac you trust it.",
    requirements: [
      "A Mac running macOS 12 or later",
      "Permission to install apps (an administrator account)",
      "The Terminal command from your dashboard under [Apps & Guides](/dashboard/apps)",
      "Your account login and an active pack",
    ],
    finish: accountSignIn(
      "keep the app in your Dock for one-click access next time.",
    ),
    troubleshooting: [
      {
        q: "“Apollo Group TV is damaged and can't be opened”",
        a: "That's Gatekeeper reacting to an unsigned app, not real damage. Make sure the app is in Applications, run the Terminal command from your dashboard exactly as shown, then open the app again.",
      },
      {
        q: "I'd rather not use Terminal",
        a: "Try opening the app once, then go to System Settings → Privacy & Security and choose Open Anyway next to the Apollo Group TV message.",
      },
      {
        q: "Terminal says “No such file or directory”",
        a: "The app isn't in your Applications folder yet, or it was renamed. Drag it from the DMG into Applications first and paste the command again, including the quotation marks.",
      },
    ],
    security: [
      "Run only the exact command shown in your dashboard — never Terminal commands sent to you by anyone else.",
      "The command applies to the Apollo Group TV app only; it doesn't change your Mac's security settings.",
      "Eject and delete the DMG after installing.",
    ],
    faqs: [
      {
        q: "Does it work on Apple silicon and Intel Macs?",
        a: "The download is a universal build, so it runs natively on both.",
      },
      {
        q: "How do I uninstall it?",
        a: "Quit the app and drag Apollo Group TV from Applications to the Trash.",
      },
    ],
  },
  {
    key: "windows",
    match: /windows|\bpc\b/i,
    metaTitle: (n) =>
      `Install Apollo Group TV on ${n}: Installer & SmartScreen Guide`,
    description: (n) =>
      `Run the official Apollo TV installer on ${n} (Windows 10 and 11), get past the SmartScreen prompt and sign in.`,
    summary:
      "A standard installer for Windows 10 and 11. Choose “Run anyway” on the SmartScreen prompt the first time.",
    intro:
      "On Windows 10 and 11 the Apollo TV app installs with a standard setup wizard. The installer isn't code-signed, so Windows SmartScreen shows a warning the first time — the steps below show how to continue safely.",
    requirements: [
      "A PC running Windows 10 or Windows 11",
      "Permission to install programs on the PC",
      "Your account login and an active pack to watch",
    ],
    finish: accountSignIn(
      "pin the app to the taskbar or Start menu so it's one click away.",
    ),
    troubleshooting: [
      {
        q: "“Windows protected your PC”",
        a: "That's SmartScreen. Select More info, check the app name, then choose Run anyway. Only do this for the installer you downloaded from your dashboard.",
      },
      {
        q: "My antivirus removed the installer",
        a: "Some antivirus tools quarantine unsigned installers. Restore the file from quarantine (or allow it once), then run it again.",
      },
      {
        q: "The app doesn't start after installing",
        a: "Restart the PC and try again. If it still won't open, uninstall it from Settings → Apps and reinstall with the latest installer.",
      },
    ],
    security: [
      "Run only the installer you downloaded from your dashboard.",
      "If SmartScreen shows a different app name or publisher than you expect, stop and contact us.",
      "Keep Windows updated — it protects the PC you watch on.",
    ],
    faqs: [
      {
        q: "Does it work on Windows 7 or 8?",
        a: "The installer is built for Windows 10 and 11. Older versions aren't supported.",
      },
      {
        q: "How do I uninstall it?",
        a: "Open Settings → Apps → Installed apps, find Apollo Group TV and choose Uninstall.",
      },
    ],
  },
  {
    key: "apple-tv",
    match: /apple\s*tv|tvos/i,
    metaTitle: (n) => `Watch Apollo Group TV on ${n} with UHF: Setup Guide`,
    description: (n) =>
      `Set up Apollo Group TV on ${n} with the UHF player from the App Store using your Xtream player login and server URL.`,
    summary:
      "Watch through the UHF player from the tvOS App Store, signed in with your player login.",
    intro:
      "On Apple TV you watch through UHF, a third-party player from the App Store, connected to your subscription with your player login. Typing with the Siri Remote is slow, so it helps to have your iPhone nearby for the keyboard.",
    requirements: [
      "An Apple TV with access to the App Store",
      "Your player login under [My Accounts → Player login](/dashboard/profile#player-login)",
      "The server URL from your dashboard under [Apps & Guides](/dashboard/apps)",
      "An active pack",
    ],
    finish: playerSignIn,
    troubleshooting: [
      {
        q: "UHF says the login failed",
        a: "Make sure you picked Xtream Login, not M3U. Usernames and passwords are case-sensitive, and the server URL must include http:// exactly as shown in your dashboard.",
      },
      {
        q: "Typing with the remote takes forever",
        a: "When a text field is open on Apple TV, a keyboard prompt appears on nearby iPhones signed in to the same Apple ID — type there instead.",
      },
      {
        q: "There's no player login in My Accounts",
        a: "It appears once our team activates your pack. If your pack is active and it's still missing, open a ticket.",
      },
    ],
    security: [
      "Keep your player login private — anyone with it can use your subscription.",
      "UHF is made by a separate developer. Any purchases inside UHF are sold by them, not by us; check the App Store listing first.",
    ],
    faqs: [
      {
        q: "Is UHF made by Apollo Group TV?",
        a: "No. UHF is an independent player app. We recommend it because it supports the Xtream login your subscription uses.",
      },
      {
        q: "Can I use the same login on my iPhone?",
        a: "Yes, within your pack's device allowance. Set up UHF on each device with the same player login.",
      },
    ],
  },
  {
    key: "ios",
    match: /iphone|ipad|ios|apple/i,
    metaTitle: (n) => `Watch Apollo Group TV on ${n} with UHF: Setup Guide`,
    description: (n) =>
      `Install UHF from the App Store on ${n}, add your Xtream player login and server URL, and start watching Apollo Group TV.`,
    summary:
      "Watch through the UHF player from the App Store, signed in with your player login.",
    intro:
      "On iPhone and iPad you watch through UHF, a third-party player from the App Store. It connects to your subscription with your player login — a separate username and password our team issues — rather than your website account.",
    requirements: [
      "An iPhone or iPad with access to the App Store",
      "Your player login under [My Accounts → Player login](/dashboard/profile#player-login)",
      "The server URL from your dashboard under [Apps & Guides](/dashboard/apps)",
      "An active pack",
    ],
    finish: playerSignIn,
    troubleshooting: [
      {
        q: "UHF says the login failed",
        a: "Choose Xtream Login (Xtream Codes API), not M3U. Copy the username, password and server URL from your dashboard to avoid typos — they're case-sensitive.",
      },
      {
        q: "Channels load but the guide is empty",
        a: "Guide data can take a few minutes to arrive the first time. Leave the app open briefly, then refresh the playlist from UHF's settings.",
      },
      {
        q: "There's no player login in My Accounts",
        a: "It appears once our team activates your pack. If your pack is active and it's still missing, open a ticket.",
      },
    ],
    security: [
      "Copy your player login from your dashboard rather than storing it in notes or messages.",
      "UHF is made by a separate developer. Any purchases inside UHF are sold by them, not by us; check the App Store listing first.",
    ],
    faqs: [
      {
        q: "Why UHF instead of an Apollo app on iPhone?",
        a: "We list the player that works with your subscription today. If an Apollo app becomes available on the App Store, this guide will change.",
      },
      {
        q: "Can I watch on iPad and iPhone at the same time?",
        a: "Yes, as long as you stay within your pack's device allowance.",
      },
    ],
  },
];

export const genericProfile: Omit<DeviceProfile, "key" | "match"> = {
  metaTitle: (n) => `Set Up Apollo Group TV on ${n}: Step-by-Step Guide`,
  description: (n) =>
    `Install the Apollo TV app on ${n} from the official source and sign in with your account.`,
  intro:
    "Follow the numbered steps below to install the app from its official source, then sign in.",
  summary:
    "Install from the official source listed in the guide, then sign in.",
  requirements: [
    "A supported device connected to the internet",
    "Your account email and password, and an active pack",
  ],
  finish: accountSignIn("then follow any on-screen prompts."),
  troubleshooting: [
    {
      q: "Something isn't working",
      a: "Work through the [troubleshooting guide](/guides/troubleshooting) or open a ticket with your device model.",
    },
  ],
  security: ["Install only from the official link in your dashboard."],
  faqs: [],
};

export function profileFor(name: string) {
  return (
    deviceProfiles.find((p) => p.match.test(name)) ?? {
      key: "generic",
      match: /$^/,
      ...genericProfile,
    }
  );
}
