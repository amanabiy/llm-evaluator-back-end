import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, Query, HttpStatus, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { User } from './entity/user.entity';
import FindAllResponseDto from 'src/dto/find-all-response.dto';
import { DeleteResponseDto } from 'src/dto/delete-response.dto';
import { PaginationDto } from 'src/dto/pagination.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles-guard';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth('bearerAuth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('me')
  @ApiOperation({ summary: 'Update current logged in user' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated successfully',
    type: User,
  })
  async updateMe(
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: User,
  ): Promise<User> {
    const { email, fullName, password } = updateUserDto;
    return this.usersService.update(currentUser.id, { fullName });
  }
  
  // @Post()
  // @ApiOperation({ summary: 'Create a new user' })
  // @ApiResponse({ status: 201, description: 'The user has been successfully created.', type: User })
  // @ApiResponse({ status: 400, description: 'Bad Request' })
  // @UsePipes(new ValidationPipe({ transform: true }))
  // create(@Body() createUserDto: CreateUserDto): Promise<User> {
  //   return this.usersService.create(createUserDto as User);
  // }

  // @Get()
  // @ApiOperation({ summary: 'Get all users with pagination' })
  // @ApiResponse({ status: 200, description: 'List of users with pagination', type: FindAllResponseDto })
  // findAll(@Query() paginationDto: PaginationDto): Promise<FindAllResponseDto<User>> {
  //   return this.usersService.findAll(paginationDto.page, paginationDto.limit);
  // }

  // @Get(':id')
  // @ApiOperation({ summary: 'Get a user by ID' })
  // @ApiResponse({ status: 200, description: 'User details', type: User })
  // @ApiResponse({ status: 404, description: 'User not found' })
  // findOne(@Param('id') id: string): Promise<User> {
  //   return this.usersService.findOne(id);
  // }

  // @Patch(':id')
  // @ApiOperation({ summary: 'Update a user by ID' })
  // @ApiResponse({ status: 200, description: 'The user has been successfully updated.', type: User })
  // @ApiResponse({ status: 404, description: 'User not found' })
  // @UsePipes(new ValidationPipe({ transform: true }))
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
  //   return this.usersService.update(id, updateUserDto);
  // }

  @Delete('me')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({ status: 200, description: 'The user has been successfully deleted.', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteMe(@Param('id') id: string): Promise<DeleteResponseDto>  {
    await this.usersService.remove(id);
    return new DeleteResponseDto();
  }
}
