import { AuthGuard } from "@/auth/auth.guard";
import { DashboardUsersService } from "@/dashboard_users/dashboard_users.service";
import { OrganizationsService } from "@/organizations/organizations.service";
import {
    Controller,
    Logger,
    Param,
    Post,
    Request,
    UseGuards,
} from "@nestjs/common";

@UseGuards(AuthGuard)
@Controller("scraper")
export class ScraperController {
    private readonly logger = new Logger(ScraperController.name);

    constructor(
        private readonly organizationService: OrganizationsService,
        private readonly dashboardUsersService: DashboardUsersService,
    ) {}

    @Post(":organizationId")
    async scrapeOrganizationPage(
        @Request() req,
        @Param("organizationId") organizationId: number,
    ): Promise<void> {
        const org = await this.organizationService.getOrganizationFromId(
            organizationId,
        );

        const url = org.url;
        const name = org.name;

        this.logger.log(req.user);

        // const isUserMeetingAdmin = await this.dashboardUsersService.checkUserIsUserMeetingAdmin(
        //     org.user_id,
        //     org.dashboard_id,
        // );
    }
}
