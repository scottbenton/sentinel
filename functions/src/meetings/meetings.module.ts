import { Module } from '@nestjs/common';
import { MeetingsService } from './meetings.service';

@Module({
  providers: [MeetingsService]
})
export class MeetingsModule {}
