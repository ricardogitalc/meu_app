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
    const refreshToken = request.cookies?.['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException(CONFIG_MESSAGES.invalidRefreshToken);
    }

    try {
      const newTokens = await this.authService.refreshToken(refreshToken);
      if (!newTokens) {
        throw new UnauthorizedException(CONFIG_MESSAGES.invalidToken);
      }

      // Define o novo accessToken no header para o JwtGuard poder validar
      request.headers.authorization = `Bearer ${newTokens.accessToken}`;

      return super.canActivate(context);
    } catch (error) {
      throw new UnauthorizedException(CONFIG_MESSAGES.invalidToken);
    }
  }
}
