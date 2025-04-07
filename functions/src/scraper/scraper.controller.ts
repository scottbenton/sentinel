import { AuthGuard } from "../auth/auth.guard";
import { DashboardUsersService } from "../dashboard_users/dashboard_users.service";
import { OrganizationsService } from "../organizations/organizations.service";
import {
    Controller,
    Logger,
    Param,
    Post,
    Request,
    UseGuards,
} from "@nestjs/common";
import { ScraperService } from "./scraper.service";

@UseGuards(AuthGuard)
@Controller("scraper")
export class ScraperController {
    private readonly logger = new Logger(ScraperController.name);

    constructor(
        private readonly organizationService: OrganizationsService,
        private readonly dashboardUsersService: DashboardUsersService,
        private readonly scraperService: ScraperService,
    ) {}

    @Post(":organizationId")
    async scrapeOrganizationPage(
        @Request() req,
        @Param("organizationId") organizationId: number,
    ): Promise<void> {
        const userId = req.user?.sub;
        this.logger.log(userId);
        if (!userId) {
            this.logger.error("User ID is not available in the request");
            throw new Error("User ID is not available in the request");
        }

        const org = await this.organizationService.getOrganizationFromId(
            organizationId,
        );

        const isUserMeetingAdmin = await this.dashboardUsersService
            .checkUserIsUserMeetingAdmin(
                userId,
                org.dashboard_id,
            );

        if (!isUserMeetingAdmin) {
            this.logger.error(
                `User ${userId} is not an admin of the organization ${organizationId}`,
            );
            throw new Error(
                `User ${userId} is not an admin of the organization ${organizationId}`,
            );
        }
        this.logger.log(
            `User ${userId} is an admin of the organization ${organizationId}`,
        );

        await this.scraperService.addOrganizationToQueue(
            organizationId,
        );
    }
}
