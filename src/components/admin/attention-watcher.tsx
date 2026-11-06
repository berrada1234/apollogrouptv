"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, X } from "lucide-react";

const POLL_MS = 30_000;

type Signup = { id: string; name: string; email: string; phone: string | null; createdAt: string };

/** A short two-note chime made with Web Audio, so no sound file is needed. Browsers may block it until the page is clicked once. */
function chime() {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    [880, 1320].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.16;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.4);
    });
    setTimeout(() => void ctx.close(), 1200);
  } catch {
    // No audio available; the pop-up still shows.
  }
}

/**
 * Keeps admin badges current without a reload and announces new sign-ups: a pop-up with the customer's
 * details, a chime, and a desktop notification when the admin has allowed them. Work waiting on an admin
 * (payments to review, packs to activate, unseen sign-ups) also shows in the tab title, e.g. "(3) Overview".
 */
export function AttentionWatcher({ initial, latestSignupId }: { initial: string; latestSignupId: string | null }) {
  const router = useRouter();
  const lastKey = useRef(initial);
  const lastSignup = useRef(latestSignupId);
  const [toasts, setToasts] = useState<Signup[]>([]);

  useEffect(() => {
    const urgent = (key: string) => {
      const [payments = 0, activations = 0, signups = 0] = key.split(",").map(Number);
      return payments + activations + signups;
    };
    let count = urgent(initial);
    const apply = () => {
      const base = document.title.replace(/^\(\d+\)\s*/, "");
      const want = count > 0 ? `(${count}) ${base}` : base;
      if (document.title !== want) document.title = want;
    };
    apply();
    // Next.js rewrites <title> on navigation; put the count back whenever it does.
    const observer = new MutationObserver(apply);
    observer.observe(document.head, { childList: true, subtree: true, characterData: true });

    const check = async () => {
      try {
        const res = await fetch("/api/admin/attention", { cache: "no-store" });
        if (!res.ok) return;
        const c = await res.json();
        const key = [c.paymentsToReview, c.toActivate, c.newSignups, c.openTickets, c.newMessages, c.pendingReviews].join(",");
        count = urgent(key);
        apply();

        const s: Signup | null = c.latestSignup;
        if (s && lastSignup.current !== null && s.id !== lastSignup.current) {
          setToasts((t) => [s, ...t].slice(0, 3));
          chime();
          if ("Notification" in window && Notification.permission === "granted") {
            try {
              const n = new Notification("New customer registered", {
                body: `${s.name} · ${s.email}${s.phone ? ` · ${s.phone}` : ""}`,
                icon: "/icon.png",
                tag: `signup-${s.id}`,
              });
              n.onclick = () => {
                window.focus();
                router.push("/admin/leads");
              };
            } catch {
              // Some browsers only allow notifications from a service worker.
            }
          }
        }
        if (s) lastSignup.current = s.id;

        if (key !== lastKey.current) {
          lastKey.current = key;
          router.refresh();
        }
      } catch {
        // Offline for a moment; the next poll tries again.
      }
    };
    // Keeps polling in background tabs (browsers slow timers there), so a sign-up still raises a desktop alert.
    const timer = window.setInterval(check, POLL_MS);
    const onVisible = () => document.visibilityState === "visible" && void check();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(timer);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [initial, router]);

  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-20 right-4 z-[60] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-3 lg:bottom-6" role="status" aria-live="polite">
      {toasts.map((s) => (
        <div key={s.id} className="nav-alert-card rounded-2xl border border-success/40 bg-[#0d1a1a] p-4 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.9)]">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-success/15 text-success">
              <UserPlus className="h-[18px] w-[18px]" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-text">New customer registered</p>
              <p className="mt-0.5 truncate text-sm text-text">{s.name}</p>
              <p className="truncate text-xs text-muted">{s.email}</p>
              {s.phone && <p className="text-xs text-muted">{s.phone}</p>}
              <Link href="/admin/leads" className="mt-2 inline-block text-sm font-medium text-accent hover:text-light-blue" onClick={() => setToasts((t) => t.filter((x) => x.id !== s.id))}>
                Open Not purchased
              </Link>
            </div>
            <button type="button" aria-label="Dismiss" className="rounded-md p-1 text-muted hover:text-text" onClick={() => setToasts((t) => t.filter((x) => x.id !== s.id))}>
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
