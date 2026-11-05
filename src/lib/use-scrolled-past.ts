"use client";

import { useEffect, useState } from "react";

/**
 * True once the page has scrolled past `offset` (a CSS length such as "12px" or "80vh").
 * An invisible marker at that depth is watched with IntersectionObserver, so the browser reports the change
 * after its own layout instead of script reading scrollY (which can force an extra layout pass).
 */
export function useScrolledPast(offset: string) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const marker = document.createElement("div");
    marker.setAttribute("aria-hidden", "true");
    marker.style.cssText = `position:absolute;left:0;top:${offset};width:1px;height:1px;pointer-events:none;visibility:hidden`;
    document.body.appendChild(marker);
    const observer = new IntersectionObserver(([entry]) => setPast(!entry.isIntersecting && entry.boundingClientRect.top < 0));
    observer.observe(marker);
    return () => {
      observer.disconnect();
      marker.remove();
    };
  }, [offset]);
  return past;
}
