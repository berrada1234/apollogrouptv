import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Cpu, FileCheck2, Scale, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/misc";
import { PageHero, RelatedLinks } from "@/components/marketing/sections";
import { FaqAccordion } from "@/components/marketing/faq-list";
import { articleNode } from "@/lib/schema";

const title = "Is Apollo Group TV Legal? IPTV, Licensing and Your Rights";
const description =
  "IPTV is a delivery technology; legality depends on content rights. What that means for Apollo Group TV, and five checks to run on any streaming service.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/is-apollo-group-tv-legal" },
  openGraph: { title, description, url: "/is-apollo-group-tv-legal", type: "article" },
};

const articleLd = articleNode({ path: "/is-apollo-group-tv-legal", headline: "Is Apollo Group TV Legal?", description });

const checks = [
  { t: "Who is the provider?", b: "A service should name the business behind it and publish a way to reach it." },
  { t: "Are policies published?", b: "Look for terms, a privacy policy, a refund policy and a copyright complaint process." },
  { t: "Do prices make sense?", b: "Offers that seem implausibly cheap for the content advertised deserve extra scrutiny." },
  { t: "Where do downloads come from?", b: "Official app stores, or links and codes the provider gives you inside your account. Files and codes passed around on forums are a warning sign." },
  { t: "How do you pay?", b: "Mainstream, reversible payment methods offer more protection than untraceable ones." },
];

const pageFaqs = [
  {
    id: "l1",
    category: "Legal",
    question: "Does using an app on my TV make streaming legal or illegal?",
    answer:
      "No. The app and the internet connection are just the delivery path. Legality turns on whether the content is being distributed with the rights holders' permission.",
  },
  {
    id: "l2",
    category: "Legal",
    question: "Can you tell me whether it's legal where I live?",
    answer:
      "We can't give legal advice, and rules differ between countries. If you're unsure about your situation, a qualified local lawyer is the right person to ask.",
  },
  {
    id: "l3",
    category: "Legal",
    question: "What do I do if I think something in the catalog shouldn't be there?",
    answer: "Tell us. Rights holders can use the notice process on our Copyright and DMCA page, and anyone can reach us through the contact page.",
  },
  {
    id: "l4",
    category: "Legal",
    question: "Is it legal to use a VPN with an IPTV service?",
    answer:
      "VPNs themselves are legal in most countries. Using one to get around regional licensing is a different matter: it breaks most services' terms, including ours, because channels are licensed for specific regions.",
  },
];

