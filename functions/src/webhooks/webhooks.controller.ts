import { Body, Controller, Logger, Post } from "@nestjs/common";
import { WebhooksService } from "./webhooks.service";
import { Tables } from "src/types/supabase-generated.types";

interface WebhookPayload<T> {
    type: "INSERT" | "UPDATE" | "DELETE";
    table: string;
    schema: string;
    record: T;
    old_record: T | null;
}

@Controller("webhooks")
export class WebhooksController {
    private readonly logger = new Logger(WebhooksController.name);

    constructor(private readonly webhooksService: WebhooksService) {}

    @Post("dashboard-user-invites")
    async handleDashboardUserInvite(
        @Body() payload: WebhookPayload<Tables<"dashboard_user_invites">>,
    ) {
        this.logger.log(
            `Received webhook for ${payload.table} with type ${payload.type}`,
        );

        if (
            payload.type !== "INSERT" ||
            payload.table !== "dashboard_user_invites"
        ) {
            this.logger.warn(
                `Invalid webhook payload: ${JSON.stringify(payload)}`,
            );
            return { success: false, message: "Invalid webhook payload" };
        }

        await this.webhooksService.handleDashboardUserInvite(payload.record);
        this.logger.log("Successfully processed dashboard user invite webhook");
        return { success: true };
    }
}
