import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { User } from 'src/modules/users/entity/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: any): Promise<User> {
    try {
      console.log(payload)
      const user = await this.userService.findOne(payload['userId']);
      if (user.isVerified === false) {
        throw new UnauthorizedException('Please verify your email address');
      }
      if (user.lastPasswordUpdatedAt && payload.lastPasswordUpdatedAt !== user.lastPasswordUpdatedAt.toISOString()) {
        throw new UnauthorizedException('Password have changed'); // this is not shown for the user (only Invalid credentials is)
      }
      console.log(user);
      return user;
    } catch (error) {
      console.log(error)
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
