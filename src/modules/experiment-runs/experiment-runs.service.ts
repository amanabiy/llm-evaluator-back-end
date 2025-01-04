import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericDAL } from 'src/DAL/dal';
import { ExperimentRun } from './entities/experiment-run.entity';
import { CreateExperimentRunDto } from './dto/create-experiment-run.dto';
import { UpdateExperimentRunDto } from './dto/update-experiment-run.dto';

@Injectable()
export class ExperimentRunsService extends GenericDAL<ExperimentRun, CreateExperimentRunDto, UpdateExperimentRunDto> {
  constructor(
    @InjectRepository(ExperimentRun)
    private experimentRunRepository: Repository<ExperimentRun>,
  ) {
    super(experimentRunRepository, 0, 10, ['experiment', 'run_by', 'test_case_results'], ExperimentRun);
  }
}
