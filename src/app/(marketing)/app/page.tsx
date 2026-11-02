import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown, Download, MonitorSmartphone, ShieldCheck } from "lucide-react";
import { Container, EmptyState, SectionHeading } from "@/components/ui/misc";
import { ButtonLink, buttonClasses } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CtaBand, PageHero, RelatedLinks } from "@/components/marketing/sections";
import { FaqAccordion } from "@/components/marketing/faq-list";
import { getPublishedFaqs } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Apollo Group TV App — Devices, Setup & Troubleshooting" },
  description: "How to get the Apollo Group TV app: verified devices, official download links, installation steps and fixes for common sign-in and playback problems.",
  alternates: { canonical: "/app" },
  openGraph: { title: "Apollo Group TV App — Devices, Setup & Troubleshooting", description: "How to get the Apollo Group TV app: verified devices, official download links, installation steps and fixes for common sign-in and playback problems.", url: "/app" },
};

const troubleshooting = [
  { t: "The app won't sign in", b: "Confirm your email is verified and your password is correct. You can reset your password from the Sign In page." },
  { t: "Playback is buffering", b: "Check that your connection is stable, restart your router and device, and close other bandwidth-heavy apps." },
  { t: "The app is out of date", b: "Install the latest version using the official download link for your device on this page." },
  { t: "Still stuck?", b: "Open a support ticket from your dashboard with your device model and a short description of the issue." },
];

