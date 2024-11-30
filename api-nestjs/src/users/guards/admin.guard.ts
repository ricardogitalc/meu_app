import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CONFIG_MESSAGES } from 'src/config/config';

@Injectable()
export class AdminGuard extends JwtGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user?.role !== 'ADMIN') {
      throw new UnauthorizedException(CONFIG_MESSAGES.AdminOnly);
    }

    return true;
  }
}
