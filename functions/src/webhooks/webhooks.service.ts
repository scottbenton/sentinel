import { Injectable, Logger } from "@nestjs/common";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database, Tables } from "../types/supabase-generated.types";
import { SupabaseService } from "../supabase/supabase.service";

@Injectable()
export class WebhooksService {
    private readonly supabase: SupabaseClient<Database>;
    private readonly logger = new Logger(WebhooksService.name);

    constructor(supabaseService: SupabaseService) {
        this.supabase = supabaseService.supabase;
    }

    async handleDashboardUserInvite(
        record: Tables<"dashboard_user_invites">,
    ) {
        this.logger.log(`Processing invite for email: ${record.email_address}`);

        // Find the user with the email address from the invite
        const { data: user } = await this.supabase
            .from("users")
            .select("id")
            .eq("email_address", record.email_address)
            .single();

        if (!user) {
            this.logger.warn(
                `No user found for email: ${record.email_address}`,
            );
            return;
        }

        this.logger.debug(`Found user with id: ${user.id}`);

        // Get dashboard name
        const { data: dashboard } = await this.supabase
            .from("dashboards")
            .select("label")
            .eq("id", record.dashboard_id)
            .single();

        // Get inviter's name
        const { data: inviter } = await this.supabase
            .from("users")
            .select("display_name")
            .eq("id", record.invited_by)
            .single();

        this.logger.debug(
            `Creating notification for dashboard: ${dashboard?.label} from inviter: ${inviter?.display_name}`,
        );

        // Create notification
        const { error } = await this.supabase.from("notifications").insert({
            type: "user_invited",
            user_id: user.id,
            created_at: new Date().toISOString(),
            additional_context: {
                dashboard_name: dashboard?.label,
                inviter_name: inviter?.display_name,
                invite_id: record.id,
            },
        });

        if (error) {
            this.logger.error(
                `Error creating notification: ${error.message}`,
            );
            return;
        }
        this.logger.log(
            `Successfully created notification for user: ${user.id}`,
        );
    }
}
