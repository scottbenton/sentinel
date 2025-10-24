import {
  NotificationSettingsDTO,
  NotificationSettingsRepository,
  NotificationType,
} from "@/repository/notificationSettings.repository";

export { NotificationType };

export interface INotificationSettings {
  id: number;
  userId: string;
  dashboardId: number | null;
  organizationId: number | null;
  meetingId: number | null;
  enabledNotificationTypes: NotificationType[];
  autoWatchNewMeetings: boolean;
  createdAt: Date;
}

export class NotificationSettingsService {
  /**
   * Convert DTO to domain model
   */
  private static convertDTOToINotificationSettings(
    dto: NotificationSettingsDTO
  ): INotificationSettings {
    const settings = dto.settings as any;
    return {
      id: dto.id,
      userId: dto.user_id,
      dashboardId: dto.dashboard_id,
      organizationId: dto.organization_id,
      meetingId: dto.meeting_id,
      enabledNotificationTypes: settings.enabledNotificationTypes || [],
      autoWatchNewMeetings: settings.autoWatchNewMeetings || false,
      createdAt: new Date(dto.created_at),
    };
  }

  /**
   * Get dashboard-level notification settings
   * Returns default settings if none exist
   */
  public static async getDashboardNotificationSettings(
    userId: string,
    dashboardId: number
  ): Promise<INotificationSettings> {
    const dto = await NotificationSettingsRepository.getDashboardNotificationSettings(
      userId,
      dashboardId
    );

    if (!dto) {
      // Return default settings
      return {
        id: -1, // Sentinel value for "not saved yet"
        userId,
        dashboardId,
        organizationId: null,
        meetingId: null,
        enabledNotificationTypes: [],
        autoWatchNewMeetings: false,
        createdAt: new Date(),
      };
    }

    return this.convertDTOToINotificationSettings(dto);
  }

  /**
   * Update dashboard notification settings
   */
  public static async updateDashboardNotificationSettings(
    userId: string,
    dashboardId: number,
    enabledNotificationTypes: NotificationType[],
    autoWatchNewMeetings: boolean
  ): Promise<INotificationSettings> {
    const dto = await NotificationSettingsRepository.upsertDashboardNotificationSettings(
      userId,
      dashboardId,
      {
        enabledNotificationTypes,
        autoWatchNewMeetings,
      }
    );

    return this.convertDTOToINotificationSettings(dto);
  }
}
