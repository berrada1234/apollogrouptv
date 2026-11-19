import type { Metadata, Viewport } from "next";
import { NotFoundBody } from "@/components/not-found-body";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { fontVariables } from "@/lib/fonts";
import { siteConfig } from "@/lib/site";
import "./globals.css";

/*
 * 404 page for URLs that match no route. It renders without the root layout, so it brings its own <html>, fonts
 * and styles. A root app/not-found.tsx would be sent inside every page's RSC payload (a full second header and
 * footer on every page); the route-level not-found files stay small because their layouts already draw the chrome.
 */
export const metadata: Metadata = {
  title: `Page not found | ${siteConfig.name}`,
  robots: { index: false },
};

export const viewport: Viewport = {
  themeColor: "#05060f",
  colorScheme: "dark",
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${fontVariables} h-full`}>
      <body className="flex min-h-full flex-col bg-bg text-text antialiased">
        <SiteHeader />
        <main id="main" className="flex flex-1 flex-col">
          <NotFoundBody />
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
