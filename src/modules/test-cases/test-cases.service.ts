import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericDAL } from 'src/DAL/dal';
import { TestCase } from './entities/test-case.entity';
import { CreateTestCaseDto } from './dto/create-test-case.dto';
import { UpdateTestCaseDto } from './dto/update-test-case.dto';
import { User } from '../users/entity/user.entity';
import FindAllResponseDto from 'src/dto/find-all-response.dto';
import { ExperimentsService } from '../experiments/experiments.service'; // Import ExperimentsService

@Injectable()
export class TestCasesService extends GenericDAL<TestCase, CreateTestCaseDto, UpdateTestCaseDto> {
  constructor(
    @InjectRepository(TestCase)
    private testCaseRepository: Repository<TestCase>,
    @Inject(forwardRef(() => ExperimentsService))
    private readonly experimentsService: ExperimentsService  // Inject ExperimentsService
  ) {
    super(testCaseRepository, 0, 10, ['experiment', 'created_by'], TestCase);
  }

  async create(createTestCaseDto: CreateTestCaseDto): Promise<TestCase> {
    // Fetch the experiment to ensure it exists
    const experiment = await this.experimentsService.user_has_permission(createTestCaseDto.experimentId, createTestCaseDto.created_by);

    // Associate the experiment with the test case
    return await super.create({
      ...createTestCaseDto,
      experiment,
    });
  }

  async createWithoutExperimentOrUser(createTestCaseDto: CreateTestCaseDto): Promise<TestCase> {
    const testCase = await super.create({
      ...createTestCaseDto,
      experiment: null, // Explicitly setting to null if no experiment is provided
      created_by: null, // Explicitly setting to null if no user is provided
    });

    return testCase
  }

  findByUser(currentUser: User, page: number, limit: number): Promise<FindAllResponseDto<TestCase>> {
    console.log(page, limit);
    return this.findWithPagination(
      {
        where: { created_by: { id: currentUser.id } },
      },
      page,
      limit
    );
  }
}
