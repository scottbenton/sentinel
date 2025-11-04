import { describe, it, expect, vi, beforeEach } from "vitest";
import { WatchersService } from "./watchers.service";
import { WatchersRepository } from "@/repository/watchers.repository";

// Mock the repository
vi.mock("@/repository/watchers.repository", () => ({
  WatchersRepository: {
    getWatchersForUser: vi.fn(),
    isWatchingOrganization: vi.fn(),
    isWatchingMeeting: vi.fn(),
    addOrganizationWatcher: vi.fn(),
    addMeetingWatcher: vi.fn(),
    removeOrganizationWatcher: vi.fn(),
    removeMeetingWatcher: vi.fn(),
    subscribeToWatchers: vi.fn(),
  },
}));

describe("WatchersService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getWatchersForUser", () => {
    it("should convert DTOs to IWatcher interfaces", async () => {
      const mockDTOs = [
        {
          id: 1,
          user_id: "user-1",
          dashboard_id: 1,
          organization_id: 100,
          meeting_id: null,
          created_at: "2025-01-01T00:00:00Z",
        },
        {
          id: 2,
          user_id: "user-1",
          dashboard_id: 1,
          organization_id: null,
          meeting_id: 200,
          created_at: "2025-01-02T00:00:00Z",
        },
      ];

      vi.mocked(WatchersRepository.getWatchersForUser).mockResolvedValue(
        mockDTOs,
      );

      const result = await WatchersService.getWatchersForUser("user-1");

      expect(WatchersRepository.getWatchersForUser).toHaveBeenCalledWith(
        "user-1",
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 1,
        userId: "user-1",
        dashboardId: 1,
        organizationId: 100,
        meetingId: null,
        createdAt: new Date("2025-01-01T00:00:00Z"),
      });
      expect(result[1]).toEqual({
        id: 2,
        userId: "user-1",
        dashboardId: 1,
        organizationId: null,
        meetingId: 200,
        createdAt: new Date("2025-01-02T00:00:00Z"),
      });
    });

    it("should return empty array when no watchers exist", async () => {
      vi.mocked(WatchersRepository.getWatchersForUser).mockResolvedValue([]);

      const result = await WatchersService.getWatchersForUser("user-1");

      expect(result).toEqual([]);
    });

    it("should convert dates correctly", async () => {
      const mockDTOs = [
        {
          id: 1,
          user_id: "user-1",
          dashboard_id: 1,
          organization_id: 100,
          meeting_id: null,
          created_at: "2025-10-23T12:00:00.000Z",
        },
      ];

      vi.mocked(WatchersRepository.getWatchersForUser).mockResolvedValue(
        mockDTOs,
      );

      const result = await WatchersService.getWatchersForUser("user-1");

      expect(result[0].createdAt).toBeInstanceOf(Date);
      expect(result[0].createdAt.toISOString()).toBe(
        "2025-10-23T12:00:00.000Z",
      );
    });
  });

  describe("isWatchingOrganization", () => {
    it("should return true when watching", async () => {
      vi.mocked(WatchersRepository.isWatchingOrganization).mockResolvedValue(
        true,
      );

      const result = await WatchersService.isWatchingOrganization(
        "user-1",
        100,
      );

      expect(WatchersRepository.isWatchingOrganization).toHaveBeenCalledWith(
        "user-1",
        100,
      );
      expect(result).toBe(true);
    });

    it("should return false when not watching", async () => {
      vi.mocked(WatchersRepository.isWatchingOrganization).mockResolvedValue(
        false,
      );

      const result = await WatchersService.isWatchingOrganization(
        "user-1",
        100,
      );

      expect(result).toBe(false);
    });
  });

  describe("isWatchingMeeting", () => {
    it("should return true when watching", async () => {
      vi.mocked(WatchersRepository.isWatchingMeeting).mockResolvedValue(true);

      const result = await WatchersService.isWatchingMeeting("user-1", 200);

      expect(WatchersRepository.isWatchingMeeting).toHaveBeenCalledWith(
        "user-1",
        200,
      );
      expect(result).toBe(true);
    });

    it("should return false when not watching", async () => {
      vi.mocked(WatchersRepository.isWatchingMeeting).mockResolvedValue(false);

      const result = await WatchersService.isWatchingMeeting("user-1", 200);

      expect(result).toBe(false);
    });
  });

  describe("toggleOrganizationWatch", () => {
    it("should remove watcher when currently watching", async () => {
      vi.mocked(WatchersRepository.removeOrganizationWatcher).mockResolvedValue(
        undefined,
      );

      await WatchersService.toggleOrganizationWatch("user-1", 1, 100, true);

      expect(WatchersRepository.removeOrganizationWatcher).toHaveBeenCalledWith(
        "user-1",
        100,
      );
      expect(WatchersRepository.addOrganizationWatcher).not.toHaveBeenCalled();
    });

    it("should add watcher when not currently watching", async () => {
      const mockDTO = {
        id: 3,
        user_id: "user-1",
        dashboard_id: 1,
        organization_id: 100,
        meeting_id: null,
        created_at: "2025-01-01T00:00:00Z",
      };

      vi.mocked(WatchersRepository.addOrganizationWatcher).mockResolvedValue(
        mockDTO,
      );

      await WatchersService.toggleOrganizationWatch("user-1", 1, 100, false);

      expect(WatchersRepository.addOrganizationWatcher).toHaveBeenCalledWith(
        "user-1",
        1,
        100,
      );
      expect(
        WatchersRepository.removeOrganizationWatcher,
      ).not.toHaveBeenCalled();
    });
  });

  describe("toggleMeetingWatch", () => {
    it("should remove watcher when currently watching", async () => {
      vi.mocked(WatchersRepository.removeMeetingWatcher).mockResolvedValue(
        undefined,
      );

      await WatchersService.toggleMeetingWatch("user-1", 1, 200, true);

      expect(WatchersRepository.removeMeetingWatcher).toHaveBeenCalledWith(
        "user-1",
        200,
      );
      expect(WatchersRepository.addMeetingWatcher).not.toHaveBeenCalled();
    });

    it("should add watcher when not currently watching", async () => {
      const mockDTO = {
        id: 4,
        user_id: "user-1",
        dashboard_id: 1,
        organization_id: null,
        meeting_id: 200,
        created_at: "2025-01-01T00:00:00Z",
      };

      vi.mocked(WatchersRepository.addMeetingWatcher).mockResolvedValue(
        mockDTO,
      );

      await WatchersService.toggleMeetingWatch("user-1", 1, 200, false);

      expect(WatchersRepository.addMeetingWatcher).toHaveBeenCalledWith(
        "user-1",
        1,
        200,
      );
      expect(WatchersRepository.removeMeetingWatcher).not.toHaveBeenCalled();
    });
  });

  describe("subscribeToWatchers", () => {
    it("should subscribe and convert DTOs in callback", () => {
      const mockDTOs = [
        {
          id: 1,
          user_id: "user-1",
          dashboard_id: 1,
          organization_id: 100,
          meeting_id: null,
          created_at: "2025-01-01T00:00:00Z",
        },
      ];

      const mockUnsubscribe = vi.fn();
      const onUpdate = vi.fn();

      vi.mocked(WatchersRepository.subscribeToWatchers).mockImplementation(
        (_userId, callback) => {
          // Simulate initial callback
          callback(mockDTOs, "initial");
          return mockUnsubscribe;
        },
      );

      const unsubscribe = WatchersService.subscribeToWatchers(
        "user-1",
        onUpdate,
      );

      expect(WatchersRepository.subscribeToWatchers).toHaveBeenCalledWith(
        "user-1",
        expect.any(Function),
      );
      expect(onUpdate).toHaveBeenCalledWith(
        [
          {
            id: 1,
            userId: "user-1",
            dashboardId: 1,
            organizationId: 100,
            meetingId: null,
            createdAt: new Date("2025-01-01T00:00:00Z"),
          },
        ],
        "initial",
      );
      expect(unsubscribe).toBe(mockUnsubscribe);
    });

    it("should handle insert events", () => {
      const mockDTO = {
        id: 2,
        user_id: "user-1",
        dashboard_id: 1,
        organization_id: null,
        meeting_id: 200,
        created_at: "2025-01-02T00:00:00Z",
      };

      const mockUnsubscribe = vi.fn();
      const onUpdate = vi.fn();

      vi.mocked(WatchersRepository.subscribeToWatchers).mockImplementation(
        (_userId, callback) => {
          // Simulate insert callback
          callback([mockDTO], "insert");
          return mockUnsubscribe;
        },
      );

      WatchersService.subscribeToWatchers("user-1", onUpdate);

      expect(onUpdate).toHaveBeenCalledWith(
        [
          {
            id: 2,
            userId: "user-1",
            dashboardId: 1,
            organizationId: null,
            meetingId: 200,
            createdAt: new Date("2025-01-02T00:00:00Z"),
          },
        ],
        "insert",
      );
    });

    it("should handle delete events", () => {
      const mockDTO = {
        id: 1,
        user_id: "user-1",
        dashboard_id: 1,
        organization_id: 100,
        meeting_id: null,
        created_at: "2025-01-01T00:00:00Z",
      };

      const mockUnsubscribe = vi.fn();
      const onUpdate = vi.fn();

      vi.mocked(WatchersRepository.subscribeToWatchers).mockImplementation(
        (_userId, callback) => {
          // Simulate delete callback
          callback([mockDTO], "delete");
          return mockUnsubscribe;
        },
      );

      WatchersService.subscribeToWatchers("user-1", onUpdate);

      expect(onUpdate).toHaveBeenCalledWith(
        [
          {
            id: 1,
            userId: "user-1",
            dashboardId: 1,
            organizationId: 100,
            meetingId: null,
            createdAt: new Date("2025-01-01T00:00:00Z"),
          },
        ],
        "delete",
      );
    });
  });
});
