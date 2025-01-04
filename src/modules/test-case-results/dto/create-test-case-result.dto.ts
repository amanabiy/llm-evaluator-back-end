import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { TestCaseStatus } from '../entities/test-case-result.entity';
import { TestCase } from 'src/modules/test-cases/entities/test-case.entity';
import { ExperimentRun } from 'src/modules/experiment-runs/entities/experiment-run.entity';

export class CreateTestCaseResultDto {
  @ApiProperty({ description: 'ID of the test case', example: 'uuid' })
  @IsString()
  @IsNotEmpty()
  test_case: TestCase;

  @ApiProperty({ description: 'ID of the experiment run', example: 'uuid' })
  @IsString()
  @IsNotEmpty()
  experiment_run: ExperimentRun;

  @ApiProperty({ description: 'Response from the test case execution', example: 'Response data' })
  @IsString()
  @IsOptional()
  response?: string;

  @ApiProperty({ description: 'Latency in milliseconds', example: 150 })
  @IsNumber()
  @IsOptional()
  latency?: number;

  @ApiProperty({ description: 'Accuracy percentage', example: 95 })
  @IsNumber()
  @IsOptional()
  accuracy?: number;

  @ApiProperty({ description: 'Optional description or evaluation prompt', required: false, example: 'Evaluation based on LLM' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Status of the test case result', enum: TestCaseStatus, example: TestCaseStatus.PENDING })
  @IsEnum(TestCaseStatus)
  status?: TestCaseStatus;
}
