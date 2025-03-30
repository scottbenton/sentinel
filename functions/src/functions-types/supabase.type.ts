import { Database } from "@/types/supabase-generated.type";
import { SupabaseClient as Client } from "@supabase/supabase-js";

export type SupabaseClient = Client<Database, "public">;
