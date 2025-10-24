import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotificationSettingsService, NotificationType } from "./notificationSettings.service";
import { NotificationSettingsRepository } from "@/repository/notificationSettings.repository";

// Mock the repository
vi.mock("@/repository/notificationSettings.repository", () => ({
  NotificationSettingsRepository: {
    getDashboardNotificationSettings: vi.fn(),
    upsertDashboardNotificationSettings: vi.fn(),
  },
  NotificationType: {
    MeetingCreated: "meeting_created",
    CommentAdded: "comment_added",
    MeetingDocumentAdded: "meeting_document_added",
    UserInvited: "user_invited",
  },
}));

describe("NotificationSettingsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getDashboardNotificationSettings", () => {
    it("should convert DTO to INotificationSettings when settings exist", async () => {
      const mockDTO = {
        id: 1,
        user_id: "user-1",
        dashboard_id: 1,
        organization_id: null,
        meeting_id: null,
        settings: {
          enabledNotificationTypes: ["meeting_created", "comment_added"],
          autoWatchNewMeetings: true,
        },
        created_at: "2025-01-01T00:00:00Z",
      };

      vi.mocked(NotificationSettingsRepository.getDashboardNotificationSettings).mockResolvedValue(
        mockDTO
      );

      const result = await NotificationSettingsService.getDashboardNotificationSettings(
        "user-1",
        1
      );

      expect(NotificationSettingsRepository.getDashboardNotificationSettings).toHaveBeenCalledWith(
        "user-1",
        1
      );
      expect(result).toEqual({
        id: 1,
        userId: "user-1",
        dashboardId: 1,
        organizationId: null,
        meetingId: null,
        enabledNotificationTypes: ["meeting_created", "comment_added"],
        autoWatchNewMeetings: true,
        createdAt: new Date("2025-01-01T00:00:00Z"),
      });
    });

    it("should return default settings when none exist", async () => {
      vi.mocked(NotificationSettingsRepository.getDashboardNotificationSettings).mockResolvedValue(
        null
      );

      const result = await NotificationSettingsService.getDashboardNotificationSettings(
        "user-1",
        1
      );

      expect(result).toEqual({
        id: -1,
        userId: "user-1",
        dashboardId: 1,
        organizationId: null,
        meetingId: null,
        enabledNotificationTypes: [],
        autoWatchNewMeetings: false,
        createdAt: expect.any(Date),
      });
    });

    it("should handle settings without autoWatchNewMeetings field", async () => {
      const mockDTO = {
        id: 2,
        user_id: "user-2",
        dashboard_id: 2,
        organization_id: null,
        meeting_id: null,
        settings: {
          enabledNotificationTypes: ["meeting_created"],
        },
        created_at: "2025-01-01T00:00:00Z",
      };

      vi.mocked(NotificationSettingsRepository.getDashboardNotificationSettings).mockResolvedValue(
        mockDTO
      );

      const result = await NotificationSettingsService.getDashboardNotificationSettings(
        "user-2",
        2
      );

      expect(result.autoWatchNewMeetings).toBe(false);
      expect(result.enabledNotificationTypes).toEqual(["meeting_created"]);
    });

    it("should handle settings with empty enabledNotificationTypes", async () => {
      const mockDTO = {
        id: 3,
        user_id: "user-3",
        dashboard_id: 3,
        organization_id: null,
        meeting_id: null,
        settings: {
          autoWatchNewMeetings: true,
        },
        created_at: "2025-01-01T00:00:00Z",
      };

      vi.mocked(NotificationSettingsRepository.getDashboardNotificationSettings).mockResolvedValue(
        mockDTO
      );

      const result = await NotificationSettingsService.getDashboardNotificationSettings(
        "user-3",
        3
      );

      expect(result.enabledNotificationTypes).toEqual([]);
      expect(result.autoWatchNewMeetings).toBe(true);
    });

    it("should convert dates correctly", async () => {
      const mockDTO = {
        id: 1,
        user_id: "user-1",
        dashboard_id: 1,
        organization_id: null,
        meeting_id: null,
        settings: {
          enabledNotificationTypes: [],
          autoWatchNewMeetings: false,
        },
        created_at: "2025-10-23T12:00:00.000Z",
      };

      vi.mocked(NotificationSettingsRepository.getDashboardNotificationSettings).mockResolvedValue(
        mockDTO
      );

      const result = await NotificationSettingsService.getDashboardNotificationSettings(
        "user-1",
        1
      );

      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.createdAt.toISOString()).toBe("2025-10-23T12:00:00.000Z");
    });
  });

  describe("updateDashboardNotificationSettings", () => {
    it("should update settings and convert response", async () => {
      const mockDTO = {
        id: 1,
        user_id: "user-1",
        dashboard_id: 1,
        organization_id: null,
        meeting_id: null,
        settings: {
          enabledNotificationTypes: ["meeting_created", "comment_added"],
          autoWatchNewMeetings: true,
        },
        created_at: "2025-01-01T00:00:00Z",
      };

      vi.mocked(NotificationSettingsRepository.upsertDashboardNotificationSettings).mockResolvedValue(
        mockDTO
      );

      const result = await NotificationSettingsService.updateDashboardNotificationSettings(
        "user-1",
        1,
        [NotificationType.MeetingCreated, NotificationType.CommentAdded],
        true
      );

      expect(NotificationSettingsRepository.upsertDashboardNotificationSettings).toHaveBeenCalledWith(
        "user-1",
        1,
        {
          enabledNotificationTypes: [NotificationType.MeetingCreated, NotificationType.CommentAdded],
          autoWatchNewMeetings: true,
        }
      );
      expect(result).toEqual({
        id: 1,
        userId: "user-1",
        dashboardId: 1,
        organizationId: null,
        meetingId: null,
        enabledNotificationTypes: ["meeting_created", "comment_added"],
        autoWatchNewMeetings: true,
        createdAt: new Date("2025-01-01T00:00:00Z"),
      });
    });

    it("should handle updating with empty notification types", async () => {
      const mockDTO = {
        id: 1,
        user_id: "user-1",
        dashboard_id: 1,
        organization_id: null,
        meeting_id: null,
        settings: {
          enabledNotificationTypes: [],
          autoWatchNewMeetings: false,
        },
        created_at: "2025-01-01T00:00:00Z",
      };

      vi.mocked(NotificationSettingsRepository.upsertDashboardNotificationSettings).mockResolvedValue(
        mockDTO
      );

      const result = await NotificationSettingsService.updateDashboardNotificationSettings(
        "user-1",
        1,
        [],
        false
      );

      expect(result.enabledNotificationTypes).toEqual([]);
      expect(result.autoWatchNewMeetings).toBe(false);
    });

    it("should handle updating with all notification types", async () => {
      const allTypes = [
        NotificationType.MeetingCreated,
        NotificationType.CommentAdded,
        NotificationType.MeetingDocumentAdded,
        NotificationType.UserInvited,
      ];

      const mockDTO = {
        id: 1,
        user_id: "user-1",
        dashboard_id: 1,
        organization_id: null,
        meeting_id: null,
        settings: {
          enabledNotificationTypes: allTypes,
          autoWatchNewMeetings: true,
        },
        created_at: "2025-01-01T00:00:00Z",
      };

      vi.mocked(NotificationSettingsRepository.upsertDashboardNotificationSettings).mockResolvedValue(
        mockDTO
      );

      const result = await NotificationSettingsService.updateDashboardNotificationSettings(
        "user-1",
        1,
        allTypes,
        true
      );

      expect(result.enabledNotificationTypes).toEqual(allTypes);
    });
  });
});
