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

    async handleNewUser(record: Tables<"users">) {
        this.logger.log(
            `Processing new user with email: ${record.email_address}`,
        );

        if (!record.email_address) {
            this.logger.warn(
                "New user has no email address, skipping invite check",
            );
            return;
        }

        // Find any pending invites for this email
        const { data: invites, error: invitesError } = await this.supabase
            .from("dashboard_user_invites")
            .select(
                "*, dashboards(label), users!dashboard_user_invites_invited_by_fkey(display_name)",
            )
            .eq("email_address", record.email_address);

        if (invitesError) {
            this.logger.error(
                `Error fetching invites: ${invitesError.message}`,
            );
            return;
        }

        if (!invites || invites.length === 0) {
            this.logger.debug(
                `No pending invites found for email: ${record.email_address}`,
            );
            return;
        }

        this.logger.log(
            `Found ${invites.length} pending invites for user ${record.id}`,
        );

        // Create notifications for each invite
        for (const invite of invites) {
            const { error } = await this.supabase.from("notifications").insert({
                type: "user_invited",
                user_id: record.id,
                created_at: new Date().toISOString(),
                additional_context: {
                    dashboard_name: invite.dashboards?.label,
                    inviter_name: invite.users?.display_name,
                    invite_id: invite.id,
                },
            });

            if (error) {
                this.logger.error(
                    `Error creating notification for invite ${invite.id}: ${error.message}`,
                );
                continue;
            }

            this.logger.debug(`Created notification for invite ${invite.id}`);
        }

        this.logger.log(
            `Successfully processed notifications for new user ${record.id}`,
        );
    }

    async handleInviteDelete(record: Tables<"dashboard_user_invites">) {
        this.logger.log(`Processing deletion of invite ${record.id}`);

        // Find and delete any notifications related to this invite
        const { error } = await this.supabase
            .from("notifications")
            .delete()
            .eq("additional_context->invite_id", record.id);

        if (error) {
            this.logger.error(`Error deleting notifications: ${error.message}`);
            return;
        }

        this.logger.log(
            `Successfully deleted notifications for invite ${record.id}`,
        );
    }
}
