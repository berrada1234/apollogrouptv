"use client";

import { useState, useSyncExternalStore } from "react";
import { Bell, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";

type Permission = NotificationPermission | "unsupported";
const noop = () => () => {};
const read = (): Permission => ("Notification" in window ? Notification.permission : "unsupported");

/** Asks the browser for permission to show a desktop notification for each new sign-up. */
export function DesktopAlertsToggle() {
  const current = useSyncExternalStore(noop, read, () => null);
  const [chosen, setChosen] = useState<Permission | null>(null);
  const state = chosen ?? current;

  if (state === null || state === "unsupported") return null;
  if (state === "granted") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-success/40 bg-success/10 px-3 py-1.5 text-sm text-success">
        <BellRing className="h-4 w-4" aria-hidden /> Desktop alerts on
      </span>
    );
  }
  if (state === "denied") {
    return <span className="text-sm text-muted">Desktop alerts are blocked in this browser&apos;s site settings.</span>;
  }
  return (
    <Button
      type="button"
      variant="secondary"
      onClick={async () => {
        const result = await Notification.requestPermission();
        setChosen(result);
        if (result === "granted") new Notification("Desktop alerts are on", { body: "You'll see a notification here for each new customer.", icon: "/icon.png" });
      }}
    >
      <Bell className="h-4 w-4" aria-hidden /> Turn on desktop alerts
    </Button>
  );
}
