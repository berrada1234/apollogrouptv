import Link from "next/link";
import { Fragment } from "react";
import { ArrowRight, Clock, Lightbulb } from "lucide-react";
import type { Block, BlogPost } from "@/lib/blog";
import { cn, formatDate } from "@/lib/utils";

const INLINE = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|`([^`]+)`|\{\{(\w+)\}\}/g;

/** Inline Markdown: links (internal via Link, external in a new tab), bold, code and {{tokens}}. */
export function Inline({ text, tokens = {} }: { text: string; tokens?: Record<string, string> }) {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(INLINE)) {
    if (m.index! > last) out.push(text.slice(last, m.index));
    const key = m.index;
    if (m[1]) {
      const href = m[2];
      const cls = "font-medium text-accent underline-offset-2 hover:text-light-blue hover:underline";
      out.push(
        href.startsWith("/") ? (
          <Link key={key} href={href} className={cls}>
            {m[1]}
          </Link>
        ) : (
          <a key={key} href={href} className={cls} target="_blank" rel="noopener noreferrer">
            {m[1]}
          </a>
        ),
      );
    } else if (m[3]) {
      out.push(
        <strong key={key} className="font-semibold text-text">
          <Inline text={m[3]} tokens={tokens} />
        </strong>,
      );
    } else if (m[4]) {
      out.push(
        <code key={key} className="rounded bg-inset px-1.5 py-0.5 font-mono text-[0.9em] text-light-blue">
          {m[4]}
        </code>,
      );
    } else if (m[5]) {
      out.push(<Fragment key={key}>{tokens[m[5]] ?? ""}</Fragment>);
    }
    last = m.index! + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

export function BlogBody({ blocks, tokens }: { blocks: Block[]; tokens: Record<string, string> }) {
  return (
    <div className="space-y-5 text-[1.0625rem] leading-8 text-muted">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h2":
            return (
              <h2 key={i} id={b.id} className="scroll-mt-24 pt-6 font-display text-2xl font-bold leading-tight text-text sm:text-[1.75rem]">
                <Inline text={b.text} tokens={tokens} />
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} id={b.id} className="scroll-mt-24 pt-2 font-display text-lg font-semibold text-text sm:text-xl">
                <Inline text={b.text} tokens={tokens} />
              </h3>
            );
          case "p":
            return (
              <p key={i}>
                <Inline text={b.text} tokens={tokens} />
              </p>
            );
          case "quote":
            return (
              <aside key={i} className="flex gap-3 rounded-[14px] border border-primary/25 bg-primary/[0.06] p-4 text-base leading-7 text-light-blue">
                <Lightbulb className="mt-1 h-5 w-5 shrink-0" aria-hidden />
                <p>
                  <Inline text={b.text} tokens={tokens} />
                </p>
              </aside>
            );
          case "code":
            return (
              <pre key={i} className="overflow-x-auto rounded-[14px] border border-border bg-inset p-4 font-mono text-sm leading-6 text-text">
                <code>{b.text}</code>
              </pre>
            );
          case "list": {
            const Tag = b.ordered ? "ol" : "ul";
            return (
              <Tag key={i} className={cn("space-y-2 pl-6", b.ordered ? "list-decimal" : "list-disc", "marker:text-accent")}>
                {b.items.map((item, j) => (
                  <li key={j} className="pl-1">
                    <Inline text={item} tokens={tokens} />
                  </li>
                ))}
              </Tag>
            );
          }
          case "table":
            return (
              <div key={i} className="overflow-x-auto rounded-[14px] border border-border">
                <table className="w-full min-w-[520px] text-left text-sm leading-6">
                  <thead className="bg-card">
                    <tr>
                      {b.head.map((h, j) => (
                        <th key={j} scope="col" className="border-b border-border px-4 py-3 font-semibold text-text">
                          <Inline text={h} tokens={tokens} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((row, r) => (
                      <tr key={r} className="border-b border-border last:border-0">
                        {row.map((c, j) => (
                          <td key={j} className="px-4 py-3 align-top">
                            <Inline text={c} tokens={tokens} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      })}
    </div>
  );
}

export function TableOfContents({ blocks }: { blocks: Block[] }) {
  const h2s = blocks.filter((b): b is Extract<Block, { type: "h2" | "h3" }> => b.type === "h2");
  return (
    <nav aria-label="Table of contents" className="rounded-[16px] border border-border bg-card p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-subtle">In this article</p>
      <ol className="mt-3 space-y-2 text-sm">
        {h2s.map((h) => (
          <li key={h.id}>
            <a href={`#${h.id}`} className="text-muted hover:text-light-blue">
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-border bg-card shadow-card transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/40"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- generated cover image */}
      <img
        src={`/blog/${post.slug}/cover`}
        alt={`Cover image for the article: ${post.title}`}
        width={1200}
        height={630}
        loading="lazy"
        className="aspect-[1200/630] w-full border-b border-border object-cover"
      />
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{post.category}</p>
        <h2 className="mt-2 font-display text-lg font-bold leading-snug text-text">{post.title}</h2>
        <p className="mt-2 flex-1 text-sm leading-6 text-muted">{post.excerpt}</p>
        <p className="mt-4 flex items-center justify-between text-xs text-subtle">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden /> {post.minutes} min read · {formatDate(new Date(post.date))}
          </span>
          <ArrowRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-0.5" aria-hidden />
        </p>
      </div>
    </Link>
  );
}
