import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger, Scope } from "@nestjs/common";
import { Job } from "bullmq";
import { Browser } from "src/browser.class";
import { OrganizationsService } from "src/organizations/organizations.service";
import { BaseScraper } from "./scrapers/BaseScraper";
import { BoardDocsScraper } from "./scrapers/BoardDocs.scraper";
import { MeetingsService } from "src/meetings/meetings.service";

@Processor({ name: "organization-scrape-queue", scope: Scope.REQUEST })
export class ScraperProcessor extends WorkerHost {
    private readonly logger = new Logger(ScraperProcessor.name);

    constructor(
        private readonly organizationService: OrganizationsService,
        private readonly meetingsService: MeetingsService,
    ) {
        super();
    }

    async process(job: Job<any, any, string>) {
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
        await browser.launch();
        this.logger.log(`Launched browser for organization ${orgId}`);

        let scraper: BaseScraper | null = null;

        if (await BoardDocsScraper.checkWillScrape(browser.page)) {
            scraper = new BoardDocsScraper(org.dashboard_id, org.id);
            this.logger.log(`Using BoardDocsScraper for organization ${orgId}`);
        }

        if (!scraper) {
            this.logger.error(
                `No scraper found for organization ${orgId}`,
            );
            throw new Error(
                `No scraper found for organization ${orgId}`,
            );
        }

        await scraper.scrape(browser.page);

        this.logger.log(
            `Scraped data for organization ${orgId}`,
        );

        await browser.shutdown();
        this.logger.log(`Browser shut down for organization ${orgId}`);

        await scraper.uploadAgendasToStorage(this.meetingsService);

        this.logger.log(`Finished job for organization ${orgId}`);

        return {};
    }
}
