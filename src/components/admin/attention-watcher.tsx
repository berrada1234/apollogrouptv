"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const POLL_MS = 45_000;

/**
 * Keeps the admin sidebar badges current without a reload: polls the counts while the tab is visible and
 * refreshes the page data when anything changes. Purchases waiting on an admin (payments to review plus paid
 * packs to activate) also show in the browser tab title, e.g. "(2) Overview", so they're seen from other tabs.
 */
export function AttentionWatcher({ initial }: { initial: string }) {
  const router = useRouter();
  const last = useRef(initial);

  useEffect(() => {
    const urgent = (key: string) => {
      const [payments = 0, activations = 0] = key.split(",").map(Number);
      return payments + activations;
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
      if (document.visibilityState !== "visible") return;
      try {
        const res = await fetch("/api/admin/attention", { cache: "no-store" });
        if (!res.ok) return;
        const c = await res.json();
        const key = [c.paymentsToReview, c.toActivate, c.openTickets, c.newMessages, c.pendingReviews].join(",");
        count = urgent(key);
        apply();
        if (key !== last.current) {
          last.current = key;
          router.refresh();
        }
      } catch {
        // Offline for a moment; the next poll tries again.
      }
    };
    const timer = window.setInterval(check, POLL_MS);
    const onVisible = () => void check();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(timer);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [initial, router]);

  return null;
}
