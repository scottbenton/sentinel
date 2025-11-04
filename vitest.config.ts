import { defineConfig, mergeConfig } from "vitest/config";
import config from "./vite.config";

export default mergeConfig(
  config,
  defineConfig({
    test: {
      globals: true,
      environment: "jsdom",
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/cypress/**",
        "**/.{idea,git,cache,output,temp}/**",
        "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
        "./functions/**", // Exclude backend tests (they use Jest)
      ],
    },
  }),
);
