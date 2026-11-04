import { absoluteUrl, siteConfig } from "@/lib/site";

/**
 * Shared structured-data building blocks, so every page describes itself the same way:
 * WebPage (#webpage) → part of WebSite (#website) → published by Organization (#organization),
 * with the page's BreadcrumbList (#breadcrumb) and any Article/Service/SoftwareApplication pointing back at #webpage.
 * Google doesn't follow @id references between pages, so each page carries a short inline copy of the
 * organization and website with the same @id the homepage uses for the full versions.
 */

export const ORG_ID = `${siteConfig.url}/#organization`;
export const SITE_ID = `${siteConfig.url}/#website`;
export const LOGO_URL = `${siteConfig.url}/brand/apollo-mark.png`;

export const pageId = (path: string) => `${absoluteUrl(path)}#webpage`;
export const breadcrumbId = (path: string) => `${absoluteUrl(path)}#breadcrumb`;

export const organizationRef = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: siteConfig.name,
  url: siteConfig.url,
  logo: { "@type": "ImageObject", url: LOGO_URL, width: 512, height: 512 },
};

export const websiteRef = { "@type": "WebSite", "@id": SITE_ID, name: siteConfig.name, url: siteConfig.url };

export type WebPageType = "WebPage" | "CollectionPage" | "AboutPage" | "ContactPage" | "FAQPage" | "ItemPage";

export function webPageNode({
  path,
  name,
  description,
  type = "WebPage",
  breadcrumb = true,
  extra,
}: {
  path: string;
  name: string;
  description?: string;
  type?: WebPageType;
  breadcrumb?: boolean;
  extra?: Record<string, unknown>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": pageId(path),
    url: absoluteUrl(path),
    name,
    ...(description ? { description } : {}),
    inLanguage: "en",
    isPartOf: websiteRef,
    publisher: organizationRef,
    ...(breadcrumb && path !== "/" ? { breadcrumb: { "@id": breadcrumbId(path) } } : {}),
    ...extra,
  };
}

/** Article-family node for guides and comparisons; dates only when the content actually records them. */
export function articleNode({
  path,
  headline,
  description,
  type = "Article",
  datePublished,
  dateModified,
  image,
  section,
}: {
  path: string;
  headline: string;
  description?: string;
  type?: "Article" | "BlogPosting" | "TechArticle";
  datePublished?: string;
  dateModified?: string;
  image?: string;
  section?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${absoluteUrl(path)}#article`,
    headline: headline.slice(0, 110),
    ...(description ? { description } : {}),
    url: absoluteUrl(path),
    mainEntityOfPage: { "@id": pageId(path) },
    inLanguage: "en",
    author: organizationRef,
    publisher: organizationRef,
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    ...(image ? { image } : {}),
    ...(section ? { articleSection: section } : {}),
  };
}

/**
 * FAQ questions on a page. It shares the page @id, so Google treats it as the same page (WebPage + FAQPage)
 * instead of a second page entity.
 */
export function faqNode(path: string, items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": pageId(path),
    url: absoluteUrl(path),
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

/** Serialises one or more nodes for a <script type="application/ld+json"> tag. */
export function ldJson(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
