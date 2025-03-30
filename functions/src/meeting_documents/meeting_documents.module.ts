import { Module } from '@nestjs/common';
import { MeetingDocumentsService } from './meeting_documents.service';

@Module({
  providers: [MeetingDocumentsService]
})
export class MeetingDocumentsModule {}