function GuidePreview() {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-lg" aria-hidden>
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-accent">
          <MonitorSmartphone className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-semibold text-text">Setup guide</p>
          <p className="text-xs text-subtle">About 5 minutes</p>
        </div>
      </div>
      <ol className="mt-5 space-y-3">
        {["Download the official app", "Sign in with your account", "Start browsing"].map((s, i) => (
          <li key={s} className="flex items-center gap-3 text-sm">
            <span className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-semibold ${i < 2 ? "bg-primary text-on-primary" : "border border-border-strong text-muted"}`}>
              {i + 1}
            </span>
            <span className={i < 2 ? "text-text" : "text-muted"}>{s}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default async function AppPage() {
  const [settings, faqs] = await Promise.all([getSettings(), getPublishedFaqs()]);
  const platforms = settings.apps.platforms.filter((p) => p.verified);
  const compatFaqs = faqs.filter((f) => /app|device|install|compat/i.test(`${f.category} ${f.question}`)).slice(0, 6);

  return (
    <>
      <PageHero
        eyebrow="App"
        title="The Apollo Group TV app"
        description="The Apollo TV app is how you watch on your TV, streaming device or phone. Here's where it runs, where to download it safely, and how to fix the most common problems."
        crumbs={[{ href: "/app", label: "App" }]}
        aside={<GuidePreview />}
      >
        <p className="inline-flex items-center gap-2 text-sm text-subtle">
          <ShieldCheck className="h-4 w-4 text-accent" aria-hidden /> Only verified devices are listed.
        </p>
      </PageHero>

      <section className="py-16 sm:py-20" aria-labelledby="devices-heading">
        <Container>
          <h2 id="devices-heading" className="mb-8 font-display text-2xl font-semibold text-text">Verified devices</h2>
          {platforms.length === 0 ? (
            <EmptyState
              icon={MonitorSmartphone}
              title="Supported devices will be listed soon"
              description="We list a device only after its compatibility has been verified. Contact support if you have questions about a specific device."
              action={<ButtonLink href="/client-portal" variant="secondary">Ask support</ButtonLink>}
            />
          ) : (
            <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
              <nav aria-label="Platforms" className="lg:sticky lg:top-24 lg:self-start">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-subtle">Platforms</p>
                <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0">
                  {platforms.map((p) => (
                    <li key={p.name} className="shrink-0">
                      <a href={`#${slugify(p.name)}`} className="block rounded-lg border border-border px-3 py-2 text-sm text-muted hover:border-accent/40 hover:text-text lg:border-transparent">
                        {p.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="space-y-6">
                {platforms.map((p) => (
                  <article key={p.name} id={slugify(p.name)} className="rounded-lg border border-border bg-card p-6 shadow-card sm:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h2 className="font-display text-xl font-semibold text-text">{p.name}</h2>
                      <span className="flex items-center gap-3">
                        <Badge tone="success" dot>Verified</Badge>
                        <Link href={`/guides/${slugify(p.name)}`} className="text-sm font-medium text-accent hover:text-light-blue">
                          Full guide →
                        </Link>
                      </span>
                    </div>
                    {p.instructions && (
                      <ol className="mt-6 space-y-4">
                        {p.instructions
                          .split("\n")
                          .filter(Boolean)
                          .map((step, i) => (
                            <li key={i} className="flex gap-4 text-sm leading-relaxed text-muted">
                              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-primary/40 bg-primary/10 text-xs font-semibold text-light-blue">
                                {i + 1}
                              </span>
                              <span className="pt-1">{step}</span>
                            </li>
                          ))}
                      </ol>
                    )}
                    <div className="mt-8 border-t border-border pt-6">
                      {p.downloadUrl ? (
                        <a href={p.downloadUrl} rel="noopener noreferrer" target="_blank" className={buttonClasses({})}>
                          <Download className="h-4 w-4" aria-hidden /> Download for {p.name}
                        </a>
                      ) : (
                        <p className="text-sm text-subtle">The official download link has not been published yet.</p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>

      <section id="troubleshooting" className="scroll-mt-20 border-y border-border bg-bg-secondary/50 py-20">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <SectionHeading align="left" eyebrow="Troubleshooting" title="Something not working?" description="Try these fixes first. Most issues are solved in a minute." />
            <div className="mt-8 rounded-lg border border-warning/30 bg-warning/5 p-5 text-sm">
              <p className="font-semibold text-warning">Only use official downloads</p>
              <p className="mt-1 text-muted">Install the app only from links on this page or official app stores. We never ask for your password by email or chat.</p>
            </div>
          </div>
          <ol className="space-y-3">
            {troubleshooting.map((t, i) => (
              <li key={t.t}>
                <details className="group rounded-lg border border-border bg-card shadow-card open:border-border-strong">
                  <summary className="flex cursor-pointer list-none items-center gap-4 p-5 [&::-webkit-details-marker]:hidden">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-inset text-xs font-semibold text-muted group-open:bg-primary group-open:text-on-primary">
                      {i + 1}
                    </span>
                    <span className="flex-1 font-medium text-text">{t.t}</span>
                    <ChevronDown className="h-4 w-4 text-subtle transition-transform group-open:rotate-180" aria-hidden />
                  </summary>
                  <p className="px-5 pb-5 pl-16 text-sm leading-relaxed text-muted">{t.b}</p>
                </details>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-20">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Compatibility" title="Compatibility FAQ" />
          <div className="mt-10">
            {compatFaqs.length > 0 ? (
              <FaqAccordion items={compatFaqs} />
            ) : (
              <RelatedLinks links={[{ href: "/faq", label: "Browse all FAQs", description: "Find answers about devices and setup." }]} />
            )}
          </div>
        </Container>
      </section>

      <section className="pb-4">
        <Container>
          <h2 className="mb-6 font-display text-xl font-semibold text-text">Related help</h2>
          <RelatedLinks
            links={[
              { href: "/guides", label: "All setup guides", description: "Device guides plus account and troubleshooting help." },
              { href: "/guides/troubleshooting", label: "Troubleshooting checklist", description: "Sign-in and playback fixes, step by step." },
              { href: "/product", label: "What the service includes", description: "Catalog, dashboard and support." },
            ]}
          />
        </Container>
      </section>
      <CtaBand title="Need a plan first?" description="Pick a plan, then come back here to set up your devices." />
    </>
  );
}
