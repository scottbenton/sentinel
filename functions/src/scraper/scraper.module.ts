import { Module } from "@nestjs/common";
import { ScraperService } from "./scraper.service";
import { ScraperController } from "./scraper.controller";
import { OrganizationsModule } from "../organizations/organizations.module";
import { DashboardUsersModule } from "../dashboard_users/dashboard_users.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { BullModule } from "@nestjs/bullmq";
import { ScraperProcessor } from "./scraper.processor";
import { MeetingsModule } from "src/meetings/meetings.module";

@Module({
  providers: [ScraperService, ScraperProcessor],
  controllers: [ScraperController],
  exports: [ScraperService],
  imports: [
    OrganizationsModule,
    MeetingsModule,
    JwtModule,
    ConfigModule,
    DashboardUsersModule,
    BullModule.registerQueue({
      name: "organization-scrape-queue",
    }),
  ],
})
export class ScraperModule {}
