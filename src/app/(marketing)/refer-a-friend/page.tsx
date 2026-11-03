import type { Metadata } from "next";
import { cardClass, Section, SectionHeader } from "@/components/section";
import Link from "next/link";
import { BadgeCheck, Copy, Gift, Link2, UserPlus } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/misc";
import { ButtonLink } from "@/components/ui/button";
import { CtaBand, PageHero } from "@/components/marketing/sections";
import { ReferralPanel } from "@/components/referral-panel";
import { getCurrentUser } from "@/lib/session";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Apollo Group TV Referral Program" },
  description: "How the Apollo Group TV referral program works: get a personal link, track sign-ups in your dashboard, and read the program terms.",
  alternates: { canonical: "/refer-a-friend" },
  openGraph: { title: "Apollo Group TV Referral Program", description: "How the Apollo Group TV referral program works: get a personal link, track sign-ups in your dashboard, and read the program terms.", url: "/refer-a-friend" },
};

export default async function ReferPage() {
  const [user, settings] = await Promise.all([getCurrentUser(), getSettings()]);
  const rewardsActive = settings.referral.enabled && settings.referral.rewardDescription;

  return (
    <>
      <PageHero
        eyebrow="Refer a Friend"
        title="The Apollo Group TV referral program"
        description={
          rewardsActive
            ? settings.referral.rewardDescription
            : "Share your personal link. Every sign-up through it is tracked on your account, ready for when referral rewards launch."
        }
        crumbs={[{ href: "/refer-a-friend", label: "Refer a Friend" }]}
        aside={
          <div className="relative mx-auto max-w-sm rounded-lg border border-primary/30 bg-gradient-to-br from-[#0b2a30] to-card p-6 shadow-lg" aria-hidden>
            <Gift className="h-7 w-7 text-accent" />
            <p className="mt-4 text-xs text-subtle">Your referral code</p>
            <div className="mt-1.5 flex items-center justify-between rounded-xl border border-border bg-inset px-4 py-3">
              <span className="font-mono text-lg tracking-[0.25em] text-light-blue">K7Q2M9XA</span>
              <Copy className="h-4 w-4 text-subtle" />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              {[["Referred", "3"], ["Qualified", "1"], ["Rewards", "—"]].map(([l, v]) => (
                <div key={l} className="rounded-lg border border-border bg-card px-2 py-2.5">
                  <p className="font-display text-base font-semibold text-text">{v}</p>
                  <p className="text-[10px] text-subtle">{l}</p>
                </div>
              ))}
            </div>
          </div>
        }
      />

      <section className="py-16">
        <Container>
          <SectionHeading eyebrow="How it works" title="Three simple steps" />
          <ol className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3 [counter-reset:step]">
            {[
              { icon: Link2, t: "Copy your link", b: "Find your referral code and link in your dashboard." },
              { icon: UserPlus, t: "Your friend signs up", b: "They create an account using your link." },
              { icon: BadgeCheck, t: "Track the status", b: "See each referral and its status in your referral history." },
            ].map((s) => (
              <li key={s.t} className="relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-card [counter-increment:step] before:absolute before:-right-2 before:-top-6 before:font-display before:text-8xl before:font-bold before:text-white/[0.03] before:content-[counter(step)]">
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-accent">
                  <s.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-display font-semibold text-text">{s.t}</h3>
                <p className="mt-2 text-sm text-muted">{s.b}</p>
              </li>
            ))}
          </ol>
          <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-6 shadow-card">
              <h3 className="font-semibold text-text">Who can take part</h3>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted marker:text-accent">
                <li>Anyone with a verified Apollo Group TV account gets a personal referral link.</li>
                <li>A referral is recorded when a new person creates an account through your link.</li>
                <li>You can&apos;t refer yourself or an account that already exists.</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border bg-card p-6 shadow-card">
              <h3 className="font-semibold text-text">Rewards</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {rewardsActive
                  ? "A referral qualifies once your friend has an active subscription. Rewards are reviewed and recorded on your account; the rules below apply."
                  : "Rewards aren't active yet. Your referrals are still tracked, and the reward rules will be published on this page before any reward is offered."}
              </p>
              <p className="mt-3 text-sm text-muted">
                Program use is also covered by our <Link href="/terms-and-conditions" className="text-accent hover:text-light-blue">terms</Link>.
              </p>
            </div>
          </div>
          {rewardsActive && settings.referral.qualifyingRule && (
            <div className="mx-auto mt-8 max-w-3xl rounded-card border border-border bg-card p-6 text-sm text-muted">
              <h3 className="mb-2 font-semibold text-text">Program rules</h3>
              <p className="whitespace-pre-line">{settings.referral.qualifyingRule}</p>
            </div>
          )}
        </Container>
      </section>

      <section className="border-t border-border bg-bg-secondary/60 py-16">
        <Container className="max-w-4xl">
          {user ? (
            <ReferralPanel userId={user.id} referralCode={user.referralCode} />
          ) : (
            <div className="rounded-card border border-border bg-card p-8 text-center shadow-card">
              <h2 className="font-display text-2xl font-semibold text-text">Get your referral link</h2>
              <p className="mx-auto mt-3 max-w-md text-muted">Sign in or create an account to see your personal referral code and history.</p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <ButtonLink href="/sign-in?next=/refer-a-friend">Sign in</ButtonLink>
                <ButtonLink href="/create-account" variant="secondary">
                  Create account
                </ButtonLink>
              </div>
            </div>
          )}
        </Container>
      </section>
      <Section>
        <SectionHeader eyebrow="Program questions" title="Referral Program: Common Questions" />
        <dl className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { q: "When does a friend count as my referral?", a: "As soon as they create an account through your link, they appear in your dashboard. Whether a referral qualifies for a reward depends on the program rules shown above." },
            { q: "My friend signed up without my link. Can they still add me?", a: "Yes — before they choose their first pack, they can enter your referral code under Plans & Billing in their dashboard." },
            { q: "Can I refer myself or create extra accounts?", a: "No. Self-referrals and duplicate accounts are excluded, and accounts created to game the program can lose any rewards." },
          ].map((f) => (
            <div key={f.q} className={`${cardClass} p-6`}>
              <dt className="font-semibold text-text">{f.q}</dt>
              <dd className="mt-2 text-sm leading-6 text-muted">{f.a}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {!user && <CtaBand title="Invite friends to Apollo Group TV" description="Create your account to get a personal referral link and track every friend who joins." />}
    </>
  );
}
