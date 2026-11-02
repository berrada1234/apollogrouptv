import Link from "next/link";
import { Fragment } from "react";

/**
 * Minimal, safe inline formatter for editable content.
 *  - [label](/path)  → internal link (only same-site paths starting with "/")
 *  - {{token}}       → value from `tokens`; a missing value renders as a highlighted owner placeholder
 * Everything else is plain text (React escapes it), so admin-entered content can't inject HTML.
 */
const PATTERN = /\[([^\]]{1,120})\]\((\/[A-Za-z0-9\-/_#?=&.]*)\)|\{\{(\w+)\}\}/g;

export type Tokens = Record<string, { value: string; placeholder: string }>;

export function RichText({ text, tokens = {} }: { text: string; tokens?: Tokens }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(PATTERN)) {
    if (m.index! > last) parts.push(text.slice(last, m.index));
    if (m[1]) {
      parts.push(
        <Link key={m.index} href={m[2]} className="font-medium text-accent underline-offset-2 hover:text-light-blue hover:underline">
          {m[1]}
        </Link>,
      );
    } else {
      const t = tokens[m[3]];
      parts.push(
        t?.value ? (
          <Fragment key={m.index}>{t.value}</Fragment>
        ) : (
          <mark key={m.index} className="rounded bg-warning/15 px-1 text-warning">
            [Owner to provide: {t?.placeholder ?? m[3]}]
          </mark>
        ),
      );
    }
    last = m.index! + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

/** Plain-text version (for search indexing and meta descriptions). */
export function stripRich(text: string) {
  return text.replace(/\[([^\]]+)\]\((\/[^)]*)\)/g, "$1").replace(/\{\{\w+\}\}/g, "");
}
