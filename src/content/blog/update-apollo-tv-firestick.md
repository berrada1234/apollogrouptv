---
title: How to Update the Apollo TV App on a Firestick (and Fix a Stuck Old Version)
seoTitle: How to Update Apollo TV on Firestick: In-App Updates and Fixes
description: Keep the Apollo TV app current on Fire TV. How in-app updates work, how to reinstall the latest version safely, Fire OS updates, and fixes when an update fails.
keyword: update apollo tv on firestick
secondary: apollo tv app update, update sideloaded apps on fire tv, fire tv system update, apollo tv old version
intent: How-to
category: Fire TV
date: 2026-11-03
excerpt: Why the Apollo TV app doesn't update through the Amazon Appstore, how its own updates work, and what to do when an update won't install.
---

If you installed the Apollo TV app on a Fire TV Stick, you may have noticed it never shows up in the Amazon Appstore's update list. That's expected. Apps installed from outside the Appstore, a process usually called sideloading, are invisible to Amazon's updater. Keeping them current works differently, and once you know how, it takes a couple of minutes.

This guide explains how updates reach the Apollo TV app on Fire TV, how to check which version you're running, how to install a newer version over the top of an old one without losing anything important, and what to do when an update refuses to install. It also covers the separate Fire TV system update, because an out-of-date Fire OS is behind more "app" problems than people expect.

If you haven't installed the app yet, start with our [Fire TV and Android TV setup guide](/guides/fire-tv-android-tv) and come back here later.

## Why the Apollo TV app doesn't update through the Appstore

Your Fire TV has two ways of getting apps:

- **The Amazon Appstore.** Apps installed from here are tracked by Amazon. When a developer publishes a new version, the Appstore downloads it, either automatically or when you choose Update on the app's page.
- **Sideloading.** Apps installed from a file you downloaded yourself, usually with the free Downloader app. Amazon's updater doesn't know these apps exist, so it never offers updates for them.

The Apollo TV app is installed the second way, through Downloader and an official code. That means the Appstore will never show an Apollo TV update, however long you wait. Updates come from the app itself or from installing a newer file, which is what the rest of this guide covers.

> **Tip:** Turning on automatic updates in the Appstore is still a good idea. It keeps Downloader and your other Appstore apps current, and that indirectly helps the Apollo TV app run smoothly.

## How Apollo TV updates normally arrive

After the first installation, new versions of the Apollo TV app are delivered inside the app. When an update is available, the app tells you when you open it. You confirm, the new version downloads, and Fire TV asks you to approve the installation. Your sign-in normally survives the update, so you go straight back to watching.

In practice, a smooth update looks like this:

1. Open the Apollo TV app as usual.
2. If a newer version is available, a prompt appears offering to update.
3. Choose **Update** and wait for the download to finish. On a good connection this takes under a minute.
4. Fire TV shows an installation screen. Select **Install**, then **Open** when it's done.

If you're asked whether to allow the app to install other apps, say yes. Fire TV needs that permission for the app to install its own new version. It applies only to the app you're granting it to.

### What if I never see an update prompt?

No prompt usually means you're already on the latest version. Updates aren't released on a fixed schedule, so weeks can pass without one. You only need to act if something has stopped working, if support has asked you to update, or if you know a newer version exists and your app isn't offering it. In those cases, use the manual method below.

## Check which version you're running

Knowing your version number saves time when you contact support and tells you whether an update actually worked.

1. From the Fire TV home screen, open **Settings**.
2. Choose **Applications**, then **Manage Installed Applications**.
3. Scroll to the Apollo TV app and select it.
4. The version number is shown at the top of the app's info screen.

Write it down before you update. Afterwards, check again: if the number changed, the update installed.

## Update manually by installing the latest version

When the in-app update doesn't appear or doesn't work, install the newest version on top of the current one. Android, which Fire OS is built on, treats this as an upgrade rather than a fresh install, as long as the new file comes from the same source. Your sign-in and settings are normally kept.

