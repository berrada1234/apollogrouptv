import type { Metadata } from "next";
import { CompareView } from "@/components/compare/compare-view";
import { getRival } from "@/content/compare";
import { getApolloCompareData } from "@/lib/compare-data";

export const dynamic = "force-dynamic";

const rival = getRival("philo");

export const metadata: Metadata = {
  title: { absolute: rival.seo.title },
  description: rival.seo.description,
  alternates: { canonical: rival.path },
  openGraph: { title: rival.seo.title, description: rival.seo.description, url: rival.path, type: "article" },
};

export default async function Page() {
  return <CompareView rival={rival} apollo={await getApolloCompareData()} />;
}
