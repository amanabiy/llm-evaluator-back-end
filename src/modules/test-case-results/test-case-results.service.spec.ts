import { Test, TestingModule } from '@nestjs/testing';
import { TestCaseResultsService } from './test-case-results.service';

describe('TestCaseResultsService', () => {
  let service: TestCaseResultsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestCaseResultsService],
    }).compile();

    service = module.get<TestCaseResultsService>(TestCaseResultsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
