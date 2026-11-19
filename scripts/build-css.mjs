// Compiles src/app/globals.css (Tailwind) into .site-css/site-css.mjs for <InlineCss /> (see
// src/components/inline-css.tsx). Runs before `next build`; production builds swap this module in for the empty
// stub src/lib/site-css.ts on the server only (next.config.ts), so the browser bundle never carries the CSS.
import fs from "node:fs";
import path from "node:path";
import postcss from "postcss";
import tailwind from "@tailwindcss/postcss";

const from = path.join(process.cwd(), "src/app/globals.css");
const result = await postcss([tailwind({ optimize: { minify: true } })]).process(fs.readFileSync(from, "utf8"), { from });
fs.mkdirSync(".site-css", { recursive: true });
fs.writeFileSync(".site-css/site-css.mjs", `export const siteCss = ${JSON.stringify(result.css)};\n`);
console.log(`.site-css/site-css.mjs: ${(result.css.length / 1024).toFixed(1)} KB of CSS`);
