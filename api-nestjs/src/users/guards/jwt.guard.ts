import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CONFIG_MESSAGES } from 'src/config/config';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      console.log('=== JWT Guard Debug ===');
      console.log('Request cookies:', request.cookies);

      const token = request.cookies?.['accessToken'];
      console.log('Cookie Token:', token);

      if (token) {
        request.headers.authorization = `Bearer ${token}`;
        console.log('Headers após setagem:', request.headers.authorization);
      } else {
        console.log('Nenhum token encontrado nos cookies');
      }

      const result = await super.canActivate(context);
      return result as boolean;
    } catch (error) {
      console.error('=== Erro no JWT Guard ===');
      console.error('Tipo do erro:', error.constructor.name);
      console.error('Mensagem:', error.message);
      console.error('Stack:', error.stack);
      throw new UnauthorizedException(CONFIG_MESSAGES.expiredToken);
    }
  }
}
