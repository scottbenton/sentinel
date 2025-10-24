import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  NotificationsService,
  NotificationType,
} from "./notifications.service";
import { NotificationsRepository } from "./notifications.repository";

// Mock the repository
vi.mock("./notifications.repository", () => ({
  NotificationsRepository: {
    deleteNotification: vi.fn(),
    updateNotification: vi.fn(),
    subscribeToNotifications: vi.fn(),
    markNotificationsAsReadByIds: vi.fn(),
    markMeetingNotificationsAsRead: vi.fn(),
    markOrganizationNotificationsAsRead: vi.fn(),
  },
}));

describe("NotificationsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("convertNotificationDTOToINotification", () => {
    it("should convert user_invited notification", () => {
      const mockDTO = {
        id: "notif-1",
        type: "user_invited" as const,
        user_id: "user-1",
        log_id: null,
        additional_context: {
          invite_id: 123,
          inviter_name: "John Doe",
          dashboard_name: "Test Dashboard",
        },
        created_at: "2025-01-01T00:00:00Z",
        has_been_read: false,
      };

      const mockUnsubscribe = vi.fn();
      const onNotifications = vi.fn();
      const onError = vi.fn();

      vi.mocked(
        NotificationsRepository.subscribeToNotifications,
      ).mockImplementation((_userId, callback) => {
        callback([mockDTO], [], false);
        return mockUnsubscribe;
      });

      NotificationsService.subscribeToNotifications(
        "user-1",
        onNotifications,
        onError,
      );

      expect(onNotifications).toHaveBeenCalledWith(
        [
          {
            id: "notif-1",
            type: NotificationType.UserInvitation,
            inviteId: 123,
            inviterName: "John Doe",
            dashboardName: "Test Dashboard",
            createdAt: new Date("2025-01-01T00:00:00Z"),
            hasBeenRead: false,
          },
        ],
        [],
        false,
      );
    });

    it("should convert meeting_created notification", () => {
      const mockDTO = {
        id: "notif-2",
        type: "meeting_created" as const,
        user_id: "user-1",
        log_id: null,
        additional_context: {
          meeting_id: 200,
          meeting_name: "City Council Meeting",
          meeting_date: "2025-02-01",
          organization_id: 100,
          organization_name: "City Council",
        },
        created_at: "2025-01-01T00:00:00Z",
        has_been_read: false,
      };

      const mockUnsubscribe = vi.fn();
      const onNotifications = vi.fn();
      const onError = vi.fn();

      vi.mocked(
        NotificationsRepository.subscribeToNotifications,
      ).mockImplementation((_userId, callback) => {
        callback([mockDTO], [], false);
        return mockUnsubscribe;
      });

      NotificationsService.subscribeToNotifications(
        "user-1",
        onNotifications,
        onError,
      );

      expect(onNotifications).toHaveBeenCalledWith(
        [
          {
            id: "notif-2",
            type: NotificationType.MeetingCreated,
            meetingId: 200,
            meetingName: "City Council Meeting",
            meetingDate: "2025-02-01",
            organizationId: 100,
            organizationName: "City Council",
            createdAt: new Date("2025-01-01T00:00:00Z"),
            hasBeenRead: false,
          },
        ],
        [],
        false,
      );
    });

    it("should convert comment_added notification with meeting context", () => {
      const mockDTO = {
        id: "notif-3",
        type: "comment_added" as const,
        user_id: "user-1",
        log_id: 300,
        additional_context: {
          meeting_id: 200,
          meeting_name: "City Council Meeting",
          organization_id: 100,
          organization_name: "City Council",
        },
        created_at: "2025-01-01T00:00:00Z",
        has_been_read: false,
      };

      const mockUnsubscribe = vi.fn();
      const onNotifications = vi.fn();
      const onError = vi.fn();

      vi.mocked(
        NotificationsRepository.subscribeToNotifications,
      ).mockImplementation((_userId, callback) => {
        callback([mockDTO], [], false);
        return mockUnsubscribe;
      });

      NotificationsService.subscribeToNotifications(
        "user-1",
        onNotifications,
        onError,
      );

      expect(onNotifications).toHaveBeenCalledWith(
        [
          {
            id: "notif-3",
            type: NotificationType.CommentAdded,
            logId: 300,
            meetingId: 200,
            meetingName: "City Council Meeting",
            organizationId: 100,
            organizationName: "City Council",
            createdAt: new Date("2025-01-01T00:00:00Z"),
            hasBeenRead: false,
          },
        ],
        [],
        false,
      );
    });

    it("should convert comment_added notification with organization context only", () => {
      const mockDTO = {
        id: "notif-4",
        type: "comment_added" as const,
        user_id: "user-1",
        log_id: 301,
        additional_context: {
          organization_id: 100,
          organization_name: "City Council",
        },
        created_at: "2025-01-01T00:00:00Z",
        has_been_read: true,
      };

      const mockUnsubscribe = vi.fn();
      const onNotifications = vi.fn();
      const onError = vi.fn();

      vi.mocked(
        NotificationsRepository.subscribeToNotifications,
      ).mockImplementation((_userId, callback) => {
        callback([mockDTO], [], false);
        return mockUnsubscribe;
      });

      NotificationsService.subscribeToNotifications(
        "user-1",
        onNotifications,
        onError,
      );

      expect(onNotifications).toHaveBeenCalledWith(
        [
          {
            id: "notif-4",
            type: NotificationType.CommentAdded,
            logId: 301,
            meetingId: undefined,
            meetingName: undefined,
            organizationId: 100,
            organizationName: "City Council",
            createdAt: new Date("2025-01-01T00:00:00Z"),
            hasBeenRead: true,
          },
        ],
        [],
        false,
      );
    });

    it("should convert meeting_document_added notification", () => {
      const mockDTO = {
        id: "notif-5",
        type: "meeting_document_added" as const,
        user_id: "user-1",
        log_id: 400,
        additional_context: {
          meeting_id: 200,
          meeting_name: "City Council Meeting",
          organization_id: 100,
          organization_name: "City Council",
        },
        created_at: "2025-01-01T00:00:00Z",
        has_been_read: false,
      };

      const mockUnsubscribe = vi.fn();
      const onNotifications = vi.fn();
      const onError = vi.fn();

      vi.mocked(
        NotificationsRepository.subscribeToNotifications,
      ).mockImplementation((_userId, callback) => {
        callback([mockDTO], [], false);
        return mockUnsubscribe;
      });

      NotificationsService.subscribeToNotifications(
        "user-1",
        onNotifications,
        onError,
      );

      expect(onNotifications).toHaveBeenCalledWith(
        [
          {
            id: "notif-5",
            type: NotificationType.MeetingDocumentAdded,
            logId: 400,
            meetingId: 200,
            meetingName: "City Council Meeting",
            organizationId: 100,
            organizationName: "City Council",
            createdAt: new Date("2025-01-01T00:00:00Z"),
            hasBeenRead: false,
          },
        ],
        [],
        false,
      );
    });

    it("should filter out unknown notification types", () => {
      const mockDTOs = [
        {
          id: "notif-1",
          type: "user_invited" as const,
          user_id: "user-1",
          log_id: null,
          additional_context: {
            invite_id: 123,
            inviter_name: "John Doe",
            dashboard_name: "Test Dashboard",
          },
          created_at: "2025-01-01T00:00:00Z",
          has_been_read: false,
        },
        {
          id: "notif-2",
          type: "unknown_type" as any,
          user_id: "user-1",
          log_id: null,
          additional_context: {},
          created_at: "2025-01-01T00:00:00Z",
          has_been_read: false,
        },
      ];

      const mockUnsubscribe = vi.fn();
      const onNotifications = vi.fn();
      const onError = vi.fn();

      vi.mocked(
        NotificationsRepository.subscribeToNotifications,
      ).mockImplementation((_userId, callback) => {
        callback(mockDTOs, [], false);
        return mockUnsubscribe;
      });

      NotificationsService.subscribeToNotifications(
        "user-1",
        onNotifications,
        onError,
      );

      // Should only return the valid notification
      expect(onNotifications).toHaveBeenCalledWith(
        [
          expect.objectContaining({
            type: NotificationType.UserInvitation,
          }),
        ],
        [],
        false,
      );
    });

    it("should handle multiple notifications of different types", () => {
      const mockDTOs = [
        {
          id: "notif-1",
          type: "user_invited" as const,
          user_id: "user-1",
          log_id: null,
          additional_context: {
            invite_id: 123,
            inviter_name: "John Doe",
            dashboard_name: "Test Dashboard",
          },
          created_at: "2025-01-01T00:00:00Z",
          has_been_read: false,
        },
        {
          id: "notif-2",
          type: "meeting_created" as const,
          user_id: "user-1",
          log_id: null,
          additional_context: {
            meeting_id: 200,
            meeting_name: "Meeting",
            meeting_date: "2025-02-01",
            organization_id: 100,
            organization_name: "Organization",
          },
          created_at: "2025-01-02T00:00:00Z",
          has_been_read: false,
        },
      ];

      const mockUnsubscribe = vi.fn();
      const onNotifications = vi.fn();
      const onError = vi.fn();

      vi.mocked(
        NotificationsRepository.subscribeToNotifications,
      ).mockImplementation((_userId, callback) => {
        callback(mockDTOs, [], false);
        return mockUnsubscribe;
      });

      NotificationsService.subscribeToNotifications(
        "user-1",
        onNotifications,
        onError,
      );

      expect(onNotifications).toHaveBeenCalledWith(
        [
          expect.objectContaining({ type: NotificationType.UserInvitation }),
          expect.objectContaining({ type: NotificationType.MeetingCreated }),
        ],
        [],
        false,
      );
    });
  });

  describe("deleteNotification", () => {
    it("should call repository deleteNotification", async () => {
      vi.mocked(NotificationsRepository.deleteNotification).mockResolvedValue(
        undefined,
      );

      await NotificationsService.deleteNotification("notif-1");

      expect(NotificationsRepository.deleteNotification).toHaveBeenCalledWith(
        "notif-1",
      );
    });
  });

  describe("markNotificationAsRead", () => {
    it("should call repository updateNotification with has_been_read", () => {
      vi.mocked(NotificationsRepository.updateNotification).mockResolvedValue(
        undefined,
      );

      NotificationsService.markNotificationAsRead("notif-1");

      expect(NotificationsRepository.updateNotification).toHaveBeenCalledWith(
        "notif-1",
        {
          has_been_read: true,
        },
      );
    });
  });

  describe("subscribeToNotifications", () => {
    it("should return unsubscribe function", () => {
      const mockUnsubscribe = vi.fn();
      const onNotifications = vi.fn();
      const onError = vi.fn();

      vi.mocked(
        NotificationsRepository.subscribeToNotifications,
      ).mockReturnValue(mockUnsubscribe);

      const unsubscribe = NotificationsService.subscribeToNotifications(
        "user-1",
        onNotifications,
        onError,
      );

      expect(unsubscribe).toBe(mockUnsubscribe);
    });

    it("should handle deleted notifications", () => {
      const mockUnsubscribe = vi.fn();
      const onNotifications = vi.fn();
      const onError = vi.fn();

      vi.mocked(
        NotificationsRepository.subscribeToNotifications,
      ).mockImplementation((_userId, callback) => {
        callback([], ["notif-1", "notif-2"], false);
        return mockUnsubscribe;
      });

      NotificationsService.subscribeToNotifications(
        "user-1",
        onNotifications,
        onError,
      );

      expect(onNotifications).toHaveBeenCalledWith(
        [],
        ["notif-1", "notif-2"],
        false,
      );
    });

    it("should handle replace state flag", () => {
      const mockDTOs = [
        {
          id: "notif-1",
          type: "user_invited" as const,
          user_id: "user-1",
          log_id: null,
          additional_context: {
            invite_id: 123,
            inviter_name: "John",
            dashboard_name: "Dashboard",
          },
          created_at: "2025-01-01T00:00:00Z",
          has_been_read: false,
        },
      ];

      const mockUnsubscribe = vi.fn();
      const onNotifications = vi.fn();
      const onError = vi.fn();

      vi.mocked(
        NotificationsRepository.subscribeToNotifications,
      ).mockImplementation((_userId, callback) => {
        callback(mockDTOs, [], true); // replaceState = true
        return mockUnsubscribe;
      });

      NotificationsService.subscribeToNotifications(
        "user-1",
        onNotifications,
        onError,
      );

      expect(onNotifications).toHaveBeenCalledWith(expect.any(Array), [], true);
    });
  });

  describe("markNotificationsAsReadByIds", () => {
    it("should call repository method with notification IDs", async () => {
      vi.mocked(
        NotificationsRepository.markNotificationsAsReadByIds,
      ).mockResolvedValue(undefined);

      await NotificationsService.markNotificationsAsReadByIds([
        "notif-1",
        "notif-2",
        "notif-3",
      ]);

      expect(
        NotificationsRepository.markNotificationsAsReadByIds,
      ).toHaveBeenCalledWith(["notif-1", "notif-2", "notif-3"]);
    });

    it("should handle empty array", async () => {
      vi.mocked(
        NotificationsRepository.markNotificationsAsReadByIds,
      ).mockResolvedValue(undefined);

      await NotificationsService.markNotificationsAsReadByIds([]);

      expect(
        NotificationsRepository.markNotificationsAsReadByIds,
      ).toHaveBeenCalledWith([]);
    });
  });

  describe("markMeetingNotificationsAsRead", () => {
    it("should call repository method with user and meeting ID", async () => {
      vi.mocked(
        NotificationsRepository.markMeetingNotificationsAsRead,
      ).mockResolvedValue(undefined);

      await NotificationsService.markMeetingNotificationsAsRead("user-1", 200);

      expect(
        NotificationsRepository.markMeetingNotificationsAsRead,
      ).toHaveBeenCalledWith("user-1", 200);
    });

    it("should propagate errors from repository", async () => {
      const mockError = new Error("Database error");
      vi.mocked(
        NotificationsRepository.markMeetingNotificationsAsRead,
      ).mockRejectedValue(mockError);

      await expect(
        NotificationsService.markMeetingNotificationsAsRead("user-1", 200),
      ).rejects.toThrow("Database error");
    });
  });

  describe("markOrganizationNotificationsAsRead", () => {
    it("should call repository method with user and organization ID", async () => {
      vi.mocked(
        NotificationsRepository.markOrganizationNotificationsAsRead,
      ).mockResolvedValue(undefined);

      await NotificationsService.markOrganizationNotificationsAsRead(
        "user-1",
        100,
      );

      expect(
        NotificationsRepository.markOrganizationNotificationsAsRead,
      ).toHaveBeenCalledWith("user-1", 100);
    });

    it("should propagate errors from repository", async () => {
      const mockError = new Error("Database error");
      vi.mocked(
        NotificationsRepository.markOrganizationNotificationsAsRead,
      ).mockRejectedValue(mockError);

      await expect(
        NotificationsService.markOrganizationNotificationsAsRead("user-1", 100),
      ).rejects.toThrow("Database error");
    });
  });
});
