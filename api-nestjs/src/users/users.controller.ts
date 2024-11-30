import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseFilters,
  UseGuards,
  Inject,
  forwardRef,
  Request,
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
import { ResendService } from '../mail/resend';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@Controller('user')
@UseFilters(HttpExceptionsFilter)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly resendService: ResendService,
  ) {}

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('register')
  async create(@Body() createUserDto: CreateUserDto): Promise<any> {
    await this.usersService.createUser({
      ...createUserDto,
    });

    const registerToken = await this.authService.generateRegisterToken(
      createUserDto,
    );

    const verifyUrl = `${this.configService.get<string>(
      'FRONTEND_URL',
    )}/verify-register?registerToken=${registerToken}`;

    await this.resendService.sendVerificationEmail(
      createUserDto.email,
      verifyUrl,
    );

    return {
      message: CONFIG_MESSAGES.SendVerificationLink,
      registerToken,
      verifyUrl,
    };
  }

  @SkipThrottle()
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

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Get('details')
  @UseGuards(JwtGuard)
  async findOne(@Request() req): Promise<User> {
    return await this.usersService.UserFindUnique({ id: req.user.id });
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Patch('update')
  @UseGuards(JwtGuard)
  async update(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<{
    message: string;
    updatedFields: Partial<User>;
  }> {
    const updatedUser = await this.usersService.updateUser({
      where: { id: req.user.id },
      data: updateUserDto,
    });

    const updatedFields: Partial<User> = {};
    Object.keys(updateUserDto).forEach((key) => {
      updatedFields[key] = updatedUser[key];
    });

    return {
      message: CONFIG_MESSAGES.UpdateUserSucess,
      updatedFields,
    };
  }

  @Throttle({ default: { limit: 1, ttl: 60000 } })
  @Delete('delete')
  @UseGuards(JwtGuard)
  async remove(@Request() req): Promise<{ message: string; user: User }> {
    const deletedUser = await this.usersService.deleteUser({ id: req.user.id });

    return {
      message: CONFIG_MESSAGES.UserDeletedSucess,
      user: deletedUser,
    };
  }
}
