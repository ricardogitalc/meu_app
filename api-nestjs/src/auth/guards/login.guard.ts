import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MESSAGES } from '../../messages/messages';

@Injectable()
export class LoginGuard extends AuthGuard('magiclogin') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const result = await super.canActivate(context);
      return result as boolean;
    } catch {
      throw new UnauthorizedException(MESSAGES.MagicLoginExpired);
    }
  }
}
