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

@Controller('auth')
@UseFilters(HttpExceptionsFilter)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly strategy: MagicLoginStrategy,
    private readonly usersService: UsersService,
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
    return { tokens: tokens };
  }

  @Post('verify-login')
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

  @Post('verify-register')
  async verifyRegister(@Body() body: { register_token: string }) {
    const userData = await this.authService.verifyRegisterToken(
      body.register_token,
    );

    const user = await this.usersService.updateUser({
      where: { email: userData.email },
      data: { verified: true },
    });

    const { jwt_token } = this.authService.generateTokens(user);

    return {
      message: CONFIG_MESSAGES.UserCreatedVerified,
      user: user,
      jwt_token: jwt_token,
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
  async verifyToken(@Req() req) {
    return req.user;
  }
}
