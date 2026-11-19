import type { Metadata } from "next";
import { NotFoundBody } from "@/components/not-found-body";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

/** notFound() inside the dashboard: the dashboard layout draws the navigation. */
export default function NotFound() {
  return <NotFoundBody />;
}
