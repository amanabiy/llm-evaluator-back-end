import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericDAL } from 'src/DAL/dal';
import { TestCaseResult, TestCaseStatus } from './entities/test-case-result.entity';
import { CreateTestCaseResultDto } from './dto/create-test-case-result.dto';
import { UpdateTestCaseResultDto } from './dto/update-test-case-result.dto';
import { ExperimentRun } from '../experiment-runs/entities/experiment-run.entity';
import { TestCase } from '../test-cases/entities/test-case.entity';
import { TestCasesService } from '../test-cases/test-cases.service'; // Assuming TestCasesService exists
import { User } from '../users/entity/user.entity';
import FindAllResponseDto from 'src/dto/find-all-response.dto';

@Injectable()
export class TestCaseResultsService extends GenericDAL<TestCaseResult, CreateTestCaseResultDto, UpdateTestCaseResultDto> {
  constructor(
    @InjectRepository(TestCaseResult)
    private testCaseResultRepository: Repository<TestCaseResult>,

    private readonly testCasesService: TestCasesService, // Inject TestCasesService to create new test cases
  ) {
    super(testCaseResultRepository, 0, 10, ['test_case', 'experiment_run'], TestCaseResult);
  }

  // Create a new TestCaseResult using the `super.create` method from GenericDAL
  async createTestCaseResult(experimentRun: ExperimentRun, test: TestCase, llm_model: string): Promise<TestCaseResult> {
    // Create a new test case by omitting the `id` of the provided test
    const { id, experiment, ...testWithoutId } = test; // Destructure and omit the `id`

    // Now, create a new test case without the `id`
    const newTestCase = await this.testCasesService.createWithoutExperimentOrUser({
      ...testWithoutId,
      experimentId: null,
      created_by: null,
    });

    const testCaseResultDto: CreateTestCaseResultDto = {
      experiment_run: experimentRun,
      test_case: newTestCase, // Use the newly created test case instead of the original one
      status: TestCaseStatus.PENDING,  // Initially setting the status to 'PENDING'
      llm_model,
    };

    // Use the `super.create` method to create the TestCaseResult entity
    return super.create(testCaseResultDto);
  }

  // Update the status of an existing TestCaseResult using the `super.update` method from GenericDAL
  async updateTestCaseResultStatus(testCaseResultId: string, status: TestCaseStatus): Promise<TestCaseResult> {
    const updateDto: UpdateTestCaseResultDto = {
      status,  // Only updating the status
    };

    return super.update(testCaseResultId, updateDto);
  }

  // A helper function to find and return a test case result by ID using the `super.findOne` method
  async getTestCaseResultById(testCaseResultId: string): Promise<TestCaseResult> {
    return super.findOne(testCaseResultId);
  }

  async findAllByExperimentRunId(experimentRunId: string): Promise<TestCaseResult[]> {
    const results = await this.find({
      where: { experiment_run: { id: experimentRunId } },  // Include relations if needed
    }, false);
    return results;
  }

  findByUser(currentUser: User, page: number, limit: number): Promise<FindAllResponseDto<TestCaseResult>> {
    console.log(page, limit);
    return this.findWithPagination(
      {
        where: { experiment_run: { run_by: { id: currentUser.id } } },
      },
      page,
      limit
    );
  }
}
