import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'Email address of the user',
    required: true,
    format: 'email',
  })
  email: string;

  @ApiProperty()
  password: string;
}
