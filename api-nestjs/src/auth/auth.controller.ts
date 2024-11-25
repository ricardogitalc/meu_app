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
import { MagicLoginStrategy } from './strategy/magic-login.strategy';
import { LoginDto } from './dto/login.dto';
import { HttpExceptionsFilter } from 'src/common/filter/http-exception.filter';
import { Response } from 'express';
import { JwtGuard } from './guards/jwt.guard';
import { CONFIG_MESSAGES } from 'src/config/config';
import { UsersService } from '../users/users.service';
import { ResendService } from '../mail/resend';

@Controller('auth')
@UseFilters(HttpExceptionsFilter)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly strategy: MagicLoginStrategy,
    private readonly usersService: UsersService,
    private readonly resendService: ResendService,
  ) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.destination);

    if (!user) {
      throw new UnauthorizedException(CONFIG_MESSAGES.UserNotFound);
    }

    if (!user.verified) {
      throw new UnauthorizedException(CONFIG_MESSAGES.EmailNotVerified);
    }

    const tokens = await this.authService.generateMagicLinkToken(
      body.destination,
    );
    await this.resendService.sendLoginEmail(
      body.destination,
      tokens.verify_url,
    );

    return { message: 'Link de acesso enviado.', tokens: tokens };
  }

  @Get('verify-login')
  async verifyMagicLink(
    @Headers('login-token') loginToken: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.verifyMagicLinkToken(loginToken);
    const { jwt_token } = this.authService.generateTokens(user);
    const refresh_token = this.authService.generateRefreshToken(user);

    return {
      message: 'Login verificado com sucesso',
      user,
      jwt_token,
      refresh_token,
    };
  }

  @Get('verify-register')
  async verifyRegister(@Headers('register-token') registerToken: string) {
    const userData = await this.authService.verifyRegisterToken(registerToken);

    const user = await this.usersService.updateUser({
      where: { email: userData.email },
      data: { verified: true },
    });

    const { jwt_token } = this.authService.generateTokens(user);
    const refresh_token = this.authService.generateRefreshToken(user);

    return {
      message: CONFIG_MESSAGES.UserCreatedVerified,
      user: user,
      jwt_token: jwt_token,
      refresh_token: refresh_token,
    };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req, @Res() res) {
    const { jwt_token } = this.authService.generateTokens(req.user);
    const refresh_token = this.authService.generateRefreshToken(req.user);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const userStr = encodeURIComponent(JSON.stringify(req.user));
    const callbackUrl = `${frontendUrl}/google-callback?token=${jwt_token}&refresh_token=${refresh_token}&user=${userStr}`;

    return res.redirect(callbackUrl);
  }

  @Get('me')
  @UseGuards(JwtGuard)
  async verifyToken(@Req() req) {
    return req.user;
  }

  @Get('refresh-token')
  async refreshToken(
    @Headers('refresh-token') refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const { user, jwt_token } = await this.authService.refreshToken(
        refreshToken,
      );
      return {
        message: 'Token atualizado com sucesso',
        user,
        jwt_token,
      };
    } catch (error) {
      throw new UnauthorizedException(CONFIG_MESSAGES.JwtTokenExpired);
    }
  }
}
