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
  async verifyMagicLink(@Body() body: { login_token: string }) {
    const user = await this.authService.verifyMagicLinkToken(body.login_token);
    return this.authService.generateTokens(user);
  }

  // @UseGuards(MagicLinkGuard)
  // @Get('login/callback')
  // callback(@Req() req) {
  //   // return req.user;
  //   return this.authService.generateTokens(req.user);
  // }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthCallback(@Req() req) {
    return this.authService.generateTokens(req.user);
  }
}
