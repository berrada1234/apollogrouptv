import { ViewTransition } from "react";
import { CardGlowTracker } from "@/components/card-glow-tracker";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        {/* Route changes cross-fade (styles: .page-fade in globals.css). */}
        <ViewTransition default="page-fade">{children}</ViewTransition>
      </main>
      <SiteFooter />
      <CardGlowTracker />
    </>
  );
}
