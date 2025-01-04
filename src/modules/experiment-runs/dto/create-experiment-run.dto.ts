import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateExperimentRunDto {
  @ApiProperty({ description: 'ID of the experiment', example: 'uuid' })
  @IsString()
  @IsNotEmpty()
  experimentId: string;

  @ApiProperty({ description: 'ID of the user who initiated the run', example: 'uuid' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
