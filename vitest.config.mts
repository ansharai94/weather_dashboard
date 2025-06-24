import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./app/__tests__/setup.ts"],
    css: true, // Enable CSS processing in tests
    coverage: {
      exclude: [
        "next.config.ts",
        ".next/**",
        "node_modules/**",
        "eslint.config.mjs",
        "postcss.config.mjs",
        "vitest.config.mts",
        "**/types/**",
        "constants.ts",
        "types.ts",
        "lib/prompts",
        "lib/openai.ts",
        "**/layout.tsx", // Layout files
        "**/loading.tsx", // Loading components
        "**/not-found.tsx", // Error pages
        "**/globals.css", // CSS files
        "**/middleware.ts", // Next.js middleware
        "next.config.js", // Config files
        "tailwind.config.js",
      ],
    },
  },
});
