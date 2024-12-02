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
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/users.dto';
import { ConfigService } from '@nestjs/config';
import {
  AuthSwaggerDocs,
  SwaggerErros,
  LoginResponse,
  RegisterResponse,
  VerifyLoginResponse,
  VerifyRegisterResponse,
  RefreshTokenResponse,
  LogoutResponse,
} from '../swagger/swagger.config';

@ApiTags('auth')
@Controller('auth')
@UseFilters(HttpExceptionsFilter)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly resendService: ResendService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({
    summary: AuthSwaggerDocs.login.operation.summary,
    operationId: AuthSwaggerDocs.login.operationId,
  })
  @ApiResponse(AuthSwaggerDocs.login.response)
  @ApiResponse(SwaggerErros.Unauthorized)
  @ApiResponse(SwaggerErros.TooManyRequests)
  @ApiResponse(SwaggerErros.InvalidDetails)
  @Post('login')
  async login(@Body() body: LoginDto): Promise<LoginResponse> {
    const user = await this.authService.validateUser(body.email);

    if (!user) {
      throw new UnauthorizedException(CONFIG_MESSAGES.userNotFound);
    }

    if (!user.verified) {
      throw new UnauthorizedException(CONFIG_MESSAGES.userNotVerified);
    }

    const tokens = await this.authService.generateMagicLinkToken(body.email);

    // await this.resendService.sendLoginEmail(body.email, tokens.verifyLoginUrl);

    return { message: CONFIG_MESSAGES.loginLinkSent, ...tokens };
  }

  @ApiOperation({
    summary: AuthSwaggerDocs.registerUser.operation.summary,
    operationId: AuthSwaggerDocs.registerUser.operationId,
  })
  @ApiResponse(AuthSwaggerDocs.registerUser.response)
  @ApiResponse(SwaggerErros.Unauthorized)
  @ApiResponse(SwaggerErros.TooManyRequests)
  @ApiResponse(SwaggerErros.InvalidDetails)
  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<RegisterResponse> {
    const user = await this.usersService.createUser({
      ...createUserDto,
    });

    const registerToken = await this.authService.generateRegisterToken(user.id);

    const verifyRegisterUrl = `${this.configService.get<string>(
      'FRONTEND_URL',
    )}/verify-register?registerToken=${registerToken}`;

    // await this.resendService.sendVerificationEmail(
    //   createUserDto.email,
    //   verifyRegisterUrl,
    // );

    return {
      message: CONFIG_MESSAGES.verificationLinkSent,
      registerToken,
      verifyRegisterUrl,
    };
  }

  @ApiOperation({
    summary: AuthSwaggerDocs.verifyLogin.operation.summary,
    operationId: AuthSwaggerDocs.verifyLogin.operationId,
  })
  @ApiHeader(AuthSwaggerDocs.verifyLogin.header)
  @ApiResponse(AuthSwaggerDocs.verifyLogin.responses.success)
  @ApiResponse(SwaggerErros.Unauthorized)
  @ApiResponse(SwaggerErros.TooManyRequests)
  @Get('verify-login')
  async verifyLogin(
    @Headers('loginToken') loginToken: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<VerifyLoginResponse> {
    const user = await this.authService.verifyMagicLinkToken(loginToken);

    const { accessToken } = this.authService.generateTokens(user);
    const refreshToken = this.authService.generateRefreshToken(user);

    // Configurando cookies
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutos
    });

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    });

    return {
      message: CONFIG_MESSAGES.userLogged,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  @ApiOperation({
    summary: AuthSwaggerDocs.verifyRegister.operation.summary,
    operationId: AuthSwaggerDocs.verifyRegister.operationId,
  })
  @ApiHeader(AuthSwaggerDocs.verifyRegister.header)
  @ApiResponse(AuthSwaggerDocs.verifyRegister.responses.success)
  @ApiResponse(SwaggerErros.Unauthorized)
  @ApiResponse(SwaggerErros.TooManyRequests)
  @Get('verify-register')
  async verifyRegister(
    @Headers('registerToken') registerToken: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<VerifyRegisterResponse> {
    const user = await this.authService.verifyRegisterToken(registerToken);

    const verifiedUser = await this.usersService.updateUser({
      where: { id: user.id },
      data: { verified: true },
    });

    const { accessToken } = this.authService.generateTokens(verifiedUser);
    const refreshToken = this.authService.generateRefreshToken(verifiedUser);

    // Configurando cookies
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutos
    });

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    });

    return {
      message: CONFIG_MESSAGES.userVerified,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  @ApiOperation({
    summary: AuthSwaggerDocs.googleLogin.operation.summary,
    operationId: AuthSwaggerDocs.googleLogin.operationId,
  })
  @ApiResponse(AuthSwaggerDocs.googleLogin.response)
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @ApiOperation({
    summary: AuthSwaggerDocs.googleCallback.operation.summary,
    operationId: AuthSwaggerDocs.googleCallback.operationId,
  })
  @ApiResponse(AuthSwaggerDocs.googleCallback.response)
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

  @ApiOperation({
    summary: AuthSwaggerDocs.refreshToken.operation.summary,
    operationId: AuthSwaggerDocs.refreshToken.operationId,
  })
  @ApiHeader(AuthSwaggerDocs.refreshToken.header)
  @ApiResponse(AuthSwaggerDocs.refreshToken.responses.success)
  @ApiResponse(SwaggerErros.Unauthorized)
  @ApiResponse(SwaggerErros.TooManyRequests)
  @Get('refresh-token')
  async refreshToken(
    @Headers('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<RefreshTokenResponse> {
    try {
      const { accessToken } = await this.authService.refreshToken(refreshToken);
      return {
        message: CONFIG_MESSAGES.tokenUpdated,
        accessToken: accessToken,
      };
    } catch (error) {
      throw new UnauthorizedException(CONFIG_MESSAGES.invalidToken);
    }
  }

  @ApiOperation({
    summary: AuthSwaggerDocs.logout.operation.summary,
    operationId: AuthSwaggerDocs.logout.operationId,
  })
  @ApiResponse(AuthSwaggerDocs.logout.responses.success)
  @Get('logout')
  async logout(
    @Res({ passthrough: true }) response: Response,
  ): Promise<LogoutResponse> {
    response.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    response.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return { message: 'Logout realizado com sucesso' };
  }
}
