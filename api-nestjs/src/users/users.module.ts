import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ResendService } from '../mail/resend';

@Module({
  imports: [
    forwardRef(() => AuthModule), // Usando forwardRef para resolver dependência circular
  ],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, ResendService],
  exports: [UsersService, PrismaService],
})
export class UsersModule {}
