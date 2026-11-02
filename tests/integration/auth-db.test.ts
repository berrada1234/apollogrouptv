/**
 * Integration tests against a real MySQL database.
 *
 * They run only when TEST_DATABASE_URL points at a disposable, migrated
 * database (never production). Example:
 *   TEST_DATABASE_URL="mysql://user:pass@127.0.0.1:3306/apollo_test" npm test
 */
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

const url = process.env.TEST_DATABASE_URL;
const run = url ? describe : describe.skip;

vi.mock("@/lib/email", () => ({ sendEmail: vi.fn(async () => undefined), isEmailConfigured: () => false }));
vi.mock("next/headers", () => ({ headers: async () => new Headers(), cookies: async () => ({ get: () => undefined, set: () => undefined }) }));

run("auth + database (integration)", () => {
  const stamp = Date.now();
  const email = `it-${stamp}@example.test`;
  const password = "Integr4tionPass!";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let auth: any, db: any;

  beforeAll(async () => {
    process.env.DATABASE_URL = url;
    process.env.BETTER_AUTH_SECRET ??= "integration-test-secret-integration-test-secret";
    process.env.BETTER_AUTH_URL ??= "http://localhost:3000";
    ({ auth } = await import("@/lib/auth"));
    ({ db } = await import("@/lib/db"));
  });

  afterAll(async () => {
    await db?.user.deleteMany({ where: { email: { endsWith: "@example.test" } } });
    await db?.$disconnect();
  });

  it("creates a user with a hashed password and a referral code", async () => {
    await auth.api.signUpEmail({ body: { name: "Integration User", email, password } });
    const user = await db.user.findUnique({ where: { email }, include: { accounts: true } });
    expect(user).toBeTruthy();
    expect(user.role).toBe("USER");
    expect(user.emailVerified).toBe(false);
    expect(user.referralCode).toMatch(/^[A-Z2-9]{8}$/);
    const credential = user.accounts.find((a: { providerId: string }) => a.providerId === "credential");
    expect(credential.password).toBeTruthy();
    expect(credential.password).not.toContain(password);
  });

  it("blocks sign-in until the email is verified", async () => {
    await expect(auth.api.signInEmail({ body: { email, password } })).rejects.toMatchObject({ status: "FORBIDDEN" });
  });

  it("signs in once verified and rejects a wrong password", async () => {
    await db.user.update({ where: { email }, data: { emailVerified: true } });
    const ok = await auth.api.signInEmail({ body: { email, password } });
    expect(ok.user.email).toBe(email);
    await expect(auth.api.signInEmail({ body: { email, password: "WrongPass123" } })).rejects.toBeTruthy();
  });

  it("refuses to create sessions for suspended accounts", async () => {
    await db.user.update({ where: { email }, data: { status: "SUSPENDED" } });
    await expect(auth.api.signInEmail({ body: { email, password } })).rejects.toBeTruthy();
    await db.user.update({ where: { email }, data: { status: "ACTIVE" } });
  });

  it("enforces unique emails at the database level", async () => {
    const user = await db.user.findUnique({ where: { email } });
    await expect(db.user.create({ data: { id: `dup-${stamp}`, name: "Dup", email } })).rejects.toMatchObject({ code: "P2002" });
    expect(user).toBeTruthy();
  });

  it("cascades user deletion to dependent records", async () => {
    const user = await db.user.findUnique({ where: { email } });
    await db.supportTicket.create({ data: { userId: user.id, subject: "Cascade test", messages: { create: { authorId: user.id, body: "hello" } } } });
    await db.user.delete({ where: { id: user.id } });
    expect(await db.supportTicket.count({ where: { userId: user.id } })).toBe(0);
    expect(await db.session.count({ where: { userId: user.id } })).toBe(0);
  });
});
