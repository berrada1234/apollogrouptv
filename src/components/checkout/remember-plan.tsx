"use client";

import { useEffect } from "react";
import { PLAN_COOKIE, PLAN_COOKIE_MAX_AGE } from "@/lib/plan-cookie";

/** Stores the chosen pack's slug in a first-party cookie; renders nothing. */
export function RememberPlan({ slug }: { slug: string }) {
  useEffect(() => {
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${PLAN_COOKIE}=${encodeURIComponent(slug)}; Path=/; Max-Age=${PLAN_COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
  }, [slug]);
  return null;
}
