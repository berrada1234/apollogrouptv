import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarCheck,
  CreditCard,
  FileText,
  Gift,
  KeyRound,
  LayoutGrid,
  LifeBuoy,
  Lock,
  MonitorSmartphone,
  Receipt,
  ShieldCheck,
  Tv,
  UserCog,
  UserPlus,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { CtaBand, PageHero, RelatedLinks } from "@/components/marketing/sections";
import { FaqAccordion } from "@/components/marketing/faq-list";
import { afterHeader, cardClass, IconBox, leadClass, Section, SectionHeader } from "@/components/section";
import { channelCategories } from "@/content/channels";
import { monthlyCents } from "@/lib/pricing";
import { getActivePlans } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { cn, formatMoney } from "@/lib/utils";
import { shareImage } from "@/lib/share-image";

export const dynamic = "force-dynamic";

const title = "Apollo Group TV Features: App, Account Dashboard & Support";
const description =
  "What an Apollo Group TV subscription includes: the Apollo TV app, an account dashboard for packs, payments and setup, and ticket support with a written record.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/product" },
  openGraph: { ...shareImage, title, description, url: "/product" },
};

const dashboard = [
  { icon: CalendarCheck, t: "Plans & Billing", b: "Your current pack, its start and end dates, and the packs you can add. Request a new pack or extend the one you have." },
  { icon: Receipt, t: "Transactions", b: "Every payment recorded on your account, with amount, status and reference, so you can match it to your statement." },
  { icon: MonitorSmartphone, t: "Apps & Guides", b: "Install steps for each device, plus the download links, codes and server details you'll need, ready to copy." },
  { icon: UserCog, t: "My Accounts", b: "Profile details, your player login for third-party apps, signed-in devices and email preferences." },
  { icon: Gift, t: "Referrals & Gifts", b: "Your personal referral link, the friends who joined through it, and a way to request a pack as a gift." },
  { icon: LifeBuoy, t: "Support", b: "Open tickets, follow every reply in one thread and get a notification when we answer." },
];

const security = [
  { icon: KeyRound, t: "Hashed passwords", b: "We store a salted hash, never your actual password." },
  { icon: Lock, t: "Encrypted player logins", b: "Credentials for third-party players are encrypted at rest and shown only to you." },
  { icon: ShieldCheck, t: "Session control", b: "See every signed-in device and sign out the ones you don't recognise." },
  { icon: FileText, t: "Logged staff actions", b: "When our team changes something on your account, it's recorded with who did it and when." },
];

const steps = [
  { icon: UserPlus, t: "Create an account", b: "Sign up with your email. It takes about a minute." },
  { icon: CreditCard, t: "Choose a pack", b: "Pick one to twelve months. Our team confirms payment with you in a ticket." },
  { icon: CalendarCheck, t: "Get activated", b: "Your pack goes live and its dates appear in Plans & Billing." },
  { icon: Tv, t: "Install and watch", b: "Follow the guide for your device in Apps & Guides and sign in." },
];

