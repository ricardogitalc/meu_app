import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          console.log('=== JWT Strategy Debug ===');
          console.log('Tentando extrair token dos cookies');
          const token = request?.cookies?.['accessToken'];
          console.log('Token encontrado nos cookies:', !!token);
          if (!token) {
            console.log('Token não encontrado nos cookies, tentando header');
            return null;
          }
          return token;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    console.log('=== Payload Debug ===');
    console.log('Payload recebido:', payload);
    return payload;
  }
}
