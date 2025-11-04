import { Test, TestingModule } from "@nestjs/testing";
import { OrganizationsService } from "./organizations.service";
import { SupabaseService } from "../supabase/supabase.service";

describe("OrganizationsService", () => {
  let service: OrganizationsService;

  beforeEach(async () => {
    const mockSupabaseService = {
      supabase: {
        from: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationsService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
      ],
    }).compile();

    service = module.get<OrganizationsService>(OrganizationsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
