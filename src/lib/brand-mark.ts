/**
 * Apollo Group TV mark geometry (120×120 box): the brand triangle in the site spectrum, cut by three aperture
 * blades whose opening forms a play button. Shared by the <BrandMark> component and scripts/brand-assets.mts,
 * which renders the favicon, app icons, email logo and PNG mark from the same shapes.
 */
export const MARK = {
  outer: "60,12 10,100 110,100",
  play: "45,52 45,88 76,70",
  cuts: [
    [45, 52, 45, 38],
    [76, 70, 101.5, 84.8],
    [45, 88, 23.8, 100.5],
  ],
  stops: ["#46E0FF", "#6F8BFF", "#A77BFF"],
} as const;

export const BRAND_MIDNIGHT = "#0A0E27";

/**
 * The mark as a standalone SVG string. `cut` widens the blade gaps for small sizes; `background` draws a square
 * tile (app icons) with the mark scaled inside it.
 */
export function markSvg({ size = 120, cut = 4, id = "am", background }: { size?: number; cut?: number; id?: string; background?: string } = {}) {
  const lines = MARK.cuts
    .map(([x1, y1, x2, y2]) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#000" stroke-width="${cut}" stroke-linecap="round"/>`)
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="${size}" height="${size}"><defs><linearGradient id="${id}g" x1="18" y1="18" x2="104" y2="104" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${MARK.stops[0]}"/><stop offset="0.55" stop-color="${MARK.stops[1]}"/><stop offset="1" stop-color="${MARK.stops[2]}"/></linearGradient><mask id="${id}m" maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="120"><polygon points="${MARK.outer}" fill="#fff" stroke="#fff" stroke-width="14" stroke-linejoin="round"/><polygon points="${MARK.play}" fill="#000" stroke="#000" stroke-width="${cut * 0.9}" stroke-linejoin="round"/>${lines}</mask></defs>${background ? `<rect width="120" height="120" fill="${background}"/><g transform="translate(16.8 14.4) scale(0.72)">` : "<g>"}<rect width="120" height="120" fill="url(#${id}g)" mask="url(#${id}m)"/></g></svg>`;
}
