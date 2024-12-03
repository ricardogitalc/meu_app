import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { CONFIG_MESSAGES } from 'src/config/config';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(protected authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const result = await super.canActivate(context);
      return result as boolean;
    } catch (error) {
      throw new UnauthorizedException(CONFIG_MESSAGES.expiredToken);
    }
  }
}
