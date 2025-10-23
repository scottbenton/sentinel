import { Module } from "@nestjs/common";
import { NotificationSettingsService } from "./notification-settings.service";
import { SupabaseModule } from "../supabase/supabase.module";

@Module({
  providers: [NotificationSettingsService],
  imports: [SupabaseModule],
  exports: [NotificationSettingsService],
})
export class NotificationSettingsModule {}
