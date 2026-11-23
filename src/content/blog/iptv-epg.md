---
title: IPTV EPG Explained: How the TV Guide Works and How to Fix It When It's Missing
seoTitle: IPTV EPG: What It Is and How to Fix a Missing TV Guide
description: What an IPTV EPG is, where the guide data comes from, and how to fix a TV guide that's empty, wrong or out of date on Firestick, Android and smart TVs.
keyword: iptv epg
secondary: what is epg in iptv, iptv tv guide, epg not showing, epg not loading, iptv guide wrong time, xmltv epg, electronic program guide
intent: Informational
category: Streaming Tech
date: 2026-11-23
excerpt: The TV guide in an IPTV app runs on EPG data. Here's how that data reaches your screen, and what to do when the guide is blank or shows the wrong times.
answer: An IPTV EPG (electronic program guide) is the schedule data that fills the TV guide in an IPTV app, showing what's on each channel now and next. The data comes from broadcasters' schedules, is matched to each channel by an ID, and is downloaded by the app. When the guide is empty or wrong, the usual causes are a device clock or time zone set incorrectly, guide data that hasn't refreshed yet, a full app cache, or a channel that simply has no guide data.
---

You open the live TV section, scroll to a channel, and the guide says "No information" where the programme name should be. Or the guide is there, but it says the match started an hour ago when it's just kicking off. Both are EPG problems, and both are usually quick to fix once you know where the guide data comes from.

This guide explains what an EPG is, how guide data travels from a broadcaster's schedule to your TV, and how to fix a guide that's blank, wrong or out of date.

## What is an EPG in IPTV?

EPG stands for **electronic program guide**. It's the on-screen schedule that shows what's playing on each channel now, what's on next, and often the next few days. In an IPTV app, the EPG is what turns a list of channel names into a TV guide you can browse.

