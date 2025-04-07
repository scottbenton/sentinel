import { Module } from '@nestjs/common';
import { MeetingLogsService } from './meeting_logs.service';

@Module({
  providers: [MeetingLogsService]
})
export class MeetingLogsModule {}
