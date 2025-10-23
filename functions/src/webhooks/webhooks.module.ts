import { Module } from "@nestjs/common";
import { WebhooksController } from "./webhooks.controller";
import { WebhooksService } from "./webhooks.service";
import { SupabaseModule } from "../supabase/supabase.module";
import { WatchersModule } from "../watchers/watchers.module";
import { NotificationSettingsModule } from "../notification-settings/notification-settings.module";

@Module({
  imports: [SupabaseModule, WatchersModule, NotificationSettingsModule],
  controllers: [WebhooksController],
  providers: [WebhooksService],
})
export class WebhooksModule {}
