import {
  WatcherDTO,
  WatchersRepository,
} from "@/repository/watchers.repository";

export interface IWatcher {
  id: number;
  userId: string;
  dashboardId: number;
  organizationId: number | null;
  meetingId: number | null;
  createdAt: Date;
}

export class WatchersService {
  /**
   * Convert DTO to domain model
   */
  private static convertDTOToIWatcher(dto: WatcherDTO): IWatcher {
    return {
      id: dto.id,
      userId: dto.user_id,
      dashboardId: dto.dashboard_id,
      organizationId: dto.organization_id,
      meetingId: dto.meeting_id,
      createdAt: new Date(dto.created_at),
    };
  }

  /**
   * Get all watchers for a user in a dashboard
   */
  public static async getWatchersForUser(userId: string): Promise<IWatcher[]> {
    const dtos = await WatchersRepository.getWatchersForUser(userId);
    return dtos.map(this.convertDTOToIWatcher);
  }

  /**
   * Check if user is watching an organization
   */
  public static async isWatchingOrganization(
    userId: string,
    organizationId: number,
  ): Promise<boolean> {
    return await WatchersRepository.isWatchingOrganization(
      userId,
      organizationId,
    );
  }

  /**
   * Check if user is watching a meeting
   */
  public static async isWatchingMeeting(
    userId: string,
    meetingId: number,
  ): Promise<boolean> {
    return await WatchersRepository.isWatchingMeeting(userId, meetingId);
  }

  /**
   * Toggle watching an organization
   */
  public static async toggleOrganizationWatch(
    userId: string,
    dashboardId: number,
    organizationId: number,
    isCurrentlyWatching: boolean,
  ): Promise<void> {
    if (isCurrentlyWatching) {
      await WatchersRepository.removeOrganizationWatcher(
        userId,
        organizationId,
      );
    } else {
      await WatchersRepository.addOrganizationWatcher(
        userId,
        dashboardId,
        organizationId,
      );
    }
  }

  /**
   * Toggle watching a meeting
   */
  public static async toggleMeetingWatch(
    userId: string,
    dashboardId: number,
    meetingId: number,
    isCurrentlyWatching: boolean,
  ): Promise<void> {
    if (isCurrentlyWatching) {
      await WatchersRepository.removeMeetingWatcher(userId, meetingId);
    } else {
      await WatchersRepository.addMeetingWatcher(
        userId,
        dashboardId,
        meetingId,
      );
    }
  }

  /**
   * Subscribe to watchers
   */
  public static subscribeToWatchers(
    userId: string,
    onUpdate: (
      watchers: IWatcher[],
      type: "initial" | "insert" | "delete",
    ) => void,
  ): () => void {
    return WatchersRepository.subscribeToWatchers(userId, (dtos, type) => {
      const watchers = dtos.map(this.convertDTOToIWatcher);
      onUpdate(watchers, type);
    });
  }
}
