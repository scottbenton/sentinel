import { describe, it, expect, vi, beforeEach } from "vitest";
import { useWatchersStore } from "./watchers.store";
import { WatchersService, IWatcher } from "@/services/watchers.service";

// Mock the service
vi.mock("@/services/watchers.service", () => ({
  WatchersService: {
    subscribeToWatchers: vi.fn(),
    toggleOrganizationWatch: vi.fn(),
    toggleMeetingWatch: vi.fn(),
  },
}));

describe("WatchersStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useWatchersStore.getState().resetStore();
  });

  describe("subscribeToWatchers", () => {
    it("should subscribe and handle initial watchers", () => {
      const mockWatchers: IWatcher[] = [
        {
          id: 1,
          userId: "user-1",
          dashboardId: 1,
          organizationId: 100,
          meetingId: null,
          createdAt: new Date("2025-01-01"),
        },
        {
          id: 2,
          userId: "user-1",
          dashboardId: 1,
          organizationId: null,
          meetingId: 200,
          createdAt: new Date("2025-01-02"),
        },
      ];

      const mockUnsubscribe = vi.fn();

      vi.mocked(WatchersService.subscribeToWatchers).mockImplementation(
        (_userId, callback) => {
          // Simulate initial callback
          callback(mockWatchers, "initial");
          return mockUnsubscribe;
        },
      );

      const { subscribeToWatchers } = useWatchersStore.getState();
      const unsubscribe = subscribeToWatchers("user-1");

      const state = useWatchersStore.getState();

      // Should populate organization watchers
      expect(state.organizationWatchers[100]).toEqual(mockWatchers[0]);
      // Should populate meeting watchers
      expect(state.meetingWatchers[200]).toEqual(mockWatchers[1]);
      // Should set loading to false
      expect(state.isLoading).toBe(false);
      // Should return unsubscribe function
      expect(unsubscribe).toBe(mockUnsubscribe);
    });

    it("should handle insert events", () => {
      const mockUnsubscribe = vi.fn();

      vi.mocked(WatchersService.subscribeToWatchers).mockImplementation(
        (_userId, callback) => {
          // First send initial (empty)
          callback([], "initial");
          // Then send insert
          callback(
            [
              {
                id: 3,
                userId: "user-1",
                dashboardId: 1,
                organizationId: 100,
                meetingId: null,
                createdAt: new Date("2025-01-03"),
              },
            ],
            "insert",
          );
          return mockUnsubscribe;
        },
      );

      const { subscribeToWatchers } = useWatchersStore.getState();
      subscribeToWatchers("user-1");

      const state = useWatchersStore.getState();

      expect(state.organizationWatchers[100]).toBeDefined();
      expect(state.organizationWatchers[100].id).toBe(3);
    });

    it("should handle delete events", () => {
      const mockUnsubscribe = vi.fn();

      vi.mocked(WatchersService.subscribeToWatchers).mockImplementation(
        (_userId, callback) => {
          // First send initial with watcher
          callback(
            [
              {
                id: 4,
                userId: "user-1",
                dashboardId: 1,
                organizationId: 100,
                meetingId: null,
                createdAt: new Date("2025-01-04"),
              },
            ],
            "initial",
          );
          // Then send delete
          callback(
            [
              {
                id: 4,
                userId: "user-1",
                dashboardId: 1,
                organizationId: 100,
                meetingId: null,
                createdAt: new Date("2025-01-04"),
              },
            ],
            "delete",
          );
          return mockUnsubscribe;
        },
      );

      const { subscribeToWatchers } = useWatchersStore.getState();
      subscribeToWatchers("user-1");

      const state = useWatchersStore.getState();

      expect(state.organizationWatchers[100]).toBeUndefined();
    });

    it("should reset watchers on initial load", () => {
      const mockUnsubscribe = vi.fn();

      // First subscription
      vi.mocked(WatchersService.subscribeToWatchers).mockImplementationOnce(
        (_userId, callback) => {
          callback(
            [
              {
                id: 1,
                userId: "user-1",
                dashboardId: 1,
                organizationId: 100,
                meetingId: null,
                createdAt: new Date(),
              },
            ],
            "initial",
          );
          return mockUnsubscribe;
        },
      );

      const { subscribeToWatchers } = useWatchersStore.getState();
      subscribeToWatchers("user-1");

      expect(
        useWatchersStore.getState().organizationWatchers[100],
      ).toBeDefined();

      // Second subscription with different data
      vi.mocked(WatchersService.subscribeToWatchers).mockImplementationOnce(
        (_userId, callback) => {
          callback(
            [
              {
                id: 2,
                userId: "user-1",
                dashboardId: 1,
                organizationId: 200,
                meetingId: null,
                createdAt: new Date(),
              },
            ],
            "initial",
          );
          return mockUnsubscribe;
        },
      );

      subscribeToWatchers("user-1");

      const state = useWatchersStore.getState();
      // Should have reset and only contain new data
      expect(state.organizationWatchers[100]).toBeUndefined();
      expect(state.organizationWatchers[200]).toBeDefined();
    });
  });

  describe("toggleOrganizationWatch", () => {
    it("should toggle organization watch when not currently watching", async () => {
      vi.mocked(WatchersService.toggleOrganizationWatch).mockResolvedValue(
        undefined,
      );

      const { toggleOrganizationWatch } = useWatchersStore.getState();
      await toggleOrganizationWatch("user-1", 1, 100);

      expect(WatchersService.toggleOrganizationWatch).toHaveBeenCalledWith(
        "user-1",
        1,
        100,
        false, // Not currently watching
      );
    });

    it("should toggle organization watch when currently watching", async () => {
      // Set up store with existing watcher
      const mockUnsubscribe = vi.fn();
      vi.mocked(WatchersService.subscribeToWatchers).mockImplementation(
        (_userId, callback) => {
          callback(
            [
              {
                id: 1,
                userId: "user-1",
                dashboardId: 1,
                organizationId: 100,
                meetingId: null,
                createdAt: new Date(),
              },
            ],
            "initial",
          );
          return mockUnsubscribe;
        },
      );

      const { subscribeToWatchers, toggleOrganizationWatch } =
        useWatchersStore.getState();
      subscribeToWatchers("user-1");

      vi.mocked(WatchersService.toggleOrganizationWatch).mockResolvedValue(
        undefined,
      );

      await toggleOrganizationWatch("user-1", 1, 100);

      expect(WatchersService.toggleOrganizationWatch).toHaveBeenCalledWith(
        "user-1",
        1,
        100,
        true, // Currently watching
      );
    });

    it("should handle errors when toggling organization watch", async () => {
      const mockError = new Error("Failed to toggle watch");
      vi.mocked(WatchersService.toggleOrganizationWatch).mockRejectedValue(
        mockError,
      );

      const { toggleOrganizationWatch } = useWatchersStore.getState();

      await expect(toggleOrganizationWatch("user-1", 1, 100)).rejects.toThrow(
        "Failed to toggle watch",
      );

      expect(useWatchersStore.getState().error).toBe("Failed to toggle watch");
    });
  });

  describe("toggleMeetingWatch", () => {
    it("should toggle meeting watch when not currently watching", async () => {
      vi.mocked(WatchersService.toggleMeetingWatch).mockResolvedValue(
        undefined,
      );

      const { toggleMeetingWatch } = useWatchersStore.getState();
      await toggleMeetingWatch("user-1", 1, 200);

      expect(WatchersService.toggleMeetingWatch).toHaveBeenCalledWith(
        "user-1",
        1,
        200,
        false,
      );
    });

    it("should toggle meeting watch when currently watching", async () => {
      // Set up store with existing watcher
      const mockUnsubscribe = vi.fn();
      vi.mocked(WatchersService.subscribeToWatchers).mockImplementation(
        (_userId, callback) => {
          callback(
            [
              {
                id: 2,
                userId: "user-1",
                dashboardId: 1,
                organizationId: null,
                meetingId: 200,
                createdAt: new Date(),
              },
            ],
            "initial",
          );
          return mockUnsubscribe;
        },
      );

      const { subscribeToWatchers, toggleMeetingWatch } =
        useWatchersStore.getState();
      subscribeToWatchers("user-1");

      vi.mocked(WatchersService.toggleMeetingWatch).mockResolvedValue(
        undefined,
      );

      await toggleMeetingWatch("user-1", 1, 200);

      expect(WatchersService.toggleMeetingWatch).toHaveBeenCalledWith(
        "user-1",
        1,
        200,
        true,
      );
    });

    it("should handle errors when toggling meeting watch", async () => {
      const mockError = new Error("Failed to toggle meeting watch");
      vi.mocked(WatchersService.toggleMeetingWatch).mockRejectedValue(
        mockError,
      );

      const { toggleMeetingWatch } = useWatchersStore.getState();

      await expect(toggleMeetingWatch("user-1", 1, 200)).rejects.toThrow(
        "Failed to toggle meeting watch",
      );

      expect(useWatchersStore.getState().error).toBe(
        "Failed to toggle meeting watch",
      );
    });
  });

  describe("isWatchingOrganization", () => {
    it("should return true when watching organization", () => {
      const mockUnsubscribe = vi.fn();
      vi.mocked(WatchersService.subscribeToWatchers).mockImplementation(
        (_userId, callback) => {
          callback(
            [
              {
                id: 1,
                userId: "user-1",
                dashboardId: 1,
                organizationId: 100,
                meetingId: null,
                createdAt: new Date(),
              },
            ],
            "initial",
          );
          return mockUnsubscribe;
        },
      );

      const { subscribeToWatchers, isWatchingOrganization } =
        useWatchersStore.getState();
      subscribeToWatchers("user-1");

      expect(isWatchingOrganization(100)).toBe(true);
    });

    it("should return false when not watching organization", () => {
      const { isWatchingOrganization } = useWatchersStore.getState();
      expect(isWatchingOrganization(999)).toBe(false);
    });
  });

  describe("isWatchingMeeting", () => {
    it("should return true when watching meeting", () => {
      const mockUnsubscribe = vi.fn();
      vi.mocked(WatchersService.subscribeToWatchers).mockImplementation(
        (_userId, callback) => {
          callback(
            [
              {
                id: 2,
                userId: "user-1",
                dashboardId: 1,
                organizationId: null,
                meetingId: 200,
                createdAt: new Date(),
              },
            ],
            "initial",
          );
          return mockUnsubscribe;
        },
      );

      const { subscribeToWatchers, isWatchingMeeting } =
        useWatchersStore.getState();
      subscribeToWatchers("user-1");

      expect(isWatchingMeeting(200)).toBe(true);
    });

    it("should return false when not watching meeting", () => {
      const { isWatchingMeeting } = useWatchersStore.getState();
      expect(isWatchingMeeting(999)).toBe(false);
    });
  });

  describe("resetStore", () => {
    it("should reset store to default state", () => {
      const mockUnsubscribe = vi.fn();
      vi.mocked(WatchersService.subscribeToWatchers).mockImplementation(
        (_userId, callback) => {
          callback(
            [
              {
                id: 1,
                userId: "user-1",
                dashboardId: 1,
                organizationId: 100,
                meetingId: null,
                createdAt: new Date(),
              },
            ],
            "initial",
          );
          return mockUnsubscribe;
        },
      );

      const { subscribeToWatchers, resetStore } = useWatchersStore.getState();
      subscribeToWatchers("user-1");

      expect(
        useWatchersStore.getState().organizationWatchers[100],
      ).toBeDefined();

      resetStore();

      const state = useWatchersStore.getState();
      expect(state.organizationWatchers).toEqual({});
      expect(state.meetingWatchers).toEqual({});
      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
    });
  });
});
