import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  ConflictException,
  InternalServerErrorException,
  HttpStatus,
  HttpException,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
import { User } from '@prisma/client';
import { HttpExceptionsFilter } from 'src/common/filter/http-exception.filter';
import { CONFIG_MESSAGES } from 'src/config/config';

@Controller('users')
@UseFilters(HttpExceptionsFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.usersService.createUser(createUserDto);
    } catch (error) {
      throw new UnauthorizedException(CONFIG_MESSAGES.UserAlReady);
    }
  }

  @Get()
  async findAll(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ): Promise<User[]> {
    try {
      return await this.usersService.users({
        skip: Number(skip) || undefined,
        take: Number(take) || undefined,
      });
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    try {
      return await this.usersService.user({ id });
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    try {
      return await this.usersService.updateUser({
        where: { id },
        data: updateUserDto,
      });
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<User> {
    try {
      return await this.usersService.deleteUser({ id });
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
