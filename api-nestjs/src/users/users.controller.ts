import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseFilters,
  UseGuards,
  Inject,
  forwardRef,
  Request,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/users.dto';
import { User } from '@prisma/client';
import { HttpExceptionsFilter } from 'src/common/filter/http-exception.filter';
import { CONFIG_MESSAGES } from 'src/config/config';
import { AdminGuard } from './guards/admin.guard';
import { AuthService } from 'src/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { ResendService } from '../mail/resend';
import { SkipThrottle } from '@nestjs/throttler';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import {
  UserSwaggerDocs,
  SwaggerErros,
  UserDetailsResponse,
  UpdateUserResponse,
  DeleteUserResponse,
  UserListResponse,
} from '../swagger/swagger.config';

@ApiTags('Usuários')
@Controller('user')
@ApiBearerAuth()
@UseFilters(HttpExceptionsFilter)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly resendService: ResendService,
  ) {}

  // ROTAS USER

  @ApiOperation(UserSwaggerDocs.findOne.operation)
  @ApiResponse(UserSwaggerDocs.findOne.response)
  @ApiResponse(SwaggerErros.Unauthorized)
  @Get('details')
  @UseGuards(JwtGuard)
  async findOne(@Request() req): Promise<UserDetailsResponse> {
    return await this.usersService.UserFindUnique({ id: req.user.id });
  }

  @ApiOperation(UserSwaggerDocs.update.operation)
  @ApiResponse(UserSwaggerDocs.update.response)
  @ApiResponse(SwaggerErros.Unauthorized)
  @ApiResponse(SwaggerErros.InvalidDetails)
  @Patch('update')
  @UseGuards(JwtGuard)
  async update(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserResponse> {
    const updatedUser = await this.usersService.updateUser({
      where: { id: req.user.id },
      data: updateUserDto,
    });

    const updatedFields: Partial<User> = {};
    Object.keys(updateUserDto).forEach((key) => {
      updatedFields[key] = updatedUser[key];
    });

    return {
      message: CONFIG_MESSAGES.userUpdated,
      updatedFields,
    };
  }

  @ApiOperation(UserSwaggerDocs.remove.operation)
  @ApiResponse(UserSwaggerDocs.remove.responses.success)
  @ApiResponse(SwaggerErros.Unauthorized)
  @Delete('delete')
  @UseGuards(JwtGuard)
  async remove(@Request() req): Promise<DeleteUserResponse> {
    const deletedUser = await this.usersService.deleteUser({ id: req.user.id });

    return {
      message: CONFIG_MESSAGES.userDeleted,
      user: deletedUser,
    };
  }

  // ROTAS ADMIN

  @ApiOperation(UserSwaggerDocs.findAll.operation)
  @ApiResponse(UserSwaggerDocs.findAll.responses.success)
  @ApiResponse(SwaggerErros.Unauthorized)
  @SkipThrottle()
  @Get('users')
  @UseGuards(AdminGuard)
  async findAll(): Promise<UserListResponse> {
    return await this.usersService.users({});
  }

  @ApiOperation(UserSwaggerDocs.findById.operation)
  @ApiResponse(UserSwaggerDocs.findById.responses.success)
  @ApiResponse(SwaggerErros.Unauthorized)
  @SkipThrottle()
  @Get(':id')
  @UseGuards(AdminGuard)
  async findById(@Param('id') id: string): Promise<User> {
    return await this.usersService.UserFindById(Number(id));
  }

  @ApiOperation(UserSwaggerDocs.updateById.operation)
  @ApiResponse(UserSwaggerDocs.updateById.responses.success)
  @ApiResponse(SwaggerErros.Unauthorized)
  @ApiResponse(SwaggerErros.InvalidDetails)
  @SkipThrottle()
  @Patch(':id')
  @UseGuards(AdminGuard)
  async updateById(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserResponse> {
    const updatedUser = await this.usersService.updateUserById(
      Number(id),
      updateUserDto,
    );

    const updatedFields: Partial<User> = {};
    Object.keys(updateUserDto).forEach((key) => {
      updatedFields[key] = updatedUser[key];
    });

    return {
      message: CONFIG_MESSAGES.userUpdated,
      updatedFields,
    };
  }

  @ApiOperation(UserSwaggerDocs.removeById.operation)
  @ApiResponse(UserSwaggerDocs.removeById.responses.success)
  @ApiResponse(SwaggerErros.Unauthorized)
  @SkipThrottle()
  @Delete(':id')
  @UseGuards(AdminGuard)
  async removeById(@Param('id') id: string): Promise<DeleteUserResponse> {
    const deletedUser = await this.usersService.deleteUserById(Number(id));

    return {
      message: CONFIG_MESSAGES.userDeleted,
      user: deletedUser,
    };
  }
}
