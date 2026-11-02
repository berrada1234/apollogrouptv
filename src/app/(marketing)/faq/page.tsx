import type { Metadata } from "next";
import { HelpCircle, LifeBuoy } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container, EmptyState } from "@/components/ui/misc";
import { CtaBand, PageHero, RelatedLinks } from "@/components/marketing/sections";
import { FaqExplorer } from "@/components/marketing/faq-list";
import { getPublishedFaqs } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Apollo Group TV FAQ — Plans, Devices, Account & Billing" },
  description: "Answers to common Apollo Group TV questions about plans, devices, sign-in, installation, billing, refunds, privacy and copyright.",
  alternates: { canonical: "/faq" },
  openGraph: { title: "Apollo Group TV FAQ — Plans, Devices, Account & Billing", description: "Answers to common Apollo Group TV questions about plans, devices, sign-in, installation, billing, refunds, privacy and copyright.", url: "/faq" },
};

export default async function FaqPage() {
  const faqs = await getPublishedFaqs();
  const items = faqs.map(({ id, category, question, answer }) => ({ id, category, question, answer }));

  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Apollo Group TV FAQ"
        description="Search or pick a topic. Each answer links to the page with the full details — and if something's missing, our team is a message away."
        crumbs={[{ href: "/faq", label: "FAQ" }]}
      />
      <section className="py-16">
        <Container>
          {items.length > 0 ? (
            <FaqExplorer
              items={items}
              aside={
                <div className="rounded-lg border border-border bg-card p-5 shadow-card">
                  <LifeBuoy className="h-6 w-6 text-accent" aria-hidden />
                  <p className="mt-3 font-semibold text-text">Still have questions?</p>
                  <p className="mt-1 text-sm text-muted">Our team answers through support tickets.</p>
                  <ButtonLink href="/dashboard/support/new" variant="secondary" size="sm" className="mt-4 w-full">
                    Contact support
                  </ButtonLink>
                </div>
              }
            />
          ) : (
            <EmptyState icon={HelpCircle} title="No questions published yet" description="Our team is preparing answers. Please contact support in the meantime." />
          )}
          <div className="mt-20 border-t border-border pt-12">
            <h2 className="mb-5 font-display text-lg font-semibold text-text">Helpful pages</h2>
            <RelatedLinks
              links={[
                { href: "/guides", label: "Setup guides", description: "Account setup, devices and troubleshooting." },
                { href: "/contact", label: "Contact support", description: "Send a message or open a ticket." },
                { href: "/refund-policy", label: "Refund policy", description: "How refund requests work." },
              ]}
            />
          </div>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
