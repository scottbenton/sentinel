import {
  NotificationSettingsService,
  INotificationSettings,
} from "@/services/notificationSettings.service";
import { NotificationType } from "@/notifications/notifications.service";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";
import deepEqual from "fast-deep-equal";
import { useEffect } from "react";

export interface NotificationSettingsStoreState {
  settings: INotificationSettings | null;
  isLoading: boolean;
  error: string | null;
}

export interface NotificationSettingsStoreActions {
  loadSettings: (userId: string, dashboardId: number) => Promise<void>;
  updateSettings: (
    userId: string,
    dashboardId: number,
    enabledNotificationTypes: NotificationType[],
    autoWatchNewMeetings: boolean
  ) => Promise<void>;
  resetStore: () => void;
}

const defaultState: NotificationSettingsStoreState = {
  settings: null,
  isLoading: false,
  error: null,
};

export const useNotificationSettingsStore = createWithEqualityFn<
  NotificationSettingsStoreState & NotificationSettingsStoreActions
>()(
  immer((set) => ({
    ...defaultState,

    loadSettings: async (userId: string, dashboardId: number) => {
      set({ isLoading: true, error: null });

      try {
        const settings =
          await NotificationSettingsService.getDashboardNotificationSettings(
            userId,
            dashboardId
          );

        set({ settings, isLoading: false });
      } catch (error: any) {
        set({ error: error.message, isLoading: false });
      }
    },

    updateSettings: async (
      userId: string,
      dashboardId: number,
      enabledNotificationTypes: NotificationType[],
      autoWatchNewMeetings: boolean
    ) => {
      set({ isLoading: true, error: null });

      try {
        const settings =
          await NotificationSettingsService.updateDashboardNotificationSettings(
            userId,
            dashboardId,
            enabledNotificationTypes,
            autoWatchNewMeetings
          );

        set({ settings, isLoading: false });
      } catch (error: any) {
        set({ error: error.message, isLoading: false });
      }
    },

    resetStore: () => {
      set(defaultState);
    },
  })),
  deepEqual
);

/**
 * Hook to load notification settings for the current dashboard
 */
export function useSyncNotificationSettings(
  userId: string | null,
  dashboardId: number | null
) {
  const loadSettings = useNotificationSettingsStore((s) => s.loadSettings);

  useEffect(() => {
    if (userId && dashboardId) {
      loadSettings(userId, dashboardId);
    }
  }, [userId, dashboardId, loadSettings]);
}
