import {
  NotificationDTO,
  NotificationsRepository,
} from "./notifications.repository";
import { RepositoryError } from "@/repository/_repositoryErrors";

export enum NotificationType {
  UserInvitation = "user_invited",
  MeetingCreated = "meeting_created",
  CommentAdded = "comment_added",
  MeetingDocumentAdded = "meeting_document_added",
}

interface NotificationContext {
  invite_id?: number;
  inviter_name?: string;
  dashboard_name?: string;
  dashboard_id?: number;
  meeting_id?: number;
  meeting_name?: string;
  meeting_date?: string;
  organization_id?: number;
  organization_name?: string;
}

interface BaseNotification {
  id: string;
  type: NotificationType;
  createdAt: Date;
  hasBeenRead: boolean;
}

interface UserInvitationNotification extends BaseNotification {
  type: NotificationType.UserInvitation;
  inviteId: number;
  inviterName: string;
  dashboardName: string;
}

interface MeetingCreatedNotification extends BaseNotification {
  type: NotificationType.MeetingCreated;
  dashboardId: number;
  meetingId: number;
  meetingName: string;
  meetingDate: string;
  organizationId: number;
  organizationName: string;
}

interface CommentAddedNotification extends BaseNotification {
  type: NotificationType.CommentAdded;
  logId: number;
  dashboardId: number;
  meetingId?: number;
  meetingName?: string;
  organizationId: number;
  organizationName?: string;
}

interface MeetingDocumentAddedNotification extends BaseNotification {
  type: NotificationType.MeetingDocumentAdded;
  logId: number;
  dashboardId: number;
  meetingId: number;
  meetingName: string;
  organizationId: number;
  organizationName: string;
}

export type INotification =
  | UserInvitationNotification
  | MeetingCreatedNotification
  | CommentAddedNotification
  | MeetingDocumentAddedNotification;

export class NotificationsService {
  public static async deleteNotification(id: string) {
    return NotificationsRepository.deleteNotification(id);
  }

  public static async deleteAllNotifications(userId: string) {
    return NotificationsRepository.deleteAllNotifications(userId);
  }

  public static subscribeToNotifications(
    userId: string,
    onNotifications: (
      changedNotifications: INotification[],
      deletedNotificationIds: string[],
      replaceState: boolean,
    ) => void,
    onError: (error: RepositoryError) => void,
  ) {
    return NotificationsRepository.subscribeToNotifications(
      userId,
      (changedNotifications, deletedIds, replaceState) => {
        onNotifications(
          changedNotifications
            .map(this.convertNotificationDTOToINotification)
            .filter((not) => not !== null),
          deletedIds,
          replaceState,
        );
      },
      onError,
    );
  }

  private static convertNotificationDTOToINotification(
    notification: NotificationDTO,
  ): INotification | null {
    const baseNotification = {
      id: notification.id,
      createdAt: new Date(notification.created_at),
      hasBeenRead: notification.has_been_read,
    };

    const context = notification.additional_context as NotificationContext;

    if (notification.type === "user_invited") {
      if (
        !context.invite_id ||
        !context.inviter_name ||
        !context.dashboard_name
      ) {
        return null;
      }
      return {
        ...baseNotification,
        type: NotificationType.UserInvitation,
        inviteId: context.invite_id,
        inviterName: context.inviter_name,
        dashboardName: context.dashboard_name,
      };
    } else if (notification.type === "meeting_created") {
      if (
        !context.dashboard_id ||
        !context.meeting_id ||
        !context.meeting_name ||
        !context.meeting_date ||
        !context.organization_id ||
        !context.organization_name
      ) {
        return null;
      }
      return {
        ...baseNotification,
        type: NotificationType.MeetingCreated,
        dashboardId: context.dashboard_id,
        meetingId: context.meeting_id,
        meetingName: context.meeting_name,
        meetingDate: context.meeting_date,
        organizationId: context.organization_id,
        organizationName: context.organization_name,
      };
    } else if (notification.type === "comment_added") {
      if (
        !context.dashboard_id ||
        !context.organization_id ||
        !context.organization_name
      ) {
        return null;
      }
      return {
        ...baseNotification,
        type: NotificationType.CommentAdded,
        logId: notification.log_id!,
        dashboardId: context.dashboard_id,
        meetingId: context.meeting_id,
        meetingName: context.meeting_name,
        organizationId: context.organization_id,
        organizationName: context.organization_name,
      };
    } else if (notification.type === "meeting_document_added") {
      if (
        !context.dashboard_id ||
        !context.meeting_id ||
        !context.meeting_name ||
        !context.organization_id ||
        !context.organization_name
      ) {
        return null;
      }
      return {
        ...baseNotification,
        type: NotificationType.MeetingDocumentAdded,
        logId: notification.log_id!,
        dashboardId: context.dashboard_id,
        meetingId: context.meeting_id,
        meetingName: context.meeting_name,
        organizationId: context.organization_id,
        organizationName: context.organization_name,
      };
    }
    return null;
  }

  public static markNotificationAsRead(id: string) {
    NotificationsRepository.updateNotification(id, {
      has_been_read: true,
    });
  }

  /**
   * Mark multiple notifications as read by their IDs
   */
  public static async markNotificationsAsReadByIds(
    notificationIds: string[],
  ): Promise<void> {
    await NotificationsRepository.markNotificationsAsReadByIds(notificationIds);
  }

  /**
   * Mark all unread notifications for a specific meeting as read
   */
  public static async markMeetingNotificationsAsRead(
    userId: string,
    meetingId: number,
  ): Promise<void> {
    await NotificationsRepository.markMeetingNotificationsAsRead(
      userId,
      meetingId,
    );
  }

  /**
   * Mark all unread notifications for a specific organization as read
   */
  public static async markOrganizationNotificationsAsRead(
    userId: string,
    organizationId: number,
  ): Promise<void> {
    await NotificationsRepository.markOrganizationNotificationsAsRead(
      userId,
      organizationId,
    );
  }
}
