"use client";

import { useRef } from "react";
import Link from "next/link";
import { PlayCircle, X } from "lucide-react";

// The narrated Cash App walkthrough, offered on the payment method cards it explains. It shows the Bitcoin route
// (buy Bitcoin in Cash App, send it to the Bitcoin Wallet invoice), so the button says so on every card.
export const CASH_APP_VIDEO = {
  src: "/videos/apollo-cash-app-guide-narrated.mp4",
  poster: "/videos/apollo-cash-app-guide-narrated-poster.webp",
  guide: "/payment-guides/cash-app",
};

/**
 * Cards that get the video: Bitcoin Wallet (the route it shows) and Cash App (where customers look for it).
 * Other Bitcoin methods (Shakepay, MoonPay) have their own steps, so they don't get it.
 */
export const hasCashAppVideo = (m: { kind: string; name: string }) => /cash\s*app/i.test(m.name) || (m.kind === "BITCOIN" && /^bitcoin\b/i.test(m.name.trim()));

export function MethodVideoButton({ label }: { label: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const close = () => {
    video.current?.pause();
    dialog.current?.close();
  };
  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/[0.07] px-3 py-2.5 text-sm font-medium text-light-blue hover:border-primary/60 hover:text-text"
      >
        <PlayCircle className="h-4 w-4" aria-hidden /> {label}
      </button>
      <dialog
        ref={dialog}
        onClose={() => video.current?.pause()}
        onClick={(e) => e.target === e.currentTarget && close()}
        aria-label="Video: pay with Bitcoin from Cash App"
        className="m-auto w-[min(960px,calc(100vw-32px))] max-w-none rounded-[20px] border border-border-strong bg-card p-0 text-text shadow-card backdrop:bg-black/70"
      >
        <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3.5">
          <div className="min-w-0">
            <p className="truncate font-display text-base font-bold">Pay with Bitcoin from Cash App</p>
            <p className="text-xs text-muted">2-minute walkthrough with voice. In the dashboard, choose Bitcoin Wallet, then pay from Cash App.</p>
          </div>
          <button type="button" onClick={close} className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border text-muted hover:text-text" aria-label="Close">
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <video ref={video} controls playsInline preload="none" poster={CASH_APP_VIDEO.poster} width={1920} height={1080} className="block h-auto w-full bg-black">
          <source src={CASH_APP_VIDEO.src} type="video/mp4" />
        </video>
        <p className="px-5 py-3 text-xs text-muted">
          Prefer reading?{" "}
          <Link href={CASH_APP_VIDEO.guide} target="_blank" className="font-medium text-accent hover:text-light-blue">
            Open the step-by-step guide with pictures
          </Link>
        </p>
      </dialog>
    </>
  );
}
