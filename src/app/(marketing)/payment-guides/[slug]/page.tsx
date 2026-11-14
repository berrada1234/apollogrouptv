import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlertTriangle, CalendarDays, CheckCircle2, Lightbulb } from "lucide-react";
import { FaqAccordion } from "@/components/marketing/faq-list";
import { CtaBand, PageHero } from "@/components/marketing/sections";
import { GuideCard, GuideGlyph, GuideMeta, PaymentFlow } from "@/components/payment-guides";
import { RichText, stripRich } from "@/components/rich-text";
import { Container } from "@/components/ui/misc";
import { getPaymentGuide, paymentGuides } from "@/content/payment-guides";
import Image from "next/image";
import { cn, formatDate } from "@/lib/utils";
import { articleNode, faqNode } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";
import { shareImage } from "@/lib/share-image";
import { PageCover } from "@/components/page-cover";
import { coverShare } from "@/lib/covers";

export function generateStaticParams() {
  return paymentGuides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/payment-guides/[slug]">): Promise<Metadata> {
  const g = getPaymentGuide((await params).slug);
  if (!g) return { title: "Guide not found", robots: { index: false } };
  return {
    title: { absolute: g.metaTitle },
    description: g.description,
    alternates: { canonical: `/payment-guides/${g.slug}` },
    openGraph: { ...shareImage, ...coverShare(`/payment-guides/${g.slug}`, g.title, "Payment guide"), title: g.metaTitle, description: g.description, url: `/payment-guides/${g.slug}`, type: "article", modifiedTime: g.updated },
  };
}

