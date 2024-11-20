import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  serverIsRuning(): string {
    return '🚀 O servidor está rodando...';
  }
}
