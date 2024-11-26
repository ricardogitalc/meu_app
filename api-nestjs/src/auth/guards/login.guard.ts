import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CONFIG_MESSAGES } from 'src/config/config';

@Injectable()
export class LoginGuard extends AuthGuard('magiclogin') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const result = await super.canActivate(context);
      return result as boolean;
    } catch {
      throw new UnauthorizedException(CONFIG_MESSAGES.LoginTokenExpired);
    }
  }
}
