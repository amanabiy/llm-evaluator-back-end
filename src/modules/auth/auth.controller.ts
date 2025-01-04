
import { Controller, Post, Body, HttpStatus, BadRequestException, Param, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { User } from 'src/modules/users/entity/user.entity';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginUserDto } from './dto/login.user.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { MessageResponseDto } from 'src/dto/message-response.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordWithOtpDto } from './dto/reset-with-otp.dto';
import { AuthRefreshTokenDto } from './dto/auth-refresh_token.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @Post('create-user')
  // @ApiOperation({ summary: 'Create a new user admin' })
  // @ApiBody({ type: CreateUserDto })
  // @ApiResponse({
  //   status: HttpStatus.CREATED,
  //   description: 'User created successfully',
  //   type: User,
  // })
  // @ApiBearerAuth('bearerAuth')
  // @UseGuards(JwtAuthGuard)
  // createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
  //   return this.authService.adminCreate(createUserDto);
  // }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: AuthRegisterDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User registered successfully',
    type: User,
  })
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User logged in successfully',
    type: AuthResponseDto,
  })
  async login(@Body() loginUserDto: LoginUserDto): Promise<AuthResponseDto> {
    return await this.authService.login(loginUserDto);
  }

  @Get('refresh-token/:refreshToken')
  @ApiOperation({ summary: 'Refresh access token for a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'New access token and potentially other user info',
    type: AuthRefreshTokenDto,
  })
  async refreshToken(
    @Param('refreshToken') refreshToken: string,
  ): Promise<AuthRefreshTokenDto> {
    const newAccessToken = await this.authService.refreshAccessToken(refreshToken);
  
    const response: AuthRefreshTokenDto = {
      accessToken: newAccessToken,
    };
  
    return response;
  }

  


  @Get('request-new-token-to-verify-email/:email')
  @ApiOperation({ summary: 'Request a new token to verify email' })
  @ApiParam({ name: 'email', description: 'Email to verifiy the ' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token sent to email successfully',
    type: MessageResponseDto,
  })
  async requestToken(@Param('email') email: string): Promise<MessageResponseDto> {
    const result = await this.authService.RequestToken(email);
    if (!result) {
      throw new BadRequestException('Could not send token to Email');
    }
    return { message: 'Token sent to Email Successfully' };
  }

  @Post('verify-email/:token')
  @ApiOperation({ summary: 'Verify email' })
  @ApiParam({ name: 'token', description: 'Email verification token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email verified successfully',
    type: MessageResponseDto,
  })
  async verifyEmail(@Param('token') token: string): Promise<MessageResponseDto> {
    const result = await this.authService.verifyEmail(token);
    if (!result) {
      throw new BadRequestException('Invalid token');
    }
    return { message: 'Email verified successfully' };
  }

  @Post('request-otp/:email')
  @ApiOperation({ summary: 'Request OTP for password reset' })
  @ApiParam({ name: 'email', description: 'Email address of the user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OTP sent successfully',
    type: MessageResponseDto,
  })
  async requestOtp(@Param('email') email: string): Promise<MessageResponseDto> {
    await this.authService.requestOtp(email);
    return { message: 'OTP sent successfully' };
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Verify OTP and reset password' })
  @ApiBody({ type: ResetPasswordWithOtpDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password reset successfully',
    type: MessageResponseDto,
  })
  async resetPasswordWithOtp(@Body() verifyOtpDto: ResetPasswordWithOtpDto): Promise<MessageResponseDto> {
    await this.authService.ResetPasswordWithOtp(verifyOtpDto.email, verifyOtpDto.otp, verifyOtpDto.newPassword);
    return { message: 'Password reset successfully' };
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP and reset password' })
  @ApiBody({ type: VerifyOtpDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OTP verified successfully',
    type: MessageResponseDto,
  })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto): Promise<MessageResponseDto> {
    await this.authService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp);
    return { message: 'OTP verified successfully' };
  }
}
