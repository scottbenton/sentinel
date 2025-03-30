import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  providers: [AuthService],
  imports: [ConfigModule],
})
export class AuthModule {}
