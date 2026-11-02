import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests. They need a running app connected to a migrated, seeded
 * database. By default Playwright builds and starts the app itself; set
 * E2E_BASE_URL to test an already-running server (e.g. a staging URL).
 */
const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  use: { baseURL, trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : { command: "npm run build && npm run start", url: baseURL, timeout: 240_000, reuseExistingServer: true },
});
