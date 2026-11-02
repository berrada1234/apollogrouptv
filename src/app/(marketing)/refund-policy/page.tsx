import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { RichText } from "@/components/rich-text";
import { refundPolicy as doc } from "@/content/legal";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: { absolute: doc.metaTitle },
    description: doc.description,
    alternates: { canonical: `/${doc.slug}` },
    openGraph: { title: doc.metaTitle, description: doc.description, url: `/${doc.slug}` },
    // Draft policies are not indexed until the owner approves them in admin settings.
    robots: settings.legal.approved ? undefined : { index: false, follow: true },
  };
}

export default async function Page() {
  const settings = await getSettings();
  return (
    <LegalPage doc={doc} settings={settings}>
      <section aria-labelledby="refund-terms" className="mt-10 rounded-lg border border-border bg-card p-6 shadow-card">
        <h2 id="refund-terms" className="font-display text-xl font-semibold text-text">
          Refund eligibility
        </h2>
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
            <mark className="rounded bg-warning/15 px-1 text-warning">[Owner to provide: approved refund window, eligibility conditions and exclusions]</mark>
          </p>
        )}
      </section>
    </LegalPage>
  );
}
