import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import Strategy from 'passport-magic-login';
import { AuthService } from '../auth.service';
import { TOKEN_MAGIC_LINK_EXPIRATION_TIME } from '../constant/constant';

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
        expiresIn: TOKEN_MAGIC_LINK_EXPIRATION_TIME,
      },
      callbackUrl: `${configService.get<string>(
        'BACKEND_URL',
      )}/auth/login/callback`,
      sendMagicLink: async (destination, href) => {
        // TODO: send email
        this.logger.debug(
          `Email enviado para [${destination}] com o mágic link [${href}]`,
        );
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
