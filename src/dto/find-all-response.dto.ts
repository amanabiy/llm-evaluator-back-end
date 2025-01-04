import { ApiProperty } from '@nestjs/swagger';

class FindAllResponseDto<T> {
  @ApiProperty({ description: 'Page number', example: 1 })
  page: number;

  @ApiProperty({ description: 'Limit per page', example: 10 })
  limit: number;

  @ApiProperty({ description: 'Total number of items', example: 100 })
  total: number;

  @ApiProperty({
    description:
      'Array of items (the items should be similar structure to when you get one item)',
    type: 'array',
    items: { type: 'object' },
  })
  items: T[];

  constructor(page: number, limit: number, total: number, items: T[]) {
    this.page = page;
    this.limit = limit;
    this.total = total;
    this.items = items;
  }
}

export default FindAllResponseDto;
