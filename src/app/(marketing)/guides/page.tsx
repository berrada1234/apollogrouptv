import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MonitorSmartphone, UserPlus, Wrench } from "lucide-react";
import { Container, EmptyState, SectionHeading } from "@/components/ui/misc";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { PageHero } from "@/components/marketing/sections";
import { generalGuides } from "@/content/guides";
import { getDeviceGuides } from "@/lib/guides";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Apollo Group TV Setup Guides — Devices & Account Help" },
  description:
    "Step-by-step Apollo Group TV guides for verified devices, account setup and troubleshooting, kept in one place and updated as devices are verified.",
  alternates: { canonical: "/guides" },
  openGraph: { url: "/guides" },
};

const generalIcons: Record<string, typeof UserPlus> = { "account-setup": UserPlus, troubleshooting: Wrench };

export default async function GuidesPage() {
  const devices = await getDeviceGuides();
  return (
    <>
      <PageHero
        eyebrow="Guides"
        title="Setup guides"
        description="Clear, numbered instructions for getting started — from creating your account to installing the app on a verified device and fixing common problems."
        crumbs={[{ href: "/guides", label: "Guides" }]}
      />

      <section className="py-16">
        <Container>
          <SectionHeading align="left" eyebrow="Devices" title="Device guides" description="A device gets a guide only after we've verified it and have an official download source." />
          {devices.length > 0 ? (
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {devices.map((d) => (
                <li key={d.slug}>
                  <Link href={`/guides/${d.slug}`} className="group flex h-full flex-col rounded-lg border border-border bg-card p-6 shadow-card transition-colors hover:border-accent/40">
                    <div className="flex items-center justify-between">
                      <MonitorSmartphone className="h-6 w-6 text-accent" aria-hidden />
                      <Badge tone="success" dot>Verified</Badge>
                    </div>
                    <h3 className="mt-4 font-display text-lg font-semibold text-text group-hover:text-light-blue">{d.name}</h3>
                    <p className="mt-1 flex-1 text-sm text-muted">Official download link and step-by-step setup.</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
                      Open guide <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={MonitorSmartphone}
              title="Device guides are on the way"
              description="We publish a device guide as soon as the device is verified. In the meantime, ask us about your device and we'll help directly."
              action={<ButtonLink href="/contact" variant="secondary">Ask about my device</ButtonLink>}
              className="mt-10"
            />
          )}
        </Container>
      </section>

      <section className="border-t border-border bg-bg-secondary/50 py-16">
        <Container>
          <SectionHeading align="left" eyebrow="Account & help" title="General guides" />
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {generalGuides.map((g) => {
              const Icon = generalIcons[g.slug] ?? Wrench;
              return (
                <li key={g.slug}>
                  <Link href={`/guides/${g.slug}`} className="group flex h-full gap-4 rounded-lg border border-border bg-card p-6 shadow-card transition-colors hover:border-accent/40">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-accent">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span>
                      <span className="block font-display text-lg font-semibold text-text group-hover:text-light-blue">{g.title}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-muted">{g.description}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="mt-10 text-sm text-muted">
            Looking for something else? Browse the <Link href="/faq" className="text-accent hover:text-light-blue">FAQ</Link> or{" "}
            <Link href="/contact" className="text-accent hover:text-light-blue">contact our team</Link>.
          </p>
        </Container>
      </section>
    </>
  );
}
