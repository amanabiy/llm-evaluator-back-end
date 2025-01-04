import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';
import { User } from 'src/modules/users/entity/user.entity';

export class CreateExperimentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The title of the experiment.',
    example: 'Experiment on AI Model Evaluation',
  })
  title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'A description of the experiment, which provides more details about the experiment.',
    required: false,
    example: 'This experiment evaluates the performance of AI models under different conditions.',
  })
  description?: string;

  @IsUUID()
  @IsOptional()
  created_by: User;

//   // Test cases and experiment runs are optional and will be set separately
//   @ApiProperty({
//     description: 'List of test cases associated with this experiment.',
//     required: false,
//     type: [String],
//     example: ['test-case-id-1', 'test-case-id-2'],
//   })
//   test_cases?: string[];

//   @ApiProperty({
//     description: 'List of experiment runs associated with this experiment.',
//     required: false,
//     type: [String],
//     example: ['experiment-run-id-1', 'experiment-run-id-2'],
//   })
//   experiment_runs?: string[];
}
