import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Like, Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GenericDAL } from 'src/DAL/dal';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../auth/dto/login.user.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService extends GenericDAL<User, CreateUserDto, UpdateUserDto> {
  adminCreate(createUserDto: CreateUserDto): User | PromiseLike<User> {
    return this.create(createUserDto as User);
  }

  constructor(@InjectRepository(User) private userModel: Repository<User>) {
    super(userModel, 0, 10, [], User);
  }

  // Check if a user already exists by email
  private async isEmailTaken(email: string): Promise<boolean> {
    const existingUser = await this.find({ where: {email} });
    return existingUser.length > 0;
  }

  async create(createUserDto: User): Promise<User> {
    // Check for email duplication
    if (await this.isEmailTaken(createUserDto.email)) {
      throw new BadRequestException('Email is already taken');
    }

    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Replace the password in the DTO with the hashed one
    const createUserDtoWithHashedPassword = {
      ...createUserDto,
      password: hashedPassword,
    };

    // Call the parent class's create method with the modified DTO
    const createdUser: User = await super.create(createUserDtoWithHashedPassword);
    return createdUser;
  }

  async validatePassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }

  hashPassword(password: string): Promise<string> {
    const saltOrRounds = 12;
    return bcrypt.hash(password, saltOrRounds);
  }

  async authenticateUser(loginUserDto: LoginUserDto): Promise<User> {
    const { email, password } = loginUserDto;
    try {
      const user = await this.findByEmail(email);
      // console.log("found user", user);
      const isValidPassword = await this.validatePassword(password, user.password);

      if (!isValidPassword) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Use plainToInstance to transform the User object into UserResponseDto
      const userResponse = plainToInstance(User, user);
      console.log("userResponse", userResponse)
      return userResponse;
    } catch {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async findByEmail(email: string): Promise<User> {
    const users = await this.find({ where: { email } }, false);
    if (!users.length) {
      throw new NotFoundException('User not found');
    }
    return users[0];
  }
}
