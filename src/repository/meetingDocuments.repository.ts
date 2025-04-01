import { supabase } from "@/lib/supabase.lib";
import {
    Tables,
    TablesInsert,
    TablesUpdate,
} from "@/types/supabase-generated.types";
import {
    ErrorNoun,
    ErrorVerb,
    getRepositoryError,
    RepositoryError,
} from "./_repositoryErrors";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { createSubscription } from "./_subscriptionManager";

export type MeetingDocumentDTO = Tables<"meeting_documents">;
export type InsertMeetingDocumentDTO = TablesInsert<"meeting_documents">;
export type UpdateMeetingDocumentDTO = TablesUpdate<"meeting_documents">;

export class MeetingDocumentsRepository {
    private static meetingDocuments = () => supabase.from("meeting_documents");

    public static listenToMeetingDocuments(
        meetingId: number,
        onMeetingDocumentChanges: (
            changedMeetingDocuments: MeetingDocumentDTO[],
            deletedMeetingDocumentIds: number[],
            replaceState: boolean,
        ) => void,
        onError: (error: RepositoryError) => void,
    ): () => void {
        const loadInitialData = async () => {
            const { data, error, status } = await this.meetingDocuments()
                .select().eq("meeting_id", meetingId);
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
                onMeetingDocumentChanges(
                    data,
                    [],
                    true,
                );
            }
        };

        const onPayload = (
            payload: RealtimePostgresChangesPayload<MeetingDocumentDTO>,
        ) => {
            if (
                payload.eventType === "INSERT" || payload.eventType === "UPDATE"
            ) {
                onMeetingDocumentChanges(
                    [payload.new],
                    [],
                    false,
                );
            } else if (payload.eventType === "DELETE" && payload.old.id) {
                onMeetingDocumentChanges(
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
            `meeting_documents:meeting_id=eq.${meetingId}`,
            "meeting_documents",
            `meeting_id=eq.${meetingId}`,
            loadInitialData,
            onPayload,
        );
    }

    public static async uploadMeetingDocument(
        dto: InsertMeetingDocumentDTO,
    ): Promise<number> {
        const { data, error, status } = await this.meetingDocuments().insert([
            dto,
        ]).select().single();
        if (error) {
            throw getRepositoryError(
                error,
                ErrorVerb.Create,
                ErrorNoun.MeetingDocuments,
                false,
                status,
            );
        }
        return data.id;
    }

    public static async deleteMeetingDocument(
        id: number,
    ): Promise<void> {
        const { error, status } = await this.meetingDocuments().delete().eq(
            "id",
            id,
        );
        if (error) {
            throw getRepositoryError(
                error,
                ErrorVerb.Delete,
                ErrorNoun.MeetingDocuments,
                false,
                status,
            );
        }
    }
}
