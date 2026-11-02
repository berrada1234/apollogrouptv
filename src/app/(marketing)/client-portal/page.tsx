import type { Metadata } from "next";
import Link from "next/link";
import { Gift, LifeBuoy, MonitorSmartphone, Receipt, Settings } from "lucide-react";
import { Container } from "@/components/ui/misc";
import { ButtonLink } from "@/components/ui/button";
import { OverviewContent } from "@/components/dashboard/overview";
import { PageHero } from "@/components/marketing/sections";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Client Portal",
  robots: { index: false, follow: false },
};

const shortcuts = [
  { href: "/dashboard/subscription", icon: Receipt, label: "Subscription & billing", body: "Status, renewal dates and invoices." },
  { href: "/dashboard/support/new", icon: LifeBuoy, label: "New support request", body: "Get help from our team." },
  { href: "/dashboard/referrals", icon: Gift, label: "Referrals", body: "Your link and referral history." },
  { href: "/app", icon: MonitorSmartphone, label: "Device setup", body: "Install the app step by step." },
  { href: "/account", icon: Settings, label: "Account settings", body: "Profile, password and sessions." },
];

export default async function ClientPortalPage() {
  const user = await requireUser("/client-portal");
  return (
    <>
      <PageHero
        eyebrow="Client Portal"
        title={`Hello, ${user.name.split(" ")[0]}`}
        description="Everything about your Apollo Group TV account in one place."
        crumbs={[{ href: "/client-portal", label: "Client Portal" }]}
      >
        <ButtonLink href="/dashboard">Open dashboard</ButtonLink>
      </PageHero>
      <Container className="py-12">
        <nav aria-label="Portal shortcuts" className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {shortcuts.map((s) => (
            <Link key={s.href} href={s.href} className="rounded-card border border-border bg-card p-4 transition-colors hover:border-accent/50">
              <s.icon className="h-5 w-5 text-accent" aria-hidden />
              <p className="mt-3 text-sm font-medium text-text">{s.label}</p>
              <p className="mt-0.5 text-xs text-muted">{s.body}</p>
            </Link>
          ))}
        </nav>
        <OverviewContent user={user} />
      </Container>
    </>
  );
}
