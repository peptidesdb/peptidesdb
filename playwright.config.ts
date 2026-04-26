import { defineConfig, devices } from "@playwright/test";

/* =========================================================
   Playwright config

   E2E tests run against a local `next dev` server (auto-started
   via webServer config). Override baseURL via E2E_BASE_URL env
   to run against a deployed preview/prod URL instead.

   One project (Desktop Chromium). Viewport-sensitive specs
   override the viewport per-describe via `test.use({ viewport })`
   — keeps viewport-agnostic specs from running 3x.
   ========================================================= */

const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const useLocalServer = !process.env.E2E_BASE_URL;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : [["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // Spin up `next dev` for local runs; CI / staged tests pass E2E_BASE_URL.
  ...(useLocalServer && {
    webServer: {
      command: "bun run dev",
      url: baseURL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  }),
});
