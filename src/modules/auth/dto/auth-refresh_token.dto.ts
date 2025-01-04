import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/users/entity/user.entity';

export class AuthRefreshTokenDto {
  @ApiProperty({ description: 'JWT access token' })
  accessToken: string;
}
