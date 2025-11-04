import { Test, TestingModule } from "@nestjs/testing";
import { ScraperService } from "./scraper.service";
import { OrganizationsService } from "../organizations/organizations.service";
import { getQueueToken } from "@nestjs/bullmq";

describe("ScraperService", () => {
  let service: ScraperService;

  beforeEach(async () => {
    const mockQueue = {
      add: jest.fn(),
    };

    const mockOrganizationsService = {
      bulkUpdateSyncPending: jest.fn(),
      getAllOrganizationIdsFromDashboardId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScraperService,
        {
          provide: getQueueToken("organization-scrape-queue"),
          useValue: mockQueue,
        },
        {
          provide: OrganizationsService,
          useValue: mockOrganizationsService,
        },
      ],
    }).compile();

    service = module.get<ScraperService>(ScraperService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
