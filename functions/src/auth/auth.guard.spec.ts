import { AuthGuard } from "./auth.guard";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

describe("AuthGuard", () => {
  it("should be defined", () => {
    const mockJwtService = {} as JwtService;
    const mockConfigService = {
      get: jest.fn().mockReturnValue("test-secret"),
    } as unknown as ConfigService;

    expect(new AuthGuard(mockJwtService, mockConfigService)).toBeDefined();
  });
});
