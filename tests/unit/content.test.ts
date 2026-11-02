import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { RichText, stripRich } from "@/components/rich-text";
import { FAQ_CATEGORIES, faqSeed } from "@/content/faqs";
import { legalDocs } from "@/content/legal";
import { contactSchema } from "@/lib/validators";

const html = (text: string, tokens = {}) => renderToStaticMarkup(createElement(RichText, { text, tokens }));

describe("RichText", () => {
  it("renders internal links", () => {
    expect(html("See the [Plans page](/plans).")).toMatch(/<a [^>]*href="\/plans"[^>]*>Plans page<\/a>/);
  });
  it("never renders external or script links", () => {
    const out = html("[x](https://evil.example) [y](javascript:alert(1))");
    expect(out).not.toContain("<a");
    expect(out).toContain("[x](https://evil.example)");
  });
  it("escapes HTML in editable content", () => {
    expect(html("<img src=x onerror=alert(1)>")).not.toContain("<img");
  });
  it("fills tokens and marks missing ones as owner placeholders", () => {
    const tokens = { entityName: { value: "Acme LLC", placeholder: "legal entity name" }, supportEmail: { value: "", placeholder: "support email address" } };
    const out = html("Operated by {{entityName}}. Write to {{supportEmail}}.", tokens);
    expect(out).toContain("Acme LLC");
    expect(out).toContain("[Owner to provide: support email address]");
  });
  it("strips formatting for search and snippets", () => {
    expect(stripRich("Go to [Plans](/plans) now {{x}}")).toBe("Go to Plans now ");
  });
});

describe("FAQ content", () => {
  it("uses only the defined categories and covers each of them", () => {
    for (const f of faqSeed) expect(FAQ_CATEGORIES).toContain(f.category);
    for (const c of FAQ_CATEGORIES) expect(faqSeed.some((f) => f.category === c)).toBe(true);
  });
  it("has no duplicate questions", () => {
    expect(new Set(faqSeed.map((f) => f.question)).size).toBe(faqSeed.length);
  });
  it("does not state prices or refund windows (those live in their own pages)", () => {
    for (const f of faqSeed) expect(f.answer).not.toMatch(/\$\d|\d+[- ]day (refund|money)/i);
  });
  it("links only to same-site paths", () => {
    for (const f of faqSeed) for (const m of f.answer.matchAll(/\]\(([^)]+)\)/g)) expect(m[1].startsWith("/")).toBe(true);
  });
});

describe("Legal content", () => {
  it("has unique slugs and descriptions", () => {
    expect(new Set(legalDocs.map((d) => d.slug)).size).toBe(legalDocs.length);
    expect(new Set(legalDocs.map((d) => d.description)).size).toBe(legalDocs.length);
  });
});

describe("contactSchema", () => {
  const valid = { name: "Jane Doe", email: "jane@example.com", topic: "Setup help", subject: "TV setup", message: "My app shows an error after sign-in." };
  it("accepts a complete message", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });
  it("rejects a filled honeypot", () => {
    const r = contactSchema.safeParse({ ...valid, website: "http://spam.example" });
    expect(r.success).toBe(false);
    expect(r.error?.issues[0].path[0]).toBe("website");
  });
  it("rejects unknown topics and short messages", () => {
    expect(contactSchema.safeParse({ ...valid, topic: "Hacking" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, message: "help" }).success).toBe(false);
  });
});

