import { Module } from "@nestjs/common";
import { DashboardUsersService } from "./dashboard_users.service";
import { SupabaseModule } from "../supabase/supabase.module";

@Module({
  providers: [DashboardUsersService],
  imports: [SupabaseModule],
  exports: [DashboardUsersService],
})
export class DashboardUsersModule {}
