---
title: Apollo TV Downloader Code, and How to Use the Downloader App Without Errors
seoTitle: Apollo TV Downloader Code: How to Use Downloader and Fix Errors
description: How to install Downloader, enter the official Apollo TV code, allow installs, and fix common Downloader errors on Fire TV and Android TV devices.
keyword: how to download apollo group tv on downloader
secondary: apollo tv downloader code, downloader app code, downloader not working fire tv, install unknown apps downloader, downloader app android tv, is downloader app safe
intent: Tool-specific how-to and troubleshooting
category: Fire TV
date: 2026-11-04
excerpt: Everything about the Downloader app itself: getting it, giving it permission, entering the official code, and what each Downloader error means.
answer: On Fire TV and Android TV, the Apollo TV app is installed with the free Downloader app: install Downloader, allow it to install unknown apps, then enter the official code {{downloaderCode}} and choose Install. Always take the code from our website, and delete the installer file afterwards to save storage.
---

On Fire TV and Android TV devices, the Apollo TV app is installed with a free app called Downloader. Downloader is a simple tool: you type a short code or a web address, it fetches the file, and it hands the file to your device to install. It's widely used and well established, but because it sits between you and the app you're installing, it's also where most installation problems show up.

This guide focuses on Downloader itself: how to get it, how to give it the permission it needs, how to enter the official Apollo TV code, and what each error message means. For the complete device setup from start to finish, including signing in, see our [Fire TV and Android TV setup guide](/guides/fire-tv-android-tv).

## The official Apollo TV Downloader code

The official Apollo TV code for Downloader is **{{downloaderCode}}**.

If Downloader asks for a web address instead, type **{{downloaderUrl}}**.

Always take the code from our website. Codes shared in videos, forums or social media posts can be out of date, or point to modified copies of the app. If what you've been given differs from the code above, use ours.

## What Downloader is and why Apollo TV uses it

