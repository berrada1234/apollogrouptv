import localFont from "next/font/local";

/*
 * Self-hosted, trimmed copies of the Google fonts (see scripts/subset-fonts.mjs): Latin-1 plus typographic
 * punctuation, Unbounded limited to the 400–600 weights the site uses. 58 KB for both instead of 81 KB.
 * Shared by the root layout and the global 404 page, which renders without that layout.
 */
export const bodyFont = localFont({
  src: "../fonts/instrument-sans-latin.woff2",
  weight: "400 700",
  variable: "--font-body",
  display: "swap",
});

// App UI headings use the body family (legible at small sizes); Unbounded is the wide display face for marketing headlines.
export const heroFont = localFont({
  src: "../fonts/unbounded-latin.woff2",
  weight: "400 600",
  variable: "--font-hero",
  display: "swap",
});

export const fontVariables = `${bodyFont.variable} ${heroFont.variable}`;
