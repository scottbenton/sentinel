import { Injectable } from "@nestjs/common";
import { SupabaseClient } from "@/functions-types/supabase.type";
import { SupabaseService } from "@/supabase/supabase.service";

@Injectable()
export class DashboardUsersService {
    private readonly supabase: SupabaseClient;

    constructor(supabaseService: SupabaseService) {
        this.supabase = supabaseService.supabase;
    }

    async checkUserIsUserMeetingAdmin(
        userId: string,
        dashboardId: number,
    ): Promise<boolean> {
        const result = await this.supabase.from("dashboard_users").select().eq(
            "user_id",
            userId,
        ).eq("dashboard_id", dashboardId).single();

        if (result.error) {
            throw new Error(
                `Error fetching user permissions: ${result.error.message}`,
            );
        }
        if (!result.data) {
            return false;
        }
        return result.data.can_manage_meetings;
    }
}
