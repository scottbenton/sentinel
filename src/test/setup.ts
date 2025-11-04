import { vi } from "vitest";

// Mock the supabase client globally so we don't need environment variables
vi.mock("@/lib/supabase.lib", () => ({
  SUPABASE_URL: "http://localhost:54321",
  supabase: {
    from: vi.fn(),
    auth: {
      getSession: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    storage: {
      from: vi.fn(),
    },
    channel: vi.fn(),
  },
}));
