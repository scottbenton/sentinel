import { Module } from "@nestjs/common";
import { WatchersService } from "./watchers.service";
import { SupabaseModule } from "../supabase/supabase.module";

@Module({
  providers: [WatchersService],
  imports: [SupabaseModule],
  exports: [WatchersService],
})
export class WatchersModule {}
