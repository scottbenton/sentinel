import { WatchersService, IWatcher } from "@/services/watchers.service";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";
import deepEqual from "fast-deep-equal";
import { useEffect } from "react";

export interface WatchersStoreState {
  // Map of organizationId/meetingId to watcher record
  organizationWatchers: Record<number, IWatcher>;
  meetingWatchers: Record<number, IWatcher>;
  isLoading: boolean;
  error: string | null;
}

export interface WatchersStoreActions {
  subscribeToWatchers: (userId: string, dashboardId: number) => () => void;
  toggleOrganizationWatch: (
    userId: string,
    dashboardId: number,
    organizationId: number
  ) => Promise<void>;
  toggleMeetingWatch: (
    userId: string,
    dashboardId: number,
    meetingId: number
  ) => Promise<void>;
  isWatchingOrganization: (organizationId: number) => boolean;
  isWatchingMeeting: (meetingId: number) => boolean;
  resetStore: () => void;
}

const defaultState: WatchersStoreState = {
  organizationWatchers: {},
  meetingWatchers: {},
  isLoading: true,
  error: null,
};

export const useWatchersStore = createWithEqualityFn<
  WatchersStoreState & WatchersStoreActions
>()(
  immer((set, get) => ({
    ...defaultState,

    subscribeToWatchers: (userId: string, dashboardId: number) => {
      set({ isLoading: true, error: null });

      return WatchersService.subscribeToWatchers(
        userId,
        dashboardId,
        (watchers, type) => {
          set((state) => {
            if (type === "initial") {
              // Reset and populate
              state.organizationWatchers = {};
              state.meetingWatchers = {};

              watchers.forEach((watcher) => {
                if (watcher.organizationId) {
                  state.organizationWatchers[watcher.organizationId] =
                    watcher;
                } else if (watcher.meetingId) {
                  state.meetingWatchers[watcher.meetingId] = watcher;
                }
              });

              state.isLoading = false;
            } else if (type === "insert") {
              watchers.forEach((watcher) => {
                if (watcher.organizationId) {
                  state.organizationWatchers[watcher.organizationId] =
                    watcher;
                } else if (watcher.meetingId) {
                  state.meetingWatchers[watcher.meetingId] = watcher;
                }
              });
            } else if (type === "delete") {
              watchers.forEach((watcher) => {
                if (watcher.organizationId) {
                  delete state.organizationWatchers[watcher.organizationId];
                } else if (watcher.meetingId) {
                  delete state.meetingWatchers[watcher.meetingId];
                }
              });
            }
          });
        }
      );
    },

    toggleOrganizationWatch: async (
      userId: string,
      dashboardId: number,
      organizationId: number
    ) => {
      const isCurrentlyWatching = get().isWatchingOrganization(organizationId);

      try {
        await WatchersService.toggleOrganizationWatch(
          userId,
          dashboardId,
          organizationId,
          isCurrentlyWatching
        );
      } catch (error: any) {
        set({ error: error.message });
        throw error;
      }
    },

    toggleMeetingWatch: async (
      userId: string,
      dashboardId: number,
      meetingId: number
    ) => {
      const isCurrentlyWatching = get().isWatchingMeeting(meetingId);

      try {
        await WatchersService.toggleMeetingWatch(
          userId,
          dashboardId,
          meetingId,
          isCurrentlyWatching
        );
      } catch (error: any) {
        set({ error: error.message });
        throw error;
      }
    },

    isWatchingOrganization: (organizationId: number) => {
      return organizationId in get().organizationWatchers;
    },

    isWatchingMeeting: (meetingId: number) => {
      return meetingId in get().meetingWatchers;
    },

    resetStore: () => {
      set(defaultState);
    },
  })),
  deepEqual
);

/**
 * Hook to sync watchers for the current dashboard
 */
export function useSyncWatchers(
  userId: string | null,
  dashboardId: number | null
) {
  const subscribeToWatchers = useWatchersStore((s) => s.subscribeToWatchers);

  useEffect(() => {
    if (userId && dashboardId) {
      return subscribeToWatchers(userId, dashboardId);
    }
  }, [userId, dashboardId, subscribeToWatchers]);
}
