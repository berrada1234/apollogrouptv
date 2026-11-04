import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, PenLine } from "lucide-react";
import { BlogBody, Inline, PostCard, TableOfContents } from "@/components/blog";
import { CtaBand, PageHero } from "@/components/marketing/sections";
import { ReadingPath } from "@/components/reading-path";
import { Container } from "@/components/ui/misc";
import { BLOG_AUTHOR, getPost, getPosts, relatedPosts } from "@/lib/blog";
import { getSettings } from "@/lib/settings";
import { siteConfig } from "@/lib/site";
import { categoryPath } from "@/content/blog-categories";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return { title: "Article not found", robots: { index: false } };
  return {
    title: { absolute: post.seoTitle },
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    authors: [{ name: BLOG_AUTHOR }],
    openGraph: {
      title: post.seoTitle,
      description: post.description,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: [BLOG_AUTHOR],
      section: post.category,
      images: [{ url: `/blog/${post.slug}/cover`, width: 1200, height: 630, alt: post.title }],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const settings = await getSettings();
  const officialDomain = settings.legal.officialDomain || new URL(siteConfig.url).host;
  // The Downloader code lives in Admin → Settings → App platforms, so articles never go stale when it changes.
  const copyItems = settings.apps.platforms.flatMap((p) => p.copyItems.split(/\r?\n/)).map((l) => l.split("|").map((x) => x.trim()));
  const downloaderCode = copyItems.find(([k]) => /downloader code/i.test(k))?.[1] || "shown in our Fire TV setup guide";
  const downloaderUrl = copyItems.find(([k]) => /full url/i.test(k))?.[1] || "the address shown in our Fire TV setup guide";
  const tokens = { officialDomain, downloaderCode, downloaderUrl };
  const url = `${siteConfig.url}/blog/${post.slug}`;
  const cover = `${url}/cover`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url,
    mainEntityOfPage: url,
    image: cover,
    datePublished: post.date,
    dateModified: post.updated,
    articleSection: post.category,
    keywords: [post.keyword, ...post.secondary].join(", "),
    wordCount: post.words,
    author: { "@type": "Organization", name: BLOG_AUTHOR, url: siteConfig.url },
    publisher: { "@type": "Organization", "@id": `${siteConfig.url}/#organization`, name: siteConfig.name, logo: { "@type": "ImageObject", url: `${siteConfig.url}/brand/apollo-mark.png` } },
  };
  const related = relatedPosts(post);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageHero
        eyebrow={post.category}
        title={post.title}
        crumbs={[
          { href: "/blog", label: "Blog" },
          { href: categoryPath(post.category), label: post.category },
          { href: `/blog/${post.slug}`, label: post.title },
        ]}
      >
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5">
            <PenLine className="h-4 w-4" aria-hidden /> {BLOG_AUTHOR}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" aria-hidden /> <time dateTime={post.date}>{formatDate(new Date(post.date))}</time>
          </span>
          {post.updated !== post.date && (
            <span>
              Updated <time dateTime={post.updated}>{formatDate(new Date(post.updated))}</time>
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4" aria-hidden /> {post.minutes} min read
          </span>
        </p>
      </PageHero>

      <Container className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-14 lg:py-14">
        <article className="min-w-0 max-w-3xl">
          {post.answer && (
            <section aria-label="Quick answer" className="glass edge-spectrum mb-8 rounded-[18px] p-5 sm:p-6">
              <p className="text-sm font-semibold text-light-blue">Quick answer</p>
              <p className="mt-2 text-base leading-7 text-text">
                <Inline text={post.answer} tokens={tokens} />
              </p>
            </section>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element -- generated cover image */}
          <img
            src={`/blog/${post.slug}/cover`}
            alt={`${post.title}, a ${post.category} guide from the Apollo Group TV blog`}
            width={1200}
            height={630}
            className="mb-8 aspect-[1200/630] w-full rounded-[18px] border border-border object-cover"
          />
          <div className="mb-8 lg:hidden">
            <TableOfContents blocks={post.blocks} />
          </div>
          <BlogBody blocks={post.blocks} tokens={tokens} />
          <ReadingPath current={`/blog/${post.slug}`} />
          <footer className="mt-12 rounded-[16px] border border-border bg-card p-5 text-sm text-muted">
            Written by the <span className="font-semibold text-text">{BLOG_AUTHOR}</span>. Found something out of date?{" "}
            <Link href="/contact" className="text-accent hover:text-light-blue">
              Let us know
            </Link>
            .
          </footer>
        </article>
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <TableOfContents blocks={post.blocks} />
          </div>
        </aside>
      </Container>

      {related.length > 0 && (
        <section aria-labelledby="related" className="border-t border-border py-14">
          <Container>
            <p id="related" className="font-display text-2xl font-bold text-text">
              Related articles
            </p>
            <ul className="mt-6 grid gap-5 md:grid-cols-3">
              {related.map((p) => (
                <li key={p.slug}>
                  <PostCard post={p} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
      <CtaBand title="Watch Apollo Group TV on your own screens" description="Compare the packs, create your account and follow the setup guide for your device." />
    </>
  );
}

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}
