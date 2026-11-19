import localFont from "next/font/local";

/*
 * Self-hosted, trimmed copies of the Google fonts (see scripts/subset-fonts.mjs): Latin-1 plus typographic
 * punctuation, Unbounded limited to the 400–600 weights the site uses. 58 KB for both instead of 81 KB.
 * Shared by the root layout and the global 404 page, which renders without that layout.
 *
 * font-display: optional. Both files are preloaded, so they are normally ready for the first paint; when one is
 * late, the size-matched fallback stays for that page view instead of swapping in later. A late swap re-laid out
 * all text about a second after first paint, which raised PageSpeed's Speed Index (2026-11-19).
 */
export const bodyFont = localFont({
  src: "../fonts/instrument-sans-latin.woff2",
  weight: "400 700",
  variable: "--font-body",
  display: "optional",
});

// App UI headings use the body family (legible at small sizes); Unbounded is the wide display face for marketing headlines.
export const heroFont = localFont({
  src: "../fonts/unbounded-latin.woff2",
  weight: "400 600",
  variable: "--font-hero",
  display: "optional",
});

export const fontVariables = `${bodyFont.variable} ${heroFont.variable}`;
