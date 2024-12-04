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
import { CONFIG_MESSAGES, COOKIE_CONFIG } from 'src/config/config';
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
} from '../swagger/swagger.config';
import { RefreshGuard } from 'src/users/guards/refresh.guard';
import { JwtGuard } from 'src/users/guards/jwt.guard';

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
    @Headers('x-login-token') loginToken: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<VerifyLoginResponse> {
    const user = await this.authService.verifyMagicLinkToken(loginToken);

    const { accessToken } = this.authService.generateTokens(user);
    const refreshToken = this.authService.generateRefreshToken(user);

    response.cookie('accessToken', accessToken, COOKIE_CONFIG.accessToken);
    response.cookie('refreshToken', refreshToken, COOKIE_CONFIG.refreshToken);

    return {
      message: CONFIG_MESSAGES.userLogged,
      accessToken,
      refreshToken,
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
    @Headers('x-register-token') registerToken: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<VerifyRegisterResponse> {
    const user = await this.authService.verifyRegisterToken(registerToken);

    const verifiedUser = await this.usersService.updateUser({
      where: { id: user.id },
      data: { verified: true },
    });

    const { accessToken } = this.authService.generateTokens(verifiedUser);
    const refreshToken = this.authService.generateRefreshToken(verifiedUser);

    response.cookie('accessToken', accessToken, COOKIE_CONFIG.accessToken);
    response.cookie('refreshToken', refreshToken, COOKIE_CONFIG.refreshToken);

    return {
      message: CONFIG_MESSAGES.userVerified,
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
  @UseGuards(RefreshGuard)
  @Get('refresh-token')
  async refreshToken(
    @Headers('x-refresh-token') refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<RefreshTokenResponse> {
    try {
      const { accessToken } = await this.authService.refreshToken(refreshToken);

      response.cookie('accessToken', accessToken, COOKIE_CONFIG.accessToken);

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
  @ApiResponse(AuthSwaggerDocs.logout.response)
  @ApiResponse(SwaggerErros.Unauthorized)
  @UseGuards(JwtGuard)
  @Get('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('accessToken');
    response.clearCookie('refreshToken');

    return {
      message: CONFIG_MESSAGES.userLoggedOut,
    };
  }
}
