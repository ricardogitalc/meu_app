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
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { MagicLoginStrategy } from './strategy/magic-login.strategy';
import { LoginDto } from './dto/login.dto';
import { HttpExceptionsFilter } from 'src/common/filter/http-exception.filter';
import { LoginGuard } from './guards/login.guard';
import { Response } from 'express';
import { COOKIE_EXPIRATION_TIME } from 'src/constant/constant';

@Controller('auth')
@UseFilters(HttpExceptionsFilter)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly strategy: MagicLoginStrategy,
  ) {}

  @Post('login')
  async login(@Body(new ValidationPipe()) body: LoginDto) {
    await this.authService.validateUser(body.destination);
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

    response.cookie('jwt_token', jwt_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: COOKIE_EXPIRATION_TIME,
    });

    return { success: true, message: 'Login verificado com sucesso' };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req) {
    return this.authService.generateTokens(req.user);
  }
}
