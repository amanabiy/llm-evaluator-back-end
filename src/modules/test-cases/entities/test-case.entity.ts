import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { User } from 'src/modules/users/entity/user.entity';
import { Experiment } from 'src/modules/experiments/entities/experiment.entity';
import { TestCaseResult } from 'src/modules/test-case-results/entities/test-case-result.entity';
import { BaseModelEntity } from 'src/BaseEntity/BaseEntity';

export enum EvaluationMethod {
  EXACT_MATCH = 'exact_match',
  LLM_EVALUATOR = 'llm_evaluator',
  JSON_OUTPUT = 'json_output',
}

@Entity('test_cases')
export class TestCase extends BaseModelEntity {
  @Column({ type: 'text' })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The title of the test case.',
    example: 'Test case for exact match evaluation',
  })
  title: string;

  @Column({ type: 'text' })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The prompt for the test case.',
    example: 'What is the capital of France?',
  })
  prompt: string;

  @Column({ type: 'text' })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The expected response for the test case.',
    example: 'Paris',
  })
  expected_response: string;

  @Column({
    type: 'enum',
    enum: EvaluationMethod,
    default: EvaluationMethod.EXACT_MATCH,
  })
  @IsEnum(EvaluationMethod)
  @ApiProperty({
    description: 'The evaluation method for the test case.',
    enum: EvaluationMethod,
    example: EvaluationMethod.EXACT_MATCH,
  })
  evaluation_method: EvaluationMethod;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Evaluation prompt to be used if the evaluation method is "llm_evaluator".',
    required: false,
    example: 'Evaluate the response based on the LLM evaluator.',
  })
  evaluation_prompt: string;

  @ManyToOne(() => User, (user) => user.test_cases)
  @ApiProperty({
    description: 'The user who created the test case.',
    type: () => User,
  })
  created_by: User;

  @ManyToOne(() => Experiment, (experiment) => experiment.test_cases)
  @ApiProperty({
    description: 'The experiment to which the test case is associated.',
    type: () => Experiment,
  })
  experiment: Experiment;

  @OneToMany(() => TestCaseResult, (testCaseResult) => testCaseResult.test_case)
  @ApiProperty({
    description: 'The results of this test case.',
    type: () => TestCaseResult,
  })
  test_case_results: TestCaseResult[];
}
