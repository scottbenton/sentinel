import { RepositoryError } from "@/repository/_repositoryErrors";
import {
    MeetingDocumentDTO,
    MeetingDocumentsRepository,
} from "@/repository/meetingDocuments.repository";
import { StorageRepository } from "@/repository/storage.repository";
import { MeetingLogsService, MeetingLogTypes } from "./meetingLogs.service";

export interface IMeetingDoc {
    id: number;
    meetingId: number;

    filename: string;
    hash: string | null;
    uploadedOn: Date;
    uploadedBy: string | null;
}

export class MeetingDocumentsService {
    public static listenToMeetingDocuments(
        meetingId: number,
        onMeetingDocumentChanges: (
            changedMeetingDocuments: IMeetingDoc[],
            deletedMeetingDocumentIds: number[],
            replaceState: boolean,
        ) => void,
        onError: (error: RepositoryError) => void,
    ): () => void {
        return MeetingDocumentsRepository.listenToMeetingDocuments(
            meetingId,
            (documents, deletedIds, replaceState) => {
                onMeetingDocumentChanges(
                    documents.map(this.convertMeetingDocumentDTOToIMeetingDoc),
                    deletedIds,
                    replaceState,
                );
            },
            onError,
        );
    }

    public static async uploadMeetingDocument(
        userId: string,
        dashboardId: number,
        organizationId: number,
        meetingId: number,
        file: File,
    ): Promise<number> {
        await StorageRepository.uploadMeetingDocument(
            dashboardId,
            organizationId,
            meetingId,
            file,
        );
        const documentId = await MeetingDocumentsRepository
            .uploadMeetingDocument({
                created_by: userId,
                meeting_id: meetingId,
                filename: file.name,
            });

        try {
            MeetingLogsService.createLog(
                userId,
                meetingId,
                `uploaded ${file.name} to this meeting`,
                MeetingLogTypes.Lifecycle,
            );
        } catch (error) {
            console.error(error);
        }

        return documentId;
    }

    public static getMeetingDocumentUrl(
        dashboardId: number,
        organizationId: number,
        meetingId: number,
        filename: string,
    ): Promise<string> {
        return StorageRepository.getMeetingDocumentUrl(
            dashboardId,
            organizationId,
            meetingId,
            filename,
        );
    }

    public static async deleteMeetingDocument(
        uid: string,
        filename: string,
        meetingId: number,
        documentId: number,
    ): Promise<void> {
        try {
            MeetingLogsService.createLog(
                uid,
                meetingId,
                `deleted ${filename} from this meeting`,
                MeetingLogTypes.Lifecycle,
            );
        } catch (error) {
            console.error(error);
        }
        await MeetingDocumentsRepository.deleteMeetingDocument(documentId);
    }

    private static convertMeetingDocumentDTOToIMeetingDoc(
        meetingDocument: MeetingDocumentDTO,
    ): IMeetingDoc {
        return {
            id: meetingDocument.id,
            meetingId: meetingDocument.meeting_id,
            filename: meetingDocument.filename,
            hash: meetingDocument.file_hash,
            uploadedOn: new Date(meetingDocument.created_at),
            uploadedBy: meetingDocument.created_by,
        };
    }
}
