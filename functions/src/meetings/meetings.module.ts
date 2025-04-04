import { Module } from "@nestjs/common";
import { MeetingsService } from "./meetings.service";
import { SupabaseModule } from "src/supabase/supabase.module";

@Module({
  providers: [MeetingsService],
  imports: [SupabaseModule],
  exports: [MeetingsService],
})
export class MeetingsModule {}
