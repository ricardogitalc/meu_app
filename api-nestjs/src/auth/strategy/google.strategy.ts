import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { CONFIG_MESSAGES } from 'src/config/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_SECRET_KEY'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    try {
      const { emails, name, photos } = profile;
      const email = emails[0].value;

      let user = await this.usersService.UserFindUnique({ email: email });

      if (!user) {
        user = await this.usersService.createUser({
          email,
          firstName: name.givenName,
          lastName: name.familyName,
          imageUrl: photos[0]?.value,
          verified: true,
        });
      }

      return done(null, user);
    } catch (error) {
      return done(
        new UnauthorizedException(CONFIG_MESSAGES.GoogleLoginError),
        false,
      );
    }
  }
}
