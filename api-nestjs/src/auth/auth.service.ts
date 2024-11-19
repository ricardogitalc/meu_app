import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/users.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MESSAGES } from 'src/messages/messages';
import { LOGIN_TOKEN_EXPIRATION_TIME } from 'src/constant/constant';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  validateUser(email: string) {
    const user = this.usersService.user({ email });

    if (!user) {
      throw new UnauthorizedException(MESSAGES.UserNotFound);
    }

    return user;
  }

  generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      whatsappNumber: user.whatsappNumber,
    };
    return { jwt_token: this.jwtService.sign(payload) };
  }

  generateMagicLinkToken(destination: string) {
    const payload = { destination };
    const login_token = this.jwtService.sign(payload, {
      expiresIn: LOGIN_TOKEN_EXPIRATION_TIME,
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
      throw new UnauthorizedException(MESSAGES.TokenAccessExpired);
    }
  }
}
