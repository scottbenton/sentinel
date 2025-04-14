import { Module } from '@nestjs/common';
import { DashboardUsersService } from './dashboard_users.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { DashboardUsersController } from './dashboard_users.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [DashboardUsersService],
  imports: [SupabaseModule, JwtModule, ConfigModule],
  exports: [DashboardUsersService],
  controllers: [DashboardUsersController],
})
export class DashboardUsersModule {}
