import { describe, expect, it } from "vitest";
import { formatMoney, humanize, initials, parseFeatures, safeRedirect, slugify } from "@/lib/utils";
import { generateReferralCode, isValidReferralCode } from "@/lib/referral";
import { oneOf, pageHref, pageParam, param } from "@/lib/params";

describe("safeRedirect", () => {
  it("allows same-site relative paths", () => {
    expect(safeRedirect("/dashboard/billing")).toBe("/dashboard/billing");
  });
  it.each(["https://evil.example", "//evil.example", "/\\evil.example", "javascript:alert(1)", "", null, undefined])(
    "falls back for unsafe target %s",
    (target) => {
      expect(safeRedirect(target as string | null | undefined)).toBe("/dashboard");
    },
  );
});

describe("formatting helpers", () => {
  it("formats cents as currency", () => {
    expect(formatMoney(1999, "USD")).toBe("$19.99");
  });
  it("humanizes enum values", () => {
    expect(humanize("WAITING_ON_CUSTOMER")).toBe("Waiting On Customer");
  });
  it("builds initials", () => {
    expect(initials("jane mary doe")).toBe("JM");
  });
  it("slugifies text", () => {
    expect(slugify("  Sports & Más HD! ")).toBe("sports-mas-hd");
  });
  it("keeps only non-empty string features", () => {
    expect(parseFeatures(["A", "", 3, null, "B"])).toEqual(["A", "B"]);
    expect(parseFeatures("not an array")).toEqual([]);
  });
});

describe("referral codes", () => {
  it("generates valid, unambiguous codes", () => {
    for (let i = 0; i < 200; i++) {
      const code = generateReferralCode();
      expect(code).toHaveLength(8);
      expect(isValidReferralCode(code)).toBe(true);
      expect(code).not.toMatch(/[01ILO]/);
    }
  });
  it("rejects malformed codes", () => {
    expect(isValidReferralCode("abc")).toBe(false);
    expect(isValidReferralCode("ABCDEFG1")).toBe(false);
    expect(isValidReferralCode("<script>")).toBe(false);
  });
});

describe("search param helpers", () => {
  it("reads, trims and caps params", () => {
    expect(param({ q: "  hello  " }, "q")).toBe("hello");
    expect(param({ q: ["a", "b"] }, "q")).toBe("a");
    expect(param({ q: "x".repeat(200) }, "q", 10)).toHaveLength(10);
    expect(param({}, "q")).toBeUndefined();
  });
  it("clamps page numbers", () => {
    expect(pageParam({ page: "-4" })).toBe(1);
    expect(pageParam({ page: "abc" })).toBe(1);
    expect(pageParam({ page: "99999999" })).toBe(10000);
  });
  it("only accepts whitelisted enum values", () => {
    expect(oneOf("ACTIVE", ["ACTIVE", "SUSPENDED"] as const)).toBe("ACTIVE");
    expect(oneOf("DROP TABLE", ["ACTIVE", "SUSPENDED"] as const)).toBeUndefined();
  });
  it("keeps filters when paginating", () => {
    expect(pageHref("/admin/users", { q: "jo", page: "3" }, 2)).toBe("/admin/users?q=jo&page=2");
    expect(pageHref("/admin/users", { q: "jo" }, 1)).toBe("/admin/users?q=jo");
  });
});
