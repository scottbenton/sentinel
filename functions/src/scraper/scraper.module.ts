import { Module } from "@nestjs/common";
import { ScraperService } from "./scraper.service";
import { ScraperController } from "./scraper.controller";
import { OrganizationsModule } from "@/organizations/organizations.module";
import { AuthModule } from "@/auth/auth.module";
import { DashboardUsersModule } from "@/dashboard_users/dashboard_users.module";

@Module({
  providers: [ScraperService],
  controllers: [ScraperController],
  imports: [OrganizationsModule, AuthModule, DashboardUsersModule],
})
export class ScraperModule {}
