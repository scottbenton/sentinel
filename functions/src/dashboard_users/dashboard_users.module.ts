import { Module } from "@nestjs/common";
import { DashboardUsersService } from "./dashboard_users.service";
import { SupabaseModule } from "../supabase/supabase.module";
import { DashboardUsersController } from "./dashboard_users.controller";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { EmailService } from "src/email/email.service";

@Module({
  providers: [DashboardUsersService, EmailService],
  imports: [SupabaseModule, JwtModule, ConfigModule],
  exports: [DashboardUsersService],
  controllers: [DashboardUsersController],
})
export class DashboardUsersModule {}
