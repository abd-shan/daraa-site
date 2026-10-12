import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL, trace: "on-first-retry" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    // 320px is the narrowest width the plan commits to supporting.
    {
      name: "mobile-320",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 320, height: 720 },
      },
    },
  ],
  webServer: {
    // Production server, not dev: it is what citizens actually get, and Next
    // refuses to run a second dev server for the same directory, so this also
    // lets the suite run while `pnpm dev` is up.
    command: `npx next build && npx next start --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
