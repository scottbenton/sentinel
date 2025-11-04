import { Test, TestingModule } from "@nestjs/testing";
import { SupabaseService } from "./supabase.service";
import { ConfigService } from "@nestjs/config";

describe("SupabaseService", () => {
  let service: SupabaseService;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn((key: string) => {
        const config: Record<string, string> = {
          SUPABASE_URL: "https://test.supabase.co",
          SUPABASE_SERVICE_ROLE_KEY: "test-key",
        };
        return config[key];
      }),
      getOrThrow: jest.fn((key: string) => {
        const config: Record<string, string> = {
          SUPABASE_URL: "https://test.supabase.co",
          SUPABASE_SERVICE_ROLE_KEY: "test-key",
        };
        return config[key];
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupabaseService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<SupabaseService>(SupabaseService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
