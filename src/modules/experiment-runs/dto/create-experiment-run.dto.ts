import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { User } from 'src/modules/users/entity/user.entity';

export class CreateExperimentRunDto {
  @ApiProperty({ description: 'ID of the experiment', example: 'uuid' })
  @IsString()
  @IsNotEmpty()
  experimentId: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  run_by: User;

  // Add the LLM models field as an array of strings
  @ApiProperty({
    description: 'List of LLM models to run the experiment on.',
    example: [
      'distil-whisper-large-v3-en',
      'gemma2-9b-it',
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant',
      'llama-guard-3-8b',
      'llama3-70b-8192',
      'llama3-8b-8192',
      'mixtral-8x7b-32768',
      'whisper-large-v3',
      'whisper-large-v3-turbo',
    ],
    isArray: true,
    type: String,
  })
  @IsArray()
  llm_models: string[];
}
