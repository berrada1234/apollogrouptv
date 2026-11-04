---
title: Xtream Codes Login Explained, from Server URL to Username and Password
seoTitle: Xtream Codes Login Explained: Server URL, Username and Password
description: What Xtream codes login details are, how to enter the server URL, username and password correctly in an IPTV player, Xtream vs M3U, and fixes for login errors.
keyword: xtream codes login details
secondary: iptv server url, xtream username and password, xtream vs m3u, iptv player login error
intent: Informational
category: Players & Logins
date: 2026-11-03
excerpt: The three pieces of an Xtream login, how players use them, the formatting mistakes that cause most login errors, and when to use M3U instead.
---

Open almost any IPTV player and you'll be asked how you want to log in. One of the options is usually labelled "Xtream Codes", "Xtream Codes API" or simply "Xtream login", and it asks for three things: a server URL, a username and a password. Get any one of them slightly wrong and the player refuses to connect, often with an unhelpful error.

This guide explains what an Xtream login is, what each of the three details means, how to enter them so they work first time, how Xtream login compares with an M3U playlist, and how to fix the login errors people run into most.

## What "Xtream Codes" means today

"Xtream Codes" was originally the name of software that IPTV providers used to manage their services. The software is long gone, but the way it let players log in became a common standard, and the name stuck. Today, "Xtream Codes login" or "Xtream API" refers to that login method: a player connects to a provider's server with a username and password and asks it for the channel list and other information.

So when a player offers Xtream login, it isn't asking you to install anything called Xtream. It's asking for your provider's server address and your login details.

## The three parts of an Xtream login

### 1. Server URL

The server URL tells the player where to connect. It's a web address, usually in one of these forms:

```
http://server.example.test
http://server.example.test:8080
```

Two parts matter:

