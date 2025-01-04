import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { TestCase } from 'src/modules/test-cases/entities/test-case.entity';
import { ExperimentRun } from 'src/modules/experiment-runs/entities/experiment-run.entity';
import { BaseModelEntity } from 'src/BaseEntity/BaseEntity';

export enum TestCaseStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PENDING = 'pending',
}

@Entity('test_case_results')
@Unique(['test_case', 'experiment_run'])
export class TestCaseResult extends BaseModelEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Unique identifier for the test case result.',
    example: 'f39cda50-4e10-4f8d-b179-679e07f2f4b6',
  })
  id: string;

  @ManyToOne(() => TestCase, (testCase) => testCase.test_case_results)
  @ApiProperty({
    description: 'The test case associated with this result.',
    type: () => TestCase,
  })
  test_case: TestCase;

  @ManyToOne(() => ExperimentRun, (experimentRun) => experimentRun.test_case_results)
  @ApiProperty({
    description: 'The experiment run associated with this test case result.',
    type: () => ExperimentRun,
  })
  experiment_run: ExperimentRun;

  @Column({ type: 'text', nullable: true })
  @IsString()
  @ApiProperty({
    description: 'The response received from the test case execution.',
    example: 'Response from the model after running the test case',
    required: false,
  })
  response: string | null;

  @Column({ type: 'numeric', nullable: true })
  @IsNumber()
  @ApiProperty({
    description: 'The latency (in milliseconds) of the test case response.',
    example: 150,
    required: false,
  })
  latency: number | null;

  @Column({ type: 'numeric', nullable: true })
  @IsNumber()
  @ApiProperty({
    description: 'The accuracy (out of 100%) of the test case response.',
    example: 92,
    required: false,
  })
  accuracy: number | null;

  @Column({ type: 'text', nullable: true })
  @IsString()
  @ApiProperty({
    description: 'A description or evaluation prompt for the result, especially useful if the evaluation method is "llm_evaluator".',
    required: false,
    example: 'Model evaluation based on the LLM evaluator',
  })
  description: string | null;

  @Column({
    type: 'enum',
    enum: TestCaseStatus,
    default: TestCaseStatus.PENDING,
  })
  @IsEnum(TestCaseStatus)
  @ApiProperty({
    description: 'The status of the test case result.',
    enum: TestCaseStatus,
    example: TestCaseStatus.PENDING,
  })
  status: TestCaseStatus;
}
