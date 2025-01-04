import { Test, TestingModule } from '@nestjs/testing';
import { ExperimentRunsController } from './experiment-runs.controller';
import { ExperimentRunsService } from './experiment-runs.service';

describe('ExperimentRunsController', () => {
  let controller: ExperimentRunsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExperimentRunsController],
      providers: [ExperimentRunsService],
    }).compile();

    controller = module.get<ExperimentRunsController>(ExperimentRunsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
