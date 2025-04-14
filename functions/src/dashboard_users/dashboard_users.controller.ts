import { AuthGuard } from "../auth/auth.guard";
import { DashboardUsersService } from "./dashboard_users.service";
import {
  Body,
  Controller,
  Logger,
  Param,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ArrayNotEmpty, IsArray } from "class-validator";
class InviteUserDTO {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsArray()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @ArrayNotEmpty()
  emailAddresses: string[];
}

@UseGuards(AuthGuard)
@Controller("dashboard-users")
export class DashboardUsersController {
  private readonly logger = new Logger(DashboardUsersController.name);

  constructor(private readonly dashboardUsersService: DashboardUsersService) {}

  @Post(":dashboardId")
  async inviteUsersToOrganization(
    @Request() req,
    @Param("dashboardId") dashboardId: number,
    @Body() inviteUsersDTO: InviteUserDTO,
  ): Promise<Record<string, number>> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const userId: string = req.user?.sub;
    this.logger.log(userId);
    if (!userId) {
      this.logger.error("User ID is not available in the request");
      throw new Error("User ID is not available in the request");
    }
    const isUserUserAdmin = await this.dashboardUsersService
      .checkUserIsUserUserAdmin(
        userId,
        dashboardId,
      );

    if (!isUserUserAdmin) {
      this.logger.error(
        `User ${userId} is not an admin of the organization ${dashboardId}`,
      );
      throw new Error(
        `User ${userId} is not an admin of the organization ${dashboardId}`,
      );
    }
    this.logger.log(
      `User ${userId} is an admin of the organization ${dashboardId}`,
    );

    const { existingInvites, nonPreExistingInvites } = await this
      .dashboardUsersService.getExistingInvitesIfExists(
        dashboardId,
        inviteUsersDTO.emailAddresses,
      );

    let inviteKeys: Record<string, number> = {
      ...existingInvites,
    };

    if (nonPreExistingInvites.length > 0) {
      const createdInviteKeys = await this.dashboardUsersService.createInvites(
        dashboardId,
        nonPreExistingInvites,
        userId,
      );
      inviteKeys = {
        ...inviteKeys,
        ...createdInviteKeys,
      };
    }

    this.logger.log(
      `User ${userId} invited ${inviteUsersDTO.emailAddresses.length} users to the organization ${dashboardId}`,
    );

    this.logger.log("Sending emails");
    for (const email of Object.keys(inviteKeys)) {
      this.logger.log(`Sending email to ${email}`);
      await this.dashboardUsersService.sendInviteEmail(
        email,
        inviteKeys[email],
        dashboardId,
      );
    }
    this.logger.log("Emails sent");
    return inviteKeys;
  }
}
