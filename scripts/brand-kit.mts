/**
 * Social media / directory logo kit, rendered from the shared mark geometry into brand-kit/:
 *   apollo-group-tv-profile.png          1024×1024 avatar (survives circular crops)
 *   apollo-group-tv-logo-dark.png        1600×400 horizontal logo on midnight
 *   apollo-group-tv-logo-light.png       1600×400 horizontal logo on white
 *   apollo-group-tv-mark-transparent.png 1024×1024 mark, transparent background
 *   apollo-group-tv-cover.png            1500×500 header for X / Facebook
 *
 * Usage: npx tsx scripts/brand-kit.mts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";
import { BRAND_MIDNIGHT, markSvg } from "../src/lib/brand-mark";

const CHROME = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT = "brand-kit";
mkdirSync(OUT, { recursive: true });

const fonts = `<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600&display=block" rel="stylesheet">`;
const glow = `radial-gradient(60% 70% at 50% 45%, rgba(111,139,255,0.28), transparent 70%)`;
const word = (size: number, light = false) =>
  `<span style="font-family:Unbounded;font-size:${size}px;letter-spacing:-0.03em;line-height:1;white-space:nowrap"><span style="font-weight:600;color:${light ? "#0F1530" : "#FFFFFF"}">Apollo</span> <span style="font-weight:400;color:${light ? "#4A5BBF" : "#A9B8FF"}">Group TV</span></span>`;

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage();

async function shot(name: string, width: number, height: number, body: string, transparent = false) {
  await page.setViewportSize({ width, height });
  await page.setContent(`<html><head>${fonts}</head><body style="margin:0">${body}</body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  writeFileSync(`${OUT}/${name}`, await page.screenshot({ omitBackground: transparent }));
  console.log("wrote", name);
}

const center = "display:flex;align-items:center;justify-content:center";

await shot(
  "apollo-group-tv-profile.png",
  1024,
  1024,
  `<div style="width:1024px;height:1024px;${center};background:${BRAND_MIDNIGHT};background-image:${glow}">${markSvg({ size: 560, cut: 4.5, id: "p" })}</div>`,
);
await shot(
  "apollo-group-tv-mark-transparent.png",
  1024,
  1024,
  `<div style="width:1024px;height:1024px;${center};background:transparent">${markSvg({ size: 900, cut: 4, id: "t" })}</div>`,
  true,
);
await shot(
  "apollo-group-tv-logo-dark.png",
  1600,
  400,
  `<div style="width:1600px;height:400px;${center};gap:44px;background:${BRAND_MIDNIGHT};background-image:${glow}">${markSvg({ size: 190, cut: 4, id: "d" })}${word(104)}</div>`,
);
await shot(
  "apollo-group-tv-logo-light.png",
  1600,
  400,
  `<div style="width:1600px;height:400px;${center};gap:44px;background:#FFFFFF">${markSvg({ size: 190, cut: 4, id: "l" })}${word(104, true)}</div>`,
);
await shot(
  "apollo-group-tv-cover.png",
  1500,
  500,
  `<div style="width:1500px;height:500px;${center};flex-direction:column;gap:26px;background:${BRAND_MIDNIGHT};background-image:${glow},linear-gradient(90deg,transparent,transparent)">
     <div style="display:flex;align-items:center;gap:30px">${markSvg({ size: 128, cut: 4, id: "c" })}${word(70)}</div>
     <div style="font-family:Unbounded;font-size:30px;color:#C3C8E0;letter-spacing:-0.01em">Live TV, sports and movies on your own screens</div>
     <div style="height:4px;width:420px;border-radius:2px;background:linear-gradient(90deg,#46E0FF,#7B8CFF,#A77BFF)"></div>
     <div style="font-family:Unbounded;font-size:24px;color:#A9B8FF">apollogroupr.tv</div>
   </div>`,
);

await browser.close();
