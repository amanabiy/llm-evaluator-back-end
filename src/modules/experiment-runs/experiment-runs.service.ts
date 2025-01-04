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
    @InjectQueue('experiment') private experimentQueue: Queue,
    private readonly testCaseResultService: TestCaseResultsService,  // Inject TestCaseResultService
  ) {
    super(experimentRunRepository, 0, 10, ['experiment', 'run_by', 'test_case_results'], ExperimentRun);
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

    // Loop through the tests in the experiment and create a test case result for each one
    for (const test of experiment.test_cases) {
      try {
        // Create a new TestCaseResult and set status to 'PENDING'
        const savedTestCaseResult = await this.testCaseResultService.createTestCaseResult(savedExperimentRun, test);

        // Push the newly created test case result to the queue
        await this.experimentQueue.add('run-experiment', {
          experimentRunId: savedExperimentRun.id,
          testCaseResultId: savedTestCaseResult.id,
        });
      } catch (error) {
        // Log the error if job addition fails, but don't throw an error
        this.logger.error(`Failed to queue test case result for test ID: ${test.id}`, error.stack);

        // Update the status of the test case result to 'FAILED'
        await this.testCaseResultService.updateTestCaseResultStatus(test.id, TestCaseStatus.FAILED);
      }
    }

    // Return the saved experiment run
    return savedExperimentRun;
  }

  async updateStatus(id: string, status: ExperimentRunStatus): Promise<ExperimentRun> {
    return this.update(id, { status });
  }
}
