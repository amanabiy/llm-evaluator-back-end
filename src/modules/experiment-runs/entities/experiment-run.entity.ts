import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Experiment } from 'src/modules/experiments/entities/experiment.entity';
import { User } from 'src/modules/users/entity/user.entity';
import { TestCaseResult } from 'src/modules/test-case-results/entities/test-case-result.entity';
import { BaseModelEntity } from 'src/BaseEntity/BaseEntity';

@Entity('experiment_runs')
export class ExperimentRun extends BaseModelEntity {
  @ManyToOne(() => Experiment, (experiment) => experiment.experiment_runs)
  @ApiProperty({ type: () => Experiment, description: 'The experiment that this run is associated with.' })
  experiment: Experiment;

  @ManyToOne(() => User, (user) => user.experiment_runs)
  @ApiProperty({ type: () => User, description: 'The user who ran the experiment.' })
  run_by: User;

//   @Column({ type: 'text', unique: true })
//   @IsString()
//   @ApiProperty({
//     description: 'A unique identifier for the experiment run, used to track this specific run.',
//     example: 'run-1234-xyz',
//   })
//   run_id: string;

  @OneToMany(() => TestCaseResult, (testCaseResult) => testCaseResult.experiment_run)
  @ApiProperty({
    type: () => TestCaseResult,
    description: 'List of test case results for this experiment run.',
    isArray: true,
  })
  test_case_results: TestCaseResult[];
}
