import {
    IMeetingDoc,
    MeetingDocumentsService,
} from "@/services/meetingDocuments.service";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";
import deepEqual from "fast-deep-equal";
import { useMeetingId } from "@/hooks/useMeetingId";
import { useEffect } from "react";

interface MeetingDocumentsStoreState {
    meetingDocuments: Record<number, IMeetingDoc>;
    meetingDocumentsLoading: boolean;
    meetingDocumentsError: string | null;
}

interface MeetingDocumentsStoreActions {
    listenToMeetingDocuments: (
        meetingId: number,
    ) => () => void;
    uploadMeetingDocument: (
        userId: string,
        dashboardId: number,
        organizationId: number,
        meetingId: number,
        file: File,
    ) => Promise<number>;
    getMeetingDocumentURL: (
        dashboardId: number,
        organizationId: number,
        meetingId: number,
        filename: string,
    ) => Promise<string>;
    deleteMeetingDocument: (
        userId: string,
        filename: string,
        meetingId: number,
        documentId: number,
    ) => Promise<void>;
}

const defaultMeetingDocumentsStoreState: MeetingDocumentsStoreState = {
    meetingDocuments: {},
    meetingDocumentsLoading: true,
    meetingDocumentsError: null,
};

export const useMeetingDocumentsStore = createWithEqualityFn<
    MeetingDocumentsStoreState & MeetingDocumentsStoreActions
>()(
    immer((set) => ({
        ...defaultMeetingDocumentsStoreState,
        listenToMeetingDocuments: (
            meetingId: number,
        ) => {
            const unsubscribe = MeetingDocumentsService
                .listenToMeetingDocuments(
                    meetingId,
                    (
                        changedMeetingDocuments,
                        deletedMeetingDocumentIds,
                        replaceState,
                    ) => {
                        set((state) => {
                            state.meetingDocumentsLoading = false;
                            if (replaceState) {
                                state.meetingDocuments = {};
                            }
                            for (const doc of changedMeetingDocuments) {
                                state.meetingDocuments[doc.id] = doc;
                            }
                            for (const id of deletedMeetingDocumentIds) {
                                delete state.meetingDocuments[id];
                            }
                        });
                    },
                    (error) => {
                        set((state) => {
                            state.meetingDocumentsLoading = false;
                            state.meetingDocumentsError = error.message;
                        });
                    },
                );
            return () => {
                unsubscribe();
                set(defaultMeetingDocumentsStoreState);
            };
        },
        uploadMeetingDocument: (
            userId: string,
            dashboardId: number,
            organizationId: number,
            meetingId: number,
            file: File,
        ) => {
            return MeetingDocumentsService.uploadMeetingDocument(
                userId,
                dashboardId,
                organizationId,
                meetingId,
                file,
            );
        },
        getMeetingDocumentURL: (
            dashboardId: number,
            organizationId: number,
            meetingId: number,
            filename: string,
        ) => {
            return MeetingDocumentsService.getMeetingDocumentUrl(
                dashboardId,
                organizationId,
                meetingId,
                filename,
            );
        },
        deleteMeetingDocument: (
            userId,
            filename,
            meetingId,
            documentId,
        ) => {
            return MeetingDocumentsService.deleteMeetingDocument(
                userId,
                filename,
                meetingId,
                documentId,
            );
        },
    })),
    deepEqual,
);

export function useSyncMeetingDocuments() {
    const meetingId = useMeetingId();

    const listenToMeetingDocuments = useMeetingDocumentsStore((store) =>
        store.listenToMeetingDocuments
    );

    useEffect(() => {
        return listenToMeetingDocuments(meetingId);
    }, [meetingId, listenToMeetingDocuments]);
}
