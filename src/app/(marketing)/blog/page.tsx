import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { BlogCategoryNav } from "@/components/blog-category-nav";
import { categoryPath } from "@/content/blog-categories";
import { PostCard } from "@/components/blog";
import { CtaBand, PageHero } from "@/components/marketing/sections";
import { Section } from "@/components/section";
import { getPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/site";
import { shareImage } from "@/lib/share-image";

const title = "Apollo Group TV Blog: Streaming Guides, Devices and IPTV Tips";
const description =
  "Practical guides from the Apollo Group TV team: Fire TV care, choosing devices, internet speed, player logins like M3U, Xtream and MAG, and staying safe online.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/blog" },
  openGraph: { ...shareImage, title, description, url: "/blog" },
};

export default async function BlogIndex({ searchParams }: PageProps<"/blog">) {
  const posts = getPosts();
  const sp = await searchParams;
  // Old filter links (/blog?category=Fire%20TV) move to the category pages.
  if (typeof sp.category === "string") permanentRedirect(categoryPath(sp.category));
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
        pageType="CollectionPage"
        eyebrow="Blog"
        title="Streaming Guides and IPTV Tips"
        description="In-depth articles from the Apollo Group TV editorial team on devices, connections, player logins and getting the most from your subscription."
        crumbs={[{ href: "/blog", label: "Blog" }]}
      />
      <Section>
        <BlogCategoryNav />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
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
