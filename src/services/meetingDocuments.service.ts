import { RepositoryError } from "@/repository/_repositoryErrors";
import {
    MeetingDocumentDTO,
    MeetingDocumentsRepository,
} from "@/repository/meetingDocuments.repository";
import { StorageRepository } from "@/repository/storage.repository";
import { LogsService, LogTypes } from "./logs.service";

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

    public static async uploadMeetingDocuments(
        userId: string,
        dashboardId: number,
        organizationId: number,
        meetingId: number,
        files: File[],
    ): Promise<number[]> {
        const documentIds: number[] = [];
        for (const file of files) {
            await StorageRepository.uploadMeetingDocument(
                dashboardId,
                organizationId,
                meetingId,
                file,
            );
            documentIds.push(
                await MeetingDocumentsRepository
                    .uploadMeetingDocument({
                        created_by: userId,
                        meeting_id: meetingId,
                        filename: file.name,
                    }),
            );
        }

        try {
            LogsService.createLog({
                uid: userId,
                organizationId: null,
                meetingId,
                type: LogTypes.MeetingDocumentAdded,
                additionalContext: {
                    document_names: files.map((file) => file.name),
                },
            });
        } catch (error) {
            console.error(error);
        }

        return documentIds;
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
            LogsService.createLog(
                {
                    uid,
                    organizationId: null,
                    meetingId,
                    type: LogTypes.MeetingDocumentDeleted,
                    additionalContext: {
                        document_names: [filename],
                    },
                },
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
