import { Module } from "@nestjs/common";
import { ScraperService } from "./scraper.service";
import { ScraperController } from "./scraper.controller";
import { OrganizationsModule } from "../organizations/organizations.module";
import { DashboardUsersModule } from "../dashboard_users/dashboard_users.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";

@Module({
  providers: [ScraperService],
  controllers: [ScraperController],
  imports: [OrganizationsModule, JwtModule, ConfigModule, DashboardUsersModule],
})
export class ScraperModule {}
