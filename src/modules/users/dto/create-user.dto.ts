// src/users/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, MinLength, IsString, IsArray, IsBoolean, IsOptional, ValidateNested, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({ description: 'Full name of the user', required: true })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({ description: 'Email address of the user', required: true, format: 'email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password for the user account', required: true, minLength: 6 })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'Roles of the user', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles: string[];

  @ApiProperty({ description: 'Active status of the user', required: false })
  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
