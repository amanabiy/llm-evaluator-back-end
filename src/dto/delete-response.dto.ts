import { ApiProperty } from '@nestjs/swagger';

export class DeleteResponseDto {
  @ApiProperty({ example: 'Resource deleted successfully' })
  message: string = 'Resource deleted successfully';
}
