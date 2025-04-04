import { InjectQueue } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { Queue } from "bullmq";

@Injectable()
export class ScraperService {
    private readonly logger = new Logger(ScraperService.name);

    constructor(
        @InjectQueue(
            "organization-scrape-queue",
        ) private readonly organizationScrapeQueue: Queue,
    ) {}

    async addOrganizationToQueue(
        organizationId: number,
    ): Promise<void> {
        // Placeholder for adding organization to queue logic
        this.logger.log(`Adding organization ${organizationId} to queue`);

        await this.organizationScrapeQueue.add(
            "scrape-organization",
            { organizationId },
            {
                jobId: `organization-${organizationId}`,
                removeOnComplete: true,
                removeOnFail: true,
            },
        );
    }
}
