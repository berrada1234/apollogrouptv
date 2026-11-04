import type { Metadata } from "next";
import { GuideArticle } from "@/components/compare/guide-article";
import { choosingIptv as page } from "@/content/compare-guides";

export const metadata: Metadata = {
  title: { absolute: page.seoTitle },
  description: page.description,
  alternates: { canonical: page.path },
  openGraph: { title: page.seoTitle, description: page.description, url: page.path, type: "article" },
};

export default function Page() {
  return <GuideArticle page={page} crumbs={[{ href: "/compare", label: "Compare" }, { href: page.path, label: "Choosing an IPTV service" }]} />;
}
