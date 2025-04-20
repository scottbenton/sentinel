import { InjectQueue } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Queue } from "bullmq";
import { OrganizationsService } from "src/organizations/organizations.service";

@Injectable()
export class ScraperService {
    private readonly logger = new Logger(ScraperService.name);

    constructor(
        @InjectQueue(
            "organization-scrape-queue",
        ) private readonly organizationScrapeQueue: Queue,
        private readonly organizationsService: OrganizationsService,
    ) {}

    async addOrganizationToQueue(
        organizationId: number,
    ): Promise<void> {
        // Placeholder for adding organization to queue logic
        this.logger.log(`Adding organization ${organizationId} to queue`);

        try {
            await this.organizationsService.bulkUpdateSyncPending(
                [organizationId],
                true,
            );
        } catch {
            this.logger.error(
                `Error updating sync pending status for organization ${organizationId}`,
            );
        }
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

    @Cron(CronExpression.EVERY_DAY_AT_1PM, { timeZone: "America/New_York" })
    async runAllSyncJobs() {
        this.logger.log("Running all sync jobs");

        let orgIds = await this.organizationsService.getNextNOrganizationIds(
            100,
        );

        while (orgIds.length > 0) {
            const successfulOrgIds: number[] = [];
            orgIds.forEach((orgId) => {
                this.addOrganizationToQueue(orgId).then(() =>
                    successfulOrgIds.push(orgId)
                ).catch((err) => {
                    this.logger.error(
                        `Error adding organization ${orgId} to queue: ${err}`,
                    );
                });
            });

            try {
                await this.organizationsService.bulkUpdateSyncPending(
                    successfulOrgIds,
                    true,
                );
            } catch {
                this.logger.error(
                    `Error updating sync pending status for organizations: ${
                        successfulOrgIds.join(", ")
                    }`,
                );
            }

            orgIds = await this.organizationsService.getNextNOrganizationIds(
                100,
                orgIds[orgIds.length - 1],
            );
        }

        this.logger.log("All sync jobs added to queue");
    }
}
