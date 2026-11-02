import type { MetadataRoute } from "next";
import { getDeviceGuides } from "@/lib/guides";
import { getSettings } from "@/lib/settings";
import { absoluteUrl, policyRoutes, publicRoutes } from "@/lib/site";

// Device guides and policy approval live in the database, so the sitemap is built per request.
export const dynamic = "force-dynamic";

const priority = (path: string) =>
  path === "/" ? 1 : path === "/plans" ? 0.9 : ["/product", "/app", "/channels"].includes(path) ? 0.8 : path.startsWith("/guides/") ? 0.6 : 0.7;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [settings, devices] = await Promise.all([getSettings(), getDeviceGuides()]);
  const paths = [
    ...publicRoutes,
    ...devices.map((d) => `/guides/${d.slug}`),
    // Draft policies are noindex, so they stay out of the sitemap until approved.
    ...(settings.legal.approved ? policyRoutes : []),
  ];
  return paths.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === "/" || path === "/channels" || path === "/reviews" ? "daily" : "weekly",
    priority: path.startsWith("/privacy") || path.startsWith("/terms") || path === "/dmca" || path === "/refund-policy" ? 0.3 : priority(path),
  }));
}
