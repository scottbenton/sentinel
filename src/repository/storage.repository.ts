import { supabase } from "@/lib/supabase.lib";
import { ErrorNoun, ErrorVerb, getRepositoryError } from "./_repositoryErrors";

export class StorageRepository {
    private static meetingDocuments = () =>
        supabase.storage.from("meeting-documents");

    public static async uploadMeetingDocument(
        dashboardId: number,
        organizationId: number,
        meetingId: number,
        file: File,
    ): Promise<void> {
        const { error } = await this.meetingDocuments().upload(
            `${dashboardId}/${organizationId}/${meetingId}/${file.name}`,
            file,
            {
                upsert: true,
            },
        );
        if (error) {
            throw getRepositoryError(
                error,
                ErrorVerb.Upload,
                ErrorNoun.MeetingDocuments,
                false,
            );
        }
    }

    public static async getMeetingDocumentUrl(
        dashboardId: number,
        organizationId: number,
        meetingId: number,
        filename: string,
    ): Promise<string> {
        const { data, error } = await this.meetingDocuments().createSignedUrl(
            `${dashboardId}/${organizationId}/${meetingId}/${filename}`,
            60,
        );
        if (error) {
            throw getRepositoryError(
                error,
                ErrorVerb.Read,
                ErrorNoun.MeetingDocuments,
                false,
            );
        }
        return data.signedUrl;
    }
}
