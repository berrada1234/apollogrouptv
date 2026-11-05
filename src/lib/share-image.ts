/**
 * Default social share image (rendered by src/app/opengraph-image.tsx).
 * Next.js merges metadata shallowly, so a page that defines its own `openGraph` object loses the inherited
 * image; every such page spreads this first (Next's documented shared-fields pattern).
 */
export const shareImage = {
  images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Apollo Group TV: live TV, sports and movies on your own screens" }],
};
