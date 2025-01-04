import { Test, TestingModule } from '@nestjs/testing';
import { TestCaseResultsController } from './test-case-results.controller';
import { TestCaseResultsService } from './test-case-results.service';

describe('TestCaseResultsController', () => {
  let controller: TestCaseResultsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestCaseResultsController],
      providers: [TestCaseResultsService],
    }).compile();

    controller = module.get<TestCaseResultsController>(TestCaseResultsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
