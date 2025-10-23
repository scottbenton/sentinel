import { Test, TestingModule } from "@nestjs/testing";
import { WebhooksService } from "./webhooks.service";
import { SupabaseService } from "../supabase/supabase.service";
import { WatchersService } from "../watchers/watchers.service";
import { NotificationSettingsService } from "../notification-settings/notification-settings.service";

describe("WebhooksService", () => {
  let service: WebhooksService;
  let watchersService: WatchersService;
  let notificationSettingsService: NotificationSettingsService;

  const mockSupabaseClient = {
    from: jest.fn(),
  };

  const mockWatchersService = {
    getOrganizationWatchers: jest.fn(),
    getMeetingWatchers: jest.fn(),
    addMeetingWatcher: jest.fn(),
  };

  const mockNotificationSettingsService = {
    hasNotificationEnabled: jest.fn(),
    hasAutoWatchEnabled: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhooksService,
        {
          provide: SupabaseService,
          useValue: {
            supabase: mockSupabaseClient,
          },
        },
        {
          provide: WatchersService,
          useValue: mockWatchersService,
        },
        {
          provide: NotificationSettingsService,
          useValue: mockNotificationSettingsService,
        },
      ],
    }).compile();

    service = module.get<WebhooksService>(WebhooksService);
    watchersService = module.get<WatchersService>(WatchersService);
    notificationSettingsService = module.get<NotificationSettingsService>(
      NotificationSettingsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("handleMeetingInsert", () => {
    const mockMeetingRecord = {
      id: 200,
      name: "Test Meeting",
      organization_id: 100,
      dashboard_id: 1,
      meeting_date: "2025-11-01",
      created_at: new Date().toISOString(),
      created_by: "user-creator",
      location: null,
      notes: null,
    };

    const mockOrganization = {
      id: 100,
      name: "Test Organization",
      dashboard_id: 1,
      created_at: new Date().toISOString(),
      created_by: "user-creator",
      description: null,
      location: null,
    };

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

    beforeEach(() => {
      // Mock organization fetch
      const mockOrgQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest
          .fn()
          .mockResolvedValue({ data: mockOrganization, error: null }),
      };

      // Mock notification insert
      const mockNotificationQuery = {
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      };

      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === "organizations") return mockOrgQuery;
        if (table === "notifications") return mockNotificationQuery;
        return {};
      });
    });

    it("should create notifications for watchers with notifications enabled", async () => {
      mockWatchersService.getOrganizationWatchers.mockResolvedValue(
        mockWatchers,
      );
      mockNotificationSettingsService.hasNotificationEnabled
        .mockResolvedValueOnce(true) // user-1 has notifications enabled
        .mockResolvedValueOnce(false); // user-2 does not
      mockNotificationSettingsService.hasAutoWatchEnabled.mockResolvedValue(
        false,
      );

      await service.handleMeetingInsert(mockMeetingRecord);

      expect(mockWatchersService.getOrganizationWatchers).toHaveBeenCalledWith(
        100,
      );
      expect(
        mockNotificationSettingsService.hasNotificationEnabled,
      ).toHaveBeenCalledTimes(2);
      expect(
        mockNotificationSettingsService.hasNotificationEnabled,
      ).toHaveBeenCalledWith("user-1", 1, "meeting_created");
      expect(
        mockNotificationSettingsService.hasNotificationEnabled,
      ).toHaveBeenCalledWith("user-2", 1, "meeting_created");

      // Should only insert notification for user-1
      const notificationQuery = mockSupabaseClient.from("notifications");
      expect(notificationQuery.insert).toHaveBeenCalledTimes(1);
      expect(notificationQuery.insert).toHaveBeenCalledWith({
        type: "meeting_created",
        user_id: "user-1",
        log_id: null,
        additional_context: {
          meeting_id: 200,
          meeting_name: "Test Meeting",
          meeting_date: "2025-11-01",
          organization_id: 100,
          organization_name: "Test Organization",
        },
      });
    });

    it("should auto-watch meetings for watchers with auto-watch enabled", async () => {
      mockWatchersService.getOrganizationWatchers.mockResolvedValue([
        mockWatchers[0],
      ]);
      mockNotificationSettingsService.hasNotificationEnabled.mockResolvedValue(
        false,
      );
      mockNotificationSettingsService.hasAutoWatchEnabled.mockResolvedValue(
        true,
      );
      mockWatchersService.addMeetingWatcher.mockResolvedValue(undefined);

      await service.handleMeetingInsert(mockMeetingRecord);

      expect(mockWatchersService.addMeetingWatcher).toHaveBeenCalledWith(
        "user-1",
        1,
        200,
      );
    });

    it("should handle auto-watch errors gracefully (duplicate watchers)", async () => {
      mockWatchersService.getOrganizationWatchers.mockResolvedValue([
        mockWatchers[0],
      ]);
      mockNotificationSettingsService.hasNotificationEnabled.mockResolvedValue(
        false,
      );
      mockNotificationSettingsService.hasAutoWatchEnabled.mockResolvedValue(
        true,
      );
      mockWatchersService.addMeetingWatcher.mockRejectedValue(
        new Error("Unique constraint violation"),
      );

      // Should not throw
      await expect(
        service.handleMeetingInsert(mockMeetingRecord),
      ).resolves.not.toThrow();
    });

    it("should handle missing organization gracefully", async () => {
      const mockOrgQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
      };

      mockSupabaseClient.from.mockReturnValue(mockOrgQuery);

      await service.handleMeetingInsert(mockMeetingRecord);

      // Should return early without calling watchers service
      expect(
        mockWatchersService.getOrganizationWatchers,
      ).not.toHaveBeenCalled();
    });

    it("should handle organization fetch error gracefully", async () => {
      const mockOrgQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest
          .fn()
          .mockResolvedValue({ data: null, error: { message: "DB Error" } }),
      };

      mockSupabaseClient.from.mockReturnValue(mockOrgQuery);

      await service.handleMeetingInsert(mockMeetingRecord);

      // Should return early without calling watchers service
      expect(
        mockWatchersService.getOrganizationWatchers,
      ).not.toHaveBeenCalled();
    });

    it("should handle empty watchers list", async () => {
      mockWatchersService.getOrganizationWatchers.mockResolvedValue([]);

      await service.handleMeetingInsert(mockMeetingRecord);

      expect(mockWatchersService.getOrganizationWatchers).toHaveBeenCalled();
      expect(
        mockNotificationSettingsService.hasNotificationEnabled,
      ).not.toHaveBeenCalled();
    });
  });

  describe("handleLogInsert", () => {
    const mockCommentLog = {
      id: 300,
      type: "comment" as const,
      meeting_id: 200,
      org_id: null,
      created_by: "user-author",
      created_at: new Date().toISOString(),
      text: "Test comment",
      additional_context: {},
      edited_at: null,
      is_bot_action: false,
    };

    const mockMeeting = {
      id: 200,
      name: "Test Meeting",
      organization_id: 100,
      meeting_date: "2025-11-01",
      created_at: new Date().toISOString(),
      created_by: "user-creator",
      dashboard_id: 1,
      location: null,
      notes: null,
    };

    const mockOrganization = {
      id: 100,
      name: "Test Organization",
      dashboard_id: 1,
      created_at: new Date().toISOString(),
      created_by: "user-creator",
      description: null,
      location: null,
    };

    const mockMeetingWatchers = [
      {
        id: 3,
        user_id: "user-1",
        dashboard_id: 1,
        organization_id: null,
        meeting_id: 200,
        created_at: new Date().toISOString(),
      },
      {
        id: 4,
        user_id: "user-author", // The comment author
        dashboard_id: 1,
        organization_id: null,
        meeting_id: 200,
        created_at: new Date().toISOString(),
      },
    ];

    beforeEach(() => {
      const mockMeetingQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockMeeting, error: null }),
      };

      const mockOrgQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest
          .fn()
          .mockResolvedValue({ data: mockOrganization, error: null }),
      };

      const mockNotificationQuery = {
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      };

      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === "meetings") return mockMeetingQuery;
        if (table === "organizations") return mockOrgQuery;
        if (table === "notifications") return mockNotificationQuery;
        return {};
      });
    });

    it("should skip non-comment logs", async () => {
      const nonCommentLog = {
        ...mockCommentLog,
        type: "lifecycle" as const,
      };

      await service.handleLogInsert(nonCommentLog);

      expect(mockWatchersService.getMeetingWatchers).not.toHaveBeenCalled();
    });

    it("should create notifications for meeting watchers (except author)", async () => {
      mockWatchersService.getMeetingWatchers.mockResolvedValue(
        mockMeetingWatchers,
      );
      mockNotificationSettingsService.hasNotificationEnabled.mockResolvedValue(
        true,
      );

      await service.handleLogInsert(mockCommentLog);

      expect(mockWatchersService.getMeetingWatchers).toHaveBeenCalledWith(200);

      // Should check notification settings for user-1 only (not author)
      expect(
        mockNotificationSettingsService.hasNotificationEnabled,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockNotificationSettingsService.hasNotificationEnabled,
      ).toHaveBeenCalledWith("user-1", 1, "comment_added");

      // Should only insert notification for user-1 (not author)
      const notificationQuery = mockSupabaseClient.from("notifications");
      expect(notificationQuery.insert).toHaveBeenCalledTimes(1);
      expect(notificationQuery.insert).toHaveBeenCalledWith({
        type: "comment_added",
        user_id: "user-1",
        log_id: 300,
        additional_context: {
          meeting_id: 200,
          meeting_name: "Test Meeting",
          organization_id: 100,
          organization_name: "Test Organization",
        },
      });
    });

    it("should handle organization-level comments", async () => {
      const orgCommentLog = {
        ...mockCommentLog,
        meeting_id: null,
        org_id: 100,
      };

      const mockOrgWatchers = [
        {
          id: 5,
          user_id: "user-3",
          dashboard_id: 1,
          organization_id: 100,
          meeting_id: null,
          created_at: new Date().toISOString(),
        },
      ];

      mockWatchersService.getOrganizationWatchers.mockResolvedValue(
        mockOrgWatchers,
      );
      mockNotificationSettingsService.hasNotificationEnabled.mockResolvedValue(
        true,
      );

      await service.handleLogInsert(orgCommentLog);

      expect(mockWatchersService.getOrganizationWatchers).toHaveBeenCalledWith(
        100,
      );

      const notificationQuery = mockSupabaseClient.from("notifications");
      expect(notificationQuery.insert).toHaveBeenCalledWith({
        type: "comment_added",
        user_id: "user-3",
        log_id: 300,
        additional_context: {
          organization_id: 100,
          organization_name: "Test Organization",
        },
      });
    });

    it("should not notify watchers with notifications disabled", async () => {
      mockWatchersService.getMeetingWatchers.mockResolvedValue([
        mockMeetingWatchers[0],
      ]);
      mockNotificationSettingsService.hasNotificationEnabled.mockResolvedValue(
        false,
      );

      await service.handleLogInsert(mockCommentLog);

      const notificationQuery = mockSupabaseClient.from("notifications");
      expect(notificationQuery.insert).not.toHaveBeenCalled();
    });

    it("should handle log with neither meeting_id nor org_id", async () => {
      const invalidLog = {
        ...mockCommentLog,
        meeting_id: null,
        org_id: null,
      };

      await service.handleLogInsert(invalidLog);

      expect(mockWatchersService.getMeetingWatchers).not.toHaveBeenCalled();
      expect(
        mockWatchersService.getOrganizationWatchers,
      ).not.toHaveBeenCalled();
    });

    it("should handle missing meeting gracefully", async () => {
      const mockMeetingQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
      };

      mockSupabaseClient.from.mockReturnValue(mockMeetingQuery);

      await service.handleLogInsert(mockCommentLog);

      expect(mockWatchersService.getMeetingWatchers).not.toHaveBeenCalled();
    });

    it("should handle meeting fetch error gracefully", async () => {
      const mockMeetingQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest
          .fn()
          .mockResolvedValue({ data: null, error: { message: "DB Error" } }),
      };

      mockSupabaseClient.from.mockReturnValue(mockMeetingQuery);

      await service.handleLogInsert(mockCommentLog);

      expect(mockWatchersService.getMeetingWatchers).not.toHaveBeenCalled();
    });

    it("should handle empty watchers list", async () => {
      mockWatchersService.getMeetingWatchers.mockResolvedValue([]);

      await service.handleLogInsert(mockCommentLog);

      expect(mockWatchersService.getMeetingWatchers).toHaveBeenCalled();
      expect(
        mockNotificationSettingsService.hasNotificationEnabled,
      ).not.toHaveBeenCalled();
    });
  });
});