- **The scheme**, `http://` or `https://`. Most players want it included. Use exactly what your provider gives you.
- **The port**, the number after the colon, such as `:8080`. Ports tell the server which service you want, as explained in this overview of [ports in computer networking](https://en.wikipedia.org/wiki/Port_%28computer_networking%29). If your server URL includes a port, it must be included; if it doesn't, don't add one.

The examples above are placeholders. Apollo Group TV customers find their real server address in [My Account](/dashboard/subscription) under **Xtream Server**.

### 2. Username

Your player username. It's specific to IPTV and is different from the email address you use to sign in to a provider's website.

### 3. Password

Your player password, again different from your website password. Usernames and passwords are usually case-sensitive: `Apollo123` and `apollo123` are different.

> **Important:** Use the Xtream username and password from My Account, not the email and password you use to sign in to the Apollo Group TV website. This is the single most common reason a player login fails.

## How to enter Xtream details in a player

Every player looks slightly different, but the steps are similar.

1. **Open the player** and choose to add a new playlist, profile or user.
2. **Select Xtream Codes / Xtream API** as the login type.
3. **Enter a name** for the profile. This is just a label for you, such as "Apollo Living Room".
4. **Enter the server URL** exactly as shown in My Account, including `http://` and any port.
5. **Enter your username and password** from My Account.
6. **Save or log in.** The player connects and downloads the channel list. The first load can take a minute.

### Use copy and paste where you can

Typing a server address with a TV remote invites mistakes. Where your player allows it, copy the details from My Account on your phone and send them to the device, or use the player's own option to enter details from a phone or computer if it has one. My Account has a copy button next to every login detail for exactly this reason.

### Players used with Apollo Group TV

On Fire TV and Android devices, the Apollo TV app is the recommended way to watch; see our [Fire TV and Android TV guide](/guides/fire-tv-android-tv). On iPhone, iPad and Apple TV, a compatible player uses your Xtream details; our [iPhone and iPad guide](/guides/iphone-ipad) and [Apple TV guide](/guides/apple-tv) walk through it. On computers, see the [Windows guide](/guides/windows) and [Mac guide](/guides/macos).

## Xtream login vs M3U playlist

Many players accept both login types. They give access to the same subscription, but they work differently.

| | Xtream login | M3U playlist |
|---|---|---|
| What you enter | Server URL, username, password | One long URL |
| How the player gets channels | Asks the server for categories and channels | Downloads a playlist file |
| Categories and extras | Usually richer, organised by the server | Depends on what's in the playlist |
| Updating the channel list | Player refreshes from the server | Player re-downloads the playlist |
| Typing on a TV remote | Three short fields | One very long URL |

As a rule of thumb, use Xtream login when your player supports it; it's easier to type and usually gives a better-organised experience. Use the M3U URL for players that only accept playlists, or for quick testing in a player like VLC. Our guide to [using an M3U URL in VLC](/blog/m3u-url-vlc) covers that.

## Fixing common login errors

### "Invalid username or password" or "Authentication failed"

- Check you're using the Xtream username and password from My Account, not your website login.
- Check for capital letters, especially if your player auto-capitalizes the first letter.
- Remove spaces before or after the details. Spaces are invisible and very common when copying.
- Check your subscription is active. Expired subscriptions stop accepting logins.

### "Server not found", "Connection failed" or a timeout

- Make sure the server URL starts with `http://` (or `https://` if that's what you were given).
- Include the port if your server URL has one, and don't invent one if it doesn't.
- Remove any trailing slash or extra text after the address unless it's part of what you were given.
- Check the device has internet by opening another app.

### The login works but no channels appear

Give the player a minute to load the channel list, especially on the first run. If categories stay empty, refresh the playlist or profile in the player's settings, or remove the profile and add it again.

### "Maximum connections reached"

Your login is already playing on as many devices as your subscription allows. Close the player on another device and try again. Our article on [IPTV connection limits](/blog/iptv-connection-limit) explains how streams are counted.

### It worked yesterday and stopped today

- Check your subscription's expiry date in My Account.
- If you recently renewed or asked for a login reset, your details may have changed. Copy them again.
- Update the player app; outdated versions sometimes stop working with servers.
- If the player shows a numbered error such as 404, our guide to [Apollo Group TV status code 404](/blog/apollo-group-tv-status-code-404) explains what each code means.

If none of these help, [contact our support team](/contact) with the player name, the device and the exact error message.

## What happens after you log in

Once the player accepts your details, it starts asking the server for information. Understanding this helps explain why the first load is slow and why some things look different between players.

### The player builds your channel list

The player requests the list of live channel categories, then the channels in each category. On a large service this is a lot of data, which is why the first load takes longer than later ones. Most players save the list on the device and refresh it in the background.

### It may request more, depending on the provider

Depending on what a provider offers, a player using Xtream login can also request things like on-demand libraries or programme guide information. What you see depends on both the provider and the player: two players using the same login can display things differently. If a feature you've seen in one player is missing in another, it's usually the player, not your subscription.

### It checks your subscription status

The server tells the player whether your login is active and, in many players, when it expires. If your subscription ends, the player stops loading channels until you renew. Your expiry date is always in My Account.

## Setting up the same login on several devices

You can enter the same Xtream details on as many of your own devices as you like. A few tips make it smoother:

- **Use a clear profile name on each device**, such as "Bedroom TV" or "Laptop". It helps when you're troubleshooting.
- **Set up one device first** and confirm it works before typing the details on the next.
- **Keep the details in one safe place.** My Account always shows the current ones, so there's no need to save them in notes or photos.
- **Remember the connection limit.** Installing on five devices is fine; playing on five at once may not be. See our guide to [IPTV connection limits](/blog/iptv-connection-limit).

## Moving to a new device

When you replace a TV, streaming stick or phone:

1. Install the player on the new device from its official app store, or the Apollo TV app using our [setup guides](/guides).
2. Enter your Xtream details from My Account.
3. On the old device, delete the profile or uninstall the player, especially if you're selling or giving it away. Otherwise the next owner has your login.

If you're choosing a new Fire TV, check our guide to the [best Fire TV Stick for IPTV](/blog/best-firestick-for-iptv) first: some new models can't install IPTV apps at all.

## Keeping your login details secure

Your Xtream details give access to your subscription, so protect them like any other password.

- **Don't share them outside your household.** Every extra person uses your connections and can trigger errors for you.
- **Don't post them in screenshots.** When asking for help in public forums, blur the details.
- **Only enter them in players you trust.** Download players from official app stores.
- **Ask for a reset if you think they've leaked.** Unexpected "maximum connections" errors can be a sign someone else is using your login.

## A quick checklist before you press Log in

Before saving your details in any player, run through this list. It catches nearly every typing mistake:

1. **Login type** is set to Xtream Codes or Xtream API, not M3U.
2. **Server URL** starts with `http://` (or exactly what My Account shows) and includes the port if there is one.
3. **No trailing spaces** after the server URL, username or password.
4. **Username** matches My Account exactly, including capital letters.
5. **Password** matches My Account exactly. Use the show-password option in the player, if it has one, to check it.
6. **Subscription is active.** Your status in My Account says Active, and the expiry date hasn't passed.
7. **No other devices** are already playing up to your connection limit.

If every line checks out and the player still refuses, try the same details in a different player on another device. If they work there, the problem is the first player or device; updating or reinstalling the app usually fixes it. If they fail everywhere, contact support so we can check your login.

## Example: a login that failed because of one character

A customer setting up an Apple TV player saw "authentication failed" on every attempt, despite copying the details carefully. Comparing the entry with My Account showed the issue: the player had automatically capitalized the first letter of the username. Turning off auto-capitalization on the on-screen keyboard and retyping the username fixed it straight away.

Another common case: a server URL entered as `server.example.test` without `http://` worked in one player and failed in another. Adding the full address, scheme included, made it work everywhere. When in doubt, enter the server URL exactly as it appears in My Account.

## Frequently asked questions

### Is Xtream Codes an app I need to download?

No. "Xtream Codes" is the name of a login method. You enter Xtream details into an IPTV player app that supports it.

### Where do I find my Xtream login details?

Apollo Group TV customers find their Xtream server, username and password in My Account in the dashboard once their subscription is active. Each has a copy button.

### Are my Xtream details the same as my website login?

No. The website login is for your Apollo Group TV account. The Xtream username and password are separate details for IPTV players.

### Should I use Xtream or M3U?

Use Xtream when your player supports it; it's easier to enter and usually better organized. Use M3U for players that only accept playlists or for testing.

### Do I need to include "http://" in the server URL?

Include it if your server URL is shown with it, which is usually the case. Many players fail to connect without it.

### Can I use my Xtream login on more than one device?

Yes, within your subscription's connection limit. Each device that plays at the same time uses one connection.

## Conclusion

An Xtream login is just three details: a server URL, a username and a password. Most failures come from small formatting slips: the website login used by mistake, a missing `http://` or port, a stray space or an auto-capitalized letter. Copy the details from My Account, enter them exactly, and the player connects. If your player only takes playlists, your M3U URL gives access to the same subscription.

All your login details live in [My Account](/dashboard/subscription). If you haven't chosen a pack yet, [compare the options here](/plans).
