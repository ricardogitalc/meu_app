import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtGuard } from './jwt.guard';
import { CONFIG_MESSAGES } from 'src/config/config';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class RefreshGuard extends JwtGuard {
  constructor(authService: AuthService) {
    super(authService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.headers['x-refresh-token'];

    if (!refreshToken) {
      throw new UnauthorizedException(CONFIG_MESSAGES.invalidRefreshToken);
    }

    try {
      const verified = await this.authService.refreshToken(refreshToken);
      if (!verified) {
        throw new UnauthorizedException(CONFIG_MESSAGES.invalidRefreshToken);
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException(CONFIG_MESSAGES.invalidRefreshToken);
    }
  }
}
