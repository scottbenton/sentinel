import { Tables } from "src/types/supabase-generated.types";
import { AuthGuard } from "../auth/auth.guard";
import { DashboardUsersService } from "./dashboard_users.service";
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
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

  @Post("/invite/:inviteId/accept")
  async acceptInvite(
    @Request() req,
    @Param("inviteId") inviteId: number,
  ): Promise<{ dashboardId: number }> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const userId: string = req.user?.sub;
    this.logger.log(userId);
    if (!userId) {
      this.logger.error("User ID is not available in the request");
      throw new HttpException(
        "User token was not valid",
        HttpStatus.UNAUTHORIZED,
      );
    }

    let invite: Tables<"dashboard_user_invites">;
    let user: Tables<"users">;

    try {
      invite = await this.dashboardUsersService.getInvite(inviteId);
    } catch {
      this.logger.error(`Invite ${inviteId} not found`);
      throw new HttpException(
        `Invite not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    try {
      user = await this.dashboardUsersService.getUser(userId);
    } catch {
      this.logger.error(`User ${userId} not found`);
      throw new HttpException(
        `User not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (invite.email_address !== user.email_address) {
      this.logger.error(
        `User ${userId} is not the target of the invite ${inviteId}`,
      );
      throw new HttpException(
        `The email address for this invite does not match the current user's email address.`,
        HttpStatus.FORBIDDEN,
      );
    }

    this.logger.log(
      `User ${userId} is the target of the invite ${inviteId}`,
    );
    try {
      await this.dashboardUsersService.addUserToDashboard(
        userId,
        invite.dashboard_id,
      );
    } catch {
      this.logger.error(
        `Error adding user ${userId} to dashboard ${invite.dashboard_id}`,
      );
      throw new HttpException(
        `Error adding user to dashboard`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    try {
      await this.dashboardUsersService.deleteInvite(inviteId);
    } catch {
      this.logger.error(
        `Error deleting invite ${inviteId} for user ${userId}`,
      );
    }
    return { dashboardId: invite.dashboard_id };
  }
}
