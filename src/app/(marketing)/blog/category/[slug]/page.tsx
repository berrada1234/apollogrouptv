import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PostCard } from "@/components/blog";
import { BlogCategoryNav } from "@/components/blog-category-nav";
import { CtaBand, PageHero } from "@/components/marketing/sections";
import { Section } from "@/components/section";
import { blogCategories, categoryBySlug } from "@/content/blog-categories";
import { getPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/site";
import { webPageNode } from "@/lib/schema";

export function generateStaticParams() {
  return blogCategories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/category/[slug]">): Promise<Metadata> {
  const category = categoryBySlug((await params).slug);
  if (!category) return {};
  const path = `/blog/category/${category.slug}`;
  return {
    title: { absolute: category.title },
    description: category.description,
    alternates: { canonical: path },
    openGraph: { title: category.title, description: category.description, url: path },
  };
}

export default async function BlogCategoryPage({ params }: PageProps<"/blog/category/[slug]">) {
  const category = categoryBySlug((await params).slug);
  if (!category) notFound();
  const path = `/blog/category/${category.slug}`;
  const posts = getPosts().filter((p) => p.category === category.name);
  const itemList = webPageNode({
    path,
    name: category.title,
    description: category.description,
    type: "CollectionPage",
    extra: { mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${siteConfig.url}/blog/${p.slug}`, name: p.title })),
    } },
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList).replace(/</g, "\u003c") }} />
      <PageHero
        pageSchema={false}
        eyebrow={`${posts.length} ${posts.length === 1 ? "article" : "articles"}`}
        title={category.name}
        description={category.intro}
        crumbs={[
          { href: "/blog", label: "Blog" },
          { href: path, label: category.name },
        ]}
      >
        <Link href={category.hub.href} className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-light-blue">
          {category.hub.label} <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </PageHero>
      <Section>
        <BlogCategoryNav active={category.slug} />
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
