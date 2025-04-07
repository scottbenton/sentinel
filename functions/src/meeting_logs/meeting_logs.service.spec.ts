import { Test, TestingModule } from '@nestjs/testing';
import { MeetingLogsService } from './meeting_logs.service';

describe('MeetingLogsService', () => {
  let service: MeetingLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MeetingLogsService],
    }).compile();

    service = module.get<MeetingLogsService>(MeetingLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
