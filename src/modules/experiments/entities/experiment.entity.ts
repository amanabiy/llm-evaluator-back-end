import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { User } from 'src/modules/users/entity/user.entity';
import { TestCase } from 'src/modules/test-cases/entities/test-case.entity';
import { ExperimentRun } from 'src/modules/experiment-runs/entities/experiment-run.entity';
import { BaseModelEntity } from 'src/BaseEntity/BaseEntity';

@Entity('experiments')
export class Experiment extends BaseModelEntity{
  @Column({ type: 'text' })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The title of the experiment.',
    example: 'Experiment on AI Model Evaluation',
  })
  title: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'A description of the experiment, which provides more details about the experiment.',
    required: false,
    example: 'This experiment evaluates the performance of AI models under different conditions.',
  })
  description: string;

  @ManyToOne(() => User, (user) => user.experiments)
  @ApiProperty({
    description: 'The user who created the experiment.',
    type: () => User,
  })
  created_by: User;

  @OneToMany(() => TestCase, (testCase) => testCase.experiment)
  @ApiProperty({
    description: 'List of test cases associated with this experiment.',
    type: () => [TestCase],
    isArray: true,
  })
  test_cases: TestCase[];

  @OneToMany(() => ExperimentRun, (experimentRun) => experimentRun.experiment)
  @ApiProperty({
    description: 'List of experiment runs associated with this experiment.',
    type: () => [ExperimentRun],
    isArray: true,
  })
  experiment_runs: ExperimentRun[];
}
