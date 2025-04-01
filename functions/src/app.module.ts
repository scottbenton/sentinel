import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { ConfigModule } from "@nestjs/config";
import { AiScraperService } from "./aiScraper.service";
import { SupabaseModule } from "./supabase/supabase.module";
import { DashboardUsersModule } from "./dashboard_users/dashboard_users.module";
import { OrganizationsModule } from "./organizations/organizations.module";
import { MeetingDocumentsModule } from "./meeting_documents/meeting_documents.module";
import { MeetingLogsModule } from "./meeting_logs/meeting_logs.module";
import { MeetingsModule } from "./meetings/meetings.module";
import { ScraperModule } from "./scraper/scraper.module";
import { ScraperController } from "./scraper/scraper.controller";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    ConfigModule.forRoot(),
    SupabaseModule,
    DashboardUsersModule,
    OrganizationsModule,
    MeetingDocumentsModule,
    MeetingLogsModule,
    MeetingsModule,
    ScraperModule,
    JwtModule,
  ],
  controllers: [AppController, ScraperController],
  providers: [AppService, AiScraperService],
})
export class AppModule {}
