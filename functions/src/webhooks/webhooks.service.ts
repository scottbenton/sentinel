import { Injectable, Logger } from "@nestjs/common";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database, Tables } from "../types/supabase-generated.types";
import { SupabaseService } from "../supabase/supabase.service";
import { WatchersService } from "../watchers/watchers.service";
import { NotificationSettingsService } from "../notification-settings/notification-settings.service";

@Injectable()
export class WebhooksService {
  private readonly supabase: SupabaseClient<Database>;
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    supabaseService: SupabaseService,
    private readonly watchersService: WatchersService,
    private readonly notificationSettingsService: NotificationSettingsService,
  ) {
    this.supabase = supabaseService.supabase;
  }

  async handleDashboardUserInvite(record: Tables<"dashboard_user_invites">) {
    this.logger.log(`Processing invite for email: ${record.email_address}`);

    // Find the user with the email address from the invite
    const { data: user } = await this.supabase
      .from("users")
      .select("id")
      .eq("email_address", record.email_address)
      .single();

    if (!user) {
      this.logger.warn(`No user found for email: ${record.email_address}`);
      return;
    }

    this.logger.debug(`Found user with id: ${user.id}`);

    // Get dashboard name
    const { data: dashboard } = await this.supabase
      .from("dashboards")
      .select("label")
      .eq("id", record.dashboard_id)
      .single();

    // Get inviter's name
    const { data: inviter } = await this.supabase
      .from("users")
      .select("display_name")
      .eq("id", record.invited_by)
      .single();

    this.logger.debug(
      `Creating notification for dashboard: ${dashboard?.label} from inviter: ${inviter?.display_name}`,
    );

    // Create notification
    const { error } = await this.supabase.from("notifications").insert({
      type: "user_invited",
      user_id: user.id,
      created_at: new Date().toISOString(),
      additional_context: {
        dashboard_name: dashboard?.label,
        inviter_name: inviter?.display_name,
        invite_id: record.id,
      },
    });

    if (error) {
      this.logger.error(`Error creating notification: ${error.message}`);
      return;
    }
    this.logger.log(`Successfully created notification for user: ${user.id}`);
  }

  async handleNewUser(record: Tables<"users">) {
    this.logger.log(`Processing new user with email: ${record.email_address}`);

    if (!record.email_address) {
      this.logger.warn("New user has no email address, skipping invite check");
      return;
    }

    // Find any pending invites for this email
    const { data: invites, error: invitesError } = await this.supabase
      .from("dashboard_user_invites")
      .select(
        "*, dashboards(label), users!dashboard_user_invites_invited_by_fkey(display_name)",
      )
      .eq("email_address", record.email_address);

    if (invitesError) {
      this.logger.error(`Error fetching invites: ${invitesError.message}`);
      return;
    }

    if (!invites || invites.length === 0) {
      this.logger.debug(
        `No pending invites found for email: ${record.email_address}`,
      );
      return;
    }

    this.logger.log(
      `Found ${invites.length} pending invites for user ${record.id}`,
    );

    // Create notifications for each invite
    for (const invite of invites) {
      const { error } = await this.supabase.from("notifications").insert({
        type: "user_invited",
        user_id: record.id,
        created_at: new Date().toISOString(),
        additional_context: {
          dashboard_name: invite.dashboards?.label,
          inviter_name: invite.users?.display_name,
          invite_id: invite.id,
        },
      });

      if (error) {
        this.logger.error(
          `Error creating notification for invite ${invite.id}: ${error.message}`,
        );
        continue;
      }

      this.logger.debug(`Created notification for invite ${invite.id}`);
    }

    this.logger.log(
      `Successfully processed notifications for new user ${record.id}`,
    );
  }

  async handleInviteDelete(record: Tables<"dashboard_user_invites">) {
    this.logger.log(`Processing deletion of invite ${record.id}`);

    // Find and delete any notifications related to this invite
    const { error } = await this.supabase
      .from("notifications")
      .delete()
      .eq("additional_context->invite_id", record.id);

    if (error) {
      this.logger.error(`Error deleting notifications: ${error.message}`);
      return;
    }

    this.logger.log(
      `Successfully deleted notifications for invite ${record.id}`,
    );
  }

  /**
   * Handle new meeting insertion
   * 1. Get all watchers of the parent organization
   * 2. For each watcher, check their notification settings
   * 3. If "notify on new meeting" is enabled, create a notification
   * 4. If "auto watch new meetings" is enabled, add them as a watcher
   */
  async handleMeetingInsert(record: Tables<"meetings">) {
    this.logger.log("Handling meeting insert webhook");

    const meetingId = record.id;
    const organizationId = record.organization_id;
    const meetingName = record.name;
    const meetingDate = record.meeting_date;

    // Get the organization to find dashboard_id
    const { data: org, error: orgError } = await this.supabase
      .from("organizations")
      .select("dashboard_id, name")
      .eq("id", organizationId)
      .single();

    if (orgError || !org) {
      this.logger.error("Error fetching organization:", orgError);
      return;
    }

    const dashboardId = org.dashboard_id;
    const organizationName = org.name;

    // Get all watchers of this organization
    const orgWatchers =
      await this.watchersService.getOrganizationWatchers(organizationId);

    this.logger.log(
      `Found ${orgWatchers.length} watchers for organization ${organizationId}`,
    );

    // Process each watcher
    for (const watcher of orgWatchers) {
      const userId = watcher.user_id;

      // Check if user has "notify on new meeting" enabled
      const shouldNotify =
        await this.notificationSettingsService.hasNotificationEnabled(
          userId,
          dashboardId,
          "meeting_created",
        );

      if (shouldNotify) {
        this.logger.log(`Creating notification for user ${userId}`);

        // Create notification
        const { error } = await this.supabase.from("notifications").insert({
          type: "meeting_created",
          user_id: userId,
          log_id: null, // No log yet
          additional_context: {
            meeting_id: meetingId,
            meeting_name: meetingName,
            meeting_date: meetingDate,
            organization_id: organizationId,
            organization_name: organizationName,
          },
        });

        if (error) {
          this.logger.error(
            `Error creating notification for user ${userId}: ${error.message}`,
          );
        }
      }

      // Check if user has "auto watch new meetings" enabled
      const shouldAutoWatch =
        await this.notificationSettingsService.hasAutoWatchEnabled(
          userId,
          dashboardId,
        );

      if (shouldAutoWatch) {
        this.logger.log(`Auto-watching meeting for user ${userId}`);

        try {
          await this.watchersService.addMeetingWatcher(
            userId,
            dashboardId,
            meetingId,
          );
        } catch (error: any) {
          // Ignore duplicate errors (user may already be watching)
          this.logger.warn(`Could not auto-watch meeting: ${error.message}`);
        }
      }
    }
  }

  /**
   * Handle new log insertion
   * Check if it's a comment, and notify watchers if needed
   */
  async handleLogInsert(record: Tables<"logs">) {
    this.logger.log("Handling log insert webhook");

    const logId = record.id;
    const logType = record.type;
    const meetingId = record.meeting_id;
    const organizationId = record.org_id;
    const createdBy = record.created_by;

    // Only process comment logs
    if (logType !== "comment") {
      this.logger.log(`Skipping non-comment log type: ${logType}`);
      return;
    }

    // Determine the context (meeting or organization)
    let watchers: Tables<"watchers">[] = [];
    let dashboardId: number;
    let contextInfo: any = {};

    if (meetingId) {
      // Get meeting info
      const { data: meeting, error: meetingError } = await this.supabase
        .from("meetings")
        .select("organization_id, name, meeting_date")
        .eq("id", meetingId)
        .single();

      if (meetingError || !meeting) {
        this.logger.error("Error fetching meeting:", meetingError);
        return;
      }

      // Get organization info
      const { data: org, error: orgError } = await this.supabase
        .from("organizations")
        .select("dashboard_id, name")
        .eq("id", meeting.organization_id)
        .single();

      if (orgError || !org) {
        this.logger.error("Error fetching organization:", orgError);
        return;
      }

      dashboardId = org.dashboard_id;
      contextInfo = {
        meeting_id: meetingId,
        meeting_name: meeting.name,
        organization_id: meeting.organization_id,
        organization_name: org.name,
      };

      // Get meeting watchers
      watchers = await this.watchersService.getMeetingWatchers(meetingId);
    } else if (organizationId) {
      // Get organization info
      const { data: org, error: orgError } = await this.supabase
        .from("organizations")
        .select("dashboard_id, name")
        .eq("id", organizationId)
        .single();

      if (orgError || !org) {
        this.logger.error("Error fetching organization:", orgError);
        return;
      }

      dashboardId = org.dashboard_id;
      contextInfo = {
        organization_id: organizationId,
        organization_name: org.name,
      };

      // Get organization watchers
      watchers =
        await this.watchersService.getOrganizationWatchers(organizationId);
    } else {
      this.logger.warn("Log has neither meeting_id nor org_id");
      return;
    }

    this.logger.log(`Found ${watchers.length} watchers for log ${logId}`);

    // Notify each watcher (except the comment author)
    for (const watcher of watchers) {
      const userId = watcher.user_id;

      // Don't notify the user who created the comment
      if (userId === createdBy) {
        continue;
      }

      // Check if user has "notify on comment" enabled
      const shouldNotify =
        await this.notificationSettingsService.hasNotificationEnabled(
          userId,
          dashboardId,
          "comment_added",
        );

      if (shouldNotify) {
        this.logger.log(`Creating comment notification for user ${userId}`);

        const { error } = await this.supabase.from("notifications").insert({
          type: "comment_added",
          user_id: userId,
          log_id: logId,
          additional_context: contextInfo,
        });

        if (error) {
          this.logger.error(
            `Error creating comment notification for user ${userId}: ${error.message}`,
          );
        }
      }
    }
  }
}
