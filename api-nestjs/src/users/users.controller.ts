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
  Param,
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
import { SkipThrottle } from '@nestjs/throttler';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Usuários')
@ApiBearerAuth()
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

  // ROTAS USER

  @ApiOperation({ summary: 'Criar novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.' })
  @ApiResponse({ status: 401, description: 'O usuário já existe.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 429, description: 'Muitas tentativas.' })
  // @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('register')
  async create(@Body() createUserDto: CreateUserDto): Promise<any> {
    await this.usersService.createUser({
      ...createUserDto,
    });

    const registerToken = await this.authService.generateRegisterToken(
      createUserDto,
    );

    const verifyRegisterUrl = `${this.configService.get<string>(
      'FRONTEND_URL',
    )}/verify-register?registerToken=${registerToken}`;

    await this.resendService.sendVerificationEmail(
      createUserDto.email,
      verifyRegisterUrl,
    );

    return {
      message: CONFIG_MESSAGES.SendVerificationLink,
      registerToken,
      verifyRegisterUrl,
    };
  }

  @ApiOperation({ summary: 'Obter detalhes do usuário atual' })
  @ApiResponse({ status: 200, description: 'Retorna os dados do usuário.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 429, description: 'Muitas tentativas.' })
  // @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Get('details')
  @UseGuards(JwtGuard)
  async findOne(@Request() req): Promise<User> {
    return await this.usersService.UserFindUnique({ id: req.user.id });
  }

  @ApiOperation({ summary: 'Atualizar usuário atual' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 429, description: 'Muitas tentativas.' })
  // @Throttle({ default: { limit: 3, ttl: 60000 } })
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

  @ApiOperation({ summary: 'Deletar usuário atual' })
  @ApiResponse({ status: 200, description: 'Usuário deletado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @Delete('delete')
  @UseGuards(JwtGuard)
  async remove(@Request() req): Promise<{ message: string; user: User }> {
    const deletedUser = await this.usersService.deleteUser({ id: req.user.id });

    return {
      message: CONFIG_MESSAGES.UserDeletedSucess,
      user: deletedUser,
    };
  }

  // ROTAS ADMIN

  @ApiOperation({ summary: 'Listar todos usuários (Admin)' })
  @ApiResponse({ status: 200, description: 'Lista de usuários retornada.' })
  @ApiResponse({
    status: 401,
    description: 'Acesso negado ou token é inválido.',
  })
  @SkipThrottle()
  @Get('users')
  @UseGuards(AdminGuard)
  async findAll(): Promise<User[]> {
    return await this.usersService.users({});
  }

  @ApiOperation({ summary: 'Buscar usuário por ID (Admin)' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @ApiResponse({ status: 401, description: 'Token não fornecido ou inválido.' })
  @ApiBearerAuth() // Adicione esta linha
  @SkipThrottle()
  @Get(':id')
  @UseGuards(AdminGuard)
  async findById(@Param('id') id: string): Promise<User> {
    return await this.usersService.UserFindById(Number(id));
  }

  @ApiOperation({ summary: 'Atualizar usuário por ID (Admin)' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado' })
  @ApiResponse({
    status: 401,
    description: 'Token invalido ou usuário não encontrado',
  })
  @SkipThrottle()
  @Patch(':id')
  @UseGuards(AdminGuard)
  async updateById(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<{
    message: string;
    updatedFields: Partial<User>;
  }> {
    const updatedUser = await this.usersService.updateUserById(
      Number(id),
      updateUserDto,
    );

    const updatedFields: Partial<User> = {};
    Object.keys(updateUserDto).forEach((key) => {
      updatedFields[key] = updatedUser[key];
    });

    return {
      message: CONFIG_MESSAGES.UpdateUserSucess,
      updatedFields,
    };
  }

  @ApiOperation({ summary: 'Deletar usuário por ID (Admin)' })
  @ApiResponse({ status: 200, description: 'Usuário deletado com sucesso' })
  @ApiResponse({
    status: 401,
    description: 'Token invalido ou usuário não encontrado',
  })
  @SkipThrottle()
  @Delete(':id')
  @UseGuards(AdminGuard)
  async removeById(
    @Param('id') id: string,
  ): Promise<{ message: string; user: User }> {
    const deletedUser = await this.usersService.deleteUserById(Number(id));

    return {
      message: CONFIG_MESSAGES.UserDeletedSucess,
      user: deletedUser,
    };
  }
}
