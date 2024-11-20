import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { GoogleStrategy } from './strategy/google.strategy';
import { MagicLoginStrategy } from './strategy/magic-login.strategy';
import { CONFIG_TIMES } from 'src/config/config';

@Module({
  imports: [
    forwardRef(() => UsersModule), // Usando forwardRef aqui também
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: CONFIG_TIMES.JWT_TOKEN,
          algorithm: 'HS256',
          encoding: 'UTF8',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  exports: [AuthService],
  providers: [AuthService, MagicLoginStrategy, JwtStrategy, GoogleStrategy],
})
export class AuthModule {}
