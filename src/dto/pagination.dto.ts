import { IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({ 
    description: 'Page number for pagination', 
    default: 1, 
    required: false 
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiProperty({ 
    description: 'Number of items per page for pagination', 
    default: 10, 
    required: false 
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit: number = 10;
}
