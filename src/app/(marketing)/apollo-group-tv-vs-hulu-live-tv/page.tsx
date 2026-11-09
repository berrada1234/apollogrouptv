import type { Metadata } from "next";
import { CompareView } from "@/components/compare/compare-view";
import { getRival } from "@/content/compare";
import { getApolloCompareData } from "@/lib/compare-data";
import { shareImage } from "@/lib/share-image";
import { coverShare } from "@/lib/covers";

export const dynamic = "force-dynamic";

const rival = getRival("hulu-live-tv");

export const metadata: Metadata = {
  title: { absolute: rival.seo.title },
  description: rival.seo.description,
  alternates: { canonical: rival.path },
  openGraph: { ...shareImage, ...coverShare(rival.path, `Apollo Group TV vs ${rival.name}`, "Comparison"), title: rival.seo.title, description: rival.seo.description, url: rival.path, type: "article" },
};

export default async function Page() {
  return <CompareView rival={rival} apollo={await getApolloCompareData()} />;
}
