import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, IsEmail } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({ description: 'Email address of the user' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'OTP for verification' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  otp: string;

}