Cable and satellite boxes have had program guides for decades. The [electronic program guide](https://en.wikipedia.org/wiki/Electronic_program_guide) in those systems arrives with the broadcast signal. IPTV works differently: the video and the guide arrive separately over the internet, so the guide can go missing even while the channel plays perfectly.

![A TV guide grid in an IPTV app, with channels down the left, times across the top, a line marking the current time and programme blocks for each channel](/images/blog/iptv-epg/iptv-epg-guide-grid.webp 1600x900 "The EPG fills the guide grid: one row per channel, one block per programme, and a line at the current time.")

### What an EPG shows you

A complete guide entry usually includes:

- **Programme title**, and often the episode name.
- **Start and end time**, which places the programme on the grid.
- **A short description** of the programme or episode.
- **Category**, such as sport, news or film, on some guides.

In the Apollo TV app, the live TV guide lists channels by category and shows what's on now, so you can switch straight to a programme instead of guessing which channel it's on.

### EPG vs channel list

The channel list and the EPG are two different things. The **channel list** tells the app which channels exist and where each stream lives. The **EPG** tells the app what's showing on those channels and when. A channel can be in your list and play normally with no guide information at all, which is why "the channel works but the guide is empty" is such a common complaint.

## How IPTV EPG data gets to your screen

Guide data takes a short journey before it appears in your app. Knowing the steps makes the fixes obvious, because each problem breaks one specific step.

![How EPG data reaches the TV guide: broadcaster schedules become guide data, the service matches it to channels, the app downloads it and the device clock places it on the grid](/images/blog/iptv-epg/iptv-epg-data-flow.webp 1600x900 "Four steps from schedule to screen. A wrong clock on the TV device shifts every programme on the grid.")

### Step 1: Broadcasters publish schedules

Every channel plans its schedule in advance. Those schedules are the raw material of every program guide.

### Step 2: The schedules become guide data

The schedules are collected into guide data files. A widely used format is **XMLTV**, a plain-text format that lists channels and programmes with their start and end times. The [XMLTV project](https://wiki.xmltv.org/) documents the format, which is why you'll see "XMLTV EPG" in many IPTV apps and settings.

### Step 3: Programmes are matched to channels

Each channel in the guide data has an ID, and each channel in the channel list needs the same ID for the two to connect. If the IDs don't match, the channel plays but its guide row stays empty. This matching happens on the service's side, not on your device.

### Step 4: The app downloads and displays the guide

Your app downloads the guide data, stores it, and draws the grid. Times in guide data are usually stored with a time zone offset, and the app converts them to your local time using **your device's clock and time zone**. That last detail is behind most "wrong time" problems.

## Why the IPTV guide is missing or wrong

Most EPG problems fall into a few patterns. Match what you see to the likely cause before changing anything.

| What you see | Most likely cause |
|---|---|
| Whole guide empty after installing or updating | Guide data hasn't downloaded yet |
| Every programme shifted by the same amount of time | Device time zone or clock is wrong |
| Guide empty on one or two channels only | Those channels have no guide data or no matching ID |
| Guide stops a day or two from now | Guide data covers a limited number of days |
| Guide shows yesterday's programmes | Guide data hasn't refreshed, or the app cache is stale |
| Guide loads slowly or the app freezes in the guide | Device short on storage or memory |

## How to fix a missing or wrong IPTV EPG

Work through these in order. The first three solve most guide problems.

### Fix 1: Give the guide time to load

Right after you install the app, sign in or update it, the guide data still has to download. On a slower connection or a smaller streaming stick, that can take a few minutes. Leave the app open on the live TV section, then check again before changing settings.

### Fix 2: Set the date, time and time zone correctly

If every programme is off by the same amount, usually exactly one or more hours, the device's time zone is wrong. Check the date and time settings on the TV device itself and turn on automatic date and time if it's available. On a Fire TV, the time zone is under **Settings → Preferences → Time Zone**. A device set to the wrong time zone, or that lost its clock after a power cut, shifts the whole guide.

Daylight saving changes cause the same symptom twice a year. If the guide jumps by an hour in spring or autumn, check that automatic time is switched on.

### Fix 3: Restart the app and the device

Close the app fully, then restart the streaming device. On a Fire TV, hold the Select and Play/Pause buttons together for about five seconds to restart. A restart clears a guide that got stuck mid-download.

### Fix 4: Clear the app cache

The app stores guide data in its cache. If that copy is outdated or damaged, the guide can show old programmes or nothing at all. Clearing the cache forces a fresh download without signing you out. Our guide to [clearing cache on a Firestick](/blog/clear-cache-firestick) shows where the setting lives, and explains why you should clear the cache before you consider clearing data.

### Fix 5: Free up storage

Guide data for hundreds of channels over several days takes space. A device that's nearly full may fail to save it, which leaves the guide blank or slow. Remove apps you don't use and keep at least 1 GB free on a streaming stick.

### Fix 6: Update the app

Updates fix guide display bugs along with playback problems. Check you have the latest version using our guide to [updating Apollo TV on a Firestick](/blog/update-apollo-tv-firestick), or the general guide to [updating Apollo Group TV](/blog/how-to-update-apollo-group-tv) on other devices.

### Fix 7: Check your connection

Guide data downloads like anything else, so a weak or busy connection can stop it arriving even when channels still play. If the guide and channels both struggle, start with our guide to [fixing IPTV buffering](/blog/iptv-buffering).

## When only some channels have no guide

If most of the guide works but a few channels show no programme information, your device is fine. Those channels either have no published schedule in the guide data, or their channel ID doesn't match. Some channels never have guide data: event channels created for a single match, for example, or small channels that don't publish schedules.

You can still watch these channels normally. If a channel that used to have a guide suddenly loses it for more than a day, report it to support with the channel name, so the team can check the matching on their side.

## Does the EPG work with other IPTV players?

Many IPTV players can display a guide, and most of them use XMLTV data. If you watch with a player that connects through an Xtream Codes login, the guide data usually comes through the same login. Our guide to [Xtream Codes logins](/blog/xtream-codes-login) explains how those logins work, and our article on [M3U URLs in VLC](/blog/m3u-url-vlc) covers playlists, which carry the channel list but not always the guide.

Players differ in how they store and refresh guide data. If the guide works in the Apollo TV app but not in another player, the problem is in that player's guide settings rather than the service.

## Tips for getting the most from the TV guide

- **Browse by category.** Jumping to Sports or News is faster than scrolling hundreds of channels.
- **Use "now and next" for live sport.** It shows whether a match has started and what follows it.
- **Check the guide before you record or plan a viewing.** Schedules change, especially for live events that overrun.
- **Keep automatic time switched on** on every device you use for live TV.

## Frequently asked questions

### What does EPG mean on IPTV?

EPG means electronic program guide. It's the schedule data that fills the TV guide in an IPTV app, showing what's on each channel now and next.

### Why is my IPTV guide empty?

Usually because the guide data hasn't downloaded yet after installing or updating the app, or because the app cache is outdated. Leave the app open on live TV for a few minutes, then restart it and clear the cache if the guide is still empty.

### Why does the TV guide show the wrong times?

Because the device's time zone or clock is wrong. The app converts guide times using the device's settings, so a wrong time zone shifts every programme by the same amount. Turn on automatic date and time on the TV device.

### Why do some channels have no guide information?

Some channels don't publish schedules, and others have a channel ID that doesn't match the guide data. The channel still plays normally. Report it to support if a channel loses its guide for more than a day.

### How many days does an IPTV guide show?

It depends on the guide data. Many guides cover a few days ahead. If yours stops sooner than expected or shows old days, clear the app cache to force a fresh download.

### What is XMLTV?

XMLTV is a common file format for TV guide data. It lists channels and programmes with their start and end times, and many IPTV players use it to build their guide.

## Conclusion

An IPTV EPG is schedule data that travels separately from the video, which is why a channel can play while its guide is empty. Most guide problems come down to three things: data that hasn't downloaded yet, a device clock or time zone that's wrong, or an outdated app cache. Fix those, and the guide fills in.

If the guide is still missing after the steps above, [contact our support team](/contact) with your device, the app version and the channels affected.
