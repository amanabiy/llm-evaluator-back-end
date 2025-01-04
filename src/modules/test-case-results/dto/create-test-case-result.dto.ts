import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { TestCaseStatus } from '../entities/test-case-result.entity';

export class CreateTestCaseResultDto {
  @ApiProperty({ description: 'ID of the test case', example: 'uuid' })
  @IsString()
  @IsNotEmpty()
  testCaseId: string;

  @ApiProperty({ description: 'ID of the experiment run', example: 'uuid' })
  @IsString()
  @IsNotEmpty()
  experimentRunId: string;

  @ApiProperty({ description: 'Response from the test case execution', example: 'Response data' })
  @IsString()
  @IsNotEmpty()
  response: string;

  @ApiProperty({ description: 'Latency in milliseconds', example: 150 })
  @IsNumber()
  @IsNotEmpty()
  latency: number;

  @ApiProperty({ description: 'Accuracy percentage', example: 95 })
  @IsNumber()
  @IsNotEmpty()
  accuracy: number;

  @ApiProperty({ description: 'Optional description or evaluation prompt', required: false, example: 'Evaluation based on LLM' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Status of the test case result', enum: TestCaseStatus, example: TestCaseStatus.PENDING })
  @IsEnum(TestCaseStatus)
  @IsOptional()
  status?: TestCaseStatus;
}
