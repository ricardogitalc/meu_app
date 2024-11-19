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
    // Primeiro verifica se o token JWT é válido usando o JwtGuard
    await super.canActivate(context);

    // Pega o usuário do request após a validação do JWT
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Verifica se o usuário tem role ADMIN
    if (user?.role !== 'ADMIN') {
      throw new UnauthorizedException(CONFIG_MESSAGES.AdminOnly);
    }

    return true;
  }
}