Downloader is a free app made by the team behind the tech news site AFTVnews, which keeps an [official page about Downloader](https://www.aftvnews.com/downloader/). It's available in the Amazon Appstore on Fire TV and in Google Play on Android TV.

The Apollo TV app isn't listed in the Amazon Appstore or in Google Play for TVs. Instead, it's installed from an official file, a process often called sideloading. Typing a long web address with a TV remote is slow and error-prone, so Downloader lets you type a short numeric code instead. The code points to the file, and Downloader does the rest.

### Is Downloader safe?

Downloader itself is a reputable, long-standing app from an established developer. What matters is what you download with it. Downloader will fetch any file a code points to, so the safety of the result depends on the source. Use only official codes from the provider's own website, and you're downloading exactly what the provider intends.

## Step 1: Install Downloader

### On Fire TV

1. From the home screen, open **Find** (the magnifying glass) and choose **Search**.
2. Type **Downloader** and select it from the results.
3. Choose **Get** or **Download**.

### On Android TV and Google TV

1. Open the **Google Play Store** on your TV.
2. Search for **Downloader** and choose the app by AFTVnews.
3. Select **Install**.

## Step 2: Give Downloader permission to install apps

Your device blocks installations from apps other than its own store until you allow them. You give that permission to Downloader specifically, not to every app.

### On Fire TV

1. Go to **Settings > My Fire TV > Developer Options**.
2. Choose **Install unknown apps** (on some older models, **Apps from Unknown Sources**).
3. Find **Downloader** and turn it **On**.

**Don't see Developer Options?** Go to **Settings > My Fire TV > About**, highlight your device name, and press the select button seven times. A message confirms you're now a developer, and Developer Options appears in the previous menu.

### On Android TV and Google TV

1. Go to **Settings > Apps > Security & restrictions**.
2. Choose **Unknown sources**.
3. Turn on **Downloader**.

Menu names vary a little between manufacturers. On some Google TV devices you first need to turn on developer mode under **Settings > System > About** by selecting the **Android TV OS build** entry seven times.

## Step 3: Enter the official Apollo TV code

1. Open **Downloader**. The first time, it may ask for access to files on the device. Choose **Allow**, or it won't be able to save the installer.
2. On the **Home** tab, select the address box.
3. Type **{{downloaderCode}}** using the on-screen keyboard.
4. Select **Go**.

Downloader looks up the code, downloads the Apollo TV installer and opens your device's installation screen. Select **Install**, then **Open** when it's finished.

> **Tip:** Downloader's on-screen keyboard has a number row. Typing the code takes a few seconds; there's no need to type "http" or anything else.

## Step 4: Delete the installer afterwards

After installation, Downloader asks whether to delete the installer file. Choose **Delete**, then **Delete** again to confirm.

The installer isn't needed once the app is installed, and storage on streaming sticks is limited. Leftover installers are one of the most common reasons a Fire TV slows down; our guide to [clearing cache and freeing storage on a Firestick](/blog/clear-cache-firestick) explains why.

If you skipped this step, open Downloader's **Files** tab later and delete the file there.

## Downloader errors and what they mean

| Message or problem | What it usually means | What to do |
|---|---|---|
| Nothing happens after selecting Go | No internet, or a typo in the code | Check the code; test another app |
| "Error: could not connect" or a timeout | Connection problem or temporary network issue | Restart the device and router, then retry |
| A web page appears instead of a download | The code or URL was mistyped | Re-enter the code exactly |
| Installation screen never appears | Downloader isn't allowed to install apps | Repeat Step 2 |
| "App not installed" | Low storage, a conflicting older copy, or a broken download | See below |
| "There was a problem parsing the package" | Incomplete download or incompatible device | Delete the file and download again |
| Downloader isn't in the Appstore | The device may run Vega OS | See "Devices where Downloader won't work" |

### "App not installed"

This is the most common installation error. Work through these:

1. **Free up space.** Delete old installers in Downloader's Files tab and uninstall apps you don't use.
2. **Remove a conflicting copy.** If you installed Apollo TV from a different source before, uninstall it first. An official version can't replace a copy signed differently.
3. **Download again.** Delete the downloaded file in Downloader and repeat Step 3. Interrupted downloads produce broken files.

### "There was a problem parsing the package"

The file couldn't be read. It's usually a download that didn't finish. Delete it and download again on a steady connection. If it happens repeatedly, contact support with your device model.

## Devices where Downloader won't work

Some newer Fire TV models run Amazon's Vega OS instead of the Android-based Fire OS. Vega OS devices only install apps from the Amazon Appstore and don't support sideloading. On those devices, Downloader either isn't available or can't install the Apollo TV app.

AFTVnews keeps a list of [Fire TV models that run Vega OS](https://www.aftvnews.com/these-are-the-fire-tvs-that-dont-support-sideloading-or-downloader-due-to-vega-os/). To check your own device, go to **Settings > My Fire TV > About** and look at the software version: Fire OS devices say "Fire OS". If yours runs Vega OS, see our guide to the [best Fire TV Stick for IPTV](/blog/best-firestick-for-iptv) for models that work.

## Using Downloader for updates

Updates to the Apollo TV app normally arrive inside the app, so you won't need Downloader for them. If an update ever won't install, using Downloader with the same official code installs the latest version over the existing one without losing your sign-in. Our guide to [updating Apollo TV on a Firestick](/blog/update-apollo-tv-firestick) covers this step by step.

## Check that you installed the official app

After installing, it takes a moment to confirm you have the genuine app:

1. Go to **Settings > Applications > Manage Installed Applications** on Fire TV, or **Settings > Apps** on Android TV.
2. Find **Apollo Group TV** in the list and select it.
3. Note the version number shown on the app's info screen.

The app should open to the Apollo Group TV sign-in screen and accept the login details from [My Account](/dashboard/subscription). If you see a different name, unexpected ads, or requests for payment inside the app, uninstall it and reinstall with the official code above.

## Tighten security after installing

Once Apollo TV is installed, you can reduce what other apps are allowed to do:

- **Leave Downloader's permission on only if you need it.** You can turn off **Install unknown apps** for Downloader after installation, and turn it back on if you ever need to reinstall.
- **Keep the Apollo TV app's own permission on.** The app installs its own updates, so leave its install permission enabled if your device asks for it.
- **Don't grant install permission to apps you don't recognize.** If an app you never installed appears in the list, uninstall it.

## Fire TV vs Android TV: small differences

Downloader works the same way on both, but a few details differ:

| | Fire TV | Android TV / Google TV |
|---|---|---|
| Where to get Downloader | Amazon Appstore | Google Play |
| Permission setting | Developer Options > Install unknown apps | Apps > Security & restrictions > Unknown sources |
| Revealing developer settings | Select the device name 7 times in About | Select the Android TV OS build 7 times in About |
| System updates | Settings > My Fire TV > About | Settings > System > About (varies by brand) |

Our article on [setting up Apollo Group TV on Google TV](/blog/apollo-tv-google-tv) walks through the Google TV version in more detail.

## Downloader's other features

Downloader has a few other tabs you don't need for Apollo TV, but they're good to know about:

- **Browser:** a basic web browser for your TV. Handy for opening a web page, but slow to use with a remote.
- **Files:** lists downloaded files so you can install or delete them later.
- **Settings:** options such as JavaScript and the home page. The defaults are fine.
- **Favorites:** saved web addresses.

## Example: "Downloader does nothing when I press Go"

A customer typed the code, pressed Go, and nothing happened. Working through the table above:

- Other apps on the Fire TV worked, so the internet was fine.
- Looking closely at the address box, one digit of the code had been entered twice when the remote double-clicked.

Clearing the box and typing the code again fixed it. A second customer saw the same symptom for a different reason: Downloader had never been given permission to access files. Reopening Downloader and choosing **Allow** at the prompt solved it.

## Frequently asked questions

### What is the Downloader code for Apollo TV?

The official code is shown at the top of this page and in our Fire TV and Android TV setup guide. Always use the code from our website.

### Why does Downloader say "App not installed"?

Usually because the device is low on storage, an older copy from another source is in the way, or the download was incomplete. Free up space, uninstall any old copy, and download again.

### Is the Downloader app safe to use?

Downloader is a well-established app from a reputable developer. Use it only with official codes from the provider's website, and you're installing exactly what the provider intends.

### Why can't I find Downloader on my Fire TV?

Your device may run Vega OS, which doesn't support sideloaded apps. Check Settings > My Fire TV > About. Fire OS devices can install Downloader from the Appstore.

### Can I type the full web address instead of the code?

Yes. Downloader accepts the full address as well as the short code. Both are shown at the top of this page; the code is just quicker to type with a remote.

### Why does Downloader show a web page instead of downloading?

Usually because the code or address was mistyped, or because the code you used points to a web page rather than a file. Clear the address box and type the official code again exactly as shown at the top of this page.

### Can I use Downloader on an Android phone?

Phones don't need it. On Android phones and tablets, download the app directly from our Android guide.

### Do I need Downloader after Apollo TV is installed?

Not normally, because updates arrive inside the app. Keep it installed in case you ever need to reinstall, or remove it to save space.

## Conclusion

Downloader is the bridge between your Fire TV or Android TV device and the Apollo TV app. Install it from your device's store, give it permission to install apps, type the official code, and delete the installer afterwards. When something goes wrong, the error message almost always points to one of a few causes: a typo, a missing permission, low storage or an old conflicting copy.

For the full setup including signing in, follow the [Fire TV and Android TV guide](/guides/fire-tv-android-tv). If you're still stuck, our [Help Center](/help) and [support team](/contact) can help.