You'll need the Downloader app, which you already used for the first installation. If you removed it, reinstall it from the Appstore; its developer keeps an [official page about Downloader](https://www.aftvnews.com/downloader/) with its own help.

### Step 1: Open Downloader

Open Downloader from **Your Apps & Channels**. If Downloader asks for permission to access files, allow it, or it won't be able to save the installer.

### Step 2: Enter the official Apollo TV code

In Downloader's home tab, select the address box and type the code shown in our [Fire TV setup guide](/guides/fire-tv-android-tv). Always take the code from our website or your account; codes passed around on forums or in videos can point to modified files.

### Step 3: Download and install

Downloader fetches the installer and opens Fire TV's installation screen. Select **Install**. Because a version is already on the device, Fire TV upgrades it in place.

### Step 4: Open and check

Choose **Open**, confirm the app starts, and check the version number again using the steps in the previous section.

### Step 5: Delete the installer file

Downloader offers to delete the installer after installation. Choose **Delete**, then **Delete** again. The installer is no longer needed and takes up space that a Fire TV Stick doesn't have much of. Our guide to [clearing cache and freeing storage on a Firestick](/blog/clear-cache-firestick) explains why that space matters.

## When an update won't install

Most failed updates come down to one of five causes. Work through them in order.

### "App not installed"

This message appears when Fire TV refuses the new file. Common reasons:

- **Not enough storage.** Fire TV needs free space to unpack the installer next to the old version. Delete old installer files in Downloader and uninstall apps you don't use, then try again.
- **The file is from a different source.** If you once installed the app from somewhere else, Fire TV won't let an official version replace it, because the files are signed by different developers. Uninstall the existing app first, then install the official one.
- **A corrupted download.** Interrupted downloads produce broken files. Delete the downloaded installer in Downloader and download it again.

### The installer screen never appears

Fire TV blocks installations from apps that haven't been given permission. Go to **Settings > My Fire TV > Developer Options > Install unknown apps** and make sure Downloader (and the Apollo TV app, for in-app updates) are turned on. If you don't see Developer Options, go to **Settings > My Fire TV > About** and press the select button on your device name seven times to reveal it.

### The update installs but the app crashes

Clear the app's cache: **Settings > Applications > Manage Installed Applications > Apollo TV > Clear cache**. Cache is temporary data that can conflict with a new version. If that doesn't help, try **Clear data**, which resets the app and signs you out, so have your login details from [My Account](/dashboard/subscription) ready.

### Downloader can't connect

If Downloader shows a connection error, check that your Fire TV has internet by opening any other app. If other apps work, restart the Fire TV (hold **Select** and **Play/Pause** together for about five seconds) and try again.

### You're on a Fire TV that can't sideload

