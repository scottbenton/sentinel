import { Test, TestingModule } from "@nestjs/testing";
import { DashboardUsersService } from "./dashboard_users.service";
import { SupabaseService } from "../supabase/supabase.service";
import { EmailService } from "../email/email.service";

describe("DashboardUsersService", () => {
  let service: DashboardUsersService;

  beforeEach(async () => {
    const mockSupabaseService = {
      supabase: {
        from: jest.fn(),
      },
    };

    const mockEmailService = {
      sendEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardUsersService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<DashboardUsersService>(DashboardUsersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
