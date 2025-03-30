import { Test, TestingModule } from '@nestjs/testing';
import { MeetingDocumentsService } from './meeting_documents.service';

describe('MeetingDocumentsService', () => {
  let service: MeetingDocumentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MeetingDocumentsService],
    }).compile();

    service = module.get<MeetingDocumentsService>(MeetingDocumentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
