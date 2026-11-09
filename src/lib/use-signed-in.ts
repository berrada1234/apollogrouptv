"use client";

import { useSyncExternalStore } from "react";

/**
 * Whether the visitor has a session, for the public header only.
 * A plain fetch of Better Auth's own endpoint replaces the full auth client (better-auth + nanostores),
 * which kept ~33 KB of JavaScript off every marketing page. The check waits until the browser is idle,
 * so it never competes with hydration, and runs again each time the header mounts.
 */
type State = "pending" | "in" | "out";

let state: State = "pending";
const listeners = new Set<() => void>();

function set(next: State) {
  state = next;
  listeners.forEach((l) => l());
}

function check() {
  fetch("/api/auth/get-session", { credentials: "same-origin", headers: { accept: "application/json" } })
    .then((r) => (r.ok ? r.json() : null))
    .then((data: { session?: unknown } | null) => set(data?.session ? "in" : "out"))
    .catch(() => set("out"));
}

function subscribe(listener: () => void) {
  // Check again whenever the header mounts afresh (e.g. coming back from the dashboard after signing in or out).
  const first = listeners.size === 0;
  listeners.add(listener);
  if (first) {
    if ("requestIdleCallback" in window) window.requestIdleCallback(check, { timeout: 2000 });
    else setTimeout(check, 200);
  }
  return () => listeners.delete(listener);
}

export function useSignedIn(): State {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => "pending",
  );
}
