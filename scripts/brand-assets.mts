/**
 * Renders every raster brand file from the shared mark geometry (src/lib/brand-mark.ts):
 *   src/app/icon.svg          favicon for modern browsers (wider blade gaps so it reads at 16px)
 *   src/app/favicon.ico       48px PNG inside an ICO, for browsers and crawlers that ask for /favicon.ico
 *   src/app/icon.png          192px mark
 *   src/app/apple-icon.png    180px tile on midnight for iOS home screens
 *   public/brand/apollo-mark.png        512px transparent mark (structured data, assistant)
 *   public/brand/apollo-logo-email.png  white wordmark for the dark email header
 *
 * Usage: npx tsx scripts/brand-assets.mts   (uses the installed Chrome through Playwright)
 */
import { writeFileSync } from "node:fs";
import { chromium } from "playwright";
import { BRAND_MIDNIGHT, markSvg } from "../src/lib/brand-mark";

const CHROME = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";

/** Wraps PNG bytes in a single-image ICO container (PNG-in-ICO is supported by every current browser). */
function pngToIco(png: Buffer, size: number) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size >= 256 ? 0 : size, 0);
  entry.writeUInt8(size >= 256 ? 0 : size, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(22, 12);
  return Buffer.concat([header, entry, png]);
}

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage();

async function renderSvg(svg: string, size: number) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<html><body style="margin:0;background:transparent">${svg.replace(/width="\d+" height="\d+"/, `width="${size}" height="${size}"`)}</body></html>`);
  return page.locator("svg").screenshot({ omitBackground: true });
}

writeFileSync("src/app/icon.svg", markSvg({ cut: 7, id: "fav" }));
writeFileSync("src/app/favicon.ico", pngToIco(await renderSvg(markSvg({ cut: 9 }), 48), 48));
writeFileSync("src/app/icon.png", await renderSvg(markSvg({ cut: 6 }), 192));
writeFileSync("src/app/apple-icon.png", await renderSvg(markSvg({ cut: 6, background: BRAND_MIDNIGHT }), 180));
writeFileSync("public/brand/apollo-mark.png", await renderSvg(markSvg({ cut: 4 }), 512));

// Email header logo: white wordmark, rendered at 2x for sharp text on high-density screens.
await page.setViewportSize({ width: 800, height: 200 });
await page.setContent(`<html><head>
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600&display=block" rel="stylesheet">
</head><body style="margin:0;background:transparent">
<div id="w" style="display:inline-flex;align-items:center;gap:22px;padding:4px;font-family:Unbounded;letter-spacing:-0.03em;line-height:1;white-space:nowrap">
  ${markSvg({ size: 72, cut: 4, id: "em" })}
  <span style="font-size:40px"><span style="font-weight:600;color:#FFFFFF">Apollo</span> <span style="font-weight:400;color:#A9B8FF">Group TV</span></span>
</div></body></html>`);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
const box = await page.locator("#w").boundingBox();
writeFileSync("public/brand/apollo-logo-email.png", await page.locator("#w").screenshot({ omitBackground: true }));
console.log(`email logo ${Math.round(box!.width)}x${Math.round(box!.height)}`);

await browser.close();
console.log("brand assets written");
