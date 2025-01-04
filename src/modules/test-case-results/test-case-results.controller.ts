import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { TestCaseResultsService } from './test-case-results.service';
import { CreateTestCaseResultDto } from './dto/create-test-case-result.dto';
import { UpdateTestCaseResultDto } from './dto/update-test-case-result.dto';
import { TestCaseResult } from './entities/test-case-result.entity';

@ApiTags('Test Case Results')
@Controller('test-case-results')
export class TestCaseResultsController {
  constructor(private readonly testCaseResultsService: TestCaseResultsService) {}

  @ApiOperation({ summary: 'Create a new test case result' })
  @ApiBody({ type: CreateTestCaseResultDto, description: 'Data for creating a new test case result' })
  @ApiResponse({ status: 201, description: 'Test case result created successfully', type: TestCaseResult })
  @Post()
  create(@Body() createTestCaseResultDto: CreateTestCaseResultDto) {
    return this.testCaseResultsService.create(createTestCaseResultDto);
  }

  @ApiOperation({ summary: 'Retrieve all test case results' })
  @ApiResponse({ status: 200, description: 'List of all test case results', type: [TestCaseResult] })
  @Get()
  findAll() {
    return this.testCaseResultsService.findAll();
  }

  @ApiOperation({ summary: 'Retrieve a specific test case result by ID' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the test case result', example: 'uuid' })
  @ApiResponse({ status: 200, description: 'Details of the test case result', type: TestCaseResult })
  @ApiResponse({ status: 404, description: 'Test case result not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testCaseResultsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update an existing test case result by ID' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the test case result', example: 'uuid' })
  @ApiBody({ type: UpdateTestCaseResultDto, description: 'Data to update the test case result' })
  @ApiResponse({ status: 200, description: 'Test case result updated successfully', type: TestCaseResult })
  @ApiResponse({ status: 404, description: 'Test case result not found' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTestCaseResultDto: UpdateTestCaseResultDto) {
    return this.testCaseResultsService.update(id, updateTestCaseResultDto);
  }

  @ApiOperation({ summary: 'Delete a specific test case result by ID' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the test case result', example: 'uuid' })
  @ApiResponse({ status: 200, description: 'Test case result successfully deleted' })
  @ApiResponse({ status: 404, description: 'Test case result not found' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testCaseResultsService.remove(id);
  }
}
