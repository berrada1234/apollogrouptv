"use client";

import { useRef } from "react";
import Link from "next/link";
import { PlayCircle, X } from "lucide-react";

// Narrated walkthroughs offered on the payment method cards. Cash App and Venmo are Bitcoin methods: the card opens
// a Bitcoin payment window, and the video shows clicking that card, buying Bitcoin in the app and sending it to the
// address in the window. Made in the apollo-video Remotion project.
type MethodVideo = { src: string; poster: string; title: string; subtitle: string; button: string; guide?: { href: string; label: string } };

const VIDEOS = {
  cashApp: {
    src: "/videos/apollo-cash-app-bitcoin.mp4",
    poster: "/videos/apollo-cash-app-bitcoin-poster.webp",
    title: "How to pay with Cash App",
    subtitle: "Buy Bitcoin in Cash App and send the exact amount to the wallet address in your payment window.",
    button: "Video: how to pay with Cash App",
    guide: { href: "/payment-guides/cash-app", label: "Open the step-by-step guide with pictures" },
  },
  venmo: {
    src: "/videos/apollo-venmo-bitcoin.mp4",
    poster: "/videos/apollo-venmo-bitcoin-poster.webp",
    title: "How to pay with Venmo",
    subtitle: "Buy Bitcoin in Venmo and transfer the exact amount to the wallet address in your payment window.",
    button: "Video: how to pay with Venmo",
    guide: { href: "/payment-guides/venmo", label: "Open the step-by-step guide" },
  },
  shakepay: {
    src: "/videos/apollo-shakepay-bitcoin.mp4",
    poster: "/videos/apollo-shakepay-bitcoin-poster.webp",
    title: "How to pay with Shakepay",
    subtitle: "Add Canadian dollars by Interac, buy Bitcoin in Shakepay and send the exact amount to the wallet address in your payment window.",
    button: "Video: how to pay with Shakepay",
    guide: { href: "/payment-guides/shakepay", label: "Open the step-by-step guide with pictures" },
  },
  moonpay: {
    src: "/videos/apollo-moonpay-bitcoin.mp4",
    poster: "/videos/apollo-moonpay-bitcoin-poster.webp",
    title: "How to pay with MoonPay",
    subtitle: "Buy Bitcoin with a card, Apple Pay or Google Pay and have MoonPay send it straight to the wallet address in your payment window.",
    button: "Video: how to pay with MoonPay",
    guide: { href: "/payment-guides/moonpay", label: "Open the step-by-step guide with pictures" },
  },
} satisfies Record<string, MethodVideo>;

/** The video for a payment method card, or null. */
export const videoFor = (m: { kind: string; name: string }): MethodVideo | null => {
  if (/cash\s*app/i.test(m.name)) return VIDEOS.cashApp;
  if (/venmo/i.test(m.name)) return VIDEOS.venmo;
  if (/shakepay/i.test(m.name)) return VIDEOS.shakepay;
  if (/moonpay/i.test(m.name)) return VIDEOS.moonpay;
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
