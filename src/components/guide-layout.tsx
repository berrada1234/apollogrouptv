import Link from "next/link";
import { BookOpen, CheckCircle2, Download, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/misc";
import { buttonClasses } from "@/components/ui/button";
import { PageHero } from "@/components/marketing/sections";
import { FaqAccordion } from "@/components/marketing/faq-list";
import { RichText } from "@/components/rich-text";
import type { GuideStep } from "@/content/guides";
import { articleNode, ldJson } from "@/lib/schema";

type Related = { href: string; title: string };

/** Each guide links to the blog category that goes deeper on its topic (the articles link back here). */
const guideArticles: Record<string, { href: string; label: string }> = {
  "fire-tv-android-tv": { href: "/blog/category/fire-tv", label: "Fire TV articles" },
  "account-setup": { href: "/blog/category/getting-started", label: "Articles for new customers" },
  troubleshooting: { href: "/blog/category/troubleshooting", label: "Troubleshooting articles" },
};

export function GuideLayout({
  slug,
  title,
  intro,
  requirements,
  steps,
  troubleshooting,
  security,
  faqs,
  related,
  download,
}: {
  slug: string;
  title: string;
  intro: string;
  requirements: string[];
  steps: GuideStep[];
  troubleshooting: { q: string; a: string }[];
  security: string[];
  faqs: { id: string; category: string; question: string; answer: string }[];
  related: Related[];
  download?: { url: string; label: string };
}) {
  // Other device guides fall back to the Devices category.
  const articles = guideArticles[slug] ?? (["windows", "macos", "iphone-ipad", "android-phone-tablet", "apple-tv"].includes(slug) ? { href: "/blog/category/devices", label: "Device articles" } : undefined);
  const articleLd = articleNode({ path: `/guides/${slug}`, headline: title, description: intro, type: "TechArticle", section: "Setup guides" });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(articleLd) }} />
      <PageHero
        eyebrow="Setup guide"
        title={title}
        description={intro}
        crumbs={[
          { href: "/guides", label: "Guides" },
          { href: `/guides/${slug}`, label: title },
        ]}
      />
      <Container className="grid gap-12 py-14 lg:grid-cols-[1fr_280px]">
        <article className="max-w-3xl space-y-12">
          <section aria-labelledby="req" className="rounded-lg border border-border bg-card p-6 shadow-card">
            <h2 id="req" className="font-display text-lg font-semibold text-text">Before you start</h2>
            <ul className="mt-4 space-y-2.5 text-muted">
              {requirements.map((r) => (
                <li key={r} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden /> <RichText text={r} />
                </li>
              ))}
            </ul>
            {download && (
              <a href={download.url} target="_blank" rel="noopener noreferrer" className={buttonClasses({ className: "mt-6" })}>
                <Download className="h-4 w-4" aria-hidden /> {download.label}
              </a>
            )}
          </section>

          <section aria-labelledby="steps">
            <h2 id="steps" className="font-display text-2xl font-semibold text-text">Step by step</h2>
            <ol className="relative mt-6 space-y-6 before:absolute before:bottom-4 before:left-[15px] before:top-4 before:w-px before:bg-border">
              {steps.map((s, i) => (
                <li key={i} className="relative flex gap-5">
                  <span className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary font-display text-sm font-semibold text-on-primary">
                    {i + 1}
                  </span>
                  <div className="pt-1">
                    <h3 className="font-semibold text-text">{s.title}</h3>
                    {s.body && (
                      <p className="mt-1.5 leading-relaxed text-muted">
                        <RichText text={s.body} />
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {troubleshooting.length > 0 && (
            <section aria-labelledby="fix">
              <h2 id="fix" className="font-display text-2xl font-semibold text-text">If something goes wrong</h2>
              <dl className="mt-6 divide-y divide-border rounded-lg border border-border bg-card shadow-card">
                {troubleshooting.map((t) => (
                  <div key={t.q} className="p-5">
                    <dt className="font-semibold text-text">{t.q}</dt>
                    <dd className="mt-1.5 text-sm leading-relaxed text-muted">
                      <RichText text={t.a} />
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <section aria-labelledby="sec" className="rounded-lg border border-primary/25 bg-primary/5 p-6">
            <h2 id="sec" className="flex items-center gap-2 font-semibold text-text">
              <ShieldCheck className="h-5 w-5 text-accent" aria-hidden /> Security notes
            </h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted marker:text-accent">
              {security.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>

          {faqs.length > 0 && (
            <section aria-labelledby="faq">
              <h2 id="faq" className="font-display text-2xl font-semibold text-text">Related questions</h2>
              <div className="mt-6">
                <FaqAccordion items={faqs} />
              </div>
            </section>
          )}
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav aria-label="More guides" className="rounded-lg border border-border bg-card p-5 shadow-card">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-subtle">
              <BookOpen className="h-4 w-4" aria-hidden /> More guides
            </p>
            <ul className="mt-3 space-y-1">
              {related.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="block rounded-lg px-2 py-1.5 text-sm text-muted hover:bg-card-hover hover:text-text">
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
{articles && (
                <Link href={articles.href} className="block text-accent hover:text-light-blue">{articles.label} →</Link>
              )}
              <Link href="/app" className="block text-accent hover:text-light-blue">App &amp; devices →</Link>
              <Link href="/contact" className="block text-accent hover:text-light-blue">Need help? Contact us →</Link>
            </div>
          </nav>
        </aside>
      </Container>
    </>
  );
}
