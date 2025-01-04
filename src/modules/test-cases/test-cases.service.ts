import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericDAL } from 'src/DAL/dal';
import { TestCase } from './entities/test-case.entity';
import { CreateTestCaseDto } from './dto/create-test-case.dto';
import { UpdateTestCaseDto } from './dto/update-test-case.dto';

@Injectable()
export class TestCasesService extends GenericDAL<TestCase, CreateTestCaseDto, UpdateTestCaseDto> {
  constructor(
    @InjectRepository(TestCase)
    private testCaseRepository: Repository<TestCase>,
  ) {
    super(testCaseRepository, 0, 10, ['experiment'], TestCase);
  }
}
