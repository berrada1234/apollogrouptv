import type { Metadata } from "next";
import { NotFoundBody } from "@/components/not-found-body";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

/** notFound() on a public page (unknown blog post, guide…): the marketing layout draws the header and footer. */
export default function NotFound() {
  return <NotFoundBody />;
}
