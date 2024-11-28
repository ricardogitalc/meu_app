import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { AUTH_TIMES, CONFIG_MESSAGES } from 'src/config/config';
import { CreateUserDto } from 'src/users/dto/users.dto';
import { UserEntity } from 'src/users/entity/users.entity';
import * as jose from 'jose';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  validateUser(email: string) {
    return this.usersService.UserFindUnique({ email });
  }

  async createGoogleUser(userData: {
    email: string;
    firstName: string;
    lastName: string;
    imageUrl?: string;
    verified: boolean;
  }) {
    try {
      return await this.usersService.createUser(userData);
    } catch (error) {
      throw new UnauthorizedException('Falha na autenticação com Google');
    }
  }

  generateTokens(user: UserEntity) {
    const payload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      whatsappNumber: user.whatsappNumber,
      imageUrl: user.imageUrl,
      verified: user.verified,
    };
    return { jwt_token: this.jwtService.sign(payload) };
  }

  generateMagicLinkToken(destination: string) {
    const payload = { destination };
    const login_token = this.jwtService.sign(payload, {
      expiresIn: AUTH_TIMES.LOGIN_TOKEN,
    });
    const verify_url = `${this.configService.get<string>(
      'FRONTEND_URL',
    )}/verify-login?login_token=${login_token}`;

    return { login_token, verify_url };
  }

  async verifyMagicLinkToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.validateUser(payload.destination);
      return user;
    } catch (error) {
      throw new UnauthorizedException(CONFIG_MESSAGES.JwtTokenExpired);
    }
  }

  async verifyRegisterToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return payload.userData; // Dados do usuário enviados no token
    } catch (error) {
      throw new UnauthorizedException(CONFIG_MESSAGES.JwtTokenExpired);
    }
  }

  generateRegisterToken(userData: CreateUserDto) {
    const payload = { userData };
    return this.jwtService.sign(payload, {
      expiresIn: AUTH_TIMES.LOGIN_TOKEN,
    });
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verifica se o refresh token é válido
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      });

      // Busca o usuário
      const user = await this.validateUser(payload.email);
      if (!user) {
        throw new UnauthorizedException(CONFIG_MESSAGES.UserNotFound);
      }

      // Gera novo token JWT
      const jwt_token = this.generateTokens(user);

      return { user, ...jwt_token };
    } catch (error) {
      throw new UnauthorizedException(CONFIG_MESSAGES.JwtTokenExpired);
    }
  }

  generateRefreshToken(user: UserEntity) {
    const payload = {
      email: user.email,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: AUTH_TIMES.REFRESH_TOKEN,
    });
  }

  async generateTestJWE() {
    const payload = {
      sub: '3424234',
      name: 'Payloading...',
      role: 'adminnn',
      exp: Math.floor(Date.now() / 1000) + 60 * 15,
    };

    const secretKey = this.configService.get<string>('JWT_SECRET_KEY');
    const key = new TextEncoder().encode(secretKey.slice(0, 32));
    const jwe = await new jose.CompactEncrypt(
      new TextEncoder().encode(JSON.stringify(payload)),
    )
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
      .encrypt(key);

    return {
      jwe,
      message: 'Token JWE gerado com sucesso',
    };
  }

  async decryptTestJWE(jwe: string) {
    const secretKey = this.configService.get<string>('JWT_SECRET_KEY');

    const key = new TextEncoder().encode(secretKey.slice(0, 32));

    const { plaintext } = await jose.compactDecrypt(jwe, key);
    const decodedPayload = new TextDecoder().decode(plaintext);
    const payload = JSON.parse(decodedPayload);

    return {
      payload: payload,
      message: 'Token JWE descriptografado com sucesso',
    };
  }
}
