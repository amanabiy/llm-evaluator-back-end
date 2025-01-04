import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericDAL } from 'src/DAL/dal';
import { TestCaseResult } from './entities/test-case-result.entity';
import { CreateTestCaseResultDto } from './dto/create-test-case-result.dto';
import { UpdateTestCaseResultDto } from './dto/update-test-case-result.dto';

@Injectable()
export class TestCaseResultsService extends GenericDAL<TestCaseResult, CreateTestCaseResultDto, UpdateTestCaseResultDto> {
  constructor(
    @InjectRepository(TestCaseResult)
    private testCaseResultRepository: Repository<TestCaseResult>,
  ) {
    super(testCaseResultRepository, 0, 10, ['test_case', 'experiment_run'], TestCaseResult);
  }
}
