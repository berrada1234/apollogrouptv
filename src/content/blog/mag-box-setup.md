---
title: MAG Box IPTV Setup, from Portal URL and MAC Address to Fixing a Stuck Portal
seoTitle: MAG Box IPTV Setup: Portal URL, MAC Address and Fixes
description: Set up IPTV on a MAG box step by step: register the MAC address, enter the portal URL, restart, and fix "loading portal" and authorization errors.
keyword: mag box iptv setup
secondary: mag portal url, mac address for iptv, mag box loading portal stuck, infomir mag settings
intent: How-to
category: Players & Logins
date: 2026-11-03
excerpt: How MAG boxes log in differently from apps, where to enter the portal URL, why your MAC address matters, and how to fix the errors people hit most.
---

MAG boxes are dedicated IPTV set-top boxes made by Infomir. Instead of installing apps and typing a username and password, you give the box a single portal address, and the service recognizes the box itself. Once set up, a MAG box boots straight into live TV with a simple remote, which is why many people prefer one for a living room TV.

The setup is different from apps, though, and that's where people get stuck. This guide explains how MAG login works, how to find your box's MAC address, where to enter the portal URL, and how to fix the "loading portal" and authorization problems that come up most often.

## How MAG login works

Most IPTV players log in with a username and password, or with a playlist URL. MAG boxes use a **portal**, a server address the box connects to when it starts. Instead of a password, the portal identifies the box by its **MAC address**, a unique hardware identifier built into every network device. This overview of [MAC addresses](https://en.wikipedia.org/wiki/MAC_address) explains what they are.

That gives MAG setup two parts:

1. **The provider links your box's MAC address to your subscription.** Until this happens, the portal won't let the box in.
2. **You enter the portal URL on the box.** The box connects, the portal recognizes the MAC address, and your channels load.

Both parts are needed. Entering the portal URL without the MAC address being registered is the most common reason a MAG box gets stuck.

### Does my Apollo Group TV subscription include MAG access?

Check [My Account](/dashboard/subscription). If your account shows a **MAG URL**, that's your portal address. If it shows a dash (—), MAG access hasn't been set up for your subscription; open a support ticket and ask, including your box's MAC address (see below).

## What you'll need

- A MAG set-top box connected to your TV by HDMI.
- An internet connection. A wired Ethernet connection is recommended; MAG boxes are designed with a network port for exactly this reason.
- The box's remote.
- Your MAG portal URL from My Account.
- Your box's MAC address, registered with us through a support ticket.

Infomir's own documentation, available on the [Infomir wiki](https://wiki.infomir.eu/), covers individual models in detail. Menu names can vary slightly with firmware versions, so use the steps below as a guide and the wiki for model-specific details.

## Step 1: Find your box's MAC address

You'll find the MAC address in one of two places:

- **On the label underneath the box.** It's printed as six pairs of characters separated by colons, usually starting with `00:1A:79`, which is the prefix used by Infomir devices. For example: `00:1A:79:XX:XX:XX`.
- **In the box's settings.** Open the settings menu (see Step 3) and look for device or network information.

Write it down carefully. It's easy to confuse `0` (zero) with `O`, and `1` with `I`; MAC addresses only use the digits 0–9 and letters A–F.

## Step 2: Register the MAC address with us

Open a ticket from your dashboard via [support](/dashboard/support/new), and include:

- Your box's MAC address, exactly as printed.
- Your box's model, if you know it (for example, MAG 524).
- Your invoice number or the email on your account.

We'll confirm when the box is linked to your subscription. Do this before entering the portal, or you'll likely see an authorization error.

## Step 3: Open the portal settings

1. Turn on the box. It starts loading Infomir's interface or a previously set portal.
2. Press the **SETUP** (or **SET**) button on the remote to open the settings menu. On some firmware versions, you open **Settings** from the box's home screen instead.
3. Choose **System settings** if prompted.
4. Open **Servers**.
5. Select **Portals**.

## Step 4: Enter the portal URL

1. Highlight **Portal 1 name** and enter a label, such as `Apollo`. The name is only for you.
2. Highlight **Portal 1 URL** and enter your MAG URL from My Account, exactly as shown, including `http://` and the ending.
3. Save with the **OK** button or the on-screen **Save** option.

Typing a long address with a remote takes care. Common slips:

- Missing `http://` at the start.
- A missing or extra slash at the end. If your portal URL ends in `/c/`, include it exactly.
- Wrong characters, such as a comma instead of a full stop.

Many MAG boxes accept a USB keyboard, which makes typing much easier.

## Step 5: Restart the box

Go back to the main settings menu and choose **Reboot** (or unplug the box for ten seconds and plug it back in). When it restarts, it connects to your portal. The first load can take a minute or two while the portal sends the channel list. Be patient on the first boot.

If everything is set up correctly, your channel list appears and you can start watching.

## Fixing common MAG problems

### The box is stuck on "Loading portal"

1. **Wait two minutes** on the first boot. Large channel lists take time.
2. **Check the network connection.** In settings, open the network section and confirm the box has an IP address. If you're on Wi-Fi, try a cable.
3. **Check the portal URL** character by character against My Account.
4. **Reboot** the box again.

### "Your STB is blocked" or "Authorization failed"

These messages almost always mean the portal doesn't recognize the box:

- The MAC address hasn't been registered yet, or was registered with a typo. Check the address on the label against the one in your ticket.
- The subscription linked to the box has expired. Check your expiry date in My Account.

Reply to your support ticket with a photo of the label and we'll check the registration.

### The portal loads but channels won't play

- Try several channels. If only one fails, report it with the channel name and time.
- Check your connection is steady; our guide to [internet speed for IPTV](/blog/internet-speed-for-iptv) explains what live TV needs.
- Check nobody else is using your subscription at the same time beyond your connection limit; see [IPTV connection limits](/blog/iptv-connection-limit).

### The picture freezes or buffers

MAG boxes are usually happiest on a wired connection. If yours is on Wi-Fi, try Ethernet. Our comparison of [Ethernet and Wi-Fi](/blog/firestick-ethernet-vs-wifi) explains why wired connections help live TV, and the same reasoning applies to set-top boxes.

### The box boots into the wrong portal

If you've set more than one portal, the box may start with another one. Check the order in **Servers > Portals**, put your Apollo portal in **Portal 1**, or remove portals you no longer use.

## Keep the box updated

Infomir releases firmware updates for MAG boxes. Updates can fix bugs and improve compatibility. In the settings menu, look for a **Software update** option, choose the update method recommended for your model on the Infomir wiki, and follow the on-screen steps. Don't unplug the box during an update.

## Wired connection settings

Because MAG boxes are designed around Ethernet, it's worth checking the network settings once:

1. In settings, open **Network**.
2. Choose **Wired (Ethernet)**.
3. Select **Auto (DHCP)**, which is right for almost every home router.
4. Save and check the network status shows a connected state.

If you must use Wi-Fi, choose the wireless option in the same menu, select your network and enter your Wi-Fi password. Place the box where it gets a strong signal, and consider moving it to a cable later if you see buffering.

## Using MAG boxes on more than one TV

Each MAG box has its own MAC address, so each box needs its own registration. If you have two boxes, send both MAC addresses in your support ticket and say which TV each is for. Both boxes then use the same portal URL from My Account.

Remember that each box playing at the same time uses one of your subscription's connections. Two boxes watching at once need a connection limit of at least two, plus any other devices you watch on at the same time. Our guide to [IPTV connection limits](/blog/iptv-connection-limit) explains the counting in detail.

## Resetting a MAG box

If a box behaves strangely after you've checked the network and portal settings, a reset can clear old settings that are getting in the way.

- **Reboot first.** A simple reboot from the settings menu fixes most temporary problems.
- **Clear the portal settings** by deleting old portal entries under **Servers > Portals**, then entering your Apollo portal again and rebooting.
- **Factory reset as a last resort.** MAG settings menus include an option to reset settings to factory defaults; the exact name and location depend on the model and firmware, so check the Infomir wiki for yours. After a reset, you'll need to set up the network and portal again from Step 3.

A reset doesn't change the box's MAC address, so your registration with us stays valid.

## Remote tips that make daily use easier

MAG remotes are simple, but a few habits help:

- **Use the channel list button** to browse categories instead of stepping through channels one by one.
- **Mark favourites** if your portal supports it, so the channels you watch most are a click away.
- **Learn the SETUP button.** It takes you straight to the settings menu, which is where every fix in this guide starts.
- **Replace weak batteries.** Missed or repeated button presses are often just tired batteries.

## MAG vs apps: which should you use?

| | MAG box | Streaming stick or TV app |
|---|---|---|
| Login | Portal URL + registered MAC address | App login, Xtream details or M3U playlist |
| Setup effort | Higher at first (registration, typing a URL) | Lower |
| Daily use | Very simple, boots straight to live TV | Simple, more features in some apps |
| Connection | Ethernet port built in | Mostly Wi-Fi, adapters available |
| Moving to another TV | Move the box | Install on the new device |

If you already own a MAG box, it's a dependable way to watch. If you're buying something new, a streaming device running the Apollo TV app is usually simpler to set up; see the [Apollo TV app page](/app) for supported devices and our guide to the [best Fire TV Stick for IPTV](/blog/best-firestick-for-iptv).

## Example: a box that wouldn't authorize

A customer entered the portal URL correctly but kept seeing "Authorization failed". The MAC address in their support ticket ended in `...:B8`, but the label on the box read `...:8B`. Two characters had been swapped when typing the ticket. Once the registration was corrected, the box loaded the portal on the next reboot.

The lesson: copy the MAC address from a photo of the label rather than from memory, and send the photo with your ticket if you can.

## Frequently asked questions

### What is a MAG portal URL?

It's the server address a MAG box connects to at start-up. Apollo Group TV customers with MAG access find it as **MAG URL** in My Account.

### Why does a MAG box need my MAC address?

MAG portals identify boxes by their MAC address instead of a username and password. Your box's MAC address has to be linked to your subscription before the portal lets it in.

### Where is the MAC address on a MAG box?

On the label underneath the box, and in the box's device or network information in settings. Infomir MAC addresses usually start with 00:1A:79.

### Can I use my Xtream username and password on a MAG box?

MAG boxes use the portal method rather than Xtream login. If you'd prefer username-and-password login, use a player app on another device; our guide to [Xtream codes login details](/blog/xtream-codes-login) explains it.

### Can I move my MAG box to another house?

The box works wherever it has internet, because the portal recognizes the box itself. It still uses one connection while playing.

### My box shows a dash for MAG URL in My Account. What does that mean?

MAG access isn't set up for your subscription yet. Open a support ticket with your MAC address and box model to ask about it.

## Conclusion

Setting up IPTV on a MAG box comes down to two steps done in the right order: register your box's MAC address with us, then enter the portal URL from My Account under **Settings > Servers > Portals** and reboot. Most problems come from a mistyped URL, an unregistered or mistyped MAC address, or Wi-Fi instability, and all three are quick to fix.

Your MAG URL and other login details are in [My Account](/dashboard/subscription). For anything specific to your box, [contact our support team](/contact) with the model and MAC address.
