import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ExperimentRunsService } from './experiment-runs.service';
import { CreateExperimentRunDto } from './dto/create-experiment-run.dto';
import { UpdateExperimentRunDto } from './dto/update-experiment-run.dto';
import { ExperimentRun } from './entities/experiment-run.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entity/user.entity';
import { DeleteResponseDto } from 'src/dto/delete-response.dto';
import FindAllResponseDto from 'src/dto/find-all-response.dto';

@ApiTags('Experiment Runs')
@Controller('experiment-runs')
@UseGuards(JwtAuthGuard) // Protect all routes with JWT Auth Guard
@ApiBearerAuth('bearerAuth')
export class ExperimentRunsController {
  constructor(private readonly experimentRunsService: ExperimentRunsService) {}

  @ApiOperation({ summary: 'Create a new experiment run' })
  @ApiBody({ type: CreateExperimentRunDto, description: 'Data for creating a new experiment run' })
  @ApiResponse({ status: 201, description: 'Experiment run created successfully', type: ExperimentRun })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post()
  create(
    @Body() createExperimentRunDto: CreateExperimentRunDto,
    @CurrentUser() currentUser: User,  // Get the current logged-in user
  ) {
    createExperimentRunDto.run_by = currentUser;
    return this.experimentRunsService.create(createExperimentRunDto);
  }

  @ApiOperation({ summary: 'Retrieve all experiment runs' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default is 1)',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Limit per page (default is 10)',
    type: Number,
    example: 10,
  })
  @ApiResponse({ status: 200, description: 'List of all experiment runs', type: FindAllResponseDto })
  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @CurrentUser() currentUser: User,  // Get the current logged-in user
  ): Promise<FindAllResponseDto<ExperimentRun>> {
    return this.experimentRunsService.findWithPagination({
      where: {
        experiment: {
          created_by: {
            id: currentUser.id
          }
        }
      }
    }, page, limit);
  }

  @ApiOperation({ summary: 'Retrieve a specific experiment run by ID' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the experiment run', example: 'uuid' })
  @ApiResponse({ status: 200, description: 'Details of the experiment run', type: ExperimentRun })
  @ApiResponse({ status: 404, description: 'Experiment run not found' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<ExperimentRun> {
    return this.experimentRunsService.findOne(id);
  }

  @ApiOperation({ summary: 'Delete a specific experiment run by ID' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the experiment run', example: 'uuid' })
  @ApiResponse({ status: 200, description: 'Experiment run successfully deleted' })
  @ApiResponse({ status: 404, description: 'Experiment run not found' })
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() currentUser: User,
  ): Promise<DeleteResponseDto> {
    this.experimentRunsService.remove(id);
    return new DeleteResponseDto();
  }
}
