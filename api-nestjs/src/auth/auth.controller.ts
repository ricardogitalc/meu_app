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

@Controller('auth')
@UseFilters(HttpExceptionsFilter)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly strategy: MagicLoginStrategy,
  ) {}

  @Post('login')
  async login(
    @Req() req,
    @Res() res,
    @Body(new ValidationPipe()) body: LoginDto,
  ) {
    await this.authService.validateUser(body.destination);
    return this.strategy.send(req, res);
  }

  @UseGuards(AuthGuard('magiclogin'))
  @Get('login/callback')
  callback(@Req() req) {
    // return req.user;
    return this.authService.generateTokens(req.user);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // O Google cuida do redirecionamento
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthCallback(@Req() req) {
    return this.authService.generateTokens(req.user);
  }
}
