import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { JWT_TIMES, CONFIG_MESSAGES } from 'src/config/config';
import { UserEntity } from 'src/users/entity/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  validateUser(email: string) {
    return this.usersService.UserFindUnique({ email });
  }

  validateUserById(id: number) {
    return this.usersService.UserFindById(id);
  }

  generateTokens(user: UserEntity) {
    const payload = {
      sub: user.id,
    };
    return { accessToken: this.jwtService.sign(payload) };
  }

  generateMagicLinkToken(email: string) {
    const payload = { email };
    const loginToken = this.jwtService.sign(payload, {
      expiresIn: JWT_TIMES.LOGIN_TOKEN,
    });
    const verifyLoginUrl = `${this.configService.get<string>(
      'FRONTEND_URL',
    )}/verify-login?loginToken=${loginToken}`;

    return { loginToken, verifyLoginUrl };
  }

  async verifyMagicLinkToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.validateUser(payload.email);
      return user;
    } catch (error) {
      throw new UnauthorizedException(CONFIG_MESSAGES.expiredToken);
    }
  }

  async verifyRegisterToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.validateUserById(payload.sub);
      return user;
    } catch (error) {
      throw new UnauthorizedException(CONFIG_MESSAGES.expiredToken);
    }
  }

  generateRegisterToken(userId: number) {
    const payload = {
      sub: userId,
    };
    return this.jwtService.sign(payload);
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('REFRESH_SECRET_KEY'),
      });

      const user = await this.validateUserById(payload.sub);
      if (!user) {
        throw new UnauthorizedException(CONFIG_MESSAGES.userNotFound);
      }

      const accessToken = this.generateTokens(user);

      return accessToken;
    } catch (error) {
      throw new UnauthorizedException(CONFIG_MESSAGES.expiredToken);
    }
  }

  generateRefreshToken(user: UserEntity) {
    const payload = {
      sub: user.id,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_SECRET_KEY'), // Corrigido aqui também
      expiresIn: JWT_TIMES.REFRESH_TOKEN,
    });
  }

  verifyToken(token: string): any {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException(CONFIG_MESSAGES.expiredToken);
    }
  }
}
