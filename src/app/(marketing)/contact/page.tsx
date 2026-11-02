import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Clock, CreditCard, HelpCircle, LifeBuoy, Mail, MessageCircle, Phone, ShieldAlert } from "lucide-react";
import { Container } from "@/components/ui/misc";
import { ButtonLink } from "@/components/ui/button";
import { PageHero } from "@/components/marketing/sections";
import { ContactForm } from "@/components/forms/contact-form";
import { getCurrentUser } from "@/lib/session";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Contact Apollo Group TV Support" },
  description:
    "Contact Apollo Group TV: send a message, open a support ticket from your account, or find setup and billing help in our guides and FAQ.",
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact" },
};

const routes = [
  { icon: LifeBuoy, t: "Already a customer?", b: "Open a ticket from your dashboard — replies stay in one thread and you're notified when we answer.", href: "/dashboard/support/new", cta: "Open a ticket" },
  { icon: BookOpen, t: "Setting up a device?", b: "Most installation questions are answered step by step in the setup guides.", href: "/guides", cta: "Setup guides" },
  { icon: CreditCard, t: "Billing or refunds?", b: "Check your payments in Billing History and read how refund requests work.", href: "/refund-policy", cta: "Refund policy" },
  { icon: HelpCircle, t: "Quick question?", b: "The FAQ covers plans, sign-in, devices, privacy and copyright.", href: "/faq", cta: "Browse the FAQ" },
];

export default async function ContactPage() {
  const [settings, user] = await Promise.all([getSettings(), getCurrentUser()]);
  const g = settings.general;
  const methods = [
    g.supportEmail && { icon: Mail, label: "Email", value: g.supportEmail, href: `mailto:${g.supportEmail}` },
    g.whatsapp && { icon: MessageCircle, label: "WhatsApp", value: `+${g.whatsapp}`, href: `https://wa.me/${g.whatsapp}` },
    g.supportPhone && { icon: Phone, label: "Phone", value: g.supportPhone, href: `tel:${g.supportPhone.replace(/[^\d+]/g, "")}` },
    g.supportHours && { icon: Clock, label: "Hours", value: g.supportHours },
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string; href?: string }[];

  return (
    <>
      <PageHero
        eyebrow="Support"
        title="Contact Apollo Group TV"
        description="Tell us what you need and we'll point you to the fastest route — a reply by email, a ticket in your dashboard, or the right guide."
        crumbs={[{ href: "/contact", label: "Contact" }]}
      />

      <section className="py-14 sm:py-16">
        <Container>
          <h2 className="sr-only">Choose the right channel</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {routes.map((r) => (
              <li key={r.t} className="flex flex-col rounded-lg border border-border bg-card p-5 shadow-card">
                <r.icon className="h-6 w-6 text-accent" aria-hidden />
                <h3 className="mt-4 font-semibold text-text">{r.t}</h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">{r.b}</p>
                <Link href={r.href} className="mt-4 text-sm font-medium text-accent hover:text-light-blue">
                  {r.cta} →
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-t border-border bg-bg-secondary/50 py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
          <div className="rounded-lg border border-border bg-card p-6 shadow-card sm:p-8">
            <h2 className="font-display text-2xl font-semibold text-text">Send us a message</h2>
            <p className="mt-2 text-sm text-muted">We reply by email. Please don&apos;t include passwords or payment card numbers.</p>
            <div className="mt-6">
              <ContactForm defaultName={user?.name} defaultEmail={user?.email} />
            </div>
          </div>
          <aside className="space-y-5">
            <div className="rounded-lg border border-border bg-card p-6 shadow-card">
              <h2 className="font-display text-lg font-semibold text-text">Other ways to reach us</h2>
              {methods.length > 0 ? (
                <dl className="mt-4 space-y-3 text-sm">
                  {methods.map((m) => (
                    <div key={m.label} className="flex items-start gap-3">
                      <m.icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                      <div>
                        <dt className="text-subtle">{m.label}</dt>
                        <dd className="text-text">
                          {m.href ? (
                            <a href={m.href} className="hover:text-light-blue" {...(m.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                              {m.value}
                            </a>
                          ) : (
                            m.value
                          )}
                        </dd>
                      </div>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="mt-3 text-sm text-muted">The contact form and support tickets are the best ways to reach us.</p>
              )}
            </div>
            <div className="rounded-lg border border-border bg-card p-6 shadow-card">
              <ShieldAlert className="h-6 w-6 text-accent" aria-hidden />
              <h2 className="mt-3 font-semibold text-text">Stay safe</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                We will never ask for your password. Messages claiming to be from Apollo Group TV
                {settings.legal.officialDomain ? ` that don't come from ${settings.legal.officialDomain}` : ""} should be treated with caution.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6 shadow-card">
              <h2 className="font-semibold text-text">Copyright notices</h2>
              <p className="mt-1.5 text-sm text-muted">Rights holders should use the dedicated notice process.</p>
              <ButtonLink href="/dmca" variant="secondary" size="sm" className="mt-4">
                Copyright and DMCA
              </ButtonLink>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
