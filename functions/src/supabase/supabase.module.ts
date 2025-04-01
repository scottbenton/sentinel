import { Module } from "@nestjs/common";
import { SupabaseService } from "./supabase.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  providers: [SupabaseService],
  imports: [ConfigModule],
  exports: [SupabaseService],
})
export class SupabaseModule {}
