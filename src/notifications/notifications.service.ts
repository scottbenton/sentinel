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

export type INotification = UserInvitationNotification;

export class NotificationsService {
    public static async deleteNotification(id: string) {
        return NotificationsRepository.deleteNotification(id);
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
                    changedNotifications.map(
                        this.convertNotificationDTOToINotification,
                    ).filter((not) => not !== null),
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
        const context = notification.additional_context;

        if (notification.type === "user_invited" && context) {
            return {
                id: notification.id,
                type: NotificationType.UserInvitation,
                inviteId: context.invite_id,
                inviterName: context.inviter_name,
                dashboardName: context.dashboard_name,
                createdAt: new Date(notification.created_at),
                hasBeenRead: notification.has_been_read,
            };
        }
        return null;
    }

    public static markNotificationAsRead(id: string) {
        NotificationsRepository.updateNotification(id, {
            has_been_read: true,
        });
    }
}
