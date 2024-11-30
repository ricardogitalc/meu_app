import {
  Controller,
  Req,
  Res,
  Post,
  Get,
  Body,
  UseGuards,
  UseFilters,
  UnauthorizedException,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { HttpExceptionsFilter } from 'src/common/filter/http-exception.filter';
import { Response } from 'express';
import { CONFIG_MESSAGES } from 'src/config/config';
import { UsersService } from '../users/users.service';
import { ResendService } from '../mail/resend';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';

@ApiTags('Autenticação')
@Controller('auth')
@UseFilters(HttpExceptionsFilter)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly resendService: ResendService,
  ) {}

  @ApiOperation({ summary: 'Enviar magic link para login' })
  @ApiResponse({ status: 201, description: 'Link de acesso enviado.' })
  @ApiResponse({ status: 401, description: 'Usuário não encontrado.' })
  @ApiResponse({ status: 429, description: 'Muitas tentativas.' })
  @ApiResponse({
    status: 401,
    description: 'Usuário não encontrado ou não verificado.',
  })
  // @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email);

    if (!user) {
      throw new UnauthorizedException(CONFIG_MESSAGES.UserNotFound);
    }

    if (!user.verified) {
      throw new UnauthorizedException(CONFIG_MESSAGES.EmailNotVerified);
    }

    const tokens = await this.authService.generateMagicLinkToken(body.email);
    await this.resendService.sendLoginEmail(body.email, tokens.verifyLoginUrl);

    return { message: 'Link de acesso enviado.', ...tokens };
  }

  @ApiOperation({ summary: 'Verificar magic link' })
  @ApiHeader({ name: 'loginToken', required: true })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Token inválido ou expirado.' })
  @ApiResponse({ status: 429, description: 'Muitas tentativas.' })
  // @Throttle({ default: { limit: 1, ttl: 60000 } })
  @Get('verify-login')
  async verifyL(
    @Headers('loginToken') loginToken: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.verifyMagicLinkToken(loginToken);

    const { accessToken } = this.authService.generateTokens(user);
    const refreshToken = this.authService.generateRefreshToken(user);

    return {
      message: CONFIG_MESSAGES.UserLogged,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  @ApiOperation({ summary: 'Verificar registro de usuário' })
  @ApiHeader({ name: 'registerToken', required: true })
  @ApiResponse({ status: 200, description: 'Registro verificado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Token inválido ou expirado.' })
  @ApiResponse({ status: 429, description: 'Muitas tentativas.' })
  // @Throttle({ default: { limit: 1, ttl: 60000 } })
  @Get('verify-register')
  async verifyRegister(@Headers('registerToken') registerToken: string) {
    const userData = await this.authService.verifyRegisterToken(registerToken);

    const user = await this.usersService.updateUser({
      where: { email: userData.email },
      data: { verified: true },
    });

    const { accessToken } = this.authService.generateTokens(user);
    const refreshToken = this.authService.generateRefreshToken(user);

    return {
      message: CONFIG_MESSAGES.UserCreatedVerified,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  @ApiOperation({ summary: 'Iniciar autenticação com Google' })
  @ApiResponse({ status: 302, description: 'Redirecionamento para Google.' })
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @ApiOperation({ summary: 'Callback da autenticação Google' })
  @ApiResponse({
    status: 302,
    description: 'Redirecionamento após autenticação.',
  })
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req, @Res() res) {
    const { accessToken } = this.authService.generateTokens(req.user);
    const refreshToken = this.authService.generateRefreshToken(req.user);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const userStr = encodeURIComponent(JSON.stringify(req.user));
    const callbackUrl = `${frontendUrl}/google-callback?token=${accessToken}&refreshToken=${refreshToken}&user=${userStr}`;

    return res.redirect(callbackUrl);
  }

  @ApiOperation({ summary: 'Renovar token de acesso' })
  @ApiHeader({ name: 'refreshToken', required: true })
  @ApiResponse({ status: 200, description: 'Token atualizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'O token é inválido ou expirou.' })
  @Get('refresh-token')
  async refreshToken(
    @Headers('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const { accessToken } = await this.authService.refreshToken(refreshToken);
      return {
        message: 'Token atualizado com sucesso',
        accessToken: accessToken,
      };
    } catch (error) {
      throw new UnauthorizedException(CONFIG_MESSAGES.JwtTokenExpired);
    }
  }
}
