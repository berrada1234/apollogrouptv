import { beforeEach, describe, expect, it, vi } from "vitest";

// ─── Module mocks (hoisted) ─────────────────────────────────────────────────

const getSession = vi.fn();
const findUnique = vi.fn();

vi.mock("next/headers", () => ({ headers: async () => new Headers() }));
vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new Error(`REDIRECT:${url}`);
  },
}));
vi.mock("@/lib/auth", () => ({ auth: { api: { getSession } } }));
vi.mock("@/lib/db", () => ({
  db: {
    user: { findUnique },
    siteSetting: { findMany: vi.fn().mockResolvedValue([{ key: "referral", value: { enabled: "yes" } }]) },
  },
}));

const { assertRole, assertUser, hasRole, requireRole, AuthorizationError } = await import("@/lib/session");
const { redact } = await import("@/lib/audit");
const { getSettings, defaultSettings } = await import("@/lib/settings");

function signedInAs(role: "USER" | "SUPPORT" | "ADMIN", status: "ACTIVE" | "SUSPENDED" = "ACTIVE") {
  getSession.mockResolvedValue({ user: { id: "u1" }, session: { id: "s1" } });
  findUnique.mockResolvedValue({ id: "u1", name: "Test", email: "t@example.com", role, status });
}

beforeEach(() => {
  getSession.mockReset();
  findUnique.mockReset();
});

describe("role hierarchy", () => {
  it("ranks ADMIN > SUPPORT > USER", () => {
    expect(hasRole({ role: "ADMIN" }, "SUPPORT")).toBe(true);
    expect(hasRole({ role: "SUPPORT" }, "ADMIN")).toBe(false);
    expect(hasRole({ role: "USER" }, "SUPPORT")).toBe(false);
    expect(hasRole({ role: "USER" }, "USER")).toBe(true);
  });
});

describe("server-side authorization", () => {
  it("rejects anonymous callers in actions", async () => {
    getSession.mockResolvedValue(null);
    await expect(assertUser()).rejects.toBeInstanceOf(AuthorizationError);
  });

  it("rejects a regular user calling an admin action", async () => {
    signedInAs("USER");
    await expect(assertRole("ADMIN")).rejects.toBeInstanceOf(AuthorizationError);
  });

  it("allows an admin", async () => {
    signedInAs("ADMIN");
    await expect(assertRole("ADMIN")).resolves.toMatchObject({ id: "u1", role: "ADMIN" });
  });

  it("re-reads the role from the database instead of trusting the session", async () => {
    // Session payload claims nothing about role; the DB says USER.
    getSession.mockResolvedValue({ user: { id: "u1", role: "ADMIN" }, session: { id: "s1" } });
    findUnique.mockResolvedValue({ id: "u1", role: "USER", status: "ACTIVE" });
    await expect(assertRole("ADMIN")).rejects.toBeInstanceOf(AuthorizationError);
  });

  it("treats suspended accounts as signed out", async () => {
    signedInAs("ADMIN", "SUSPENDED");
    await expect(assertUser()).rejects.toBeInstanceOf(AuthorizationError);
  });

  it("redirects non-staff away from admin pages", async () => {
    signedInAs("USER");
    await expect(requireRole("SUPPORT")).rejects.toThrow("REDIRECT:/dashboard");
  });

  it("sends anonymous visitors to sign in with a return path", async () => {
    getSession.mockResolvedValue(null);
    await expect(requireRole("ADMIN", "/admin/users")).rejects.toThrow("REDIRECT:/sign-in?next=%2Fadmin%2Fusers");
  });
});

describe("audit log redaction", () => {
  it("removes secret-looking keys at any depth", () => {
    expect(redact({ email: "a@b.c", password: "x", nested: { apiKey: "k", ok: 1 }, list: [{ token: "t" }] })).toEqual({
      email: "a@b.c",
      password: "[redacted]",
      nested: { apiKey: "[redacted]", ok: 1 },
      list: [{ token: "[redacted]" }],
    });
  });
});

describe("site settings", () => {
  it("falls back to safe defaults when a stored value is invalid", async () => {
    const s = await getSettings();
    // `enabled: "yes"` is not a boolean, so the referral program must stay off.
    expect(s.referral).toEqual(defaultSettings.referral);
    expect(s.referral.enabled).toBe(false);
  });
});
