import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { WatchersRepository } from "./watchers.repository";
import { supabase } from "@/lib/supabase.lib";

// Mock the supabase client
vi.mock("@/lib/supabase.lib", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

// Mock the createSubscription function
vi.mock("./_subscriptionManager", () => ({
  createSubscription: vi.fn(
    (_channelName, _table, _filter, loadInitialData) => {
      // Call loadInitialData immediately for testing
      loadInitialData();
      // Return a mock cleanup function
      return vi.fn();
    },
  ),
}));

describe("WatchersRepository", () => {
  const mockSupabaseFrom = vi.mocked(supabase.from);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getWatchersForUser", () => {
    it("should return watchers for a user in a dashboard", async () => {
      const mockWatchers = [
        {
          id: 1,
          user_id: "user-1",
          dashboard_id: 1,
          organization_id: 100,
          meeting_id: null,
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          user_id: "user-1",
          dashboard_id: 1,
          organization_id: null,
          meeting_id: 200,
          created_at: new Date().toISOString(),
        },
      ];

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          data: mockWatchers,
          error: null,
          status: 200,
        }),
      };

      mockSupabaseFrom.mockReturnValue(mockQuery as unknown);

      const result = await WatchersRepository.getWatchersForUser("user-1");

      expect(mockSupabaseFrom).toHaveBeenCalledWith("watchers");
      expect(mockQuery.select).toHaveBeenCalledWith("*");
      expect(mockQuery.eq).toHaveBeenCalledWith("user_id", "user-1");
      expect(result).toEqual(mockWatchers);
    });

    it("should return empty array when no watchers exist", async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
      };

      mockQuery.eq
        .mockReturnValueOnce(mockQuery) // First eq() returns the chain
        .mockResolvedValueOnce({
          // Second eq() resolves
          data: null,
          error: null,
          status: 200,
        });

      mockSupabaseFrom.mockReturnValue(mockQuery as unknown);

      const result = await WatchersRepository.getWatchersForUser("user-1");

      expect(result).toEqual([]);
    });

    it("should throw RepositoryError on database error", async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
      };

      mockQuery.eq.mockResolvedValueOnce({
        data: null,
        error: { message: "Database error" },
        status: 500,
      });

      mockSupabaseFrom.mockReturnValue(mockQuery as unknown);

      await expect(
        WatchersRepository.getWatchersForUser("user-1"),
      ).rejects.toThrow();
    });
  });

  describe("isWatchingOrganization", () => {
    it("should return true when user is watching organization", async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        is: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({
          data: { id: 1 },
          error: null,
        }),
      };

      mockSupabaseFrom.mockReturnValue(mockQuery as unknown);

      const result = await WatchersRepository.isWatchingOrganization(
        "user-1",
        100,
      );

      expect(mockSupabaseFrom).toHaveBeenCalledWith("watchers");
      expect(mockQuery.select).toHaveBeenCalledWith("id");
      expect(mockQuery.eq).toHaveBeenCalledWith("user_id", "user-1");
      expect(mockQuery.eq).toHaveBeenCalledWith("organization_id", 100);
      expect(mockQuery.is).toHaveBeenCalledWith("meeting_id", null);
      expect(result).toBe(true);
    });

    it("should return false when user is not watching organization", async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        is: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      };

      mockSupabaseFrom.mockReturnValue(mockQuery as unknown);

      const result = await WatchersRepository.isWatchingOrganization(
        "user-1",
        100,
      );

      expect(result).toBe(false);
    });

    it("should return false on database error", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        is: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({
          data: null,
          error: { message: "Database error" },
        }),
      };

      mockSupabaseFrom.mockReturnValue(mockQuery as unknown);

      const result = await WatchersRepository.isWatchingOrganization(
        "user-1",
        100,
      );

      expect(result).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe("isWatchingMeeting", () => {
    it("should return true when user is watching meeting", async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        is: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({
          data: { id: 2 },
          error: null,
        }),
      };

      mockSupabaseFrom.mockReturnValue(mockQuery as unknown);

      const result = await WatchersRepository.isWatchingMeeting("user-1", 200);

      expect(mockSupabaseFrom).toHaveBeenCalledWith("watchers");
      expect(mockQuery.select).toHaveBeenCalledWith("id");
      expect(mockQuery.eq).toHaveBeenCalledWith("user_id", "user-1");
      expect(mockQuery.eq).toHaveBeenCalledWith("meeting_id", 200);
      expect(mockQuery.is).toHaveBeenCalledWith("organization_id", null);
      expect(result).toBe(true);
    });

    it("should return false when user is not watching meeting", async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        is: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      };

      mockSupabaseFrom.mockReturnValue(mockQuery as unknown);

      const result = await WatchersRepository.isWatchingMeeting("user-1", 200);

      expect(result).toBe(false);
    });
  });

  describe("addOrganizationWatcher", () => {
    it("should add a watcher for an organization", async () => {
      const mockWatcher = {
        id: 3,
        user_id: "user-1",
        dashboard_id: 1,
        organization_id: 100,
        meeting_id: null,
        created_at: new Date().toISOString(),
      };

      const mockQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: mockWatcher,
          error: null,
          status: 201,
        }),
      };

      mockSupabaseFrom.mockReturnValue(mockQuery as unknown);

      const result = await WatchersRepository.addOrganizationWatcher(
        "user-1",
        1,
        100,
      );

      expect(mockSupabaseFrom).toHaveBeenCalledWith("watchers");
      expect(mockQuery.insert).toHaveBeenCalledWith({
        user_id: "user-1",
        dashboard_id: 1,
        organization_id: 100,
        meeting_id: null,
      });
      expect(mockQuery.select).toHaveBeenCalledWith("*");
      expect(result).toEqual(mockWatcher);
    });

    it("should throw RepositoryError on duplicate", async () => {
      const mockQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { code: "23505", message: "Unique constraint violation" },
          status: 409,
        }),
      };

      mockSupabaseFrom.mockReturnValue(mockQuery as unknown);

      await expect(
        WatchersRepository.addOrganizationWatcher("user-1", 1, 100),
      ).rejects.toThrow();
    });
  });

  describe("addMeetingWatcher", () => {
    it("should add a watcher for a meeting", async () => {
      const mockWatcher = {
        id: 4,
        user_id: "user-1",
        dashboard_id: 1,
        organization_id: null,
        meeting_id: 200,
        created_at: new Date().toISOString(),
      };

      const mockQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: mockWatcher,
          error: null,
          status: 201,
        }),
      };

      mockSupabaseFrom.mockReturnValue(mockQuery as unknown);

      const result = await WatchersRepository.addMeetingWatcher(
        "user-1",
        1,
        200,
      );

      expect(mockSupabaseFrom).toHaveBeenCalledWith("watchers");
      expect(mockQuery.insert).toHaveBeenCalledWith({
        user_id: "user-1",
        dashboard_id: 1,
        organization_id: null,
        meeting_id: 200,
      });
      expect(result).toEqual(mockWatcher);
    });
  });

  describe("removeOrganizationWatcher", () => {
    it("should remove a watcher for an organization", async () => {
      const mockQuery = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        is: vi.fn().mockResolvedValue({
          error: null,
          status: 204,
        }),
      };

      mockSupabaseFrom.mockReturnValue(mockQuery as unknown);

      await WatchersRepository.removeOrganizationWatcher("user-1", 100);

      expect(mockSupabaseFrom).toHaveBeenCalledWith("watchers");
      expect(mockQuery.delete).toHaveBeenCalled();
      expect(mockQuery.eq).toHaveBeenCalledWith("user_id", "user-1");
      expect(mockQuery.eq).toHaveBeenCalledWith("organization_id", 100);
      expect(mockQuery.is).toHaveBeenCalledWith("meeting_id", null);
    });

    it("should throw RepositoryError on database error", async () => {
      const mockQuery = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        is: vi.fn().mockResolvedValue({
          error: { message: "Database error" },
          status: 500,
        }),
      };

      mockSupabaseFrom.mockReturnValue(mockQuery as unknown);

      await expect(
        WatchersRepository.removeOrganizationWatcher("user-1", 100),
      ).rejects.toThrow();
    });
  });

  describe("removeMeetingWatcher", () => {
    it("should remove a watcher for a meeting", async () => {
      const mockQuery = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        is: vi.fn().mockResolvedValue({
          error: null,
          status: 204,
        }),
      };

      mockSupabaseFrom.mockReturnValue(mockQuery as unknown);

      await WatchersRepository.removeMeetingWatcher("user-1", 200);

      expect(mockSupabaseFrom).toHaveBeenCalledWith("watchers");
      expect(mockQuery.delete).toHaveBeenCalled();
      expect(mockQuery.eq).toHaveBeenCalledWith("user_id", "user-1");
      expect(mockQuery.eq).toHaveBeenCalledWith("meeting_id", 200);
      expect(mockQuery.is).toHaveBeenCalledWith("organization_id", null);
    });
  });

  describe("subscribeToWatchers", () => {
    it("should set up subscription and call initial load", async () => {
      const mockWatchers = [
        {
          id: 1,
          user_id: "user-1",
          dashboard_id: 1,
          organization_id: 100,
          meeting_id: null,
          created_at: new Date().toISOString(),
        },
      ];

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          data: mockWatchers,
          error: null,
          status: 200,
        }),
      };

      mockSupabaseFrom.mockReturnValue(mockQuery as unknown);

      const onPayload = vi.fn();
      const unsubscribe = WatchersRepository.subscribeToWatchers(
        "user-1",
        onPayload,
      );

      // Wait for initial load to complete
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(onPayload).toHaveBeenCalledWith(mockWatchers, "initial");
      expect(typeof unsubscribe).toBe("function");
    });
  });
});
