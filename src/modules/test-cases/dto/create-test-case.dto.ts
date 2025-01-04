import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { EvaluationMethod } from '../entities/test-case.entity';
import { User } from 'src/modules/users/entity/user.entity';

export class CreateTestCaseDto {
  @ApiProperty({ description: 'Title of the test case', example: 'Test case for exact match evaluation' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Prompt for the test case', example: 'What is the capital of France?' })
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @ApiProperty({ description: 'Expected response for the test case', example: 'Paris' })
  @IsString()
  @IsNotEmpty()
  expected_response: string;

  @ApiProperty({ description: 'Evaluation method for the test case', enum: EvaluationMethod })
  @IsEnum(EvaluationMethod)
  evaluation_method: EvaluationMethod;

  @ApiProperty({ description: 'Evaluation prompt for the LLM evaluator', required: false, example: 'Evaluate the response based on the LLM evaluator.' })
  @IsString()
  @IsOptional()
  evaluation_prompt: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  created_by: User;

  @ApiProperty({ description: 'ID of the experiment associated with the test case', example: 'uuid' })
  @IsString()
  @IsNotEmpty()
  experimentId: string;
}
