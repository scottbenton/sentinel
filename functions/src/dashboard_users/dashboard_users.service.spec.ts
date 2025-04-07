import { Test, TestingModule } from '@nestjs/testing';
import { DashboardUsersService } from './dashboard_users.service';

describe('DashboardUsersService', () => {
  let service: DashboardUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DashboardUsersService],
    }).compile();

    service = module.get<DashboardUsersService>(DashboardUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
