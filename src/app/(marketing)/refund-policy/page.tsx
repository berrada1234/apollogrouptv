import type { Metadata } from "next";
import { LegalPage, legalTokens } from "@/components/legal-page";
import { RichText } from "@/components/rich-text";
import { refundPolicy as doc } from "@/content/legal";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: doc.metaTitle },
  description: doc.description,
  alternates: { canonical: `/${doc.slug}` },
  openGraph: {
    title: doc.metaTitle,
    description: doc.description,
    url: `/${doc.slug}`,
  },
};

export default async function Page() {
  const settings = await getSettings();
  return (
    <LegalPage doc={doc} settings={settings}>
      <section
        aria-labelledby="refund-terms"
        className="mt-10 rounded-lg border border-border bg-card p-6 shadow-card"
      >
        <h2
          id="refund-terms"
          className="font-display text-xl font-semibold text-text"
        >
          Refund window and eligibility
        </h2>
        <p className="mt-3 leading-relaxed text-muted">
          <RichText
            text="You can ask for a refund within {{refundWindow}} of your pack being activated, provided the conditions below are met."
            tokens={legalTokens(settings)}
          />
        </p>
        {settings.legal.refundTerms ? (
          settings.legal.refundTerms
            .split("\n")
            .filter(Boolean)
            .map((p, i) => (
              <p key={i} className="mt-3 leading-relaxed text-muted">
                <RichText text={p} />
              </p>
            ))
        ) : (
          <p className="mt-3 leading-relaxed text-muted">
            <mark className="rounded bg-warning/15 px-1 text-warning">
              [Owner to provide: eligibility conditions and exclusions]
            </mark>
          </p>
        )}
      </section>
    </LegalPage>
  );
}
