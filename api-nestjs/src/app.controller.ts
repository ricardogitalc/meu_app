import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  serverIsRuning(): string {
    return '🚀 Servidor está rodando...';
  }
}
