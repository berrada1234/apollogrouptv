"use client";

import { useState } from "react";
import { Check, Copy, Mail, MessageCircle, Send, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ReferralShare({ code, link }: { code: string; link: string }) {
  const [copied, setCopied] = useState<"code" | "link" | null>(null);
  const text = `Join me on Apollo Group TV: ${link}`;

  async function copy(value: string, kind: "code" | "link") {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
    }
  }

  async function nativeShare() {
    if (navigator.share) await navigator.share({ title: "Apollo Group TV", text, url: link }).catch(() => undefined);
  }

  const shareLinks = [
    { label: "WhatsApp", icon: MessageCircle, href: `https://wa.me/?text=${encodeURIComponent(text)}` },
    { label: "Telegram", icon: Send, href: `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent("Join me on Apollo Group TV")}` },
    { label: "Email", icon: Mail, href: `mailto:?subject=${encodeURIComponent("Join me on Apollo Group TV")}&body=${encodeURIComponent(text)}` },
  ];

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-1.5 text-sm font-medium text-text">Your referral code</p>
        <div className="flex gap-2">
          <output className="flex h-11 flex-1 items-center rounded-xl border border-border bg-bg-secondary px-4 font-mono text-lg tracking-[0.2em] text-light-blue">
            {code}
          </output>
          <Button type="button" variant="secondary" onClick={() => copy(code, "code")} aria-label="Copy referral code">
            {copied === "code" ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <div>
        <p className="mb-1.5 text-sm font-medium text-text">Your referral link</p>
        <div className="flex gap-2">
          <input
            readOnly
            value={link}
            aria-label="Referral link"
            onFocus={(e) => e.currentTarget.select()}
            className="h-11 min-w-0 flex-1 rounded-xl border border-border bg-bg-secondary px-4 text-sm text-text"
          />
          <Button type="button" onClick={() => copy(link, "link")}>
            {copied === "link" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span className="hidden sm:inline">{copied === "link" ? "Copied" : "Copy"}</span>
          </Button>
        </div>
        <p className="sr-only" aria-live="polite">
          {copied ? `${copied === "code" ? "Code" : "Link"} copied to clipboard` : ""}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {shareLinks.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm text-muted transition-colors hover:border-accent/50 hover:text-text"
          >
            <s.icon className="h-4 w-4" aria-hidden /> {s.label}
          </a>
        ))}
        <button
          type="button"
          onClick={nativeShare}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm text-muted transition-colors hover:border-accent/50 hover:text-text"
        >
          <Share2 className="h-4 w-4" aria-hidden /> More
        </button>
      </div>
    </div>
  );
}
