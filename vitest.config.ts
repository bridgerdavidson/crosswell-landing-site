import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  // tsconfig says jsx "preserve" (Next compiles it); the tests render
  // components themselves, so vitest compiles JSX with the automatic runtime
  esbuild: { jsx: "automatic" },
  test: {
    include: ["tests/**/*.test.{ts,tsx}"],
    testTimeout: 90_000,
    hookTimeout: 90_000,
  },
});
