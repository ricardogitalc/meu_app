import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { GoogleStrategy } from './strategy/google.strategy';
import { JWT_TIMES, JWT_CONFIG } from 'src/config/config';
import { ResendService } from '../mail/resend';
import { RefreshTokenStrategy } from 'src/users/strategies/refresh-token.strategy';

@Module({
  imports: [
    ConfigModule, // Adicione esta linha se ainda não existir
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: JWT_TIMES.ACCESS_TOKEN,
          ...JWT_CONFIG,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  exports: [AuthService],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    ResendService,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
