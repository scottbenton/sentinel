import { Injectable } from "@nestjs/common";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

import { Database } from "../types/supabase-generated.types";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SupabaseService {
    public supabase: SupabaseClient<Database, "public">;

    constructor(private configService: ConfigService) {
        const supabaseUrl = this.configService.getOrThrow<string>(
            "SUPABASE_URL",
        );
        const supabaseAnonKey = this.configService.getOrThrow<string>(
            "SUPABASE_SERVICE_ROLE_KEY",
        );
        this.supabase = createClient<Database>(
            supabaseUrl,
            supabaseAnonKey,
        );
    }
}
