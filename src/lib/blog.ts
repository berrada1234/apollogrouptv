import "server-only";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { cache } from "react";

/**
 * Blog articles live as Markdown files in src/content/blog. Each file starts with a
 * simple front matter block (key: value lines between ---). The body supports the
 * subset of Markdown the articles use: ## and ### headings, paragraphs, - and 1. lists,
 * tables, fenced code, > quotes, **bold**, `code` and [links](url).
 */

export type BlogMeta = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  keyword: string;
  secondary: string[];
  intent: string;
  category: string;
  date: string;
  excerpt: string;
};

export type Block =
  | { type: "h2" | "h3"; text: string; id: string }
  | { type: "p"; text: string }
  | { type: "quote"; text: string }
  | { type: "code"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "table"; head: string[]; rows: string[][] };

export type BlogPost = BlogMeta & { blocks: Block[]; words: number; minutes: number };

export const BLOG_AUTHOR = "Apollo Group TV Editorial Team";
const DIR = join(process.cwd(), "src/content/blog");

export function headingId(text: string) {
  return text
    .toLowerCase()
    .replace(/[`*]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseFrontMatter(raw: string) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!m) throw new Error("Blog post is missing front matter");
  const data: Record<string, string> = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i > 0) data[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { data, body: m[2] };
}

const cells = (row: string) =>
  row
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => c.trim());

export function parseBlocks(body: string): Block[] {
  const lines = body.split(/\r?\n/);
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    if (line.startsWith("```")) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) code.push(lines[i++]);
      i++;
      blocks.push({ type: "code", text: code.join("\n") });
      continue;
    }
    const h = /^(#{2,3})\s+(.*)$/.exec(line);
    if (h) {
      const text = h[2].trim();
      blocks.push({ type: h[1].length === 2 ? "h2" : "h3", text, id: headingId(text) });
      i++;
      continue;
    }
    if (line.startsWith("|")) {
      const rows: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) rows.push(lines[i++]);
      const [head, , ...rest] = rows;
      blocks.push({ type: "table", head: cells(head), rows: rest.map(cells) });
      continue;
    }
    if (/^(-|\d+\.)\s/.test(line)) {
      const ordered = /^\d+\./.test(line);
      const items: string[] = [];
      while (i < lines.length && /^(-|\d+\.)\s/.test(lines[i])) items.push(lines[i++].replace(/^(-|\d+\.)\s+/, ""));
      blocks.push({ type: "list", ordered, items });
      continue;
    }
    if (line.startsWith(">")) {
      const quote: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) quote.push(lines[i++].replace(/^>\s?/, ""));
      blocks.push({ type: "quote", text: quote.join(" ") });
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{2,3}\s|```|\||>|-\s|\d+\.\s)/.test(lines[i])) para.push(lines[i++].trim());
    blocks.push({ type: "p", text: para.join(" ") });
  }
  return blocks;
}

/** Plain text of a block, for word counts and reading time. */
export function plainText(text: string) {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*|`/g, "");
}

function blockText(b: Block): string {
  if (b.type === "list") return b.items.join(" ");
  if (b.type === "table") return [...b.head, ...b.rows.flat()].join(" ");
  return b.text;
}

function load(file: string): BlogPost {
  const { data, body } = parseFrontMatter(readFileSync(join(DIR, file), "utf8"));
  const blocks = parseBlocks(body);
  const words = blocks
    .filter((b) => b.type !== "code")
    .map((b) => plainText(blockText(b)))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return {
    slug: file.replace(/\.md$/, ""),
    title: data.title,
    seoTitle: data.seoTitle || data.title,
    description: data.description,
    keyword: data.keyword,
    secondary: (data.secondary ?? "").split(",").map((s) => s.trim()).filter(Boolean),
    intent: data.intent,
    category: data.category,
    date: data.date,
    excerpt: data.excerpt || data.description,
    blocks,
    words,
    minutes: Math.max(1, Math.round(words / 230)),
  };
}

export const getPosts = cache((): BlogPost[] =>
  readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map(load)
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title)),
);

export function getPost(slug: string) {
  return getPosts().find((p) => p.slug === slug);
}

/** Up to `n` other posts, same category first. */
export function relatedPosts(post: BlogPost, n = 3) {
  const others = getPosts().filter((p) => p.slug !== post.slug);
  return [...others.filter((p) => p.category === post.category), ...others.filter((p) => p.category !== post.category)].slice(0, n);
}
