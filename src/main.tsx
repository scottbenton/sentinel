import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Providers } from "./providers/Providers.tsx";
import { Layout } from "./components/layout/Layout.tsx";
// @ts-expect-error Font source has wrong types
import "@fontsource-variable/figtree";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <Layout>
        <App />
      </Layout>
    </Providers>
  </StrictMode>
);
