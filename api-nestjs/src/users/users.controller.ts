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
import { UserEntity } from './entity/users.entity';

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
    const userVerified = await this.usersService.UserFindUnique({
      email: createUserDto.email,
    });

    if (userVerified.verified === true) {
      throw new UnauthorizedException(CONFIG_MESSAGES.UserAlReady);
    }

    const user = await this.usersService.createUser({
      ...createUserDto,
      verified: false,
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
  @UseGuards(JwtGuard)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    try {
      return await this.usersService.UserFindUnique({ id });
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
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
  @UseGuards(JwtGuard)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<User> {
    try {
      return await this.usersService.deleteUser({ id });
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
