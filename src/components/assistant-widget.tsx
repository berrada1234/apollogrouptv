"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { X } from "lucide-react";

const loadPanel = () => import("@/components/assistant-panel");
// The panel (messages, Markdown rendering, streaming) isn't needed until the chat is opened, so it's a separate chunk.
const AssistantPanel = dynamic(loadPanel, { ssr: false });

/**
 * 24/7 chat assistant launcher. Only this button ships with the page; the panel loads on first open.
 */
export function AssistantWidget({ whatsapp }: { whatsapp: string }) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const prefetch = useCallback(() => void loadPanel(), []);
  const close = useCallback(() => {
    setOpen(false);
    launcherRef.current?.focus();
  }, []);

  return (
    <>
      {/* Launcher: the prism inside a slowly turning spectrum ring. */}
      <button
        ref={launcherRef}
        type="button"
        onClick={() => {
          setLoaded(true);
          setOpen((o) => !o);
        }}
        // Start fetching the panel as soon as the visitor shows intent, so it's ready by the click.
        onPointerEnter={prefetch}
        onFocus={prefetch}
        aria-expanded={open}
        aria-controls="assistant-panel"
        aria-label={open ? "Close the assistant" : "Ask Apollo a question"}
        className="group fixed bottom-5 right-5 z-50 rounded-full p-[2px] shadow-[0_14px_40px_-10px_rgb(70_224_255/0.7)] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        <span className="assistant-ring absolute inset-0 rounded-full" aria-hidden />
        <span className="relative grid h-14 w-14 place-items-center rounded-full bg-[#070b1f]">
          {open ? (
            <X className="h-6 w-6 text-text" aria-hidden />
          ) : (
            <Image src="/brand/apollo-mark.png" alt="Apollo Group TV logo" width={30} height={30} className="transition-transform duration-300 group-hover:scale-110" />
          )}
        </span>
        {!open && (
          <span className="absolute right-0.5 top-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#070b1f] bg-emerald-400" aria-hidden />
        )}
      </button>

      {loaded && <AssistantPanel open={open} onClose={close} whatsapp={whatsapp} />}
    </>
  );
}
