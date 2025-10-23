import { Test, TestingModule } from "@nestjs/testing";
import { WatchersService } from "./watchers.service";
import { SupabaseService } from "../supabase/supabase.service";

describe("WatchersService", () => {
  let service: WatchersService;
  let supabaseService: SupabaseService;

  const mockSupabaseClient = {
    from: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WatchersService,
        {
          provide: SupabaseService,
          useValue: {
            supabase: mockSupabaseClient,
          },
        },
      ],
    }).compile();

    service = module.get<WatchersService>(WatchersService);
    supabaseService = module.get<SupabaseService>(SupabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getOrganizationWatchers", () => {
    it("should return watchers for an organization", async () => {
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
          user_id: "user-2",
          dashboard_id: 1,
          organization_id: 100,
          meeting_id: null,
          created_at: new Date().toISOString(),
        },
      ];

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockResolvedValue({ data: mockWatchers, error: null }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      const result = await service.getOrganizationWatchers(100);

      expect(mockSupabaseClient.from).toHaveBeenCalledWith("watchers");
      expect(mockQuery.select).toHaveBeenCalledWith("*");
      expect(mockQuery.eq).toHaveBeenCalledWith("organization_id", 100);
      expect(mockQuery.is).toHaveBeenCalledWith("meeting_id", null);
      expect(result).toEqual(mockWatchers);
    });

    it("should throw error when database query fails", async () => {
      const mockError = { message: "Database error" };
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockResolvedValue({ data: null, error: mockError }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      await expect(service.getOrganizationWatchers(100)).rejects.toThrow(
        "Error fetching organization watchers: Database error"
      );
    });

    it("should return empty array when no watchers exist", async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockResolvedValue({ data: null, error: null }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      const result = await service.getOrganizationWatchers(100);

      expect(result).toEqual([]);
    });
  });

  describe("getMeetingWatchers", () => {
    it("should return watchers for a meeting", async () => {
      const mockWatchers = [
        {
          id: 3,
          user_id: "user-3",
          dashboard_id: 1,
          organization_id: null,
          meeting_id: 200,
          created_at: new Date().toISOString(),
        },
      ];

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockResolvedValue({ data: mockWatchers, error: null }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      const result = await service.getMeetingWatchers(200);

      expect(mockSupabaseClient.from).toHaveBeenCalledWith("watchers");
      expect(mockQuery.select).toHaveBeenCalledWith("*");
      expect(mockQuery.eq).toHaveBeenCalledWith("meeting_id", 200);
      expect(mockQuery.is).toHaveBeenCalledWith("organization_id", null);
      expect(result).toEqual(mockWatchers);
    });

    it("should throw error when database query fails", async () => {
      const mockError = { message: "Database error" };
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockResolvedValue({ data: null, error: mockError }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      await expect(service.getMeetingWatchers(200)).rejects.toThrow(
        "Error fetching meeting watchers: Database error"
      );
    });
  });

  describe("addOrganizationWatcher", () => {
    it("should add a watcher to an organization", async () => {
      const mockQuery = {
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      await service.addOrganizationWatcher("user-1", 1, 100);

      expect(mockSupabaseClient.from).toHaveBeenCalledWith("watchers");
      expect(mockQuery.insert).toHaveBeenCalledWith({
        user_id: "user-1",
        dashboard_id: 1,
        organization_id: 100,
        meeting_id: null,
      });
    });

    it("should throw error when insert fails", async () => {
      const mockError = { message: "Unique constraint violation" };
      const mockQuery = {
        insert: jest.fn().mockResolvedValue({ data: null, error: mockError }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      await expect(
        service.addOrganizationWatcher("user-1", 1, 100)
      ).rejects.toThrow(
        "Error adding organization watcher: Unique constraint violation"
      );
    });
  });

  describe("addMeetingWatcher", () => {
    it("should add a watcher to a meeting", async () => {
      const mockQuery = {
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      await service.addMeetingWatcher("user-1", 1, 200);

      expect(mockSupabaseClient.from).toHaveBeenCalledWith("watchers");
      expect(mockQuery.insert).toHaveBeenCalledWith({
        user_id: "user-1",
        dashboard_id: 1,
        organization_id: null,
        meeting_id: 200,
      });
    });

    it("should throw error when insert fails", async () => {
      const mockError = { message: "Foreign key violation" };
      const mockQuery = {
        insert: jest.fn().mockResolvedValue({ data: null, error: mockError }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      await expect(
        service.addMeetingWatcher("user-1", 1, 200)
      ).rejects.toThrow("Error adding meeting watcher: Foreign key violation");
    });
  });
});
