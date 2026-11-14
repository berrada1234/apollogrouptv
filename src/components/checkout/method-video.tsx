"use client";

import { useRef } from "react";
import Link from "next/link";
import { PlayCircle, X } from "lucide-react";

// Narrated walkthroughs offered on the payment method cards. Each card gets the video for what that card really does:
// Cash App and Venmo cards send dollars to our account with the invoice memo; Bitcoin Wallet pays a Bitcoin invoice
// (the video shows buying that Bitcoin in Cash App). Made in the apollo-video Remotion project.
type MethodVideo = { src: string; poster: string; title: string; subtitle: string; button: string; guide?: { href: string; label: string } };

const VIDEOS = {
  cashappDirect: {
    src: "/videos/apollo-cash-app-direct.mp4",
    poster: "/videos/apollo-cash-app-direct-poster.webp",
    title: "How to pay with Cash App",
    subtitle: "Send the exact amount to our Cash App with your invoice number in the note, then press I Have Paid.",
    button: "Video: how to pay with Cash App",
  },
  venmoDirect: {
    src: "/videos/apollo-venmo-direct.mp4",
    poster: "/videos/apollo-venmo-direct-poster.webp",
    title: "How to pay with Venmo",
    subtitle: "Send the exact amount to our Venmo with your invoice number in the note, then press I Have Paid.",
    button: "Video: how to pay with Venmo",
  },
  bitcoinFromCashApp: {
    src: "/videos/apollo-cash-app-guide-narrated.mp4",
    poster: "/videos/apollo-cash-app-guide-narrated-poster.webp",
    title: "Pay with Bitcoin from Cash App",
    subtitle: "Buy Bitcoin in Cash App and send it to your Bitcoin Wallet invoice.",
    button: "Video: paying with Bitcoin from Cash App",
    guide: { href: "/payment-guides/cash-app", label: "Open the step-by-step guide with pictures" },
  },
} satisfies Record<string, MethodVideo>;

/** The video for a payment method card, or null. Manual Cash App/Venmo cards get the direct-pay video. */
export const videoFor = (m: { kind: string; name: string }): MethodVideo | null => {
  if (m.kind === "MANUAL" && /cash\s*app/i.test(m.name)) return VIDEOS.cashappDirect;
  if (m.kind === "MANUAL" && /venmo/i.test(m.name)) return VIDEOS.venmoDirect;
  if (m.kind === "BITCOIN" && /^bitcoin\b/i.test(m.name.trim())) return VIDEOS.bitcoinFromCashApp;
  return null;
};

export function MethodVideoButton({ video: v }: { video: MethodVideo }) {
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
        <PlayCircle className="h-4 w-4 shrink-0" aria-hidden /> {v.button}
      </button>
      <dialog
        ref={dialog}
        onClose={() => video.current?.pause()}
        onClick={(e) => e.target === e.currentTarget && close()}
        aria-label={`Video: ${v.title}`}
        className="m-auto w-[min(960px,calc(100vw-32px))] max-w-none rounded-[20px] border border-border-strong bg-card p-0 text-text shadow-card backdrop:bg-black/70"
      >
        <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3.5">
          <div className="min-w-0">
            <p className="truncate font-display text-base font-bold">{v.title}</p>
            <p className="text-xs text-muted">{v.subtitle}</p>
          </div>
          <button type="button" onClick={close} className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border text-muted hover:text-text" aria-label="Close">
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <video ref={video} controls playsInline preload="none" poster={v.poster} width={1920} height={1080} className="block h-auto w-full bg-black">
          <source src={v.src} type="video/mp4" />
        </video>
        {v.guide && (
          <p className="px-5 py-3 text-xs text-muted">
            Prefer reading?{" "}
            <Link href={v.guide.href} target="_blank" className="font-medium text-accent hover:text-light-blue">
              {v.guide.label}
            </Link>
          </p>
        )}
      </dialog>
    </>
  );
}
