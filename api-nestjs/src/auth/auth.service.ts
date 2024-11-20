import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { CONFIG_MESSAGES, CONFIG_TIMES } from 'src/config/config';
import { CreateUserDto } from 'src/users/dto/users.dto';
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
      expiresIn: CONFIG_TIMES.LOGIN_TOKEN,
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
      expiresIn: CONFIG_TIMES.LOGIN_TOKEN,
    });
  }
}
