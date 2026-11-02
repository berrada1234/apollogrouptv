import type { Metadata } from "next";
import { Compass } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-24">
        <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-accent">
            <Compass className="h-7 w-7" aria-hidden />
          </span>
          <p className="mt-6 font-display text-sm font-semibold text-accent">404</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-text">Page not found</h1>
          <p className="mx-auto mt-4 max-w-md text-muted">The page you’re looking for doesn’t exist or has moved.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/">Back to home</ButtonLink>
            <ButtonLink href="/faq" variant="secondary">
              Visit the FAQ
            </ButtonLink>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
