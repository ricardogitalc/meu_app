import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CONFIG_MESSAGES } from 'src/config/config';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('refresh-jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const result = await super.canActivate(context);

      if (!result) {
        throw new UnauthorizedException(CONFIG_MESSAGES.expiredToken);
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException(CONFIG_MESSAGES.expiredToken);
    }
  }
}
