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

    public static async getNotificationSettings(
        params: {
            userId: string;
            dashboardId: number | null;
            organizationId: number | null;
            meetingId: number | null;
        },
    ): Promise<NotificationSettingsDTO | null> {
        const { userId, dashboardId, organizationId, meetingId } = params;

        if (!dashboardId && !organizationId && !meetingId) {
            throw new Error(
                "At least one of dashboardId, organizationId, or meetingId must be provided.",
            );
        }

        const query = this.notificationSettings()
            .select("*")
            .eq("user_id", userId);

        if (dashboardId) {
            query.eq("dashboard_id", dashboardId);
        }
        if (organizationId) {
            query.eq("organization_id", organizationId);
        }
        if (meetingId) {
            query.eq("meeting_id", meetingId);
        }

        const { data, status, error } = await query
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
}
