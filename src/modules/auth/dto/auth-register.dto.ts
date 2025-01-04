import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsPhoneNumber, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthRegisterDto {
  @IsEmail()
  @ApiProperty({
    description: 'Email address of the user',
    required: true,
    format: 'email',
  })
  email: string;

  @ApiProperty({
    description: 'Full name of the user',
    required: true,
  })
  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({
    description: 'Password for the user account',
    required: true,
    minLength: 6,
  })
  password: string;
}
