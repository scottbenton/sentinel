import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5174,
  },
  plugins: [
    react(),
    tsconfigPaths(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: null,
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
      },
      devOptions: {
        enabled: false,
        suppressWarnings: true,
      },
      manifest: {
        name: "Sentinel",
        short_name: "Sentinel",
        start_url: "/dashboards",
        scope: "/",
        description:
          "Sentinel is a web application for monitoring local governments.",
        display: "standalone",
        theme_color: "#111111",
        background_color: "#ffffff",
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
