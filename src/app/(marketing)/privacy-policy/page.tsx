import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { privacyPolicy as doc } from "@/content/legal";
import { getSettings } from "@/lib/settings";
import { shareImage } from "@/lib/share-image";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: doc.metaTitle },
  description: doc.description,
  alternates: { canonical: `/${doc.slug}` },
  openGraph: {
    ...shareImage,
    title: doc.metaTitle,
    description: doc.description,
    url: `/${doc.slug}`,
  },
};

export default async function Page() {
  const settings = await getSettings();
  return <LegalPage doc={doc} settings={settings}></LegalPage>;
}
