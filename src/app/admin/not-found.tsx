import type { Metadata } from "next";
import { NotFoundBody } from "@/components/not-found-body";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

/** notFound() inside the admin area: the admin layout draws the navigation. */
export default function NotFound() {
  return <NotFoundBody />;
}
