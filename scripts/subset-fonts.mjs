// Rebuilds src/fonts/*.woff2: the two web fonts trimmed to what the site uses (used by src/lib/fonts.ts).
//
//   npm i --no-save subset-font
//   node scripts/subset-fonts.mjs path/to/InstrumentSans-latin.woff2 path/to/Unbounded-latin.woff2
//
// Sources: the Latin variable woff2 files Google Fonts serves (next/font/google downloaded the same ones).
// Keeps printable ASCII, Latin-1 (accented names) and the typographic punctuation the copy uses.
// Instrument Sans keeps its full 400-700 weight axis; Unbounded only 400-600 (the site never sets it heavier),
// which takes it from 51 KB to 30 KB. A character outside this set still shows, in the fallback font.
import fs from "node:fs";
import subsetFont from "subset-font";

const [instrument, unbounded] = process.argv.slice(2);
if (!instrument || !unbounded) throw new Error("usage: node scripts/subset-fonts.mjs <InstrumentSans.woff2> <Unbounded.woff2>");

let keep = "";
for (let c = 0x20; c <= 0x7e; c++) keep += String.fromCharCode(c); // printable ASCII
for (let c = 0xa0; c <= 0xff; c++) keep += String.fromCharCode(c); // Latin-1: accents, ©, ®, °, ½ …
keep += "‘’‚“”„‹›–—‑…•·′″−→←↑↓€™Œœƒˆˇˉˊˋˌˍˎˏːˑ˘˙˚˛˜˝   ";

for (const [input, output, wght] of [
  [instrument, "src/fonts/instrument-sans-latin.woff2", { min: 400, max: 700 }],
  [unbounded, "src/fonts/unbounded-latin.woff2", { min: 400, max: 600 }],
]) {
  const out = await subsetFont(fs.readFileSync(input), keep, { targetFormat: "woff2", variationAxes: { wght } });
  fs.writeFileSync(output, out);
  console.log(output + ":", (out.length / 1024).toFixed(1) + " KB");
}
