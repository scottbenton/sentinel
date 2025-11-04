import { describe, it, expect, vi, beforeEach } from "vitest";
import { useNotificationSettingsStore } from "./notificationSettings.store";
import {
  NotificationSettingsService,
  INotificationSettings,
} from "@/services/notificationSettings.service";
import { NotificationType } from "@/notifications/notifications.service";

// Mock the service
vi.mock("@/services/notificationSettings.service", () => ({
  NotificationSettingsService: {
    getDashboardNotificationSettings: vi.fn(),
    updateDashboardNotificationSettings: vi.fn(),
  },
}));

describe("NotificationSettingsStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNotificationSettingsStore.getState().resetStore();
  });

  describe("loadSettings", () => {
    it("should load settings successfully", async () => {
      const mockSettings: INotificationSettings = {
        id: 1,
        userId: "user-1",
        dashboardId: 1,
        organizationId: null,
        meetingId: null,
        enabledNotificationTypes: [NotificationType.MeetingCreated],
        autoWatchNewMeetings: true,
        createdAt: new Date("2025-01-01"),
      };

      vi.mocked(
        NotificationSettingsService.getDashboardNotificationSettings
      ).mockResolvedValue(mockSettings);

      const { loadSettings } = useNotificationSettingsStore.getState();
      await loadSettings("user-1", 1);

      const state = useNotificationSettingsStore.getState();

      expect(state.settings).toEqual(mockSettings);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });

    it("should handle default settings when none exist", async () => {
      const defaultSettings: INotificationSettings = {
        id: -1,
        userId: "user-1",
        dashboardId: 1,
        organizationId: null,
        meetingId: null,
        enabledNotificationTypes: [],
        autoWatchNewMeetings: false,
        createdAt: expect.any(Date) as Date,
      };

      vi.mocked(
        NotificationSettingsService.getDashboardNotificationSettings
      ).mockResolvedValue(defaultSettings);

      const { loadSettings } = useNotificationSettingsStore.getState();
      await loadSettings("user-1", 1);

      const state = useNotificationSettingsStore.getState();

      expect(state.settings?.id).toBe(-1);
      expect(state.settings?.enabledNotificationTypes).toEqual([]);
      expect(state.settings?.autoWatchNewMeetings).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it("should set loading to true while loading", async () => {
      vi.mocked(
        NotificationSettingsService.getDashboardNotificationSettings
      ).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  id: 1,
                  userId: "user-1",
                  dashboardId: 1,
                  organizationId: null,
                  meetingId: null,
                  enabledNotificationTypes: [],
                  autoWatchNewMeetings: false,
                  createdAt: new Date(),
                }),
              100
            )
          )
      );

      const { loadSettings } = useNotificationSettingsStore.getState();
      const promise = loadSettings("user-1", 1);

      // Check loading state immediately
      expect(useNotificationSettingsStore.getState().isLoading).toBe(true);

      await promise;

      expect(useNotificationSettingsStore.getState().isLoading).toBe(false);
    });

    it("should handle errors when loading settings", async () => {
      const mockError = new Error("Failed to load settings");
      vi.mocked(
        NotificationSettingsService.getDashboardNotificationSettings
      ).mockRejectedValue(mockError);

      const { loadSettings } = useNotificationSettingsStore.getState();
      await loadSettings("user-1", 1);

      const state = useNotificationSettingsStore.getState();

      expect(state.error).toBe("Failed to load settings");
      expect(state.isLoading).toBe(false);
      expect(state.settings).toBe(null);
    });
  });

  describe("updateSettings", () => {
    it("should update settings successfully", async () => {
      const updatedSettings: INotificationSettings = {
        id: 1,
        userId: "user-1",
        dashboardId: 1,
        organizationId: null,
        meetingId: null,
        enabledNotificationTypes: [
          NotificationType.MeetingCreated,
          NotificationType.CommentAdded,
        ],
        autoWatchNewMeetings: true,
        createdAt: new Date("2025-01-01"),
      };

      vi.mocked(
        NotificationSettingsService.updateDashboardNotificationSettings
      ).mockResolvedValue(updatedSettings);

      const { updateSettings } = useNotificationSettingsStore.getState();
      await updateSettings(
        "user-1",
        1,
        [NotificationType.MeetingCreated, NotificationType.CommentAdded],
        true
      );

      const state = useNotificationSettingsStore.getState();

      expect(state.settings).toEqual(updatedSettings);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);

      expect(
        NotificationSettingsService.updateDashboardNotificationSettings
      ).toHaveBeenCalledWith("user-1", 1, [
        NotificationType.MeetingCreated,
        NotificationType.CommentAdded,
      ], true);
    });

    it("should handle empty notification types", async () => {
      const updatedSettings: INotificationSettings = {
        id: 1,
        userId: "user-1",
        dashboardId: 1,
        organizationId: null,
        meetingId: null,
        enabledNotificationTypes: [],
        autoWatchNewMeetings: false,
        createdAt: new Date("2025-01-01"),
      };

      vi.mocked(
        NotificationSettingsService.updateDashboardNotificationSettings
      ).mockResolvedValue(updatedSettings);

      const { updateSettings } = useNotificationSettingsStore.getState();
      await updateSettings("user-1", 1, [], false);

      const state = useNotificationSettingsStore.getState();

      expect(state.settings?.enabledNotificationTypes).toEqual([]);
      expect(state.settings?.autoWatchNewMeetings).toBe(false);
    });

    it("should set loading to true while updating", async () => {
      vi.mocked(
        NotificationSettingsService.updateDashboardNotificationSettings
      ).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  id: 1,
                  userId: "user-1",
                  dashboardId: 1,
                  organizationId: null,
                  meetingId: null,
                  enabledNotificationTypes: [],
                  autoWatchNewMeetings: false,
                  createdAt: new Date(),
                }),
              100
            )
          )
      );

      const { updateSettings } = useNotificationSettingsStore.getState();
      const promise = updateSettings("user-1", 1, [], false);

      // Check loading state immediately
      expect(useNotificationSettingsStore.getState().isLoading).toBe(true);

      await promise;

      expect(useNotificationSettingsStore.getState().isLoading).toBe(false);
    });

    it("should handle errors when updating settings", async () => {
      const mockError = new Error("Failed to update settings");
      vi.mocked(
        NotificationSettingsService.updateDashboardNotificationSettings
      ).mockRejectedValue(mockError);

      const { updateSettings } = useNotificationSettingsStore.getState();
      await updateSettings("user-1", 1, [NotificationType.MeetingCreated], true);

      const state = useNotificationSettingsStore.getState();

      expect(state.error).toBe("Failed to update settings");
      expect(state.isLoading).toBe(false);
    });
  });

  describe("resetStore", () => {
    it("should reset store to default state", async () => {
      const mockSettings: INotificationSettings = {
        id: 1,
        userId: "user-1",
        dashboardId: 1,
        organizationId: null,
        meetingId: null,
        enabledNotificationTypes: [NotificationType.MeetingCreated],
        autoWatchNewMeetings: true,
        createdAt: new Date("2025-01-01"),
      };

      vi.mocked(
        NotificationSettingsService.getDashboardNotificationSettings
      ).mockResolvedValue(mockSettings);

      const { loadSettings, resetStore } =
        useNotificationSettingsStore.getState();
      await loadSettings("user-1", 1);

      expect(useNotificationSettingsStore.getState().settings).toEqual(
        mockSettings
      );

      resetStore();

      const state = useNotificationSettingsStore.getState();
      expect(state.settings).toBe(null);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });
  });

  describe("state persistence", () => {
    it("should maintain settings across multiple operations", async () => {
      const initialSettings: INotificationSettings = {
        id: 1,
        userId: "user-1",
        dashboardId: 1,
        organizationId: null,
        meetingId: null,
        enabledNotificationTypes: [NotificationType.MeetingCreated],
        autoWatchNewMeetings: false,
        createdAt: new Date("2025-01-01"),
      };

      const updatedSettings: INotificationSettings = {
        ...initialSettings,
        enabledNotificationTypes: [
          NotificationType.MeetingCreated,
          NotificationType.CommentAdded,
        ],
        autoWatchNewMeetings: true,
      };

      vi.mocked(
        NotificationSettingsService.getDashboardNotificationSettings
      ).mockResolvedValue(initialSettings);

      vi.mocked(
        NotificationSettingsService.updateDashboardNotificationSettings
      ).mockResolvedValue(updatedSettings);

      const { loadSettings, updateSettings } =
        useNotificationSettingsStore.getState();

      // Load initial settings
      await loadSettings("user-1", 1);
      expect(
        useNotificationSettingsStore.getState().settings?.enabledNotificationTypes
      ).toEqual([NotificationType.MeetingCreated]);

      // Update settings
      await updateSettings(
        "user-1",
        1,
        [NotificationType.MeetingCreated, NotificationType.CommentAdded],
        true
      );

      const finalState = useNotificationSettingsStore.getState();
      expect(finalState.settings?.enabledNotificationTypes).toEqual([
        NotificationType.MeetingCreated,
        NotificationType.CommentAdded,
      ]);
      expect(finalState.settings?.autoWatchNewMeetings).toBe(true);
    });
  });
});
