import { Module } from "@nestjs/common";
import { DashboardUsersService } from "./dashboard_users.service";
import { SupabaseModule } from "src/supabase/supabase.module";

@Module({
  providers: [DashboardUsersService],
  imports: [SupabaseModule],
})
export class DashboardUsersModule {}
