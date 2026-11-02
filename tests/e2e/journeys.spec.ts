import { expect, test } from "@playwright/test";

const publicPages = [
  ["/", /Apollo Group TV/],
  ["/product", /Product/],
  ["/app", /App/],
  ["/plans", /Plans/],
  ["/channels", /Channels/],
  ["/reviews", /Reviews/],
  ["/refer-a-friend", /Refer a Friend/],
  ["/faq", /FAQ/],
] as const;

test.describe("public website", () => {
  for (const [path, title] of publicPages) {
    test(`${path} renders with a unique title and one h1`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page).toHaveTitle(title);
      await expect(page.locator("h1")).toHaveCount(1);
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical).toContain(path === "/" ? "" : path);
      // No horizontal overflow on any viewport.
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      expect(overflow).toBe(false);
    });
  }

  test("main navigation works", async ({ page, isMobile }) => {
    await page.goto("/");
    if (isMobile) await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("link", { name: "Plans" }).first().click();
    await expect(page).toHaveURL(/\/plans$/);
  });

  test("channel search shows an empty state for no matches", async ({ page }) => {
    await page.goto("/channels?q=zzzz-no-such-channel");
    await expect(page.getByText("No channels found")).toBeVisible();
  });

  test("FAQ accordion is keyboard accessible", async ({ page }) => {
    await page.goto("/faq");
    const first = page.locator("button[aria-expanded]").first();
    test.skip((await first.count()) === 0, "No FAQ entries seeded");
    await first.focus();
    await page.keyboard.press("Enter");
    await expect(first).toHaveAttribute("aria-expanded", "true");
  });

  test("custom 404 page", async ({ page }) => {
    const res = await page.goto("/this-page-does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
  });

  test("robots.txt and sitemap.xml are served", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(await robots.text()).toContain("Disallow: /admin");
    const sitemap = await request.get("/sitemap.xml");
    expect(await sitemap.text()).toContain("/plans");
  });
});

test.describe("authentication & access control", () => {
  test("protected areas redirect to sign in", async ({ page }) => {
    for (const path of ["/dashboard", "/admin", "/account", "/client-portal"]) {
      await page.goto(path);
      await expect(page).toHaveURL(new RegExp(`/sign-in\\?next=${encodeURIComponent(path).replace(/%2F/g, "(%2F|/)")}`));
    }
  });

  test("private pages send a noindex header", async ({ request }) => {
    const res = await request.get("/sign-in");
    expect(res.headers()["x-robots-tag"]).toContain("noindex");
  });

  test("sign-in form validates input", async ({ page }) => {
    await page.goto("/sign-in");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText("Enter a valid email address.")).toBeVisible();
    await page.getByLabel("Email").fill("nobody@example.test");
    await page.getByLabel("Password", { exact: true }).fill("WrongPassword1");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByRole("alert").filter({ hasText: /incorrect|too many/i })).toBeVisible();
  });

  test("show/hide password toggle", async ({ page }) => {
    await page.goto("/sign-in");
    const input = page.getByLabel("Password", { exact: true });
    await expect(input).toHaveAttribute("type", "password");
    await page.getByRole("button", { name: "Show password" }).click();
    await expect(input).toHaveAttribute("type", "text");
  });

  test("create account validates passwords and terms", async ({ page }) => {
    await page.goto("/create-account");
    await page.getByLabel("Full name").fill("E2E Tester");
    await page.getByLabel("Email").fill(`e2e-${Date.now()}@example.test`);
    await page.getByLabel("Password", { exact: true }).fill("weak");
    await page.getByLabel("Confirm password").fill("different");
    await page.getByRole("button", { name: "Create account" }).click();
    await expect(page.getByText("Use at least 10 characters.")).toBeVisible();
    await expect(page.getByText("You must accept the Terms and Privacy Policy.")).toBeVisible();
  });

  test("referral link stores the code for sign-up", async ({ page, context }) => {
    await page.goto("/create-account?ref=ABCD2345");
    await expect(page.getByText("ABCD2345")).toBeVisible();
    const cookies = await context.cookies();
    expect(cookies.find((c) => c.name === "agtv_ref")?.value).toBe("ABCD2345");
  });
});
