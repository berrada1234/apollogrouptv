import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, LogIn } from "lucide-react";
import { BlogBody, TableOfContents } from "@/components/blog";
import { CtaBand, PageHero } from "@/components/marketing/sections";
import { buttonClasses } from "@/components/ui/button";
import { Container } from "@/components/ui/misc";
import { ReadingPath } from "@/components/reading-path";
import { renewal } from "@/content/renewal";
import { parseBlocks, plainText, type Block } from "@/lib/blog";
import { faqNode } from "@/lib/schema";

const path = `/${renewal.slug}`;
const signInToRenew = "/sign-in?next=/dashboard/plan";

export const metadata: Metadata = {
  title: { absolute: renewal.seoTitle },
  description: renewal.description,
  alternates: { canonical: path },
  openGraph: { title: renewal.seoTitle, description: renewal.description, url: path, type: "article" },
};

/** Questions and answers under the "Frequently asked questions" heading, for FAQPage structured data. */
function faqFrom(blocks: Block[]) {
  const start = blocks.findIndex((b) => b.type === "h2" && b.text === "Frequently asked questions");
  if (start < 0) return [];
  const out: { q: string; a: string }[] = [];
  for (let i = start + 1; i < blocks.length && blocks[i].type !== "h2"; i++) {
    const b = blocks[i];
    const next = blocks[i + 1];
    if (b.type === "h3" && next?.type === "p") out.push({ q: b.text, a: plainText(next.text) });
  }
  return out;
}

export default function RenewalPage() {
  const blocks = parseBlocks(renewal.body);
  const faq = faqFrom(blocks);

  const jsonLd = [
    faqNode(path, faq),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageHero
        eyebrow="Renew your subscription"
        title={renewal.title}
        description={renewal.lead}
        crumbs={[{ href: path, label: "Renewal" }]}
        aside={
          <ol className="glass edge-spectrum rounded-[24px] p-6 sm:p-7" aria-label="Renewal in four steps">
            {renewal.steps.map((s, i) => (
              <li key={s.t} className="flex gap-4 border-b border-border py-4 first:pt-0 last:border-0 last:pb-0">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[rgb(122_162_255/0.45)] font-hero text-sm font-medium text-light-blue">
                  {i + 1}
                </span>
                <span>
                  <span className="block font-semibold text-text">{s.t}</span>
                  <span className="mt-0.5 block text-sm leading-6 text-muted">{s.b}</span>
                </span>
              </li>
            ))}
          </ol>
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href={signInToRenew} className={buttonClasses({ size: "lg" })}>
            <LogIn className="h-4 w-4" aria-hidden /> Sign in to renew
          </Link>
          <Link href="/plans" className={buttonClasses({ variant: "secondary", size: "lg" })}>
            Compare packs <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </PageHero>

      <Container className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-14 lg:py-14">
        <article className="min-w-0 max-w-3xl">
          {/* The four steps sit beside the hero on large screens; repeat them here for phones. */}
          <ol className="mb-8 grid gap-3 sm:grid-cols-2 lg:hidden" aria-label="Renewal in four steps">
            {renewal.steps.map((s, i) => (
              <li key={s.t} className="glass flex gap-3 rounded-[16px] p-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[rgb(122_162_255/0.45)] font-hero text-xs font-medium text-light-blue">{i + 1}</span>
                <span>
                  <span className="block text-sm font-semibold text-text">{s.t}</span>
                  <span className="mt-0.5 block text-sm leading-6 text-muted">{s.b}</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="mb-8 lg:hidden">
            <TableOfContents blocks={blocks} />
          </div>
          <BlogBody blocks={blocks} tokens={{}} />
          <ReadingPath current={path} />
        </article>
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <TableOfContents blocks={blocks} />
            <div className="glass rounded-[16px] p-5">
              <p className="font-semibold text-text">Renew from your dashboard</p>
              <p className="mt-1 text-sm leading-6 text-muted">Sign in and open Plans &amp; Billing.</p>
              <Link href={signInToRenew} className={buttonClasses({ size: "sm", className: "mt-4 w-full" })}>
                Sign in to renew
              </Link>
            </div>
          </div>
        </aside>
      </Container>

      <CtaBand title="Keep watching without a gap" description="Renew before your end date and your new pack starts the day the current one ends." />
    </>
  );
}
