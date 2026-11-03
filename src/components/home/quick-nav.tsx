"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Sticky in-page navigation for the homepage; highlights the section currently in view. */
export function HomeQuickNav({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const targets = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => el !== null);
    // A section counts as active once its top passes the band just below the sticky bars.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-130px 0px -55% 0px" },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [items]);

  // Keep the active chip visible on narrow screens.
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    const list = listRef.current;
    if (el && list) list.scrollTo({ left: el.offsetLeft - list.clientWidth / 2 + el.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  return (
    <nav aria-label="On this page" className="sticky top-[4.75rem] z-40 px-3 py-2 sm:px-4">
      <ul ref={listRef} className="glass-blur no-scrollbar mx-auto flex w-fit max-w-full gap-1 overflow-x-auto rounded-full p-1.5">
        {items.map((i) => (
          <li key={i.id} data-id={i.id} className="shrink-0">
            <a
              href={`#${i.id}`}
              aria-current={active === i.id ? "true" : undefined}
              className={cn(
                "block rounded-full px-3.5 py-1.5 text-sm font-medium transition-[background-color,color] duration-300",
                active === i.id ? "bg-[image:var(--spectrum)] text-on-primary shadow-[0_6px_18px_-8px_rgb(122_162_255/0.9)]" : "text-muted hover:bg-white/[0.06] hover:text-text",
              )}
            >
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
