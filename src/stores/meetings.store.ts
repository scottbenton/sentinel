import { createWithEqualityFn } from "zustand/traditional";
import { immer } from "zustand/middleware/immer";
import deepEqual from "fast-deep-equal";
import { IMeeting, MeetingsService } from "@/services/meetings.service";
import { useOrganizationsStore } from "./organizations.store";
import { useEffect } from "react";

interface MeetingsStoreState {
  futureMeetings: Record<number, IMeeting>;
  loadedPastMeetings: Record<number, IMeeting>;
  loadingFutureMeetings: boolean;
  futureMeetingsError: string | null;
}
interface MeetingsStoreActions {
  listenToFutureMeetings: (organizationIds: number[]) => () => void;
  listenToPastMeetings: (organizationIds: number[]) => () => void;
  createMeeting: (
    uid: string,
    organizationId: number,
    meetingName: string,
    meetingDate: Date,
  ) => Promise<number>;
  updateMeeting: (
    meetingId: number,
    meetingName: string,
    meetingDate: Date,
  ) => Promise<void>;
  deleteMeeting: (meetingId: number) => Promise<void>;
  resetStore: () => void;
}

const defaultState: MeetingsStoreState = {
  futureMeetings: {},
  loadingFutureMeetings: true,
  futureMeetingsError: null,

  loadedPastMeetings: {},
};

export const useMeetingsStore = createWithEqualityFn<
  MeetingsStoreState & MeetingsStoreActions
>()(
  immer((set) => ({
    ...defaultState,
    listenToFutureMeetings: (organizationIds) => {
      return MeetingsService.listenToFutureMeetings(
        organizationIds,
        (changedMeetings, deletedMeetingIds, replaceState) => {
          set((state) => {
            if (replaceState) {
              state.futureMeetings = {};
            }
            changedMeetings.forEach((meeting) => {
              state.futureMeetings[meeting.id] = meeting;
            });
            deletedMeetingIds.forEach((id) => {
              delete state.futureMeetings[id];
            });
          });
        },
        (error) => {
          set((state) => {
            state.futureMeetingsError = error.message;
          });
        },
      );
    },
    listenToPastMeetings: (organizationIds) => {
      return MeetingsService.listenToPastMeetings(
        organizationIds,
        (changedMeetings, deletedMeetingIds, replaceState) => {
          set((state) => {
            if (replaceState) {
              state.loadedPastMeetings = {};
            }
            changedMeetings.forEach((meeting) => {
              state.loadedPastMeetings[meeting.id] = meeting;
            });
            deletedMeetingIds.forEach((id) => {
              delete state.loadedPastMeetings[id];
            });
          });
        },
        (error) => {
          set((state) => {
            state.futureMeetingsError = error.message;
          });
        },
      );
    },

    createMeeting: async (uid, organizationId, meetingName, meetingDate) => {
      return MeetingsService.createMeeting(
        uid,
        organizationId,
        meetingName,
        meetingDate,
      );
    },
    updateMeeting: async (meetingId, meetingName, meetingDate) => {
      return MeetingsService.updateMeeting(meetingId, meetingName, meetingDate);
    },
    deleteMeeting: async (meetingId) => {
      return MeetingsService.deleteMeeting(meetingId);
    },

    resetStore: () => {
      set(defaultState);
    },
  })),
  deepEqual,
);

export function useSyncFutureMeetings() {
  const organizationIds = useOrganizationsStore((store) =>
    Object.keys(store.organizations).map((id) => parseInt(id)),
  );
  const listenToFutureMeetings = useMeetingsStore(
    (store) => store.listenToFutureMeetings,
  );
  useEffect(() => {
    const unsubscribe = listenToFutureMeetings(organizationIds);
    return () => {
      unsubscribe();
    };
  }, [organizationIds, listenToFutureMeetings]);
}
