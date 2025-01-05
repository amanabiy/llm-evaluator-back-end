import { Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericDAL } from 'src/DAL/dal';
import { ExperimentRun, ExperimentRunStatus } from './entities/experiment-run.entity';
import { CreateExperimentRunDto } from './dto/create-experiment-run.dto';
import { UpdateExperimentRunDto } from './dto/update-experiment-run.dto';
import { ExperimentsService } from '../experiments/experiments.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { TestCaseResultsService } from '../test-case-results/test-case-results.service';
import { TestCaseStatus } from '../test-case-results/entities/test-case-result.entity';

@Injectable()
export class ExperimentRunsService extends GenericDAL<ExperimentRun, CreateExperimentRunDto, UpdateExperimentRunDto> {
  private readonly logger = new Logger(ExperimentRunsService.name);  // Initialize logger

  constructor(
    @InjectRepository(ExperimentRun)
    private experimentRunRepository: Repository<ExperimentRun>,

    private readonly experimentService: ExperimentsService,
    @InjectQueue('run-experiment') private experimentQueue: Queue,
    private readonly testCaseResultsService: TestCaseResultsService,  // Inject TestCaseResultService
  ) {
    super(experimentRunRepository, 0, 10, ['experiment', 'run_by', 'test_case_results', 'test_case_results.test_case'], ExperimentRun);
  }

  async create(createExperimentRunDto: CreateExperimentRunDto): Promise<ExperimentRun> {
    // Use the ExperimentService to retrieve the experiment by ID
    const experiment = await this.experimentService.user_has_permission(
      createExperimentRunDto.experimentId,
      createExperimentRunDto.run_by
    );

    // Create a new experiment run with the experiment attached
    const experimentRun = this.experimentRunRepository.create({
      ...createExperimentRunDto,
      experiment,  // Attach the found experiment entity
    });

    // Save the experiment run
    const savedExperimentRun = await this.experimentRunRepository.save(experimentRun);

    // Loop through the tests in the experiment
    for (const test of experiment.test_cases) {
      // Loop through each model in the LLM list for the experiment run
      for (const model of createExperimentRunDto.llm_models || []) {
        try {
          // Create a new TestCaseResult for this combination of test case and model
          const savedTestCaseResult = await this.testCaseResultsService.createTestCaseResult(
            savedExperimentRun,
            test,
            model // Pass the model to the test case result creation
          );

          // Push the newly created test case result to the queue with retry rules
          await this.experimentQueue.add('run-experiment', {
            experimentRunId: savedExperimentRun.id,
            testCaseResultId: savedTestCaseResult.id,
          }, {
            attempts: 3,  // Retry up to 3 attempts (1 initial + 2 retries)
            backoff: {
              type: 'fixed',  // Fixed backoff time between retries
              delay: 5000,    // Retry every 5 seconds
            }
          });
        } catch (error) {
          // Log the error if job addition fails, but don't throw an error
          this.logger.error(`Failed to queue test case result for test ID: ${test.id} with model: ${model}`, error.stack);

          // Update the status of the test case result to 'FAILED'
          await this.testCaseResultsService.updateTestCaseResultStatus(test.id, TestCaseStatus.FAILED);
        }
      }
    }

    // Return the saved experiment run
    return savedExperimentRun;
  }

  async checkAndCompleteExperimentRun(experimentRunId: string): Promise<void> {
    // Fetch all test case results for the given experiment run
    const testCaseResults = await this.testCaseResultsService.findAllByExperimentRunId(experimentRunId);

    // Check if all test case results have a status of 'COMPLETED'
    const allCompleted = testCaseResults.every(result => result.status === TestCaseStatus.COMPLETED);

    // If all are completed, update the experiment run status to 'COMPLETED'
    if (allCompleted) {
      await this.updateStatus(experimentRunId, ExperimentRunStatus.COMPLETED);
      this.logger.log(`ExperimentRun with ID ${experimentRunId} marked as COMPLETED`);
    }
  }

  async updateStatus(id: string, status: ExperimentRunStatus): Promise<ExperimentRun> {
    return this.update(id, { status });
  }
}
