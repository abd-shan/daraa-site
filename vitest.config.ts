import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // Next resolves the "@/*" path from tsconfig; Vitest does not, so tests
  // importing anything that uses it fail to resolve without this.
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    // Only src — e2e/ belongs to Playwright, which uses the same file naming.
    include: ["src/**/*.test.ts"],
  },
});
