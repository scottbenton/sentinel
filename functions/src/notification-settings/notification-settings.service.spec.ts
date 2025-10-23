import { Test, TestingModule } from "@nestjs/testing";
import { NotificationSettingsService } from "./notification-settings.service";
import { SupabaseService } from "../supabase/supabase.service";

describe("NotificationSettingsService", () => {
  let service: NotificationSettingsService;
  let supabaseService: SupabaseService;

  const mockSupabaseClient = {
    from: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationSettingsService,
        {
          provide: SupabaseService,
          useValue: {
            supabase: mockSupabaseClient,
          },
        },
      ],
    }).compile();

    service = module.get<NotificationSettingsService>(
      NotificationSettingsService
    );
    supabaseService = module.get<SupabaseService>(SupabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getNotificationSettings", () => {
    it("should return settings when they exist", async () => {
      const mockSettings = {
        id: 1,
        user_id: "user-1",
        dashboard_id: 1,
        organization_id: null,
        meeting_id: null,
        settings: {
          enabledNotificationTypes: ["meeting_created", "comment_added"],
          autoWatchNewMeetings: true,
        },
        created_at: new Date().toISOString(),
      };

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockReturnThis(),
        maybeSingle: jest
          .fn()
          .mockResolvedValue({ data: mockSettings, error: null }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      const result = await service.getNotificationSettings(
        "user-1",
        1,
        null,
        null
      );

      expect(mockSupabaseClient.from).toHaveBeenCalledWith(
        "notification_settings"
      );
      expect(mockQuery.select).toHaveBeenCalledWith("*");
      expect(mockQuery.eq).toHaveBeenCalledWith("user_id", "user-1");
      expect(mockQuery.eq).toHaveBeenCalledWith("dashboard_id", 1);
      expect(mockQuery.is).toHaveBeenCalledWith("organization_id", null);
      expect(mockQuery.is).toHaveBeenCalledWith("meeting_id", null);
      expect(result).toEqual({
        enabledNotificationTypes: ["meeting_created", "comment_added"],
        autoWatchNewMeetings: true,
      });
    });

    it("should return default settings when none exist", async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      const result = await service.getNotificationSettings(
        "user-1",
        1,
        null,
        null
      );

      expect(result).toEqual({
        enabledNotificationTypes: [],
        autoWatchNewMeetings: false,
      });
    });

    it("should query with organization_id when provided", async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      await service.getNotificationSettings("user-1", 1, 100, null);

      expect(mockQuery.eq).toHaveBeenCalledWith("organization_id", 100);
    });

    it("should query with meeting_id when provided", async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      await service.getNotificationSettings("user-1", 1, null, 200);

      expect(mockQuery.eq).toHaveBeenCalledWith("meeting_id", 200);
    });

    it("should throw error when database query fails", async () => {
      const mockError = { message: "Database error" };
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockReturnThis(),
        maybeSingle: jest
          .fn()
          .mockResolvedValue({ data: null, error: mockError }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      await expect(
        service.getNotificationSettings("user-1", 1, null, null)
      ).rejects.toThrow(
        "Error fetching notification settings: Database error"
      );
    });
  });

  describe("hasNotificationEnabled", () => {
    it("should return true when notification type is enabled", async () => {
      const mockSettings = {
        id: 1,
        user_id: "user-1",
        dashboard_id: 1,
        organization_id: null,
        meeting_id: null,
        settings: {
          enabledNotificationTypes: ["meeting_created", "comment_added"],
          autoWatchNewMeetings: false,
        },
        created_at: new Date().toISOString(),
      };

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockReturnThis(),
        maybeSingle: jest
          .fn()
          .mockResolvedValue({ data: mockSettings, error: null }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      const result = await service.hasNotificationEnabled(
        "user-1",
        1,
        "meeting_created"
      );

      expect(result).toBe(true);
    });

    it("should return false when notification type is not enabled", async () => {
      const mockSettings = {
        id: 1,
        user_id: "user-1",
        dashboard_id: 1,
        organization_id: null,
        meeting_id: null,
        settings: {
          enabledNotificationTypes: ["comment_added"],
          autoWatchNewMeetings: false,
        },
        created_at: new Date().toISOString(),
      };

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockReturnThis(),
        maybeSingle: jest
          .fn()
          .mockResolvedValue({ data: mockSettings, error: null }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      const result = await service.hasNotificationEnabled(
        "user-1",
        1,
        "meeting_created"
      );

      expect(result).toBe(false);
    });

    it("should return false when no settings exist", async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      const result = await service.hasNotificationEnabled(
        "user-1",
        1,
        "meeting_created"
      );

      expect(result).toBe(false);
    });
  });

  describe("hasAutoWatchEnabled", () => {
    it("should return true when auto-watch is enabled", async () => {
      const mockSettings = {
        id: 1,
        user_id: "user-1",
        dashboard_id: 1,
        organization_id: null,
        meeting_id: null,
        settings: {
          enabledNotificationTypes: [],
          autoWatchNewMeetings: true,
        },
        created_at: new Date().toISOString(),
      };

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockReturnThis(),
        maybeSingle: jest
          .fn()
          .mockResolvedValue({ data: mockSettings, error: null }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      const result = await service.hasAutoWatchEnabled("user-1", 1);

      expect(result).toBe(true);
    });

    it("should return false when auto-watch is disabled", async () => {
      const mockSettings = {
        id: 1,
        user_id: "user-1",
        dashboard_id: 1,
        organization_id: null,
        meeting_id: null,
        settings: {
          enabledNotificationTypes: [],
          autoWatchNewMeetings: false,
        },
        created_at: new Date().toISOString(),
      };

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockReturnThis(),
        maybeSingle: jest
          .fn()
          .mockResolvedValue({ data: mockSettings, error: null }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      const result = await service.hasAutoWatchEnabled("user-1", 1);

      expect(result).toBe(false);
    });

    it("should return false when no settings exist", async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      const result = await service.hasAutoWatchEnabled("user-1", 1);

      expect(result).toBe(false);
    });
  });
});
