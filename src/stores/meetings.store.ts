import { createWithEqualityFn } from "zustand/traditional";
import { immer } from "zustand/middleware/immer";
import deepEqual from "fast-deep-equal";
import { IMeeting, MeetingsService } from "@/services/meetings.service";
import { useOrganizationsStore } from "./organizations.store";
import { useEffect } from "react";
import { useMeetingId } from "@/hooks/useMeetingId";

interface MeetingsStoreState {
  meetings: Record<number, IMeeting>;
  futureMeetings: Record<number, IMeeting>;
  loadingFutureMeetings: boolean;
  futureMeetingsError: string | null;

  loadedPastMeetings: Record<number, IMeeting>;

  currentMeeting: IMeeting | null;
  loadingCurrentMeeting: boolean;
  currentMeetingError: string | null;
}
interface MeetingsStoreActions {
  listenToFutureMeetings: (organizationIds: number[]) => () => void;
  listenToPastMeetings: (organizationIds: number[]) => () => void;
  listenToCurrentMeeting: (meetingId: number) => () => void;
  createMeeting: (
    uid: string,
    organizationId: number,
    meetingName: string,
    meetingDate: Date,
  ) => Promise<number>;
  updateMeeting: (
    uid: string,
    meetingId: number,
    meetingName: string,
    meetingDate: Date,
  ) => Promise<void>;
  deleteMeeting: (meetingId: number) => Promise<void>;
  resetStore: () => void;
}

const defaultState: MeetingsStoreState = {
  meetings: {},
  futureMeetings: {},
  loadingFutureMeetings: true,
  futureMeetingsError: null,

  loadedPastMeetings: {},

  currentMeeting: null,
  loadingCurrentMeeting: true,
  currentMeetingError: null,
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
            state.loadingFutureMeetings = false;
            state.futureMeetingsError = null;
            if (replaceState) {
              state.futureMeetings = {};
              state.meetings = { ...state.loadedPastMeetings };
            }
            changedMeetings.forEach((meeting) => {
              state.futureMeetings[meeting.id] = meeting;
              state.meetings[meeting.id] = meeting;
            });
            deletedMeetingIds.forEach((id) => {
              delete state.futureMeetings[id];
              delete state.meetings[id];
            });
          });
        },
        (error) => {
          set((state) => {
            state.loadingFutureMeetings = false;
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
              state.meetings = { ...state.futureMeetings };
              state.loadedPastMeetings = {};
            }
            changedMeetings.forEach((meeting) => {
              state.loadedPastMeetings[meeting.id] = meeting;
              state.meetings[meeting.id] = meeting;
            });
            deletedMeetingIds.forEach((id) => {
              delete state.loadedPastMeetings[id];
              delete state.meetings[id];
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

    listenToCurrentMeeting: (meetingId) => {
      const unsubscribe = MeetingsService.listenToMeeting(
        meetingId,
        (meeting) => {
          set((store) => {
            store.currentMeeting = meeting;
            store.loadingCurrentMeeting = false;
            store.currentMeetingError = null;
          });
        },
        (error) => {
          set((state) => {
            state.loadingCurrentMeeting = false;
            state.currentMeetingError = error.message;
          });
        },
      );

      return () => {
        unsubscribe();
        set((store) => {
          store.currentMeeting = null;
          store.loadingCurrentMeeting = true;
          store.currentMeetingError = null;
        });
      };
    },

    createMeeting: async (uid, organizationId, meetingName, meetingDate) => {
      return MeetingsService.createMeeting(
        uid,
        organizationId,
        meetingName,
        meetingDate,
      );
    },
    updateMeeting: async (uid, meetingId, meetingName, meetingDate) => {
      return MeetingsService.updateMeeting(
        uid,
        meetingId,
        meetingName,
        meetingDate,
      );
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
    Object.keys(store.organizations).map((id) => parseInt(id))
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

export function useSyncCurrentMeeting() {
  const meetingId = useMeetingId();
  const listenToCurrentMeeting = useMeetingsStore((store) =>
    store.listenToCurrentMeeting
  );

  useEffect(() => {
    return listenToCurrentMeeting(meetingId);
  }, [meetingId, listenToCurrentMeeting]);
}
