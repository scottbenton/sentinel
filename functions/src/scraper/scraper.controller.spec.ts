import { Test, TestingModule } from "@nestjs/testing";
import { ScraperController } from "./scraper.controller";
import { ScraperService } from "./scraper.service";
import { OrganizationsService } from "../organizations/organizations.service";
import { DashboardUsersService } from "../dashboard_users/dashboard_users.service";
import { AuthGuard } from "../auth/auth.guard";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

describe("ScraperController", () => {
  let controller: ScraperController;

  beforeEach(async () => {
    const mockScraperService = {
      addOrganizationToQueue: jest.fn(),
    };

    const mockOrganizationsService = {
      getOrganizationFromId: jest.fn(),
      getAllOrganizationIdsFromDashboardId: jest.fn(),
    };

    const mockDashboardUsersService = {
      checkUserIsUserMeetingAdmin: jest.fn(),
    };

    const mockJwtService = {
      verifyAsync: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn().mockReturnValue("test-secret"),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScraperController],
      providers: [
        {
          provide: ScraperService,
          useValue: mockScraperService,
        },
        {
          provide: OrganizationsService,
          useValue: mockOrganizationsService,
        },
        {
          provide: DashboardUsersService,
          useValue: mockDashboardUsersService,
        },
        AuthGuard,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<ScraperController>(ScraperController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
