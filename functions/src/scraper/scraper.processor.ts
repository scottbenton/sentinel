import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger, Scope } from "@nestjs/common";
import { Job } from "bullmq";
import { Browser } from "src/browser.class";
import { OrganizationsService } from "src/organizations/organizations.service";
import { BaseScraper } from "./scrapers/BaseScraper";
import { BoardDocsScraper } from "./scrapers/BoardDocs.scraper";
import { MeetingsService } from "src/meetings/meetings.service";
import { GarnetValleyScraper } from "./scrapers/GarnetValleyScraper";
import { PennDelcoScraper } from "./scrapers/PennDelcoScraper";
import { RidleyScraper } from "./scrapers/RidleyScraper";

@Processor({ name: "organization-scrape-queue", scope: Scope.REQUEST })
export class ScraperProcessor extends WorkerHost {
    private readonly logger = new Logger(ScraperProcessor.name);

    constructor(
        private readonly organizationService: OrganizationsService,
        private readonly meetingsService: MeetingsService,
    ) {
        super();
    }

    async process(
        job: Job<
            {
                organizationId: string;
            },
            any,
            string
        >,
    ) {
        const { organizationId: orgIdString } = job.data;
        const orgId = parseInt(orgIdString);

        this.logger.log(
            `Processing job for organization ${orgIdString}`,
        );

        if (isNaN(orgId)) {
            this.logger.error(`Invalid organization ID ${orgId}`);
            throw new Error("Invalid organization ID");
        }

        const org = await this.organizationService.getOrganizationFromId(
            orgId,
        );

        const browser = new Browser(
            org.url,
            1024,
            768,
        );

        try {
            await browser.launch();
        } catch (error) {
            const errorMessage = `Error launching browser for organization.`;
            this.logger.error(
                errorMessage + " " + orgId + " " + error,
            );
            await this.organizationService.updateLastScrapedError(
                orgId,
                errorMessage,
            );
            await browser.shutdown();
            throw error;
        }
        this.logger.log(`Launched browser for organization ${orgId}`);

        let scraper: BaseScraper | null = null;

        if (await BoardDocsScraper.checkWillScrape(browser.page)) {
            scraper = new BoardDocsScraper(org.dashboard_id, org.id);
            this.logger.log(`Using BoardDocsScraper for organization ${orgId}`);
        } else if (await GarnetValleyScraper.checkWillScrape(browser.page)) {
            scraper = new GarnetValleyScraper(org.dashboard_id, org.id);
            this.logger.log(
                `Using GarnetValleyScraper for organization ${orgId}`,
            );
        } else if (await PennDelcoScraper.checkWillScrape(browser.page)) {
            scraper = new PennDelcoScraper(org.dashboard_id, org.id);
        } else if (await RidleyScraper.checkWillScrape(browser.page)) {
            scraper = new RidleyScraper(org.dashboard_id, org.id);
            this.logger.log(
                `Using RidleyScraper for organization ${orgId}`,
            );
        }

        if (!scraper) {
            const errorMessage = `No scraper found for organization`;
            this.logger.error(
                errorMessage + " " + orgId,
            );
            await this.organizationService.updateLastScrapedError(
                orgId,
                errorMessage,
            );
            await browser.shutdown();
            return;
        }
        try {
            await scraper.scrape(browser.page);
        } catch (error) {
            let errorMessage = "Unknown error";
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === "string") {
                errorMessage = error;
            } else if (
                error && typeof error === "object" && "message" in error
            ) {
                errorMessage = (error as { message: string }).message;
            }
            await this.organizationService.updateLastScrapedError(
                orgId,
                errorMessage,
            );
            this.logger.error(
                `Error scraping organization ${orgId}: ${errorMessage}`,
            );
            await browser.shutdown();
            return;
        }

        this.logger.log(
            `Scraped data for organization ${orgId}`,
        );

        await browser.shutdown();
        this.logger.log(`Browser shut down for organization ${orgId}`);

        try {
            await scraper.uploadAgendasToStorage(this.meetingsService);
            await this.organizationService.updateLastScrapedDate(
                orgId,
                new Date(),
            );
        } catch (error) {
            let errorMessage = "Unknown error";
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === "string") {
                errorMessage = error;
            } else if (
                error && typeof error === "object" && "message" in error
            ) {
                errorMessage = (error as { message: string }).message;
            }
            await this.organizationService.updateLastScrapedError(
                orgId,
                errorMessage,
            );
        }

        this.logger.log(`Finished job for organization ${orgId}`);

        return {};
    }
}
