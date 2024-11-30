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
} from '../swagger/swagger.config';

@ApiTags('Autenticação')
@Controller('auth')
@UseFilters(HttpExceptionsFilter)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly resendService: ResendService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation(AuthSwaggerDocs.login.operation)
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

  @ApiOperation(AuthSwaggerDocs.register.operation)
  @ApiResponse(AuthSwaggerDocs.register.response)
  @ApiResponse(SwaggerErros.Unauthorized)
  @ApiResponse(SwaggerErros.TooManyRequests)
  @ApiResponse(SwaggerErros.InvalidDetails)
  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<RegisterResponse> {
    await this.usersService.createUser({
      ...createUserDto,
    });

    const registerToken = await this.authService.generateRegisterToken(
      createUserDto,
    );

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

  @ApiOperation(AuthSwaggerDocs.verifyLogin.operation)
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

    return {
      message: CONFIG_MESSAGES.userLogged,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  @ApiOperation(AuthSwaggerDocs.verifyRegister.operation)
  @ApiHeader(AuthSwaggerDocs.verifyRegister.header)
  @ApiResponse(AuthSwaggerDocs.verifyRegister.responses.success)
  @ApiResponse(SwaggerErros.Unauthorized)
  @ApiResponse(SwaggerErros.TooManyRequests)
  @Get('verify-register')
  async verifyRegister(
    @Headers('registerToken') registerToken: string,
  ): Promise<VerifyRegisterResponse> {
    const userData = await this.authService.verifyRegisterToken(registerToken);

    const user = await this.usersService.updateUser({
      where: { email: userData.email },
      data: { verified: true },
    });

    const { accessToken } = this.authService.generateTokens(user);
    const refreshToken = this.authService.generateRefreshToken(user);

    return {
      message: CONFIG_MESSAGES.userVerified,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  @ApiOperation(AuthSwaggerDocs.googleAuth.operation)
  @ApiResponse(AuthSwaggerDocs.googleAuth.response)
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @ApiOperation(AuthSwaggerDocs.googleCallback.operation)
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

  @ApiOperation(AuthSwaggerDocs.refreshToken.operation)
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
}
