import { SupabaseClient } from "@/functions-types/supabase.type";
import { SupabaseService } from "@/supabase/supabase.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OrganizationsService {
    private readonly supabase: SupabaseClient;
    constructor(supabaseService: SupabaseService) {
        this.supabase = supabaseService.supabase;
    }

    async getOrganizationFromId(
        organizationId: number,
    ) {
        const result = await this.supabase.from("organizations").select().eq(
            "id",
            organizationId,
        ).single();

        if (result.error) {
            throw new Error(
                `Error fetching organization: ${result.error.message}`,
            );
        }
        if (!result.data) {
            throw new Error(`Organization not found`);
        }
        return result.data;
    }
}
