import { createWithEqualityFn } from "zustand/traditional";
import { immer } from "zustand/middleware/immer";
import deepEqual from "fast-deep-equal";
import { IMeeting, MeetingsService } from "@/services/meetings.service";
import { useOrganizationsStore } from "./organizations.store";
import { useEffect } from "react";
import { useMeetingId } from "@/hooks/useMeetingId";
import { useOrganizationId } from "@/hooks/useOrganizationId";

interface MeetingsStoreState {
  meetings: Record<number, IMeeting>;
  futureMeetings: Record<number, IMeeting>;
  loadingFutureMeetings: boolean;
  futureMeetingsError: string | null;

  loadingPastMeetings: boolean;
  pastMeetings: Record<number, IMeeting>;
  pastMeetingsError: string | null;

  currentMeeting: IMeeting | null;
  loadingCurrentMeeting: boolean;
  currentMeetingError: string | null;
}
interface MeetingsStoreActions {
  listenToFutureMeetings: (organizationIds: number[]) => () => void;
  listenToPastMeetings: (organizationId: number) => () => void;
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
    oldName: string,
    meetingName: string,
    oldDate: Date,
    meetingDate: Date,
  ) => Promise<void>;
  deleteMeeting: (uid: string, meetingId: number) => Promise<void>;
  resetStore: () => void;
}

const defaultState: MeetingsStoreState = {
  meetings: {},
  futureMeetings: {},
  loadingFutureMeetings: true,
  futureMeetingsError: null,

  loadingPastMeetings: true,
  pastMeetings: {},
  pastMeetingsError: null,

  currentMeeting: null,
  loadingCurrentMeeting: true,
  currentMeetingError: null,
};

export const useMeetingsStore = createWithEqualityFn<
  MeetingsStoreState & MeetingsStoreActions
>()(
  immer((set, getState) => ({
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
              state.meetings = { ...state.pastMeetings };
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
    listenToPastMeetings: (organizationId) => {
      const unsubscribe = MeetingsService.listenToPastMeetings(
        [organizationId],
        (changedMeetings, deletedMeetingIds, replaceState) => {
          set((state) => {
            state.loadingPastMeetings = false;
            state.pastMeetingsError = null;
            if (replaceState) {
              state.meetings = { ...state.futureMeetings };
              state.pastMeetings = {};
            }
            changedMeetings.forEach((meeting) => {
              state.pastMeetings[meeting.id] = meeting;
              state.meetings[meeting.id] = meeting;
            });
            deletedMeetingIds.forEach((id) => {
              delete state.pastMeetings[id];
              delete state.meetings[id];
            });
          });
        },
        (error) => {
          set((state) => {
            state.loadingPastMeetings = false;
            state.pastMeetingsError = error.message;
          });
        },
      );

      return () => {
        unsubscribe();
        set((store) => {
          store.pastMeetings = {};
          store.loadingPastMeetings = true;
          store.pastMeetingsError = null;
        });
      };
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
    updateMeeting: async (
      uid,
      meetingId,
      oldName,
      meetingName,
      oldDate,
      meetingDate,
    ) => {
      return MeetingsService.updateMeeting(
        uid,
        meetingId,
        oldName,
        meetingName,
        oldDate,
        meetingDate,
      );
    },
    deleteMeeting: async (uid, meetingId) => {
      const meeting = getState().meetings[meetingId];
      if (!meeting) {
        throw new Error("Meeting not found");
      }
      return MeetingsService.deleteMeeting(
        uid,
        meeting.organizationId,
        meetingId,
        meeting.name,
      );
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

export function useSyncPastMeetings() {
  const organizationId = useOrganizationId();
  const listenToPastMeetings = useMeetingsStore(
    (store) => store.listenToPastMeetings,
  );
  useEffect(() => {
    return listenToPastMeetings(organizationId);
  }, [organizationId, listenToPastMeetings]);
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
