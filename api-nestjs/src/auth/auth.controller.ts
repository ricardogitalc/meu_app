import {
  Controller,
  Req,
  Res,
  Post,
  Get,
  Body,
  ValidationPipe,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { MagicLoginStrategy } from './strategy/magic-login.strategy';
import { LoginDto } from './dto/login.dto';
import { HttpExceptionsFilter } from 'src/common/filter/http-exception.filter';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtGuard } from './guards/jwt.guard';

@ApiTags('auth')
@Controller('auth')
@UseFilters(HttpExceptionsFilter)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly strategy: MagicLoginStrategy,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Gerar magic link para login' })
  @ApiResponse({ status: 200, description: 'Token gerado com sucesso' })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiBody({
    type: LoginDto,
    description: 'Dados para geração do magic link',
  })
  async login(@Body(new ValidationPipe()) body: LoginDto) {
    await this.authService.validateUser(body.destination);
    const tokens = await this.authService.generateMagicLinkToken(
      body.destination,
    );
    return { tokens: tokens };
  }

  @Post('verify-login')
  @ApiOperation({ summary: 'Verificar magic link e gerar JWT' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        login_token: {
          type: 'string',
          description: 'Token do magic link recebido por email',
        },
      },
    },
  })
  async verifyMagicLink(
    @Body() body: { login_token: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.verifyMagicLinkToken(body.login_token);
    const { jwt_token } = this.authService.generateTokens(user);

    return {
      success: true,
      message: 'Login verificado com sucesso',
      jwt_token,
    };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req) {
    return this.authService.generateTokens(req.user);
  }

  @Get('me')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Retornar dados do usuario' })
  @ApiResponse({
    status: 200,
    description: 'Dados do usuário retornados com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Token inválido ou expirado' })
  async verifyToken(@Req() req) {
    return req.user;
  }
}
