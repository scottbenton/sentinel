import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { ConfigModule } from "@nestjs/config";
import { AiScraperService } from "./aiScraper.service";

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, AiScraperService],
})
export class AppModule {}
