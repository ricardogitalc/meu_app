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
  constructor(private authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.cookies?.['accessToken'];
      const refreshToken = request.cookies?.['refreshToken'];

      if (token) {
        request.headers.authorization = `Bearer ${token}`;
      }

      try {
        const result = await super.canActivate(context);
        return result as boolean;
      } catch (error) {
        if (refreshToken) {
          const newTokens = await this.authService.refreshToken(refreshToken);
          if (newTokens) {
            const response = context.switchToHttp().getResponse();
            response.cookie('accessToken', newTokens.accessToken, {
              httpOnly: true,
            });
            request.headers.authorization = `Bearer ${newTokens.accessToken}`;
            return super.canActivate(context) as Promise<boolean>;
          }
        }
        throw error;
      }
    } catch (error) {
      throw new UnauthorizedException(CONFIG_MESSAGES.expiredToken);
    }
  }
}
