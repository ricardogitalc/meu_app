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

@Controller('auth')
@UseFilters(HttpExceptionsFilter)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly resendService: ResendService,
  ) {}

  @Throttle({ default: { limit: 3, ttl: 60000 } })
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
    await this.resendService.sendLoginEmail(body.email, tokens.verifyUrl);

    return { message: 'Link de acesso enviado.', ...tokens };
  }

  @Throttle({ default: { limit: 1, ttl: 60000 } })
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

  @Throttle({ default: { limit: 1, ttl: 60000 } })
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

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

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
