import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import Strategy from 'passport-magic-login';
import { AuthService } from '../auth.service';
import { LOGIN_TOKEN_EXPIRATION_TIME } from 'src/constant/constant';

@Injectable()
export class MagicLoginStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(MagicLoginStrategy.name);

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      secret: configService.get<string>('JWT_SECRET_KEY'),
      jwtOptions: {
        expiresIn: LOGIN_TOKEN_EXPIRATION_TIME,
      },
      callbackUrl: '', // Removendo callback URL pois não vamos redirecionar
      sendMagicLink: async (destination, href) => {
        this.logger.debug(
          `Email enviado para [${destination}] com o mágic link [${href}]`,
        );
        return href;
      },
      verify: async (payload, callback) =>
        callback(null, this.validate(payload)),
    });
  }

  validate(payload: { destination: string }) {
    const user = this.authService.validateUser(payload.destination);

    return user;
  }
}
