"use client";

import { useEffect } from "react";

/**
 * One delegated listener that feeds the pointer position to whichever .card-glow element is hovered.
 * Reads and writes happen once per animation frame, so moving the mouse never forces extra layouts.
 */
export function CardGlowTracker() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let last: PointerEvent | null = null;
    let frame = 0;
    const update = () => {
      frame = 0;
      const e = last;
      const card = (e?.target as Element | null)?.closest?.<HTMLElement>(".card-glow");
      if (!e || !card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    const onMove = (e: PointerEvent) => {
      last = e;
      if (!frame) frame = requestAnimationFrame(update);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);
  return null;
}
