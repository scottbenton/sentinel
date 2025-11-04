import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  NotificationSettingsRepository,
  NotificationType,
} from "./notificationSettings.repository";
import { supabase } from "@/lib/supabase.lib";

describe("NotificationSettingsRepository", () => {
  const mockSupabaseFrom = vi.mocked(supabase.from);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getDashboardNotificationSettings", () => {
    it("should return settings when they exist", async () => {
      const mockSettings = {
        id: 1,
        user_id: "user-1",
        dashboard_id: 1,
        organization_id: null,
        meeting_id: null,
        settings: {
          enabledNotificationTypes: [
            NotificationType.MeetingCreated,
            NotificationType.CommentAdded,
          ],
          autoWatchNewMeetings: true,
        },
        created_at: new Date().toISOString(),
      };

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        is: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({
          data: mockSettings,
          error: null,
          status: 200,
        }),
      };

      mockSupabaseFrom.mockReturnValue(mockQuery as unknown);

      const result =
        await NotificationSettingsRepository.getDashboardNotificationSettings(
          "user-1",
          1,
        );

      expect(mockSupabaseFrom).toHaveBeenCalledWith("notification_settings");
      expect(mockQuery.select).toHaveBeenCalledWith("*");
      expect(mockQuery.eq).toHaveBeenCalledWith("user_id", "user-1");
      expect(mockQuery.eq).toHaveBeenCalledWith("dashboard_id", 1);
      expect(mockQuery.is).toHaveBeenCalledWith("organization_id", null);
      expect(mockQuery.is).toHaveBeenCalledWith("meeting_id", null);
      expect(result).toEqual(mockSettings);
    });

    it("should return null when settings do not exist", async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        is: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({
          data: null,
          error: null,
          status: 200,
        }),
      };

      mockSupabaseFrom.mockReturnValue(mockQuery as unknown);

      const result =
        await NotificationSettingsRepository.getDashboardNotificationSettings(
          "user-1",
          1,
        );

      expect(result).toBeNull();
    });

    it("should throw RepositoryError on database error", async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        is: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({
          data: null,
          error: { message: "Database error" },
          status: 500,
        }),
      };

      mockSupabaseFrom.mockReturnValue(mockQuery as unknown);

      await expect(
        NotificationSettingsRepository.getDashboardNotificationSettings(
          "user-1",
          1,
        ),
      ).rejects.toThrow();
    });
  });

  describe("upsertDashboardNotificationSettings", () => {
    it("should update existing settings", async () => {
      const existingSettings = {
        id: 1,
        user_id: "user-1",
        dashboard_id: 1,
        organization_id: null,
        meeting_id: null,
        settings: {
          enabledNotificationTypes: [NotificationType.MeetingCreated],
          autoWatchNewMeetings: false,
        },
        created_at: new Date().toISOString(),
      };

      const updatedSettings = {
        ...existingSettings,
        settings: {
          enabledNotificationTypes: [
            NotificationType.MeetingCreated,
            NotificationType.CommentAdded,
          ],
          autoWatchNewMeetings: true,
        },
      };

      // Mock the getDashboardNotificationSettings call
      const mockSelectQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        is: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({
          data: existingSettings,
          error: null,
          status: 200,
        }),
      };

      // Mock the updateNotificationSettings call
      const mockUpdateQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: updatedSettings,
          error: null,
          status: 200,
        }),
      };

      mockSupabaseFrom
        .mockReturnValueOnce(mockSelectQuery as unknown)
        .mockReturnValueOnce(mockUpdateQuery as unknown);

      const result =
        await NotificationSettingsRepository.upsertDashboardNotificationSettings(
          "user-1",
          1,
          {
            enabledNotificationTypes: [
              NotificationType.MeetingCreated,
              NotificationType.CommentAdded,
            ],
            autoWatchNewMeetings: true,
          },
        );

      expect(mockUpdateQuery.update).toHaveBeenCalledWith({
        settings: {
          enabledNotificationTypes: [
            NotificationType.MeetingCreated,
            NotificationType.CommentAdded,
          ],
          autoWatchNewMeetings: true,
        },
      });
      expect(mockUpdateQuery.eq).toHaveBeenCalledWith("id", 1);
      expect(result).toEqual(updatedSettings);
    });

    it("should insert new settings when none exist", async () => {
      const newSettings = {
        id: 2,
        user_id: "user-2",
        dashboard_id: 2,
        organization_id: null,
        meeting_id: null,
        settings: {
          enabledNotificationTypes: [NotificationType.MeetingCreated],
          autoWatchNewMeetings: false,
        },
        created_at: new Date().toISOString(),
      };

      // Mock the getDashboardNotificationSettings call (no existing settings)
      const mockSelectQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        is: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({
          data: null,
          error: null,
          status: 200,
        }),
      };

      // Mock the insertNotificationSettings call
      const mockInsertQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: newSettings,
          error: null,
          status: 201,
        }),
      };

      mockSupabaseFrom
        .mockReturnValueOnce(mockSelectQuery as unknown)
        .mockReturnValueOnce(mockInsertQuery as unknown);

      const result =
        await NotificationSettingsRepository.upsertDashboardNotificationSettings(
          "user-2",
          2,
          {
            enabledNotificationTypes: [NotificationType.MeetingCreated],
            autoWatchNewMeetings: false,
          },
        );

      expect(mockInsertQuery.insert).toHaveBeenCalledWith({
        user_id: "user-2",
        dashboard_id: 2,
        organization_id: null,
        meeting_id: null,
        settings: {
          enabledNotificationTypes: [NotificationType.MeetingCreated],
          autoWatchNewMeetings: false,
        },
      });
      expect(result).toEqual(newSettings);
    });

    it("should handle settings with only enabledNotificationTypes", async () => {
      const mockSelectQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        is: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({
          data: null,
          error: null,
          status: 200,
        }),
      };

      const newSettings = {
        id: 3,
        user_id: "user-3",
        dashboard_id: 3,
        organization_id: null,
        meeting_id: null,
        settings: {
          enabledNotificationTypes: [
            NotificationType.CommentAdded,
            NotificationType.MeetingDocumentAdded,
          ],
        },
        created_at: new Date().toISOString(),
      };

      const mockInsertQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: newSettings,
          error: null,
          status: 201,
        }),
      };

      mockSupabaseFrom
        .mockReturnValueOnce(mockSelectQuery as unknown)
        .mockReturnValueOnce(mockInsertQuery as unknown);

      const result =
        await NotificationSettingsRepository.upsertDashboardNotificationSettings(
          "user-3",
          3,
          {
            enabledNotificationTypes: [
              NotificationType.CommentAdded,
              NotificationType.MeetingDocumentAdded,
            ],
          },
        );

      expect(mockInsertQuery.insert).toHaveBeenCalledWith({
        user_id: "user-3",
        dashboard_id: 3,
        organization_id: null,
        meeting_id: null,
        settings: {
          enabledNotificationTypes: [
            NotificationType.CommentAdded,
            NotificationType.MeetingDocumentAdded,
          ],
        },
      });
      expect(result).toEqual(newSettings);
    });

    it("should handle empty notification types array", async () => {
      const mockSelectQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        is: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({
          data: null,
          error: null,
          status: 200,
        }),
      };

      const newSettings = {
        id: 4,
        user_id: "user-4",
        dashboard_id: 4,
        organization_id: null,
        meeting_id: null,
        settings: {
          enabledNotificationTypes: [],
          autoWatchNewMeetings: true,
        },
        created_at: new Date().toISOString(),
      };

      const mockInsertQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: newSettings,
          error: null,
          status: 201,
        }),
      };

      mockSupabaseFrom
        .mockReturnValueOnce(mockSelectQuery as unknown)
        .mockReturnValueOnce(mockInsertQuery as unknown);

      const result =
        await NotificationSettingsRepository.upsertDashboardNotificationSettings(
          "user-4",
          4,
          {
            enabledNotificationTypes: [],
            autoWatchNewMeetings: true,
          },
        );

      expect(result.settings).toMatchObject({
        enabledNotificationTypes: [],
        autoWatchNewMeetings: true,
      });
    });
  });
});
