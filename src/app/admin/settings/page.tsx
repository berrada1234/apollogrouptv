import type { Metadata } from "next";
import { saveSettings } from "@/actions/admin";
import { ActionForm } from "@/components/admin/action-form";
import { ButtonLink } from "@/components/ui/button";
import { AppsEditor } from "@/components/admin/apps-editor";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Checkbox, Field, Input, Textarea } from "@/components/ui/form";
import { Notice } from "@/components/ui/misc";
import { isEmailConfigured } from "@/lib/email";
import { getPaymentProvider } from "@/lib/payments";
import { requireRole } from "@/lib/session";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Settings" };

function Section({ id, title, description, children }: { id: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <Card id={id} className="scroll-mt-24">
      <CardHeader title={title} description={description} />
      <CardBody>{children}</CardBody>
    </Card>
  );
}

const socialFields = [
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/yourpage" },
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/yourname" },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@yourname" },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@yourchannel" },
  { key: "x", label: "X (Twitter)", placeholder: "https://x.com/yourname" },
  { key: "telegram", label: "Telegram", placeholder: "https://t.me/yourchannel" },
  { key: "whatsapp", label: "WhatsApp channel", placeholder: "https://whatsapp.com/channel/..." },
] as const;

export default async function SettingsPage() {
  await requireRole("ADMIN");
  const s = await getSettings();
  const integrations = [
    { name: "Database", ok: true, note: "Connected (this page loaded from it)." },
    { name: "Email (SMTP)", ok: isEmailConfigured(), note: isEmailConfigured() ? "SMTP credentials present." : "Not configured — emails are not being delivered." },
    { name: "Payment provider", ok: getPaymentProvider() !== null, note: getPaymentProvider() ? `PAYMENT_PROVIDER=${getPaymentProvider()} (adapter still required)` : "No card processor connected (optional). Bitcoin and manual methods are managed under Payment Methods." },
    { name: "Google Search Console", ok: Boolean(process.env.GOOGLE_SITE_VERIFICATION), note: process.env.GOOGLE_SITE_VERIFICATION ? "Verification meta tag is output." : "GOOGLE_SITE_VERIFICATION not set." },
    { name: "Analytics", ok: Boolean(process.env.NEXT_PUBLIC_ANALYTICS_ID), note: process.env.NEXT_PUBLIC_ANALYTICS_ID ? "Analytics ID set." : "Not configured." },
  ];

  return (
    <>
      <PageHeader title="Settings" description="Branding, contact details, policies and program configuration." />
      <div className="space-y-6">
        <Section id="integrations" title="Integrations status" description="Read from server environment variables. Secrets are never shown.">
          <ul className="divide-y divide-border">
            {integrations.map((i) => (
              <li key={i.name} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <span className="font-medium text-text">{i.name}</span>
                <span className={i.ok ? "text-success" : "text-warning"}>{i.note}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="general" title="Branding & contact">
          <ActionForm action={saveSettings} submitLabel="Save branding">
            <input type="hidden" name="settingsKey" value="general" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Brand name" htmlFor="brandName"><Input id="brandName" name="brandName" defaultValue={s.general.brandName} required /></Field>
              <Field label="Tagline" htmlFor="tagline"><Input id="tagline" name="tagline" defaultValue={s.general.tagline} /></Field>
              <Field label="Support email" htmlFor="supportEmail"><Input id="supportEmail" name="supportEmail" type="email" defaultValue={s.general.supportEmail} /></Field>
              <Field label="Support phone" htmlFor="supportPhone"><Input id="supportPhone" name="supportPhone" defaultValue={s.general.supportPhone} /></Field>
              <Field label="Support hours" htmlFor="supportHours"><Input id="supportHours" name="supportHours" defaultValue={s.general.supportHours} placeholder="e.g. Mon–Fri, 9:00–18:00 GMT" /></Field>
              <Field label="WhatsApp number" htmlFor="whatsapp" hint="Digits only with country code, e.g. 15551234567. Leave blank to hide WhatsApp buttons.">
                <Input id="whatsapp" name="whatsapp" inputMode="numeric" defaultValue={s.general.whatsapp} />
              </Field>
              <Field label="Business address" htmlFor="address"><Input id="address" name="address" defaultValue={s.general.address} /></Field>
            </div>
          </ActionForm>
        </Section>

        <Section id="social" title="Social media" description="Paste the full https:// link to each profile. Filled-in links appear as icons in the site footer; leave a field blank to hide it.">
          <ActionForm action={saveSettings} submitLabel="Save social links">
            <input type="hidden" name="settingsKey" value="social" />
            <div className="grid gap-4 sm:grid-cols-2">
              {socialFields.map(({ key, label, placeholder }) => (
                <Field key={key} label={label} htmlFor={`social-${key}`}>
                  <Input id={`social-${key}`} name={key} type="url" inputMode="url" placeholder={placeholder} defaultValue={s.social[key]} />
                </Field>
              ))}
            </div>
          </ActionForm>
        </Section>

        <Section id="seo" title="SEO settings" description="Default titles, descriptions and search-engine verification now have their own page.">
          <ButtonLink href="/admin/seo" variant="secondary">Open SEO settings</ButtonLink>
        </Section>

        <Section id="referral" title="Referral program" description="Rewards are only advertised and issued while the program is enabled.">
          <div className="mb-4">
            <Notice tone="warning" title="Get the rules approved first">Enable the program only after the reward terms are final and approved.</Notice>
          </div>
          <ActionForm action={saveSettings} submitLabel="Save referral rules">
            <input type="hidden" name="settingsKey" value="referral" />
            <Checkbox name="enabled" label="Referral program enabled" defaultChecked={s.referral.enabled} />
            <Field label="Reward description (shown publicly)" htmlFor="rewardDescription">
              <Input id="rewardDescription" name="rewardDescription" defaultValue={s.referral.rewardDescription} maxLength={240} />
            </Field>
            <Field label="Qualifying rules (shown publicly)" htmlFor="qualifyingRule">
              <Textarea id="qualifyingRule" name="qualifyingRule" defaultValue={s.referral.qualifyingRule} rows={4} maxLength={500} />
            </Field>
          </ActionForm>
        </Section>

        <Section id="apps" title="App platforms" description="Shown on the App page. Only verified platforms are visible publicly.">
          <ActionForm action={saveSettings} submitLabel="Save platforms">
            <input type="hidden" name="settingsKey" value="apps" />
            <AppsEditor initial={s.apps.platforms} details={s.apps} />
          </ActionForm>
        </Section>

        <Section
          id="legal"
          title="Legal & policies"
          description="These details fill the Privacy, Terms, Refund and DMCA pages. Blank fields show as highlighted placeholders."
        >
          <div className="mb-4">
            <Notice tone="warning" title="Have a qualified lawyer review your policies">
              Until you tick “approved”, every policy page shows a draft banner and is hidden from search engines.
            </Notice>
          </div>
          <ActionForm action={saveSettings} submitLabel="Save legal details">
            <input type="hidden" name="settingsKey" value="legal" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Legal entity name" htmlFor="entityName"><Input id="entityName" name="entityName" defaultValue={s.legal.entityName} /></Field>
              <Field label="Governing law (e.g. State of Delaware, USA)" htmlFor="governingLaw"><Input id="governingLaw" name="governingLaw" defaultValue={s.legal.governingLaw} /></Field>
              <Field label="Registered address" htmlFor="entityAddress"><Input id="entityAddress" name="entityAddress" defaultValue={s.legal.entityAddress} /></Field>
              <Field label="Official website domain" htmlFor="officialDomain" hint="e.g. apollogrouptvi.com — helps visitors spot lookalike sites.">
                <Input id="officialDomain" name="officialDomain" defaultValue={s.legal.officialDomain} />
              </Field>
              <Field label="DMCA designated agent name" htmlFor="dmcaAgentName"><Input id="dmcaAgentName" name="dmcaAgentName" defaultValue={s.legal.dmcaAgentName} /></Field>
              <Field label="DMCA agent email" htmlFor="dmcaAgentEmail"><Input id="dmcaAgentEmail" name="dmcaAgentEmail" type="email" defaultValue={s.legal.dmcaAgentEmail} /></Field>
              <Field label="DMCA agent postal address" htmlFor="dmcaAgentAddress"><Input id="dmcaAgentAddress" name="dmcaAgentAddress" defaultValue={s.legal.dmcaAgentAddress} /></Field>
              <Field label="Policies last updated" htmlFor="lastUpdated"><Input id="lastUpdated" name="lastUpdated" type="date" defaultValue={s.legal.lastUpdated} /></Field>
            </div>
            <Field label="Refund terms (shown on the Refund Policy page)" htmlFor="refundTerms" hint="State your approved refund window, eligibility and process. One paragraph per line.">
              <Textarea id="refundTerms" name="refundTerms" rows={5} defaultValue={s.legal.refundTerms} maxLength={4000} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Where your servers are located" htmlFor="hostingRegion" hint="e.g. the European Union (Lithuania). Used in the Privacy Policy.">
                <Input id="hostingRegion" name="hostingRegion" defaultValue={s.legal.hostingRegion} maxLength={160} />
              </Field>
            </div>
            <Field label="What the Apollo TV app collects (Privacy Policy)" htmlFor="appDataPractices" hint="Describe any device, playback or crash data the app sends, and to whom. Leave blank until confirmed.">
              <Textarea id="appDataPractices" name="appDataPractices" rows={3} defaultValue={s.legal.appDataPractices} maxLength={1500} />
            </Field>
            <Checkbox name="approved" label="These policies have been reviewed and approved for publication" defaultChecked={s.legal.approved} />
          </ActionForm>
        </Section>

        <Section
          id="highlights"
          title="Homepage highlights"
          description="Shown in the homepage hero. Leave a field blank to hide it."
        >
          <div className="mb-4">
            <Notice tone="warning" title="Only publish what you can back up">
              Catalog sizes must match what customers actually get, and the money-back window must match the refund terms in Legal &amp; policies.
            </Notice>
          </div>
          <ActionForm action={saveSettings} submitLabel="Save highlights">
            <input type="hidden" name="settingsKey" value="highlights" />
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Money-back window (days)" htmlFor="moneyBackDays"><Input id="moneyBackDays" name="moneyBackDays" inputMode="numeric" defaultValue={s.highlights.moneyBackDays} /></Field>
              <Field label="Live channels" htmlFor="liveChannels"><Input id="liveChannels" name="liveChannels" defaultValue={s.highlights.liveChannels} placeholder="e.g. 22,000+" /></Field>
              <Field label="Movies & shows" htmlFor="moviesShows"><Input id="moviesShows" name="moviesShows" defaultValue={s.highlights.moviesShows} placeholder="e.g. 90,000+" /></Field>
            </div>
            <p className="mt-6 text-sm text-muted">
              The bar under the hero shows billing and the money-back window from the price list and this form. It has no ratings or member counts.
            </p>
          </ActionForm>
        </Section>

        <Section id="payments" title="Payment methods" description="Shown on Plans & Billing in the customer dashboard. List only methods you actually accept.">
          <ActionForm action={saveSettings} submitLabel="Save payment methods">
            <input type="hidden" name="settingsKey" value="payments" />
            <Field label="Payment explanation" htmlFor="pay-intro" hint="Leave blank to use the default: our team confirms payment options in the activation ticket.">
              <Textarea id="pay-intro" name="intro" rows={3} defaultValue={s.payments.intro} maxLength={600} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Accepted methods (one per line)" htmlFor="pay-methods">
                <Textarea id="pay-methods" name="methods" rows={4} defaultValue={s.payments.methods} maxLength={400} placeholder="e.g. Bitcoin" />
              </Field>
              <Field label="Payment guides (“Label | https://link” per line)" htmlFor="pay-guides">
                <Textarea id="pay-guides" name="guides" rows={4} defaultValue={s.payments.guides} maxLength={1200} placeholder="e.g. Cash App | https://…" />
              </Field>
            </div>
          </ActionForm>
        </Section>

        <Section id="notifications" title="Staff notifications" description="Requires SMTP to be configured.">
          <ActionForm action={saveSettings} submitLabel="Save notification settings">
            <input type="hidden" name="settingsKey" value="notifications" />
            <Field label="Notification email" htmlFor="adminEmail"><Input id="adminEmail" name="adminEmail" type="email" defaultValue={s.notifications.adminEmail} /></Field>
            <Checkbox name="notifyOnNewTicket" label="Email me when a new support ticket is opened" defaultChecked={s.notifications.notifyOnNewTicket} />
            <Checkbox name="notifyOnNewReview" label="Email me when a review is submitted" defaultChecked={s.notifications.notifyOnNewReview} />
          </ActionForm>
        </Section>
      </div>
    </>
  );
}
