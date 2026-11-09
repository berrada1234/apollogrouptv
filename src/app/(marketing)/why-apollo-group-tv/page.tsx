import type { Metadata } from "next";
import { GuideArticle } from "@/components/compare/guide-article";
import { YearlyCostTable } from "@/components/compare/yearly-cost-table";
import { whyApollo as page } from "@/content/compare-guides";
import { getApolloCompareData } from "@/lib/compare-data";
import { shareImage } from "@/lib/share-image";
import { coverShare } from "@/lib/covers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: page.seoTitle },
  description: page.description,
  alternates: { canonical: page.path },
  openGraph: { ...shareImage, ...coverShare(page.path, page.title, "Comparison guide"), title: page.seoTitle, description: page.description, url: page.path, type: "article" },
};

export default async function Page() {
  const apollo = await getApolloCompareData();
  return (
    <GuideArticle
      page={page}
      crumbs={[{ href: "/compare", label: "Compare" }, { href: page.path, label: "Why Apollo Group TV" }]}
      insert={<YearlyCostTable apollo={apollo} />}
      insertAfter="What a year of live TV costs"
    />
  );
}
