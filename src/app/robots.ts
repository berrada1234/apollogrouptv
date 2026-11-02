import type { MetadataRoute } from "next";
import { absoluteUrl, privatePrefixes } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Staging/preview deployments can opt out of indexing entirely.
  if (process.env.ALLOW_INDEXING === "false") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: privatePrefixes.map((p) => `${p}`) },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
