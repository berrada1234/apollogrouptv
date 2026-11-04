import { BlogBody, TableOfContents } from "@/components/blog";
import { CtaBand, PageHero } from "@/components/marketing/sections";
import { Container } from "@/components/ui/misc";
import { type Block, parseBlocks } from "@/lib/blog";

/**
 * Long-form page rendered from Markdown with the blog renderer: quick answer first, then the body.
 * `insert` is placed right after the first paragraph that follows the heading named in `insertAfter`.
 */
export function GuideArticle({
  page,
  crumbs,
  insert,
  insertAfter,
}: {
  page: { title: string; answer: string; body: string; description: string };
  crumbs: { href: string; label: string }[];
  insert?: React.ReactNode;
  insertAfter?: string;
}) {
  const blocks = parseBlocks(page.body);
  let before: Block[] = blocks;
  let after: Block[] = [];
  if (insert && insertAfter) {
    const h = blocks.findIndex((b) => b.type === "h2" && b.text === insertAfter);
    if (h >= 0) {
      const cut = blocks[h + 1]?.type === "p" ? h + 2 : h + 1;
      before = blocks.slice(0, cut);
      after = blocks.slice(cut);
    }
  }

  return (
    <>
      <PageHero eyebrow="Compare" title={page.title} description={page.description} crumbs={crumbs} />
      <Container className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-14 lg:py-14">
        <article className="min-w-0 max-w-3xl">
          <section aria-label="Quick answer" className="glass edge-spectrum mb-8 rounded-[18px] p-5 sm:p-6">
            <p className="text-sm font-semibold text-light-blue">Quick answer</p>
            <p className="mt-2 text-base leading-7 text-text">{page.answer}</p>
          </section>
          <div className="mb-8 lg:hidden">
            <TableOfContents blocks={blocks} />
          </div>
          <BlogBody blocks={before} tokens={{}} />
          {after.length > 0 && (
            <>
              {insert}
              <BlogBody blocks={after} tokens={{}} />
            </>
          )}
        </article>
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <TableOfContents blocks={blocks} />
          </div>
        </aside>
      </Container>
      <CtaBand title="See the packs for yourself" description="Every pack is a one-time payment with the same channels and library. Nothing renews by itself." />
    </>
  );
}
