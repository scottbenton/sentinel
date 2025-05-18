import { Module } from "@nestjs/common";
import { WebhooksController } from "./webhooks.controller";
import { WebhooksService } from "./webhooks.service";
import { SupabaseModule } from "../supabase/supabase.module";

@Module({
    imports: [SupabaseModule],
    controllers: [WebhooksController],
    providers: [WebhooksService],
})
export class WebhooksModule {}
