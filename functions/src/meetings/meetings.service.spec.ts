import { Test, TestingModule } from "@nestjs/testing";
import { MeetingsService } from "./meetings.service";
import { SupabaseService } from "../supabase/supabase.service";

describe("MeetingsService", () => {
  let service: MeetingsService;

  beforeEach(async () => {
    const mockSupabaseService = {
      supabase: {
        from: jest.fn(),
        storage: {
          from: jest.fn(),
        },
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeetingsService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
      ],
    }).compile();

    service = module.get<MeetingsService>(MeetingsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
