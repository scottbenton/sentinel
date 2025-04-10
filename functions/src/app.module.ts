import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { ConfigModule } from "@nestjs/config";
import { AiScraperService } from "./aiScraper.service";
import { SupabaseModule } from "./supabase/supabase.module";
import { DashboardUsersModule } from "./dashboard_users/dashboard_users.module";
import { OrganizationsModule } from "./organizations/organizations.module";
import { MeetingsModule } from "./meetings/meetings.module";
import { ScraperModule } from "./scraper/scraper.module";
import { ScraperController } from "./scraper/scraper.controller";
import { JwtModule } from "@nestjs/jwt";
import { BullModule } from "@nestjs/bullmq";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    ConfigModule.forRoot(),
    SupabaseModule,
    DashboardUsersModule,
    OrganizationsModule,
    MeetingsModule,
    ScraperModule,
    JwtModule,
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT ?? ""),
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
      },
    }),
  ],
  controllers: [AppController, ScraperController],
  providers: [AppService, AiScraperService],
})
export class AppModule {}
