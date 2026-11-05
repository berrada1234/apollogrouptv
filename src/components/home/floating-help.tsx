"use client";

import { useScrolledPast } from "@/lib/use-scrolled-past";
import { LifeBuoy, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/** Help button that appears after the visitor scrolls past the hero, so it never covers the first screen. */
export function FloatingHelp({ whatsapp }: { whatsapp: string }) {
  const visible = useScrolledPast("80vh");

  const href = whatsapp ? `https://wa.me/${whatsapp}` : "/dashboard/support/new";
  return (
    <a
      href={href}
      {...(whatsapp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label={whatsapp ? "Chat with us on WhatsApp" : "Contact support"}
      tabIndex={visible ? undefined : -1}
      aria-hidden={visible ? undefined : true}
      className={cn(
        "fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-primary text-on-primary shadow-[0_12px_30px_-8px_rgb(70_224_255/0.8)] transition-all duration-200 hover:-translate-y-0.5",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      {whatsapp ? <MessageCircle className="h-6 w-6" aria-hidden /> : <LifeBuoy className="h-6 w-6" aria-hidden />}
    </a>
  );
}
