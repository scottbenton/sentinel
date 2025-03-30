import { Module } from "@nestjs/common";
import { OrganizationsService } from "./organizations.service";
import { SupabaseModule } from "@/supabase/supabase.module";

@Module({
  providers: [OrganizationsService],
  imports: [SupabaseModule],
})
export class OrganizationsModule {}