Some newer Fire TV models run Amazon's Vega OS instead of the Android-based Fire OS, and they don't allow apps from outside the Appstore. On those devices, neither installation nor manual updates through Downloader will work. The tech site AFTVnews keeps a list of [Fire TV models that run Vega OS](https://www.aftvnews.com/these-are-the-fire-tvs-that-dont-support-sideloading-or-downloader-due-to-vega-os/) and explains how to check yours: in **Settings > My Fire TV > About**, Fire OS devices show "Fire OS" in the software version. Our article on [choosing the best Fire TV Stick for IPTV](/blog/best-firestick-for-iptv) covers what to buy instead.

## Don't forget the Fire TV system update

The Apollo TV app runs on top of Fire OS, Amazon's operating system for Fire TV. An old Fire OS can cause playback glitches, missing features and installation errors that look like app problems.

To check for a system update:

1. Open **Settings**.
2. Choose **My Fire TV** (called **Device & Software** on some models).
3. Select **About**, then **Check for Updates** (or **Install Update** if one is waiting).
4. Leave the device plugged in while it installs and restarts. Don't unplug it mid-update.

Fire TV updates itself overnight when it's idle, but devices that are always unplugged or always in use can fall behind. Checking takes seconds.

## Updating on Android TV boxes and Android phones

The same principles apply to other Android devices that run the Apollo TV app. On Android TV boxes, Google TV devices and Android phones or tablets, the app is installed from an official download rather than Google Play, so Play Store updates won't include it either.

- **In-app updates** work the same way: open the app and accept the update when it's offered.
- **Manual updates** mean downloading the latest installer from the link in our [Android phone and tablet guide](/guides/android-phone-tablet) or the Android TV section of the [Fire TV and Android TV guide](/guides/fire-tv-android-tv), then installing it over the existing app.
- **Permission prompts** are similar: Android asks you to allow the browser or file manager you used to install apps. Grant it for that one app.

On phones, Android may also block installation if Play Protect flags an app it doesn't recognize from the Play Store. Read the warning carefully, and only continue for the official file from our website.

## A simple maintenance routine

You don't need to think about updates often. A light routine every month or two keeps everything working:

1. **Check for a Fire TV system update** as above.
2. **Open the Apollo TV app** and accept any update it offers.
3. **Clear the Apollo TV cache** if the app feels sluggish.
4. **Delete leftover installer files** in Downloader.
5. **Restart the Fire TV** to clear its memory.

That's five minutes, and it heads off most of the problems people contact support about.

## Example: fixing an app that stopped loading after months without an update

Here's a typical case. A customer's Apollo TV app had worked for months, then started showing a loading spinner that never finished. The Fire TV was the original model, rarely restarted, and showed only 300 MB of free storage.

The fix took four steps: deleting two old installer files in Downloader freed most of a gigabyte; a Fire OS update that had been waiting installed overnight; the Apollo TV app was updated using the manual method above; and its cache was cleared once. The app loaded normally afterwards. None of the steps were complicated, but skipping any of them would likely have left the problem in place.

## Frequently asked questions

### Will updating Apollo TV sign me out?

Usually not. Updating in place keeps your sign-in. You're signed out only if you uninstall the app first or choose Clear data. Keep your login details from My Account handy just in case.

### Can I turn on automatic updates for the Apollo TV app?

Fire TV's automatic updates only cover Appstore apps. The Apollo TV app checks for its own updates when you open it, so opening it occasionally is enough.

### Is it safe to install an update from a link someone sent me?

Only install using the official code on our website or in your account. Files shared elsewhere may be modified. If in doubt, [contact our support team](/contact) before installing anything.

### How can I tell an update is genuine?

Genuine updates are offered inside the Apollo TV app itself or installed with the official code from our website. Be wary of messages, pop-ups on other websites or social media posts telling you to download an "urgent update" from a link; that's a common trick for spreading modified apps. When in doubt, check the code against our setup guide.

### Do I need to uninstall the old version first?

No. Installing the new version on top upgrades it. Uninstall first only if Fire TV shows "App not installed" because the old copy came from a different source.

### My Fire TV says there's not enough space. What should I remove?

Start with old installer files in Downloader, then apps you no longer use. Clearing the cache of large apps also helps. Our [cache and storage guide](/blog/clear-cache-firestick) walks through it.

### Where can I get help if the update still fails?

Open a ticket from your dashboard with your Fire TV model, your Fire OS version and the app version number. You'll also find general fixes in our [troubleshooting guide](/guides/troubleshooting).

## Conclusion

Updating the Apollo TV app on a Firestick is mostly automatic: open the app, accept the update, and carry on watching. When that doesn't happen, installing the latest version through Downloader with the official code upgrades the app in place, and the fixes above cover almost every installation error. Pair it with an occasional Fire OS update and a quick cache clear, and your Fire TV stays in good shape.

New to Apollo Group TV? You can [compare the packs](/plans) and follow the [Fire TV setup guide](/guides/fire-tv-android-tv) to get started.