export default function LegalExplainerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd).replace(/</g, "\\u003c") }} />
      <PageHero
        eyebrow="Explained"
        title="Is Apollo Group TV Legal?"
        description="The answer starts with a distinction most articles skip: the technology used to deliver TV is one question, and the right to distribute the content is another."
        crumbs={[{ href: "/is-apollo-group-tv-legal", label: "Is Apollo Group TV legal?" }]}
      />

      <Container className="py-14">
        <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
          <article className="max-w-3xl space-y-12">
            <section aria-labelledby="short">
              <h2 id="short" className="font-display text-2xl font-semibold text-text">The short answer</h2>
              <p className="mt-4 leading-relaxed text-muted">
                Streaming television over the internet, often called IPTV, is a mainstream, lawful technology used by many large broadcasters.
                Whether a particular service is lawful depends on whether it has permission to distribute the channels and programs it offers.
                Apollo Group TV&apos;s policy is to list only authorized, properly licensed content, to remove material when a valid copyright
                notice shows it shouldn&apos;t be there, and to publish the policies that govern the service.
              </p>
            </section>

            <section aria-labelledby="tech" className="grid gap-4 sm:grid-cols-2">
              <h2 id="tech" className="sr-only">Technology versus rights</h2>
              <div className="rounded-lg border border-border bg-card p-6 shadow-card">
                <Cpu className="h-6 w-6 text-accent" aria-hidden />
                <h3 className="mt-4 font-semibold text-text">The technology</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  IPTV sends video as data over an internet connection to an app on your device, instead of over cable, satellite or an antenna.
                  The method itself is neutral.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-6 shadow-card">
                <Scale className="h-6 w-6 text-accent" aria-hidden />
                <h3 className="mt-4 font-semibold text-text">The rights</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Channels and programs are owned by rights holders. Distributing them requires their permission, usually through licensing
                  agreements that can vary by country and change over time.
                </p>
              </div>
            </section>

            <section aria-labelledby="evaluate">
              <h2 id="evaluate" className="font-display text-2xl font-semibold text-text">How to evaluate any streaming service</h2>
              <p className="mt-4 leading-relaxed text-muted">
                Before you subscribe to any service, ours included, these five questions say a lot about how it operates.
              </p>
              <ol className="mt-6 space-y-3">
                {checks.map((c, i) => (
                  <li key={c.t} className="flex gap-4 rounded-lg border border-border bg-card p-5">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-light-blue">{i + 1}</span>
                    <div>
                      <p className="font-semibold text-text">{c.t}</p>
                      <p className="mt-1 text-sm text-muted">{c.b}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section aria-labelledby="commit">
              <h2 id="commit" className="font-display text-2xl font-semibold text-text">What Apollo Group TV commits to</h2>
              <ul className="mt-5 space-y-3 text-muted">
                {[
                  "Listing only authorized, properly licensed content in the catalog.",
                  "A published copyright notice and takedown process.",
                  "App downloads only from official stores or verified links shown in our guides.",
                  "Published terms, privacy and refund policies, with dates.",
                ].map((t) => (
                  <li key={t} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden /> {t}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="not" className="rounded-lg border border-warning/30 bg-warning/5 p-6">
              <h2 id="not" className="flex items-center gap-2 font-semibold text-warning">
                <AlertTriangle className="h-5 w-5" aria-hidden /> What this page is not
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                This is general information, not legal advice, and it doesn&apos;t claim the service is authorized in every country. Laws differ by
                location; if you need a definitive answer for your circumstances, speak to a qualified lawyer.
              </p>
            </section>

            <section aria-labelledby="qa">
              <h2 id="qa" className="font-display text-2xl font-semibold text-text">Questions people ask</h2>
              <div className="mt-6">
                <FaqAccordion items={pageFaqs} />
              </div>
            </section>
          </article>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-border bg-card p-5 shadow-card">
              <ShieldCheck className="h-6 w-6 text-accent" aria-hidden />
              <p className="mt-3 font-semibold text-text">Our policies</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li><Link href="/terms-and-conditions" className="text-accent hover:text-light-blue">Terms and Conditions</Link></li>
                <li><Link href="/dmca" className="text-accent hover:text-light-blue">Copyright and DMCA</Link></li>
                <li><Link href="/privacy-policy" className="text-accent hover:text-light-blue">Privacy Policy</Link></li>
              </ul>
            </div>
            <div className="rounded-lg border border-border bg-card p-5 shadow-card">
              <FileCheck2 className="h-6 w-6 text-accent" aria-hidden />
              <p className="mt-3 font-semibold text-text">Report a concern</p>
              <p className="mt-1 text-sm text-muted">Rights holders and viewers can reach us directly.</p>
              <Link href="/contact" className="mt-3 inline-block text-sm text-accent hover:text-light-blue">Contact us →</Link>
            </div>
          </aside>
        </div>

        <div className="mt-16 border-t border-border pt-12">
          <h2 className="mb-6 font-display text-xl font-semibold text-text">Keep reading</h2>
          <RelatedLinks
            links={[
              { href: "/faq", label: "Full FAQ", description: "Plans, devices, account access and billing." },
              { href: "/about-us", label: "About Apollo Group TV", description: "How we approach transparency and support." },
              { href: "/channels", label: "Channel guide", description: "Browse the catalog by category." },
            ]}
          />
        </div>
      </Container>
    </>
  );
}
