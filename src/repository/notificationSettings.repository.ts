import { supabase } from "@/lib/supabase.lib";
import {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/types/supabase-generated.types";
import { ErrorNoun, ErrorVerb, getRepositoryError } from "./_repositoryErrors";

export enum NotificationType {
  MeetingCreated = "meeting_created",
  CommentAdded = "comment_added",
  MeetingDocumentAdded = "meeting_document_added",
  UserInvited = "user_invited",
}
// The notification settings JSON column should contain the following object:
/**
 * {
 *  enabledNotificationTypes: NotificationType[],
 * }
 */

export type NotificationSettingsDTO = Tables<"notification_settings">;
type NotificationSettingsInsertDTO = TablesInsert<"notification_settings">;
type NotificationSettingsUpdateDTO = TablesUpdate<"notification_settings">;

export class NotificationSettingsRepository {
  private static notificationSettings = () =>
    supabase.from("notification_settings");

  public static async getNotificationSettings(params: {
    userId: string;
    dashboardId: number | null;
    organizationId: number | null;
    meetingId: number | null;
  }): Promise<NotificationSettingsDTO | null> {
    const { userId, dashboardId, organizationId, meetingId } = params;

    if (!dashboardId && !organizationId && !meetingId) {
      throw new Error(
        "At least one of dashboardId, organizationId, or meetingId must be provided.",
      );
    }

    const query = this.notificationSettings().select("*").eq("user_id", userId);

    if (dashboardId) {
      query.eq("dashboard_id", dashboardId);
    }
    if (organizationId) {
      query.eq("organization_id", organizationId);
    }
    if (meetingId) {
      query.eq("meeting_id", meetingId);
    }

    const { data, status, error } = await query.maybeSingle();

    if (error) {
      throw getRepositoryError(
        error,
        ErrorVerb.Read,
        ErrorNoun.NotificationSettings,
        false,
        status,
      );
    }

    return data;
  }

  public static async insertNotificationSettings(
    insertDTO: NotificationSettingsInsertDTO,
  ): Promise<NotificationSettingsDTO> {
    const { data, error, status } = await this.notificationSettings()
      .insert(insertDTO)
      .select("*")
      .single();

    if (error) {
      throw getRepositoryError(
        error,
        ErrorVerb.Create,
        ErrorNoun.NotificationSettings,
        false,
        status,
      );
    }

    return data;
  }

  public static async updateNotificationSettings(
    settingsId: number,
    updateDTO: NotificationSettingsUpdateDTO,
  ): Promise<NotificationSettingsDTO> {
    const { data, error, status } = await this.notificationSettings()
      .update(updateDTO)
      .eq("id", settingsId)
      .select("*")
      .single();

    if (error) {
      throw getRepositoryError(
        error,
        ErrorVerb.Update,
        ErrorNoun.NotificationSettings,
        false,
        status,
      );
    }

    return data;
  }

  /**
   * Get notification settings for a user at the dashboard level
   * This is the primary settings location for the new features
   */
  public static async getDashboardNotificationSettings(
    userId: string,
    dashboardId: number,
  ): Promise<NotificationSettingsDTO | null> {
    const { data, status, error } = await this.notificationSettings()
      .select("*")
      .eq("user_id", userId)
      .eq("dashboard_id", dashboardId)
      .is("organization_id", null)
      .is("meeting_id", null)
      .maybeSingle();

    if (error) {
      throw getRepositoryError(
        error,
        ErrorVerb.Read,
        ErrorNoun.NotificationSettings,
        false,
        status,
      );
    }

    return data;
  }

  /**
   * Create or update dashboard-level notification settings
   */
  public static async upsertDashboardNotificationSettings(
    userId: string,
    dashboardId: number,
    settings: {
      enabledNotificationTypes: NotificationType[];
      autoWatchNewMeetings?: boolean;
    },
  ): Promise<NotificationSettingsDTO> {
    // First, try to find existing settings
    const existing = await this.getDashboardNotificationSettings(
      userId,
      dashboardId,
    );

    if (existing) {
      // Update existing
      return await this.updateNotificationSettings(existing.id, {
        settings: settings as any,
      });
    } else {
      // Insert new
      return await this.insertNotificationSettings({
        user_id: userId,
        dashboard_id: dashboardId,
        organization_id: null,
        meeting_id: null,
        settings: settings as any,
      });
    }
  }
}
