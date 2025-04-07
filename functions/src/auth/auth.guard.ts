import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  private readonly jwtSecret: string;
  constructor(private jwtService: JwtService, configService: ConfigService) {
    const secret = configService.get<string>("SUPABASE_JWT_SECRET");
    if (!secret || typeof secret !== "string") {
      throw new Error("JWT secret is not defined");
    }
    this.jwtSecret = secret;
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new Error("No token provided");
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtSecret,
      });
      request.user = payload;
    } catch (error) {
      throw new Error("Invalid token");
    }
    return true;
  }

  private extractTokenFromHeader(request): string | undefined {
    this.logger.debug(request);
    const [type, token] = request.headers["authorization"]?.split(" ") ??
      [];
    return type === "Bearer" ? token : undefined;
  }
}
