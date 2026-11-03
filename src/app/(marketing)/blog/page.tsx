import type { Metadata } from "next";
import Link from "next/link";
import { PostCard } from "@/components/blog";
import { CtaBand, PageHero } from "@/components/marketing/sections";
import { Section } from "@/components/section";
import { getPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const title = "Apollo Group TV Blog: Streaming Guides, Devices and IPTV Tips";
const description =
  "Practical guides from the Apollo Group TV team: Fire TV care, choosing devices, internet speed, player logins like M3U, Xtream and MAG, and staying safe online.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/blog" },
  openGraph: { title, description, url: "/blog" },
};

export default async function BlogIndex({ searchParams }: PageProps<"/blog">) {
  const posts = getPosts();
  const categories = [...new Set(posts.map((p) => p.category))];
  const sp = await searchParams;
  const active = typeof sp.category === "string" && categories.includes(sp.category) ? sp.category : null;
  const shown = active ? posts.filter((p) => p.category === active) : posts;
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Apollo Group TV blog",
    itemListElement: posts.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${siteConfig.url}/blog/${p.slug}`, name: p.title })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList).replace(/</g, "\\u003c") }} />
      <PageHero
        eyebrow="Blog"
        title="Streaming Guides and IPTV Tips"
        description="In-depth articles from the Apollo Group TV editorial team on devices, connections, player logins and getting the most from your subscription."
        crumbs={[{ href: "/blog", label: "Blog" }]}
      />
      <Section>
        <ul className="mb-8 flex flex-wrap gap-2" aria-label="Filter articles by category">
          {[null, ...categories].map((c) => (
            <li key={c ?? "all"}>
              <Link
                href={c ? `/blog?category=${encodeURIComponent(c)}` : "/blog"}
                className={cn(
                  "inline-flex rounded-full border px-3.5 py-1.5 text-sm font-medium",
                  active === c ? "border-primary/60 bg-primary/10 text-light-blue" : "border-border text-muted hover:text-text",
                )}
              >
                {c ?? "All articles"}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <li key={p.slug}>
              <PostCard post={p} />
            </li>
          ))}
        </ul>
      </Section>
      <CtaBand title="New to Apollo Group TV?" description="See what's included, compare the packs and set up on your device in minutes." />
    </>
  );
}