export default async function ProductPage() {
  const [settings, plans] = await Promise.all([getSettings(), getActivePlans()]);
  const devices = settings.apps.platforms.filter((p) => p.verified).map((p) => p.name);
  const monthlies = plans.map(monthlyCents).filter((m): m is number => m !== null);
  const from = monthlies.length ? formatMoney(Math.min(...monthlies), plans[0]?.currency ?? "USD") : null;

  const faq = [
    {
      q: "Do I need a cable box, satellite dish or antenna?",
      a: "No. Everything arrives over your internet connection to the app on your device. A stable broadband connection matters more than any extra hardware.",
    },
    {
      q: "Is the channel lineup the same on every pack?",
      a: "Yes. All packs include the same live channels, on-demand library, device allowance and support. Packs differ only in length and price.",
    },
    {
      q: "Can I manage everything myself?",
      a: "Almost. You can see your pack, payments, devices and setup details any time in your dashboard. Activating a pack and issuing player logins are done by our team, because they follow a confirmed payment.",
    },
    {
      q: "What if my device isn't supported?",
      a: "Tell us the make and model in a message before you buy. We'll tell you whether it works today, so you don't pay for something you can't use.",
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Features"
        title="Apollo Group TV Features: What You Get and How It Works"
        description="A subscription covers three things: the Apollo TV app for watching, an account dashboard for managing your pack, and a support team that answers in writing. Here is what each one does."
        crumbs={[{ href: "/product", label: "Features" }]}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/plans">Compare packs{from ? ` from ${from}/mo` : ""}</ButtonLink>
          <ButtonLink href="/app" variant="secondary">
            Supported devices
          </ButtonLink>
        </div>
      </PageHero>

      {/* Watching */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16 [&>*]:min-w-0">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="Watching"
              title="The Apollo TV App"
              description="Live channels and an on-demand library in one app, signed in with the same account you use on this website."
            />
            <p className={cn(leadClass, "mt-5")}>
              Channels are grouped into {channelCategories.length} categories, from sports and news to kids and international TV, and where licensing allows they&apos;re
              also sorted by region. Each channel shows its picture-quality label, and HD, Full HD or 4K depend on the broadcast, your device and your connection.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <Link href="/channels" className="font-medium text-accent hover:text-light-blue">
                Browse the channel categories →
              </Link>
              <Link href="/app" className="font-medium text-accent hover:text-light-blue">
                How the app works →
              </Link>
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className={cn(cardClass, "p-6")}>
              <p className="text-sm font-semibold text-text">Works on</p>
              {devices.length > 0 ? (
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {devices.map((d) => (
                    <li key={d} className="flex items-center gap-3 rounded-xl border border-border bg-inset px-4 py-3 text-sm text-text">
                      <MonitorSmartphone className="h-4 w-4 shrink-0 text-accent" aria-hidden /> {d}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted">Supported devices are listed on the App page once verified.</p>
              )}
              <p className="mt-4 text-xs leading-5 text-subtle">
                On iPhone, iPad and Apple TV you watch through the independent UHF player, signed in with the player login from your dashboard.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Managing */}
      <section className="section-y border-y border-border bg-bg-secondary" aria-labelledby="dash-heading">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div id="dash-heading">
            <SectionHeader
              eyebrow="Managing"
              title="Your Account Dashboard"
              description="Six sections cover everything after you sign up. You can check where your account stands without writing to anyone."
            />
          </div>
          <ul className={cn(afterHeader, "grid gap-4 sm:grid-cols-2 lg:grid-cols-3")}>
            {dashboard.map((d) => (
              <li key={d.t} className={cn(cardClass, "p-6")}>
                <IconBox icon={d.icon} />
                <h3 className="mt-5 font-display text-base font-bold text-text">{d.t}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{d.b}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Support + paying */}
      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className={cn(cardClass, "p-6 sm:p-8")}>
            <IconBox icon={LifeBuoy} />
            <h2 className="mt-5 font-display text-xl font-bold text-text">Support That Keeps a Record</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Each question becomes a ticket with its own thread. You and our team see the whole history, so a setup problem that takes three replies never means
              explaining it three times. You get a dashboard notification whenever we answer, and the{" "}
              <Link href="/guides" className="text-accent hover:text-light-blue">
                setup guides
              </Link>{" "}
              and{" "}
              <Link href="/faq" className="text-accent hover:text-light-blue">
                FAQ
              </Link>{" "}
              cover the questions that come up most.
            </p>
          </div>
          <div className={cn(cardClass, "p-6 sm:p-8")}>
            <IconBox icon={LayoutGrid} />
            <h2 className="mt-5 font-display text-xl font-bold text-text">Packs You Pay for Once</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              You choose how long you want access, from one month to a year, and pay a single amount. Nothing renews automatically; when the pack ends, access stops.
              Longer packs cost less per month, and every pack includes the same service. Compare them on the{" "}
              <Link href="/plans" className="text-accent hover:text-light-blue">
                Plans page
              </Link>{" "}
              and read the{" "}
              <Link href="/refund-policy" className="text-accent hover:text-light-blue">
                Refund Policy
              </Link>{" "}
              before you buy.
            </p>
          </div>
        </div>
      </Section>

      {/* Security */}
      <section className="section-y border-y border-border bg-bg-secondary" aria-labelledby="security-heading">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div id="security-heading">
            <SectionHeader eyebrow="Security" title="How Your Account Is Protected" />
          </div>
          <ul className={cn(afterHeader, "grid gap-4 sm:grid-cols-2 lg:grid-cols-4")}>
            {security.map((s) => (
              <li key={s.t} className={cn(cardClass, "p-6")}>
                <IconBox icon={s.icon} size="sm" />
                <h3 className="mt-4 font-semibold text-text">{s.t}</h3>
                <p className="mt-1.5 text-sm leading-6 text-muted">{s.b}</p>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-muted">
            Details are in our{" "}
            <Link href="/privacy-policy" className="text-accent hover:text-light-blue">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Steps */}
      <Section>
        <SectionHeader align="center" eyebrow="Getting started" title="From Sign-Up to Your First Channel" />
        <ol className={cn(afterHeader, "grid gap-4 sm:grid-cols-2 lg:grid-cols-4")}>
          {steps.map((s, i) => (
            <li key={s.t} className={cn(cardClass, "p-6")}>
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-primary/40 font-display text-sm font-bold text-accent">{i + 1}</span>
                <s.icon className="h-5 w-5 text-subtle" aria-hidden />
              </div>
              <h3 className="mt-5 font-display text-base font-bold text-text">{s.t}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{s.b}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* FAQ */}
      <section className="section-y border-t border-border bg-bg-secondary">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8 [&>*]:min-w-0">
          <div className="lg:col-span-5">
            <SectionHeader eyebrow="Questions" title="Questions About the Service" />
          </div>
          <div className="lg:col-span-7">
            <FaqAccordion items={faq.map((f, i) => ({ id: `product-${i}`, category: "Product", question: f.q, answer: f.a }))} />
          </div>
        </div>
      </section>

      <Section>
        <h2 className="mb-6 font-display text-xl font-bold text-text">Keep exploring</h2>
        <RelatedLinks
          links={[
            { href: "/app", label: "The Apollo TV app", description: "Supported devices, install methods and requirements." },
            { href: "/plans", label: "Plans and pricing", description: "Every pack compared by total and monthly cost." },
            { href: "/channels", label: "Channel categories", description: "What each category covers, by genre and region." },
            { href: "/is-apollo-group-tv-legal", label: "Is it legal?", description: "How IPTV technology and content rights relate." },
          ]}
        />
      </Section>

      <CtaBand title="See it for yourself" description="Compare the packs, then create an account. The dashboard, guides and support are ready from day one." />
    </>
  );
}
