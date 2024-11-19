import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CONFIG_MESSAGES } from 'src/config/config';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const result = await super.canActivate(context);
      return result as boolean;
    } catch {
      throw new UnauthorizedException(CONFIG_MESSAGES.JwtTokenExpired);
    }
  }
}

// usar jwt.guard.ts para rotas que precisam verificar se o token jwt está válido
