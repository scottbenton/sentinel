import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/health-check")
  healthCheck(): string {
    return "OK";
  }

  // @Get("scrape")
  // async scrape(): Promise<string> {
  //   const currentDate = new Date();
  //   const url = "https://go.boarddocs.com/pa/wpen/Board.nsf/Public";
  //   const instruction =
  //     `Get all meetings that are either scheduled today or in the future. The date is ${currentDate.toLocaleDateString()}.`;
  //   return await this.aiScraperService.scrapeURL(url, instruction);
  // }
}
