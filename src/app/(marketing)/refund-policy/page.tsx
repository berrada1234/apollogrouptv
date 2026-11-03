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

type RefundBlock =
  | { kind: "heading" | "paragraph"; text: string }
  | { kind: "list"; items: string[] };

// Owner refund terms: one block per line; "### " starts a subheading and "- " a bullet.
function refundBlocks(source: string): RefundBlock[] {
  const blocks: RefundBlock[] = [];
  for (const raw of source.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("### "))
      blocks.push({ kind: "heading", text: line.slice(4) });
    else if (line.startsWith("- ")) {
      const last = blocks.at(-1);
      if (last?.kind === "list") last.items.push(line.slice(2));
      else blocks.push({ kind: "list", items: [line.slice(2)] });
    } else blocks.push({ kind: "paragraph", text: line });
  }
  return blocks;
}

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
            text="You can ask for a refund within {{refundWindow}} (calendar days) of the date your pack is first activated, provided the conditions below are met."
            tokens={legalTokens(settings)}
          />
        </p>
        {settings.legal.refundTerms ? (
          refundBlocks(settings.legal.refundTerms).map((b, i) =>
            b.kind === "heading" ? (
              <h3
                key={i}
                className="mt-6 font-display text-base font-semibold text-text"
              >
                {b.text}
              </h3>
            ) : b.kind === "list" ? (
              <ul
                key={i}
                className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-muted marker:text-accent"
              >
                {b.items.map((item, j) => (
                  <li key={j}>
                    <RichText text={item} />
                  </li>
                ))}
              </ul>
            ) : (
              <p key={i} className="mt-3 leading-relaxed text-muted">
                <RichText text={b.text} />
              </p>
            ),
          )
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
