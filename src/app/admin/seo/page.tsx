import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, CircleAlert } from "lucide-react";
import { saveSettings } from "@/actions/admin";
import { ActionForm } from "@/components/admin/action-form";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/form";
import { requireRole } from "@/lib/session";
import { getSettings } from "@/lib/settings";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = { title: "SEO Settings" };

export default async function SeoSettingsPage() {
  await requireRole("ADMIN");
  const s = await getSettings();
  const indexing = process.env.ALLOW_INDEXING !== "false";
  const verification = Boolean(
    process.env.GOOGLE_SITE_VERIFICATION || s.seo.googleSiteVerification,
  );
  const isLocal = /localhost|127.0.0.1/.test(siteConfig.url);

  // Status read from server configuration — nothing secret is displayed.
  const checks = [
    {
      ok: indexing,
      label: "Search engines may index the site",
      note: indexing
        ? "robots.txt allows crawling."
        : "ALLOW_INDEXING=false — robots.txt blocks all crawlers.",
    },
    {
      ok: verification,
      label: "Google Search Console verification",
      note: verification
        ? "A verification meta tag is output."
        : "Set GOOGLE_SITE_VERIFICATION after adding the property in Search Console.",
    },
    {
      ok: !isLocal,
      label: "Canonical site URL",
      note: isLocal
        ? `NEXT_PUBLIC_SITE_URL is ${siteConfig.url} — set your real domain before launch.`
        : siteConfig.url,
    },
    {
      ok: s.legal.approved,
      label: "Legal pages approved",
      note: s.legal.approved
        ? "Policies are approved; the draft notice is hidden."
        : "Policy pages are indexed but still show a draft notice until approved in Settings → Legal & policies.",
    },
  ];

  return (
    <>
      <PageHeader
        title="SEO Settings"
        description="Default metadata and the search-engine readiness of your site."
      />
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] [&>*]:min-w-0">
        <Card>
          <CardHeader
            title="Default metadata"
            description="Used on pages that don't set their own title and description."
          />
          <CardBody>
            <ActionForm action={saveSettings} submitLabel="Save SEO settings">
              <input type="hidden" name="settingsKey" value="seo" />
              <Field
                label="Default title (max 70)"
                htmlFor="defaultTitle"
                hint="Shown in browser tabs and search results."
              >
                <Input
                  id="defaultTitle"
                  name="defaultTitle"
                  defaultValue={s.seo.defaultTitle}
                  maxLength={70}
                  required
                />
              </Field>
              <Field
                label="Default description (max 170)"
                htmlFor="defaultDescription"
                hint="One or two sentences that describe the service."
              >
                <Textarea
                  id="defaultDescription"
                  name="defaultDescription"
                  defaultValue={s.seo.defaultDescription}
                  maxLength={170}
                  rows={3}
                  required
                />
              </Field>
              <Field
                label="Google site verification token"
                htmlFor="googleSiteVerification"
                hint="Prefer the GOOGLE_SITE_VERIFICATION environment variable; this field is kept for reference."
              >
                <Input
                  id="googleSiteVerification"
                  name="googleSiteVerification"
                  defaultValue={s.seo.googleSiteVerification}
                  maxLength={120}
                />
              </Field>
            </ActionForm>
          </CardBody>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader title="Search readiness" />
            <CardBody>
              <ul className="space-y-4 text-sm">
                {checks.map((c) => (
                  <li key={c.label} className="flex gap-3">
                    {c.ok ? (
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-success"
                        aria-hidden
                      />
                    ) : (
                      <CircleAlert
                        className="mt-0.5 h-4 w-4 shrink-0 text-warning"
                        aria-hidden
                      />
                    )}
                    <span>
                      <span className="block font-medium text-text">
                        {c.label}
                      </span>
                      <span className="text-muted">{c.note}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Generated files" />
            <CardBody className="space-y-2 text-sm">
              <Link
                href="/sitemap.xml"
                target="_blank"
                className="block text-accent hover:text-light-blue"
              >
                /sitemap.xml
              </Link>
              <Link
                href="/robots.txt"
                target="_blank"
                className="block text-accent hover:text-light-blue"
              >
                /robots.txt
              </Link>
              <p className="pt-2 text-muted">
                Page-level titles, descriptions and structured data are written
                in the site content and documented in docs/seo-metadata-map.md.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
