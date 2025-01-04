import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsDate,
  IsString,
  IsBoolean,
  IsArray,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Exclude, Type } from 'class-transformer';
import { BaseModelEntity } from 'src/BaseEntity/BaseEntity';
import { Experiment } from 'src/modules/experiments/entities/experiment.entity';
import { TestCase } from 'src/modules/test-cases/entities/test-case.entity';
import { ExperimentRun } from 'src/modules/experiment-runs/entities/experiment-run.entity';

enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

@Entity('users')
export class User extends BaseModelEntity {
  @ApiProperty({ description: 'Full name of the user' })
  @IsNotEmpty()
  @IsString()
  @Column({ type: 'varchar', length: 255 })
  fullName: string;

  @ApiProperty({ description: 'Email address of the user' })
  @IsEmail()
  @IsNotEmpty()
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @ApiHideProperty()
  @Exclude()
  @IsNotEmpty()
  @IsString()
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @ApiProperty({
    description: 'Roles assigned to the user',
    type: [String],
    example: ['user', 'admin'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Column('simple-array', { nullable: true })
  roles: string[];

  @ApiProperty({ description: 'Status of user activation', required: false })
  @IsBoolean()
  @IsOptional()
  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @ApiHideProperty()
  @Exclude()
  @Column({ type: 'timestamp', nullable: true })
  lastPasswordUpdatedAt: Date;

  @ApiProperty({
    description: 'One Time Password for user verification',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Column({ type: 'varchar', length: 6, nullable: true })
  OTP: string;

  @ApiProperty({ description: 'Expiry date for the OTP', required: false })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @Column({ type: 'timestamp', nullable: true })
  OTPExpiry: Date;

  @ApiProperty({ description: 'Indicates if the user is verified', required: false })
  @IsBoolean()
  @IsOptional()
  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @OneToMany(() => Experiment, (experiment) => experiment.created_by)
  experiments: Experiment[];

  @OneToMany(() => TestCase, (testCase) => testCase.created_by)
  test_cases: TestCase[];

  @ManyToOne(() => ExperimentRun, (experimentRun) => experimentRun.test_case_results)
  @ApiProperty({
    description: 'Experiment runs associated with the user.',
    type: () => ExperimentRun,
  })
  experiment_runs: ExperimentRun;
}