describe("homepage content", async () => {
  const { homeCopy, homeFaq } = await import("@/content/home");
  it("renders **bold** as strong text", () => {
    expect(html("Search for **Apollo TV** here")).toContain("<strong");
  });
  it("uses the brand keyword in the H1 and in section H2s", () => {
    expect(homeCopy.hero.h1).toContain("Apollo Group TV");
    const h2s = Object.values(homeCopy).flatMap((s) => ("h2" in s ? [s.h2] : []));
    expect(h2s.filter((h) => /Apollo Group TV|Apollo TV/.test(h)).length).toBeGreaterThanOrEqual(10);
    expect(h2s).toContain("Apollo Group TV Subscription Plans & Pricing");
    expect(new Set(h2s).size).toBe(h2s.length);
  });
  it("gives every device logo a descriptive, keyword-aware alt text", () => {
    for (const d of homeCopy.devices.logos) {
      expect(d.alt.length).toBeGreaterThan(25);
      expect(d.alt).toMatch(/Apollo (Group )?TV/);
    }
  });
  it("keeps homepage FAQ factual and distinct from /faq", () => {
    const faqQuestions = new Set(faqSeed.map((f) => f.question));
    for (const f of homeFaq) {
      expect(f.a).not.toMatch(/\$\d|\d+[- ]day (refund|money|trial)/i);
      for (const m of f.a.matchAll(/\]\(([^)]+)\)/g)) expect(m[1].startsWith("/")).toBe(true);
    }
    const shared = homeFaq.filter((f) => faqQuestions.has(f.q));
    expect(shared.length).toBeLessThanOrEqual(2);
  });
});

describe("homepage copy guardrails", () => {
  it("contains no hard-coded audience or catalog figures", async () => {
    const src = (await import("node:fs")).readFileSync("src/content/home.ts", "utf8");
    expect(src).not.toMatch(/\b\d{1,3},\d{3}\+|\b\d+\+ (channels|movies|countries|subscribers)/i);
    expect(src).not.toMatch(/money-back|24\/7|anti-freeze/i);
  });
});

describe("channels page content", () => {
  it("stays brand-free: no channel, network, league or streaming-service names", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("src/content/channels.ts", "utf8");
    const brands = /\b(ESPN|CNN|HBO|BBC|Sky|Fox|NBC|CBS|ABC|MSNBC|beIN|DAZN|Netflix|Disney|Hulu|Prime Video|Paramount|Peacock|Nickelodeon|Cartoon Network|Discovery|National Geographic|MTV|TSN|Sportsnet|Al Jazeera|NFL|NBA|MLB|NHL|UFC|Premier League|La Liga|Champions League|Formula 1|F1)\b/;
    expect(src).not.toMatch(brands);
  });
  it("gives every category a summary and program types, and every FAQ a real answer", async () => {
    const { channelCategories, channelFaq } = await import("@/content/channels");
    expect(new Set(channelCategories.map((c) => c.key)).size).toBe(channelCategories.length);
    for (const c of channelCategories) {
      expect(c.summary.length).toBeGreaterThan(40);
      expect(c.covers.length).toBeGreaterThanOrEqual(3);
    }
    for (const f of channelFaq) expect(stripRich(f.a).length).toBeGreaterThan(60);
  });
});

describe("app page content", () => {
  it("avoids unverifiable stats, titles, brands and risky install advice", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("src/content/app.ts", "utf8").split("\n").filter((l) => !l.trim().startsWith("*")).join("\n");
    expect(src).not.toMatch(/\d+\s*(K|M)\+|\d\.\d\s*\/\s*5|\d+\s*(ms|Mbps|seconds?)\b|downloads?\s+\d/i);
    expect(src).not.toMatch(/\b(VPN|sideload|APK|M3U|MAC address|TestFlight|anti-freeze|catch-?up|DVR|PVR|24\/7)\b/i);
    expect(src).not.toMatch(/\b(Dark Knight|Interstellar|Inception|Shawshank|IMDB|TMDB|ESPN|HBO|BBC|Netflix|Disney)\b/i);
    // Downloader codes may only be mentioned as something to avoid.
    expect(src).not.toMatch(/(enter|use) (a|the) downloader code/i);
  });
  it("answers every app FAQ with substance", async () => {
    const { appFaq } = await import("@/content/app");
    expect(appFaq.length).toBeGreaterThanOrEqual(6);
    for (const f of appFaq) expect(stripRich(f.a).length).toBeGreaterThan(60);
  });
});
