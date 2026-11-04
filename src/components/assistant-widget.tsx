"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUp, MessageCircle, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = ["Will it work on my Fire TV?", "How much does a pack cost?", "How do I install the app?", "What's the refund policy?"];

/** Renders the assistant's small Markdown subset: internal [links](/path), **bold**, line breaks and "- " / "1." lists. */
function Rich({ text }: { text: string }) {
  const inline = (line: string, key: string) =>
    line.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g).map((part, i) => {
      const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
      // Only links into this site are rendered as links; anything else stays plain text.
      if (link && link[2].startsWith("/") && !link[2].startsWith("//"))
        return (
          <Link key={`${key}-${i}`} href={link[2]} className="font-medium text-accent underline-offset-2 hover:underline">
            {link[1]}
          </Link>
        );
      if (link) return <Fragment key={`${key}-${i}`}>{link[1]}</Fragment>;
      const bold = /^\*\*([^*]+)\*\*$/.exec(part);
      if (bold) return <strong key={`${key}-${i}`} className="font-semibold text-text">{bold[1]}</strong>;
      return <Fragment key={`${key}-${i}`}>{part}</Fragment>;
    });
  return (
    <>
      {text.split(/\n{2,}/).map((block, b) => {
        const lines = block.split("\n").filter(Boolean);
        const list = lines.length > 0 && lines.every((l) => /^(\s*[-•]|\s*\d+\.)\s/.test(l));
        if (list)
          return (
            <ul key={b} className="my-1.5 space-y-1 pl-4">
              {lines.map((l, i) => (
                <li key={i} className="list-disc">
                  {inline(l.replace(/^\s*([-•]|\d+\.)\s/, ""), `${b}-${i}`)}
                </li>
              ))}
            </ul>
          );
        return (
          <p key={b} className="my-1.5 first:mt-0 last:mb-0">
            {lines.map((l, i) => (
              <Fragment key={i}>
                {i > 0 && <br />}
                {inline(l, `${b}-${i}`)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}

/**
 * 24/7 chat assistant for visitors. Answers come from /api/assistant (site content + live prices).
 * The conversation lives only in this tab; nothing is stored on our side.
 */
export function AssistantWidget({ whatsapp }: { whatsapp: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const humanHref = whatsapp ? `https://wa.me/${whatsapp}` : "/contact";

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text: string) {
    const question = text.trim().slice(0, 1500);
    if (!question || busy) return;
    const history: Msg[] = [...messages, { role: "user" as const, content: question }].slice(-15);
    setMessages([...history, { role: "assistant", content: "" }]);
    setDraft("");
    setBusy(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history[0].role === "user" ? history : history.slice(1) }),
      });
      if (!res.ok || !res.body) {
        const err = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(err?.error ?? "I'm having trouble answering right now. Please try again in a moment.");
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: answer }]);
      }
    } catch (e) {
      setMessages([...history, { role: "assistant", content: e instanceof Error ? e.message : "Something went wrong." }]);
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="assistant-panel"
        aria-label={open ? "Close the assistant" : "Ask a question"}
        className="fixed bottom-5 right-5 z-50 inline-flex h-14 items-center gap-2 rounded-full bg-[image:var(--spectrum)] px-5 font-semibold text-on-primary shadow-[0_12px_30px_-8px_rgb(70_224_255/0.8)] transition-transform hover:-translate-y-0.5"
      >
        {open ? <X className="h-5 w-5" aria-hidden /> : <MessageCircle className="h-5 w-5" aria-hidden />}
        <span className={cn(open && "sr-only sm:not-sr-only")}>{open ? "Close" : "Ask us"}</span>
      </button>

      {open && (
        <section
          id="assistant-panel"
          aria-label="Apollo Group TV assistant"
          className="glass-blur fixed inset-x-3 bottom-24 z-50 flex max-h-[min(36rem,calc(100dvh-8rem))] flex-col overflow-hidden rounded-[18px] border border-border-strong bg-[rgb(11_14_30/0.96)] shadow-2xl sm:inset-x-auto sm:right-5 sm:w-[24rem]"
        >
          <header className="flex items-center gap-3 border-b border-border px-4 py-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 text-accent">
              <Sparkles className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-text">Ask Apollo</p>
              <p className="text-xs text-muted">AI assistant · answers any time</p>
            </div>
            <a href={humanHref} {...(whatsapp ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="text-xs font-medium text-accent hover:text-light-blue">
              Talk to a person
            </a>
          </header>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm leading-6" aria-live="polite">
            {messages.length === 0 ? (
              <>
                <p className="text-muted">Hi! I can help with packs and prices, installing the app on your device, payments and renewals. What would you like to know?</p>
                <div className="flex flex-wrap gap-2">
                  {STARTERS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => void send(s)}
                      className="rounded-full border border-border-strong bg-white/[0.04] px-3 py-1.5 text-xs text-text hover:border-accent/50"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3.5 py-2.5",
                      m.role === "user" ? "bg-primary/20 text-text" : "border border-border bg-card text-text/90",
                    )}
                  >
                    {m.role === "assistant" && !m.content ? (
                      <span className="inline-flex gap-1" aria-label="Typing">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted" />
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted [animation-delay:150ms]" />
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted [animation-delay:300ms]" />
                      </span>
                    ) : m.role === "assistant" ? (
                      <Rich text={m.content} />
                    ) : (
                      m.content
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(draft);
            }}
            className="border-t border-border p-3"
          >
            <div className="flex items-end gap-2">
              <label htmlFor="assistant-input" className="sr-only">
                Your question
              </label>
              <textarea
                ref={inputRef}
                id="assistant-input"
                rows={1}
                maxLength={1500}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send(draft);
                  }
                }}
                placeholder="Type your question…"
                className="max-h-28 min-h-11 flex-1 resize-none rounded-xl border border-border bg-inset px-3 py-2.5 text-sm text-text placeholder:text-subtle focus:border-accent/60 focus:outline-none"
              />
              <button
                type="submit"
                disabled={busy || !draft.trim()}
                aria-label="Send"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[image:var(--spectrum)] text-on-primary disabled:opacity-40"
              >
                <ArrowUp className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <p className="mt-2 text-[11px] leading-4 text-subtle">
              AI answers can be wrong. Never share passwords or card details. For account issues,{" "}
              <Link href="/dashboard/support/new" className="underline underline-offset-2 hover:text-muted">
                open a ticket
              </Link>
              .
            </p>
          </form>
        </section>
      )}
    </>
  );
}
