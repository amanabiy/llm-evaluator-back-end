import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ForbiddenException, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TestCaseResultsService } from './test-case-results.service';
import { TestCaseResult } from './entities/test-case-result.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entity/user.entity';
import FindAllResponseDto from 'src/dto/find-all-response.dto';
import { DeleteResponseDto } from 'src/dto/delete-response.dto';

@ApiTags('Test Case Results')
@Controller('test-case-results')
@UseGuards(JwtAuthGuard)  // Protect all routes with JWT auth guard
@ApiBearerAuth('bearerAuth')  // Add security bearer token for API docs
export class TestCaseResultsController {
  constructor(private readonly testCaseResultsService: TestCaseResultsService) { }

  @ApiOperation({ summary: 'Retrieve all test case results' })
  @ApiResponse({ status: 200, description: 'List of all test case results', type: FindAllResponseDto })
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
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @CurrentUser() currentUser: User  // Get the current logged-in user
  ): Promise<FindAllResponseDto<TestCaseResult>> {
    return this.testCaseResultsService.findByUser(currentUser, page, limit)
  }

  @ApiOperation({ summary: 'Retrieve a specific test case result by ID' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the test case result', example: 'uuid' })
  @ApiResponse({ status: 200, description: 'Details of the test case result', type: TestCaseResult })
  @ApiResponse({ status: 404, description: 'Test case result not found' })
  @Get(':id')
  async findOne(@Param('id') id: string,
    @CurrentUser() currentUser: User  // Get the current logged-in user
  ) {
    const testCaseResult = await this.testCaseResultsService.findOne(id);
    if (testCaseResult.experiment_run.run_by.id !== currentUser.id) {
      throw new ForbiddenException(`You don't have access to this test`);
    }
    return testCaseResult;
  }

  @ApiOperation({ summary: 'Delete a specific test case result by ID' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the test case result', example: 'uuid' })
  @ApiResponse({ status: 200, description: 'Test case result successfully deleted', type: DeleteResponseDto })
  @ApiResponse({ status: 404, description: 'Test case result not found' })
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() currentUser: User
  ): Promise<DeleteResponseDto> {
    this.testCaseResultsService.remove(id);
    return new DeleteResponseDto();
  }
}
