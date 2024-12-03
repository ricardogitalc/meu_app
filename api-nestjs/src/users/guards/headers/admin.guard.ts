import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtGuard } from './jwt.guard';
import { CONFIG_MESSAGES } from 'src/config/config';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AdminGuard extends JwtGuard {
  constructor(authService: AuthService) {
    super(authService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuthenticated = await super.canActivate(context);

    if (!isAuthenticated) {
      throw new UnauthorizedException(CONFIG_MESSAGES.expiredToken);
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user?.role !== 'ADMIN') {
      throw new UnauthorizedException(CONFIG_MESSAGES.adminOnly);
    }

    return true;
  }
}
