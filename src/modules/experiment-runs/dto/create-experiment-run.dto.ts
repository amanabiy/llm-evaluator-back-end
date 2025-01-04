import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
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
}
