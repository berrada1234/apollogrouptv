"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUp, Download, Headset, ReceiptText, RotateCcw, Tv, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = [
  { icon: Tv, text: "Will it work on my Fire TV?" },
  { icon: ReceiptText, text: "How much does a pack cost?" },
  { icon: Download, text: "How do I install the app?" },
  { icon: RotateCcw, text: "What's the refund policy?" },
];

/** The site's prism mark on a dark disc: the assistant's face in the header and beside every reply. */
function Avatar({ size = 32, live = false }: { size?: number; live?: boolean }) {
  return (
    <span className="relative inline-grid shrink-0 place-items-center rounded-full border border-primary/30 bg-[#070b1f]" style={{ width: size, height: size }}>
      <Image src="/brand/apollo-mark.png" alt="" width={Math.round(size * 0.62)} height={Math.round(size * 0.62)} loading="eager" aria-hidden />
      {live && (
        <span className="absolute -bottom-0.5 -right-0.5 grid h-3 w-3 place-items-center rounded-full bg-[#070b1f]" aria-hidden>
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgb(52_211_153/0.9)]" />
        </span>
      )}
    </span>
  );
}

/** Renders the assistant's small Markdown subset: internal [links](/path), **bold**, line breaks and "- " / "1." lists. */
function Rich({ text }: { text: string }) {
  const inline = (line: string, key: string) =>
    line.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g).map((part, i) => {
      const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
      // Only links into this site are rendered as links; anything else stays plain text.
      if (link && link[2].startsWith("/") && !link[2].startsWith("//"))
        return (
          <Link key={`${key}-${i}`} href={link[2]} className="font-medium text-primary underline decoration-primary/40 underline-offset-[3px] hover:decoration-primary">
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
        const ordered = lines.length > 0 && lines.every((l) => /^\s*\d+\.\s/.test(l));
        const bullets = lines.length > 0 && lines.every((l) => /^\s*[-•]\s/.test(l));
        if (ordered || bullets) {
          const List = ordered ? "ol" : "ul";
          return (
            <List key={b} className={cn("my-2 space-y-1.5 pl-5", ordered ? "list-decimal marker:text-primary" : "list-disc marker:text-primary/70")}>
              {lines.map((l, i) => (
                <li key={i} className="pl-1">
                  {inline(l.replace(/^\s*([-•]|\d+\.)\s/, ""), `${b}-${i}`)}
                </li>
              ))}
            </List>
          );
        }
        return (
          <p key={b} className="my-2 first:mt-0 last:mb-0">
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

/** One reply from the assistant: avatar, then open text set against a thin cyan rule. */
function Reply({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <Avatar size={28} />
      <div className="min-w-0 flex-1 border-l border-primary/30 pl-3 text-[0.9375rem] leading-[1.6] text-text/90">{children}</div>
    </div>
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
  const launcherRef = useRef<HTMLButtonElement>(null);
  const humanHref = whatsapp ? `https://wa.me/${whatsapp}` : "/contact";

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      launcherRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Grow the input with its text, up to about four lines.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 112)}px`;
  }, [draft]);

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
        throw new Error(err?.error ?? "The assistant didn't respond. Try again in a moment, or [contact our team](/contact).");
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
      {/* Launcher: the prism inside a slowly turning spectrum ring. */}
      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="assistant-panel"
        aria-label={open ? "Close the assistant" : "Ask Apollo a question"}
        className="group fixed bottom-5 right-5 z-50 rounded-full p-[2px] shadow-[0_14px_40px_-10px_rgb(70_224_255/0.7)] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        <span className="assistant-ring absolute inset-0 rounded-full" aria-hidden />
        <span className="relative grid h-14 w-14 place-items-center rounded-full bg-[#070b1f]">
          {open ? (
            <X className="h-6 w-6 text-text" aria-hidden />
          ) : (
            <Image src="/brand/apollo-mark.png" alt="" width={30} height={30} aria-hidden className="transition-transform duration-300 group-hover:scale-110" />
          )}
        </span>
        {!open && (
          <span className="absolute right-0.5 top-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#070b1f] bg-emerald-400" aria-hidden />
        )}
      </button>

      {open && (
        <section
          id="assistant-panel"
          aria-label="Apollo Group TV assistant"
          className="assistant-panel fixed inset-x-2 bottom-[5.75rem] top-[max(4.5rem,env(safe-area-inset-top))] z-50 flex flex-col overflow-hidden rounded-[22px] border border-white/10 bg-[#0a0f26]/[0.97] shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8),0_0_0_1px_rgb(70_224_255/0.06)] backdrop-blur-xl sm:inset-x-auto sm:right-5 sm:top-auto sm:h-[min(40rem,calc(100dvh-8rem))] sm:w-[25rem]"
        >
          {/* A faint spectrum light along the top edge ties the panel to the launcher. */}
          <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[image:var(--spectrum)] opacity-70" aria-hidden />

          <header className="flex items-center gap-3 px-4 pb-3 pt-4">
            <Avatar size={40} live />
            <div className="min-w-0 flex-1">
              <p className="font-hero text-[1.0625rem] font-medium tracking-[-0.02em] text-text">Apollo Help</p>
              <p className="text-xs text-emerald-300/90">Online 24/7</p>
            </div>
            <a
              href={humanHref}
              {...(whatsapp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/10 px-3 text-xs font-medium text-muted transition-colors hover:border-primary/40 hover:text-text"
            >
              <Headset className="h-3.5 w-3.5" aria-hidden /> A person
            </a>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                launcherRef.current?.focus();
              }}
              aria-label="Close"
              className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-white/[0.06] hover:text-text"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </header>

          <div ref={listRef} className="flex-1 space-y-5 overflow-y-auto overscroll-contain border-t border-white/[0.06] px-4 py-5" aria-live="polite">
            <Reply>
              <p>Hi, I&apos;m Apollo&apos;s assistant. Ask me about packs and prices, installing the app on your device, payments or renewals.</p>
            </Reply>

            {messages.length === 0 && (
              <div className="pl-[2.375rem]">
                <p className="mb-2 text-xs text-subtle">Popular questions</p>
                <ul className="space-y-1.5">
                  {STARTERS.map(({ icon: Icon, text }) => (
                    <li key={text}>
                      <button
                        type="button"
                        onClick={() => void send(text)}
                        className="flex w-full items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-2.5 text-left text-sm text-text transition-colors hover:border-primary/40 hover:bg-primary/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                      >
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-3.5 w-3.5" aria-hidden />
                        </span>
                        {text}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <p className="max-w-[82%] whitespace-pre-wrap rounded-[18px] rounded-br-md bg-gradient-to-br from-primary/25 to-violet/20 px-3.5 py-2.5 text-[0.9375rem] leading-[1.5] text-text ring-1 ring-inset ring-white/10">
                    {m.content}
                  </p>
                </div>
              ) : (
                <Reply key={i}>
                  {m.content ? (
                    <Rich text={m.content} />
                  ) : (
                    <span className="assistant-signal inline-flex h-5 items-end gap-[3px]" role="status" aria-label="Apollo is typing">
                      <span />
                      <span />
                      <span />
                    </span>
                  )}
                </Reply>
              ),
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(draft);
            }}
            className="border-t border-white/[0.06] px-3 pb-3 pt-3"
          >
            <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-[#070b1f] p-1.5 transition-colors focus-within:border-primary/50">
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
                placeholder="Ask a question"
                className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2.5 py-2 text-[0.9375rem] text-text placeholder:text-subtle focus:outline-none"
              />
              <button
                type="submit"
                disabled={busy || !draft.trim()}
                aria-label="Send"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[image:var(--spectrum)] text-on-primary transition-opacity disabled:opacity-30"
              >
                <ArrowUp className="h-5 w-5" strokeWidth={2.5} aria-hidden />
              </button>
            </div>
            <p className="mt-2 px-1 text-[11px] leading-4 text-subtle">
              Answers come from an AI and can be wrong. Never share passwords or card details. For your account,{" "}
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
