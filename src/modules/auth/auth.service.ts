import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { User } from 'src/modules/users/entity/user.entity';
import { LoginUserDto } from './dto/login.user.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { randomBytes } from 'crypto';
import { MailService } from '../mail/mailer.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(createUserDto: AuthRegisterDto): Promise<User> {
    const user: User = await this.userService.create(createUserDto as User);
    return user
  }

  async login(loginUserDto: LoginUserDto): Promise<AuthResponseDto> {
    const user: User = await this.userService.authenticateUser(loginUserDto);
    console.log("login user", user)
    if (user.isVerified === false) {
      throw new BadRequestException('Please verify your email address');
    }

    const payload = {
      email: user.email,
      userId: user.id,
      lastPasswordUpdatedAt: user.lastPasswordUpdatedAt,
    };
    const accessToken = await this.getAccessToken(payload);
    const refreshToken = this.jwtService.sign(
      {
        userId: user.id,
        lastPasswordUpdatedAt: user.lastPasswordUpdatedAt,
      }, { expiresIn: '7d' });

    const response: AuthResponseDto = {
      accessToken,
      refreshToken,
      user,
    };
    console.log("user", user)
    console.log("the user is", user['email'], user['fullName'])
    await this.mailService.sendUserConfirmation(user.email, user.fullName)
    return response;
  }

  async verifyEmail(token: string): Promise<boolean> {
    // Verify the token and update the user's isVerified status
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.userService.findOne(decoded.sub);
      if (!user) {
        throw new BadRequestException('Invalid token');
      }
      user.isVerified = true;
      await this.userService.update(user.id, user);
      return true;
    } catch (error) {
      return false;
    }
  }

  async requestOtp(email: string): Promise<void> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const otp = randomBytes(3).toString('hex'); // Generate a 6-character OTP
    user.OTP = otp;
    user.OTPExpiry = new Date(Date.now() + 15 * 60 * 1000); // OTP valid for 15 minutes

    await this.userService.update(user.id, user);
    await this.mailService.sendOtp(user.email, otp);
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const user = await this.userService.findByEmail(email);
    if (!user || user.OTP !== otp || user.OTPExpiry < new Date()) {
      throw new BadRequestException('Invalid or expired OTP');
    }
    return true;
  }

  async ResetPasswordWithOtp(email: string, otp: string, newPassword: string): Promise<boolean> {
    const user = await this.userService.findByEmail(email);
    if (!user || user.OTP !== otp || user.OTPExpiry < new Date()) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    user.password = await this.userService.hashPassword(newPassword);
    user['lastPasswordUpdatedAt'] = new Date();
    user.OTP = null;
    user.OTPExpiry = null;
    user.lastPasswordUpdatedAt = new Date();

    await this.userService.update(user.id, user);
    return true;
  }

  async RequestToken(email: string): Promise<boolean> {
    const user = await this.userService.findByEmail(email);
    await this.sendVerifyEmailToken(user);
    return true;
  }

  async sendVerifyEmailToken(user: User) {
    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    await this.mailService.sendUserConfirmation(user.email, token);
    return true
  }

  async getAccessToken(payload: any): Promise<string> {
    return this.jwtService.sign(payload, { expiresIn: '3h' });
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    const decoded = this.jwtService.verify(refreshToken);
    console.log("decoded", decoded);
    const user = await this.userService.findOne(decoded.userId);
    if (!user) {
      throw new BadRequestException('Invalid token');
    }

    const payload = {
      email: user.email,
      userId: user.id,
      lastPasswordUpdatedAt: user.lastPasswordUpdatedAt,
    };
    return await this.getAccessToken(payload);
  }

  async adminCreate(createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.adminCreate(createUserDto);
  }

}
