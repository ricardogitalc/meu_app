import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      secret: configService.get<string>('JWT_SECRET_KEY'),
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
    const { emails, name, photos } = profile;
    const email = emails[0].value;

    try {
      // Tenta validar usuário existente
      const user = await this.authService.validateUser(email);
      done(null, user);
    } catch (error) {
      // Se usuário não existir, cria novo
      const newUser = await this.authService.createGoogleUser({
        email: email,
        firstName: name.givenName,
        lastName: name.familyName,
        imageUrl: photos[0]?.value,
        verified: true, // Google já verificou o email
      });
      done(null, newUser);
    }
  }
}
