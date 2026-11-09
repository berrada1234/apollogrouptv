import "server-only";
import { rivals } from "@/content/compare";
import { choosingIptv, whyApollo } from "@/content/compare-guides";
import { generalGuides } from "@/content/guides";
import { getPaymentGuide } from "@/content/payment-guides";
import { getPost } from "@/lib/blog";
import { getDeviceGuides } from "@/lib/guides";
import { absoluteUrl } from "@/lib/site";

/**
 * Each article-style page has its own cover image: its real title and page type on the brand background.
 * Covers are rendered on demand at /covers/<page path> (blog posts keep /blog/<slug>/cover) and used three ways:
 * shown on the page with alt text, as the Article image in structured data, and as the social share image.
 */
export type Cover = { eyebrow: string; title: string; footer: string };

export async function resolveCover(path: string): Promise<Cover | null> {
  const [section, slug] = path.replace(/^\/+|\/+$/g, "").split("/");

  if (section === "guides" && slug) {
    const general = generalGuides.find((g) => g.slug === slug);
    if (general) return { eyebrow: "Setup guide", title: general.title, footer: "Step-by-step setup" };
    const device = (await getDeviceGuides()).find((d) => d.slug === slug);
    if (device) return { eyebrow: "Setup guide", title: device.title, footer: `Install on ${device.name}` };
    return null;
  }
  if (section === "payment-guides" && slug) {
    const g = getPaymentGuide(slug);
    return g ? { eyebrow: "Payment guide", title: g.title, footer: `About ${g.minutes} minutes` } : null;
  }
  if (section === "blog" && slug) {
    const post = getPost(slug);
    return post ? { eyebrow: post.category, title: post.title, footer: `${post.minutes} min read` } : null;
  }
  const rival = rivals.find((r) => r.path === `/${section}`);
  if (rival) return { eyebrow: "Comparison", title: `Apollo Group TV vs ${rival.name}`, footer: "Cost, channels and devices compared" };
  if (`/${section}` === whyApollo.path) return { eyebrow: "Comparison guide", title: whyApollo.title, footer: "Live TV without the monthly bill" };
  if (`/${section}` === choosingIptv.path) return { eyebrow: "Buyer's guide", title: choosingIptv.title, footer: "A checklist before you pay" };
  if (section === "is-apollo-group-tv-legal") return { eyebrow: "Trust and safety", title: "Is Apollo Group TV Legal?", footer: "IPTV, licensing and your rights" };
  return null;
}

/** Public URL of a page's cover image. */
export function coverUrl(path: string) {
  const p = `/${path.replace(/^\/+|\/+$/g, "")}`;
  return absoluteUrl(p.startsWith("/blog/") ? `${p}/cover` : `/covers${p}`);
}

/** Descriptive alt text: what the image shows, without "image of". */
export function coverAlt(cover: Cover) {
  return `${cover.title}, ${cover.eyebrow.toLowerCase()} from Apollo Group TV`;
}

/** openGraph/twitter images entry for a page's cover. */
export function coverShareImages(path: string, cover: Cover) {
  return { images: [{ url: coverUrl(path), width: 1200, height: 630, alt: coverAlt(cover) }] };
}

/** Same as coverShareImages, for metadata that already knows the title and page type. */
export function coverShare(path: string, title: string, eyebrow: string) {
  return coverShareImages(path, { title, eyebrow, footer: "" });
}
