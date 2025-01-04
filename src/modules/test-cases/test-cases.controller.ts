import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ForbiddenException, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TestCasesService } from './test-cases.service';
import { CreateTestCaseDto } from './dto/create-test-case.dto';
import { UpdateTestCaseDto } from './dto/update-test-case.dto';
import { TestCase } from './entities/test-case.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entity/user.entity';
import FindAllResponseDto from 'src/dto/find-all-response.dto';
import { DeleteResponseDto } from 'src/dto/delete-response.dto';

@ApiTags('Test Cases')
@Controller('test-cases')
@UseGuards(JwtAuthGuard)  // Protect all routes with JWT auth guard
@ApiBearerAuth('bearerAuth')
export class TestCasesController {
  constructor(private readonly testCasesService: TestCasesService) {}

  @ApiOperation({ summary: 'Create a new test case' })
  @ApiBody({ type: CreateTestCaseDto, description: 'Data for creating a new test case' })
  @ApiResponse({ status: 201, description: 'Test case created successfully', type: TestCase })
  @Post()
  create(
    @Body() createTestCaseDto: CreateTestCaseDto,
    @CurrentUser() currentUser: User  // Get the current logged-in user
  ) {
    createTestCaseDto.created_by = currentUser;  // Set the created_by field
    return this.testCasesService.create(createTestCaseDto);
  }

  @ApiOperation({ summary: 'Retrieve all test cases created by the current user' })
  @ApiResponse({ status: 200, description: 'List of test cases created by the current user', type: FindAllResponseDto })
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
  @Get('my')
  findMyTestCases(
    @CurrentUser() currentUser: User,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<FindAllResponseDto<TestCase>> {
    return this.testCasesService.findByUser(currentUser, page, limit);
  }

  @ApiOperation({ summary: 'Retrieve all test cases' })
  @ApiResponse({ status: 200, description: 'List of all test cases', type: FindAllResponseDto })
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
  ): Promise<FindAllResponseDto<TestCase>> {
    return this.testCasesService.findAll(page, limit);
  }

  @ApiOperation({ summary: 'Retrieve a specific test case by ID' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the test case', example: 'uuid' })
  @ApiResponse({ status: 200, description: 'Details of the test case', type: TestCase })
  @ApiResponse({ status: 404, description: 'Test case not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testCasesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update an existing test case by ID' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the test case', example: 'uuid' })
  @ApiBody({ type: UpdateTestCaseDto, description: 'Data to update the test case' })
  @ApiResponse({ status: 200, description: 'Test case updated successfully', type: TestCase })
  @ApiResponse({ status: 404, description: 'Test case not found' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTestCaseDto: UpdateTestCaseDto,
    @CurrentUser() currentUser: User  // Get the current logged-in user
  ) {
    return this.testCasesService.update(id, updateTestCaseDto);
  }

  @ApiOperation({ summary: 'Delete a specific test case by ID' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the test case', example: 'uuid' })
  @ApiResponse({ status: 200, description: 'Test case successfully deleted' })
  @ApiResponse({ status: 404, description: 'Test case not found' })
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() currentUser: User
  ): Promise<DeleteResponseDto> {
    this.testCasesService.remove(id);
    return new DeleteResponseDto();
  }
}
