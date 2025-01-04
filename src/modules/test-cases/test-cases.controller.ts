import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { TestCasesService } from './test-cases.service';
import { CreateTestCaseDto } from './dto/create-test-case.dto';
import { UpdateTestCaseDto } from './dto/update-test-case.dto';
import { TestCase } from './entities/test-case.entity';

@ApiTags('Test Cases')
@Controller('test-cases')
export class TestCasesController {
  constructor(private readonly testCasesService: TestCasesService) {}

  @ApiOperation({ summary: 'Create a new test case' })
  @ApiBody({ type: CreateTestCaseDto, description: 'Data for creating a new test case' })
  @ApiResponse({ status: 201, description: 'Test case created successfully', type: TestCase })
  @Post()
  create(@Body() createTestCaseDto: CreateTestCaseDto) {
    return this.testCasesService.create(createTestCaseDto);
  }

  @ApiOperation({ summary: 'Retrieve all test cases' })
  @ApiResponse({ status: 200, description: 'List of all test cases', type: [TestCase] })
  @Get()
  findAll() {
    return this.testCasesService.findAll();
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
  update(@Param('id') id: string, @Body() updateTestCaseDto: UpdateTestCaseDto) {
    return this.testCasesService.update(id, updateTestCaseDto);
  }

  @ApiOperation({ summary: 'Delete a specific test case by ID' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the test case', example: 'uuid' })
  @ApiResponse({ status: 200, description: 'Test case successfully deleted' })
  @ApiResponse({ status: 404, description: 'Test case not found' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testCasesService.remove(id);
  }
}
