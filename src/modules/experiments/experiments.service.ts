import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericDAL } from 'src/DAL/dal';
import { Experiment } from './entities/experiment.entity';
import { CreateExperimentDto } from './dto/create-experiment.dto';
import { UpdateExperimentDto } from './dto/update-experiment.dto';
import { User } from '../users/entity/user.entity';
import FindAllResponseDto from 'src/dto/find-all-response.dto';

@Injectable()
export class ExperimentsService extends GenericDAL<Experiment, CreateExperimentDto, UpdateExperimentDto> {
  constructor(
    @InjectRepository(Experiment)
    private experimentRepository: Repository<Experiment>,
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
}
