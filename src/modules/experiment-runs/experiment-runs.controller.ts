import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { ExperimentRunsService } from './experiment-runs.service';
import { CreateExperimentRunDto } from './dto/create-experiment-run.dto';
import { UpdateExperimentRunDto } from './dto/update-experiment-run.dto';
import { ExperimentRun } from './entities/experiment-run.entity';

@ApiTags('Experiment Runs')
@Controller('experiment-runs')
export class ExperimentRunsController {
  constructor(private readonly experimentRunsService: ExperimentRunsService) {}

  @ApiOperation({ summary: 'Retrieve all experiment runs' })
  @ApiResponse({ status: 200, description: 'List of all experiment runs', type: [ExperimentRun] })
  @Get()
  findAll() {
    return this.experimentRunsService.findAll();
  }

  @ApiOperation({ summary: 'Retrieve a specific experiment run by ID' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the experiment run', example: 'uuid' })
  @ApiResponse({ status: 200, description: 'Details of the experiment run', type: ExperimentRun })
  @ApiResponse({ status: 404, description: 'Experiment run not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.experimentRunsService.findOne(id);
  }

  @ApiOperation({ summary: 'Delete a specific experiment run by ID' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the experiment run', example: 'uuid' })
  @ApiResponse({ status: 200, description: 'Experiment run successfully deleted' })
  @ApiResponse({ status: 404, description: 'Experiment run not found' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.experimentRunsService.remove(id);
  }
}
