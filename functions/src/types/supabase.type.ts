import { Database } from "./supabase-generated.types";
import { SupabaseClient as Client } from "@supabase/supabase-js";

export type SupabaseClient = Client<Database, "public">;
