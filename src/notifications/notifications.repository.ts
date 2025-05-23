import { supabase } from "@/lib/supabase.lib";
import {
    ErrorNoun,
    ErrorVerb,
    getRepositoryError,
    RepositoryError,
} from "@/repository/_repositoryErrors";
import { createSubscription } from "@/repository/_subscriptionManager";
import { Tables, TablesUpdate } from "@/types/supabase-generated.types";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type UserInvitedNotificationDTO = Tables<"notifications"> & {
    type: "user_invited";
    additional_context: {
        invite_id: number;
        inviter_name: string;
        dashboard_name: string;
    };
};
type MeetingCreatedNotificationDTO = Tables<"notifications"> & {
    type: "meeting_created";
};
type CommentAddedNotificationDTO = Tables<"notifications"> & {
    type: "comment_added";
};
type MeetingDocumentAddedNotificationDTO = Tables<"notifications"> & {
    type: "meeting_document_added";
};

export type NotificationDTO =
    | UserInvitedNotificationDTO
    | MeetingCreatedNotificationDTO
    | CommentAddedNotificationDTO
    | MeetingDocumentAddedNotificationDTO;
type UpdateNotificationDTO = TablesUpdate<"notifications">;

export class NotificationsRepository {
    private static notifications = () => supabase.from("notifications");

    public static subscribeToNotifications(
        userId: string,
        onNotifications: (
            changedNotifications: NotificationDTO[],
            deletedNotificationIds: string[],
            replaceState: boolean,
        ) => void,
        onError: (error: RepositoryError) => void,
    ): () => void {
        const loadInitialData = async () => {
            const { data, error, status } = await this.notifications()
                .select().eq("user_id", userId);
            if (error) {
                onError(getRepositoryError(
                    error,
                    ErrorVerb.Read,
                    ErrorNoun.MeetingDocuments,
                    true,
                    status,
                ));
            }
            if (data) {
                onNotifications(
                    data as NotificationDTO[],
                    [],
                    true,
                );
            }
        };

        const onPayload = (
            payload: RealtimePostgresChangesPayload<NotificationDTO>,
        ) => {
            if (
                payload.eventType === "INSERT" || payload.eventType === "UPDATE"
            ) {
                onNotifications(
                    [payload.new],
                    [],
                    false,
                );
            } else if (payload.eventType === "DELETE" && payload.old.id) {
                onNotifications(
                    [],
                    [payload.old.id],
                    false,
                );
            } else {
                onError(getRepositoryError(
                    "Unknown event type",
                    ErrorVerb.Read,
                    ErrorNoun.MeetingDocuments,
                    true,
                ));
            }
        };

        return createSubscription(
            `notifications_${userId}`,
            "notifications",
            `user_id=eq.${userId}`,
            loadInitialData,
            onPayload,
        );
    }

    public static deleteNotification(id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.notifications().delete().eq(
                "id",
                id,
            ).then(({ error, status }) => {
                if (error) {
                    reject(getRepositoryError(
                        error,
                        ErrorVerb.Delete,
                        ErrorNoun.MeetingDocuments,
                        false,
                        status,
                    ));
                } else {
                    resolve();
                }
            });
        });
    }

    public static updateNotification(
        id: string,
        dto: UpdateNotificationDTO,
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            this.notifications().update(dto).eq(
                "id",
                id,
            ).then(({ error, status }) => {
                if (error) {
                    reject(
                        getRepositoryError(
                            error,
                            ErrorVerb.Update,
                            ErrorNoun.MeetingDocuments,
                            false,
                            status,
                        ),
                    );
                } else {
                    resolve();
                }
            });
        });
    }
}
