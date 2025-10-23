import { Injectable, Logger } from "@nestjs/common";
import { SupabaseClient } from "@supabase/supabase-js";
import { SupabaseService } from "../supabase/supabase.service";
import { Database } from "../types/supabase-generated.types";

export interface NotificationSettingsData {
  enabledNotificationTypes: string[];
  autoWatchNewMeetings?: boolean;
}

@Injectable()
export class NotificationSettingsService {
  private readonly logger = new Logger(NotificationSettingsService.name);
  private readonly supabase: SupabaseClient<Database>;

  constructor(supabaseService: SupabaseService) {
    this.supabase = supabaseService.supabase;
  }

  /**
   * Get notification settings for a user at a specific scope
   * Returns default settings if none exist
   */
  async getNotificationSettings(
    userId: string,
    dashboardId: number | null,
    organizationId: number | null,
    meetingId: number | null,
  ): Promise<NotificationSettingsData> {
    let query = this.supabase
      .from("notification_settings")
      .select("*")
      .eq("user_id", userId);

    if (dashboardId !== null) {
      query = query.eq("dashboard_id", dashboardId);
    } else {
      query = query.is("dashboard_id", null);
    }

    if (organizationId !== null) {
      query = query.eq("organization_id", organizationId);
    } else {
      query = query.is("organization_id", null);
    }

    if (meetingId !== null) {
      query = query.eq("meeting_id", meetingId);
    } else {
      query = query.is("meeting_id", null);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      this.logger.error("Error fetching notification settings:", error);
      throw new Error(`Error fetching notification settings: ${error.message}`);
    }

    // Return default settings if none exist
    if (!data) {
      return {
        enabledNotificationTypes: [],
        autoWatchNewMeetings: false,
      };
    }

    return data.settings as unknown as NotificationSettingsData;
  }

  /**
   * Check if a user has a specific notification type enabled at dashboard level
   */
  async hasNotificationEnabled(
    userId: string,
    dashboardId: number,
    notificationType: string,
  ): Promise<boolean> {
    const settings = await this.getNotificationSettings(
      userId,
      dashboardId,
      null,
      null,
    );

    return settings.enabledNotificationTypes.includes(notificationType);
  }

  /**
   * Check if a user has auto-watch enabled
   */
  async hasAutoWatchEnabled(
    userId: string,
    dashboardId: number,
  ): Promise<boolean> {
    const settings = await this.getNotificationSettings(
      userId,
      dashboardId,
      null,
      null,
    );

    return settings.autoWatchNewMeetings === true;
  }
}
