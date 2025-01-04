import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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
    private readonly experimentsService: ExperimentsService  // Inject ExperimentsService
  ) {
    super(testCaseRepository, 0, 10, ['experiment', 'created_by'], TestCase);
  }

  async create(createTestCaseDto: CreateTestCaseDto): Promise<TestCase> {
    // Fetch the experiment to ensure it exists
    const experiment = await this.experimentsService.user_has_permission(createTestCaseDto.experimentId, createTestCaseDto.created_by);

    // Associate the experiment with the test case
    const testCase = this.testCaseRepository.create({
      ...createTestCaseDto,
      experiment,
    });

    return this.testCaseRepository.save(testCase);
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
