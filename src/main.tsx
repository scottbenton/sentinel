import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Providers } from "./providers/Providers.tsx";
import { Layout } from "./components/layout/Layout.tsx";
// @ts-expect-error Font source has wrong types
import "@fontsource-variable/figtree";
import { registerSW } from "virtual:pwa-register";

const SERVICE_WORKER_UPDATE_INTERVAL_MINUTES = 0.5;
registerSW({
  immediate: true,
  onRegisteredSW: (_, r) => {
    if (r) {
      console.log("Service worker registered");
      setInterval(() => {
        console.log("Checking for service worker update");
        r.update();
      }, SERVICE_WORKER_UPDATE_INTERVAL_MINUTES * 60 * 1000);
    }
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <Layout>
        <App />
      </Layout>
    </Providers>
  </StrictMode>
);