export default async function PaymentGuidePage({ params }: PageProps<"/payment-guides/[slug]">) {
  const g = getPaymentGuide((await params).slug);
  if (!g) notFound();

  const jsonLd = [
    articleNode({ path: `/payment-guides/${g.slug}`, headline: g.title, description: g.description, type: "TechArticle", dateModified: g.updated, section: "Payment guides" }),
    faqNode(`/payment-guides/${g.slug}`, g.faqs.map((f) => ({ q: f.q, a: stripRich(f.a) }))),
    ...(g.video
      ? [
          {
            "@context": "https://schema.org",
            "@type": "VideoObject",
            name: g.video.title,
            description: g.video.description,
            thumbnailUrl: absoluteUrl(g.video.poster),
            contentUrl: absoluteUrl(g.video.src),
            uploadDate: g.video.uploaded,
            duration: g.video.duration,
          },
        ]
      : []),
  ];
  const related = g.related.map(getPaymentGuide).filter((x) => x !== undefined);
  // Steps are numbered continuously across sections.
  const offsets = g.sections.map((_, i) => g.sections.slice(0, i).reduce((sum, sec) => sum + sec.steps.length, 0));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageHero
        eyebrow="Payment guide"
        title={g.title}
        crumbs={[
          { href: "/payment-guides", label: "Payment Guides" },
          { href: `/payment-guides/${g.slug}`, label: g.name },
        ]}
      >
        <div className="flex flex-wrap items-center gap-4">
          <GuideGlyph guide={g} size="lg" />
          <div className="space-y-1">
            <p className="flex items-center gap-1.5 text-sm text-muted">
              <CalendarDays className="h-4 w-4" aria-hidden /> Last updated: <time dateTime={g.updated}>{formatDate(new Date(g.updated))}</time>
            </p>
            <GuideMeta guide={g} className="flex text-sm" />
          </div>
        </div>
      </PageHero>
      <PageCover path={`/payment-guides/${g.slug}`} />

      <Container className="grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_280px] lg:py-16">
        <article className="min-w-0 max-w-3xl space-y-10">
          <div className="space-y-4 text-lg leading-relaxed text-muted">
            {g.intro.map((p) => (
              <p key={p}>
                <RichText text={p} />
              </p>
            ))}
          </div>

          <PaymentFlow guide={g} />

          {g.video && (
            <section aria-labelledby="video" className="rounded-[16px] border border-border bg-card p-6 shadow-card">
              <h2 id="video" className="font-display text-xl font-bold text-text">
                Watch it first
              </h2>
              <p className="mt-2 text-muted">{g.video.description} The steps below show the same screens one at a time.</p>
              <video
                controls
                playsInline
                preload="none"
                poster={g.video.poster}
                width={g.video.width}
                height={g.video.height}
                className="mt-5 h-auto w-full max-w-[300px] rounded-[18px] border border-border bg-black"
                aria-label={g.video.title}
              >
                <source src={g.video.src} type="video/mp4" />
              </video>
            </section>
          )}

          <section aria-labelledby="needs" className="rounded-[16px] border border-border bg-card p-6 shadow-card">
            <h2 id="needs" className="font-display text-xl font-bold text-text">
              What you need
            </h2>
            <ul className="mt-4 space-y-2.5">
              {g.needs.map((item) => (
                <li key={item} className="flex gap-2.5 text-muted">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                  <span>
                    <RichText text={item} />
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="steps" className="space-y-8">
            <h2 id="steps" className="font-display text-2xl font-bold text-text">
              Step-by-step instructions
            </h2>
            {g.sections.map((section, si) => (
              <div key={section.heading}>
                <h3 className="font-display text-lg font-semibold text-text">{section.heading}</h3>
                {section.intro && <p className="mt-2 text-muted">{section.intro}</p>}
                <ol className="mt-5 space-y-4">
                  {section.steps.map((step, j) => {
                    const n = offsets[si] + j + 1;
                    return (
                      <li key={step.title} className="flex gap-4 rounded-[14px] border border-border bg-card p-5">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/15 font-display text-sm font-bold text-accent" aria-hidden>
                          {n}
                        </span>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-text">
                            <span className="sr-only">Step {n}: </span>
                            {step.title}
                          </h4>
                          <p className="mt-1.5 leading-7 text-muted">
                            <RichText text={step.body} />
                          </p>
                          {step.tip && (
                            <p className="mt-3 flex gap-2 rounded-xl border border-primary/25 bg-primary/[0.06] px-3.5 py-2.5 text-sm text-light-blue">
                              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                              <span>
                                <span className="font-semibold">Pro tip: </span>
                                <RichText text={step.tip} />
                              </span>
                            </p>
                          )}
                          {step.note && (
                            <p className="mt-3 flex gap-2 rounded-xl border border-warning/30 bg-warning/[0.07] px-3.5 py-2.5 text-sm text-warning">
                              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                              <span>
                                <span className="font-semibold">Note: </span>
                                <RichText text={step.note} />
                              </span>
                            </p>
                          )}
                          {step.image && (
                            <figure className={cn("mt-4", { phone: "max-w-[240px]", panel: "max-w-[360px]", screen: "max-w-full" }[step.image.kind])}>
                              <Image
                                src={step.image.src}
                                alt={step.image.alt}
                                width={step.image.width}
                                height={step.image.height}
                                sizes={{ phone: "240px", panel: "360px", screen: "(min-width: 1024px) 640px, 100vw" }[step.image.kind]}
                                className={cn("h-auto w-full border border-border", step.image.kind === "phone" ? "rounded-[18px]" : "rounded-[12px]")}
                              />
                            </figure>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            ))}
          </section>

          {g.extras?.map((x) => (
            <section key={x.heading} aria-label={x.heading} className="space-y-3">
              <h2 className="font-display text-2xl font-bold text-text">{x.heading}</h2>
              {x.paragraphs.map((p) => (
                <p key={p} className="leading-7 text-muted">
                  <RichText text={p} />
                </p>
              ))}
              {x.list && (
                <ul className="list-disc space-y-2 pl-5 text-muted marker:text-accent">
                  {x.list.map((item) => (
                    <li key={item}>
                      <RichText text={item} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <section aria-labelledby="next" className="rounded-[16px] border border-success/30 bg-success/[0.05] p-6">
            <h2 id="next" className="font-display text-2xl font-bold text-text">
              What happens next?
            </h2>
            <div className="mt-3 space-y-3 leading-7 text-muted">
              {g.after.map((p) => (
                <p key={p}>
                  <RichText text={p} />
                </p>
              ))}
            </div>
          </section>

          <section aria-labelledby="faq" className="space-y-4">
            <h2 id="faq" className="font-display text-2xl font-bold text-text">
              Frequently asked questions
            </h2>
            <FaqAccordion items={g.faqs.map((f, i) => ({ id: `${g.slug}-${i}`, category: "Payment guide", question: f.q, answer: f.a }))} />
          </section>
        </article>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-subtle">Other payment guides</p>
          <ul className="space-y-3">
            {related.map((r) => (
              <li key={r.slug}>
                <GuideCard guide={r} />
              </li>
            ))}
          </ul>
        </aside>
      </Container>

      <CtaBand title="Pay for your pack with this guide open" description="Choose your pack, open your invoice and pay with the method from this guide." />
    </>
  );
}
