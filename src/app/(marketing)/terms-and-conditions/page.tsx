import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { termsAndConditions as doc } from "@/content/legal";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: { absolute: doc.metaTitle },
    description: doc.description,
    alternates: { canonical: `/${doc.slug}` },
    openGraph: { title: doc.metaTitle, description: doc.description, url: `/${doc.slug}` },
    // Draft policies are not indexed until the owner approves them in admin settings.
    robots: settings.legal.approved ? undefined : { index: false, follow: true },
  };
}

export default async function Page() {
  const settings = await getSettings();
  return (
    <LegalPage doc={doc} settings={settings}>
    </LegalPage>
  );
}
