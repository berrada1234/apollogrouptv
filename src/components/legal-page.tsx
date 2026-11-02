import Link from "next/link";
import { FileWarning } from "lucide-react";
import { Container } from "@/components/ui/misc";
import { PageHero } from "@/components/marketing/sections";
import { RichText, type Tokens } from "@/components/rich-text";
import type { LegalDoc } from "@/content/legal";
import { TOKEN_LABELS } from "@/content/legal";
import type { Settings } from "@/lib/settings";
import { formatDate } from "@/lib/utils";

export function legalTokens(s: Settings): Tokens {
  const v: Record<string, string> = {
    entityName: s.legal.entityName,
    entityAddress: s.legal.entityAddress,
    governingLaw: s.legal.governingLaw,
    officialDomain: s.legal.officialDomain,
    supportEmail: s.general.supportEmail,
    dmcaAgentName: s.legal.dmcaAgentName,
    dmcaAgentEmail: s.legal.dmcaAgentEmail,
    dmcaAgentAddress: s.legal.dmcaAgentAddress,
  };
  return Object.fromEntries(Object.entries(TOKEN_LABELS).map(([k, label]) => [k, { value: v[k] ?? "", placeholder: label }]));
}

const related = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms and Conditions" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/dmca", label: "Copyright and DMCA" },
  { href: "/is-apollo-group-tv-legal", label: "Is Apollo Group TV legal?" },
];

export function LegalPage({ doc, settings, children }: { doc: LegalDoc; settings: Settings; children?: React.ReactNode }) {
  const tokens = legalTokens(settings);
  const approved = settings.legal.approved;
  return (
    <>
      <PageHero title={doc.title} crumbs={[{ href: `/${doc.slug}`, label: doc.title }]}>
        <p className="text-sm text-subtle">
          {settings.legal.lastUpdated ? `Last updated ${formatDate(settings.legal.lastUpdated)}` : "Last updated: not yet published"}
        </p>
      </PageHero>
      <Container className="grid gap-12 py-14 lg:grid-cols-[1fr_240px]">
        <article className="max-w-3xl">
          {!approved && (
            <div role="note" className="mb-10 flex gap-3 rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm">
              <FileWarning className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden />
              <p className="text-text/90">
                <strong className="text-warning">Draft — pending owner review.</strong> This policy has not yet been approved for publication.
                Highlighted items are details the site owner still needs to provide.
              </p>
            </div>
          )}
          <p className="text-lg leading-relaxed text-muted">
            <RichText text={doc.intro} tokens={tokens} />
          </p>
          {children}
          <div className="mt-10 space-y-10">
            {doc.sections.map((s, i) => (
              <section key={s.heading} aria-labelledby={`sec-${i}`}>
                <h2 id={`sec-${i}`} className="font-display text-xl font-semibold text-text">
                  {s.heading}
                </h2>
                {s.paragraphs?.map((p, j) => (
                  <p key={j} className="mt-3 leading-relaxed text-muted">
                    <RichText text={p} tokens={tokens} />
                  </p>
                ))}
                {s.list && (
                  <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-muted marker:text-accent">
                    {s.list.map((li, j) => (
                      <li key={j}>
                        <RichText text={li} tokens={tokens} />
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
          <p className="mt-12 border-t border-border pt-6 text-sm text-subtle">
            This page is general information about how our service works and is not legal advice.
          </p>
        </article>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav aria-label="Policies" className="rounded-lg border border-border bg-card p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-subtle">Policies</p>
            <ul className="mt-3 space-y-1">
              {related.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    aria-current={r.href === `/${doc.slug}` ? "page" : undefined}
                    className="block rounded-lg px-2 py-1.5 text-sm text-muted hover:bg-card-hover hover:text-text aria-[current=page]:text-light-blue"
                  >
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-border pt-4 text-sm">
              <Link href="/contact" className="text-accent hover:text-light-blue">
                Questions? Contact us →
              </Link>
            </div>
          </nav>
        </aside>
      </Container>
    </>
  );
}
