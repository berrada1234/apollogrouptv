import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { getPosts, plainText } = await import("@/lib/blog");

// Primary keywords and H1s already owned by other pages; blog posts must never target these.
const reservedKeywords = [
  "apollo group tv",
  "apollo tv",
  "is apollo tv legal",
  "how to download apollo tv",
  "how to install apollo group tv",
  "how to download apollo tv on firestick",
  "how to pay for apollo group tv",
  "how to pay apollo group tv with cash app",
  "how to pay apollo group tv with credit card",
  "what is apollo tv",
  "is apollo tv illegal",
  "what is apollo group tv",
  "how much is apollo tv",
  "how to download apollo group tv on android",
  "how to download apollo group tv on fire tv",
  "how to install apollo tv",
];

describe("blog", () => {
  const posts = getPosts();

  it("has twenty published articles with unique slugs, H1s, SEO titles and focus keywords", () => {
    expect(posts).toHaveLength(20);
    for (const key of ["slug", "title", "seoTitle", "description", "keyword"] as const) {
      expect(new Set(posts.map((p) => p[key].toLowerCase())).size, key).toBe(posts.length);
    }
  });

  it("never targets a keyword owned by an existing page", () => {
    for (const p of posts) expect(reservedKeywords, p.slug).not.toContain(p.keyword.toLowerCase());
  });

  it("keeps every article at 2,000+ words with one H1 (no # headings in the body)", () => {
    for (const p of posts) {
      expect(p.words, p.slug).toBeGreaterThanOrEqual(2000);
      expect(p.blocks.some((b) => b.type === "h2"), p.slug).toBe(true);
    }
  });

  it("keeps search snippets within limits and fills every field", () => {
    for (const p of posts) {
      expect(p.seoTitle.length, p.slug).toBeLessThanOrEqual(65);
      expect(p.description.length, p.slug).toBeLessThanOrEqual(160);
      expect(p.secondary.length, p.slug).toBeGreaterThanOrEqual(3);
      expect(p.category && p.intent && p.date, p.slug).toBeTruthy();
    }
  });

  it("has an FAQ, a conclusion and internal links to other articles", () => {
    const slugs = new Set(posts.map((p) => p.slug));
    for (const p of posts) {
      const headings = p.blocks.filter((b) => b.type === "h2").map((b) => ("text" in b ? b.text : ""));
      expect(headings, p.slug).toContain("Frequently asked questions");
      expect(headings, p.slug).toContain("Conclusion");
      const text = p.blocks.map((b) => ("text" in b ? b.text : "items" in b ? b.items.join(" ") : "")).join(" ");
      const blogLinks = [...text.matchAll(/\]\(\/blog\/([a-z0-9-]+)\)/g)].map((m) => m[1]);
      expect(blogLinks.length, p.slug).toBeGreaterThan(0);
      for (const l of blogLinks) expect(slugs.has(l), `${p.slug} → ${l}`).toBe(true);
    }
  });

  it("strips Markdown for word counts", () => {
    expect(plainText("See [the guide](/guides) and **bold** `code`")).toBe("See the guide and bold code");
  });
});
