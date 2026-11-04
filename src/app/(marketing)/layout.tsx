import { ViewTransition } from "react";
import { AssistantWidget } from "@/components/assistant-widget";
import { CardGlowTracker } from "@/components/card-glow-tracker";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { assistantProvider } from "@/lib/assistant-providers";
import { getSettings } from "@/lib/settings";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  // The assistant shows only once Cloudflare Workers AI (or an Anthropic key) is configured on the server.
  const assistant = assistantProvider() !== null;
  const whatsapp = assistant ? await getSettings().then((s) => s.general.whatsapp).catch(() => "") : "";
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        {/* Route changes cross-fade (styles: .page-fade in globals.css). */}
        <ViewTransition default="page-fade">{children}</ViewTransition>
      </main>
      <SiteFooter />
      <CardGlowTracker />
      {assistant && <AssistantWidget whatsapp={whatsapp} />}
    </>
  );
}
