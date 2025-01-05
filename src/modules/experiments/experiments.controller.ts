import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ForbiddenException, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ExperimentsService } from './experiments.service';
import { CreateExperimentDto } from './dto/create-experiment.dto';
import { UpdateExperimentDto } from './dto/update-experiment.dto';
import { Experiment } from './entities/experiment.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entity/user.entity';
import FindAllResponseDto from 'src/dto/find-all-response.dto';
import { DeleteResponseDto } from 'src/dto/delete-response.dto';

@ApiTags('Experiments')
@Controller('experiments')
@UseGuards(JwtAuthGuard)  // Protect all routes in this controller with JWT auth guard
@ApiBearerAuth('bearerAuth')
export class ExperimentsController {
  constructor(private readonly experimentsService: ExperimentsService) { }

  @ApiOperation({ summary: 'Create a new experiment' })
  @ApiBody({ type: CreateExperimentDto, description: 'Data for the new experiment' })
  @ApiResponse({ status: 201, description: 'Experiment created successfully', type: Experiment })
  @Post()
  create(
    @Body() createExperimentDto: CreateExperimentDto,
    @CurrentUser() currentUser: User,  // Get the current logged-in user
  ) {
    createExperimentDto.created_by = currentUser;  // Set the created_by field
    return this.experimentsService.create(createExperimentDto);
  }

  @ApiOperation({ summary: 'Retrieve all experiments created by the current user (My Experiments)' })
  @ApiResponse({ status: 200, description: 'List of experiments created by the current user', type: FindAllResponseDto })
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
  @Get()
  findMyExperiments(
    @CurrentUser() currentUser: User,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<FindAllResponseDto<Experiment>> {
    return this.experimentsService.findByUser(currentUser, page, limit);
  }

  // @ApiOperation({ summary: 'Retrieve all experiments' })
  // @ApiResponse({ status: 200, description: 'List of all experiments', type: FindAllResponseDto })
  // @ApiQuery({
  //   name: 'page',
  //   required: false,
  //   description: 'Page number (default is 1)',
  //   type: Number,
  //   example: 1,
  // })
  // @ApiQuery({
  //   name: 'limit',
  //   required: false,
  //   description: 'Limit per page (default is 10)',
  //   type: Number,
  //   example: 10,
  // })
  // @Get()
  // findAll(
  //   @Query('page') page: number = 1,
  //   @Query('limit') limit: number = 10,
  // ): Promise<FindAllResponseDto<Experiment>> {
  //   return this.experimentsService.findAll(page, limit);
  // }

  @ApiOperation({ summary: 'Retrieve a specific experiment by ID' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the experiment', example: 'uuid' })
  @ApiResponse({ status: 200, description: 'Details of the experiment', type: Experiment })
  @ApiResponse({ status: 404, description: 'Experiment not found' })
  @Get(':id')
  findOne(@Param('id') id: string,
    @CurrentUser() currentUser: User,  // Get the current logged-in user
  ) {
    return this.experimentsService.user_has_permission(id, currentUser);
  }

  @ApiOperation({ summary: 'Duplicate an existing experiment by ID' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the experiment to duplicate', example: 'uuid' })
  @ApiResponse({ status: 201, description: 'Experiment duplicated successfully', type: Experiment })
  @Post(':id/duplicate')
  async duplicate(
    @Param('id') id: string,
    @CurrentUser() currentUser: User,  // Get the current logged-in user
  ): Promise<Experiment> {
    const experiment = await this.experimentsService.user_has_permission(id, currentUser);
    return await this.experimentsService.duplicate_experiment_with_test_cases(experiment);
  }

  @ApiOperation({ summary: 'Update an existing experiment by ID' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the experiment', example: 'uuid' })
  @ApiBody({ type: UpdateExperimentDto, description: 'Data to update the experiment' })
  @ApiResponse({ status: 200, description: 'Experiment updated successfully', type: Experiment })
  @ApiResponse({ status: 404, description: 'Experiment not found' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExperimentDto: UpdateExperimentDto,
    @CurrentUser() currentUser: User,  // Get the current logged-in user
  ) {
    return this.experimentsService.update(id, updateExperimentDto);
  }

  @ApiOperation({ summary: 'Delete a specific experiment by ID' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the experiment', example: 'uuid' })
  @ApiResponse({ status: 200, description: 'Experiment successfully deleted' })
  @ApiResponse({ status: 404, description: 'Experiment not found' })
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() currentUser: User,  // Get the current logged-in user
  ): Promise<DeleteResponseDto> {
    this.experimentsService.remove(id);
    return new DeleteResponseDto();
  }
}
