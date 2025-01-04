import { Test, TestingModule } from '@nestjs/testing';
import { ExperimentRunsService } from './experiment-runs.service';

describe('ExperimentRunsService', () => {
  let service: ExperimentRunsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExperimentRunsService],
    }).compile();

    service = module.get<ExperimentRunsService>(ExperimentRunsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
