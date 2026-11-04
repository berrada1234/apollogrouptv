import { describe, expect, it } from "vitest";
import { suggestEmail } from "@/lib/email-typos";

describe("suggestEmail", () => {
  it("corrects common domain typos", () => {
    expect(suggestEmail("jane@gmial.com")).toBe("jane@gmail.com");
    expect(suggestEmail(" Jane@Hotmail.con ")).toBe("jane@hotmail.com");
  });
  it("leaves correct or unknown domains alone", () => {
    expect(suggestEmail("jane@gmail.com")).toBeNull();
    expect(suggestEmail("jane@company.co")).toBeNull();
    expect(suggestEmail("not-an-email")).toBeNull();
  });
});
