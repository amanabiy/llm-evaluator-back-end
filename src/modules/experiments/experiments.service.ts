import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericDAL } from 'src/DAL/dal';
import { Experiment } from './entities/experiment.entity';
import { CreateExperimentDto } from './dto/create-experiment.dto';
import { UpdateExperimentDto } from './dto/update-experiment.dto';
import { User } from '../users/entity/user.entity';
import FindAllResponseDto from 'src/dto/find-all-response.dto';
import { TestCasesService } from '../test-cases/test-cases.service';
import { CreateTestCaseDto } from '../test-cases/dto/create-test-case.dto';

@Injectable()
export class ExperimentsService extends GenericDAL<Experiment, CreateExperimentDto, UpdateExperimentDto> {
  constructor(
    @InjectRepository(Experiment)
    private experimentRepository: Repository<Experiment>,
    private testCasesService: TestCasesService
  ) {
    super(experimentRepository, 0, 10, ['test_cases', 'experiment_runs', 'created_by'], Experiment);
  }

  findByUser(currentUser: User, page: number, limit: number): Promise<FindAllResponseDto<Experiment>> {
    console.log(page, limit)
    const response = this.findWithPagination(
      {
        where: { created_by: { id: currentUser.id } },
      },
      page,
      limit
    );

    return response;
  }

  async user_has_permission(id: string, currentUser: User): Promise<Experiment> {
    const experiment = await this.findOne(id);
    if (!experiment) {
      throw new NotFoundException('Experiment not found');
    }

    if (experiment.created_by.id !== currentUser.id) {
      throw new ForbiddenException("You don't have access to add test case to this experiment")
    }

    return experiment;
  }

  async duplicate_experiment_with_test_cases(old_experiment: Experiment): Promise<Experiment> {
    const { id, test_cases, experiment_runs, ...the_rest_experiment_detail } = old_experiment;
    const new_experiment = await this.create(the_rest_experiment_detail);
    new_experiment.test_cases = []

    // Duplicate each test case and associate it with the new experiment
    for (const t of test_cases) {
      console.log("trying to get the id for the test case")
      const test_case = await this.testCasesService.findOne(t.id);
      const { id: old_test_case_id, ...test_case_details } = test_case;
      console.log("failed to get the id")
      const new_test_case: CreateTestCaseDto = {
        ...test_case_details,
        experimentId: new_experiment.id, // Associate new test case with the new experiment
      };
      console.log("new test case is", new_test_case)
      // Save the new test case (assuming a createTestCase method exists)
      const saved_test_case = await this.testCasesService.create(new_test_case);
      new_experiment.test_cases.push(saved_test_case)
    }

    return new_experiment;
  }
}
