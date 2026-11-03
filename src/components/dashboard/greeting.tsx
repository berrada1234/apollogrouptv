"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** "Good morning/afternoon/evening" in the visitor's own time zone (the server can't know it). */
export function Greeting({ firstName }: { firstName: string }) {
  const hour = useSyncExternalStore(noop, () => new Date().getHours(), () => -1);
  const part = hour < 0 ? "Welcome back" : hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return (
    <>
      {part}, {firstName}!
    </>
  );
}
