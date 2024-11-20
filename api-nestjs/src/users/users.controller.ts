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
  UnauthorizedException,
  UseFilters,
  UseGuards,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
import { User } from '@prisma/client';
import { HttpExceptionsFilter } from 'src/common/filter/http-exception.filter';
import { CONFIG_MESSAGES } from 'src/config/config';
import { AdminGuard } from './guards/admin.guard';
import { AuthService } from 'src/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('users')
@UseFilters(HttpExceptionsFilter)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto): Promise<any> {
    await this.usersService.createUser({
      ...createUserDto,
    });

    const register_token = await this.authService.generateRegisterToken(
      createUserDto,
    );

    const verify_url = `${this.configService.get<string>(
      'FRONTEND_URL',
    )}/verify-register?register_token=${register_token}`;

    return {
      message: CONFIG_MESSAGES.SendVerificationLink,
      register_token,
      verify_url,
    };
  }

  @Get('all')
  @UseGuards(AdminGuard)
  async findAll(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ): Promise<User[]> {
    return await this.usersService.users({
      skip: Number(skip) || undefined,
      take: Number(take) || undefined,
    });
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    const user = await this.usersService.UserFindUnique({ id });

    if (!user) {
      throw new UnauthorizedException(CONFIG_MESSAGES.UserNotFound);
    }

    return user;
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<{ message: string; User: User }> {
    const user = await this.usersService.UserFindUnique({ id });

    if (!user) {
      throw new UnauthorizedException(CONFIG_MESSAGES.UserNotFound);
    }

    const User = await this.usersService.updateUser({
      where: { id },
      data: updateUserDto,
    });

    return {
      message: CONFIG_MESSAGES.UpdateUserSucess,
      User: User,
    };
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string; user: User }> {
    const user = await this.usersService.UserFindUnique({ id });

    if (!user) {
      throw new UnauthorizedException(CONFIG_MESSAGES.UserNotFound);
    }

    const deletedUser = await this.usersService.deleteUser({ id });

    return {
      message: CONFIG_MESSAGES.UserDeletedSucess,
      user: deletedUser,
    };
  }
}
