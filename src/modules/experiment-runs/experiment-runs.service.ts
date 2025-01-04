import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericDAL } from 'src/DAL/dal';
import { ExperimentRun, ExperimentRunStatus } from './entities/experiment-run.entity';
import { CreateExperimentRunDto } from './dto/create-experiment-run.dto';
import { UpdateExperimentRunDto } from './dto/update-experiment-run.dto';
import { ExperimentsService } from '../experiments/experiments.service';

@Injectable()
export class ExperimentRunsService extends GenericDAL<ExperimentRun, CreateExperimentRunDto, UpdateExperimentRunDto> {
  constructor(
    @InjectRepository(ExperimentRun)
    private experimentRunRepository: Repository<ExperimentRun>,

    private readonly experimentService: ExperimentsService,  // Inject ExperimentService
  ) {
    super(experimentRunRepository, 0, 10, ['experiment', 'run_by', 'test_case_results'], ExperimentRun);
  }

  async create(createExperimentRunDto: CreateExperimentRunDto): Promise<ExperimentRun> {
    // Use the ExperimentService to retrieve the experiment by ID
    const experiment = await this.experimentService.user_has_permission(
      createExperimentRunDto.experimentId,
      createExperimentRunDto.run_by
    )

    // Create a new experiment run with the experiment attached
    const experimentRun = this.experimentRunRepository.create({
      ...createExperimentRunDto,  // Spread other DTO fields
      experiment,  // Attach the found experiment entity
    });

    // Save and return the experiment run
    return super.create(experimentRun);
  }

  // New method to update the status of an experiment run using DAL pattern
  async updateStatus(id: string, status: ExperimentRunStatus): Promise<ExperimentRun> {
    return this.update(id, { "status": status });
  }
}
