import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ServerSwaggerDocs } from './swagger/swagger.config';

@Controller()
export class AppController {
  @Get()
  @ApiOperation({
    summary: ServerSwaggerDocs.serverStatus.operation.summary,
    operationId: ServerSwaggerDocs.serverStatus.operationId,
  })
  @ApiResponse(ServerSwaggerDocs.serverStatus.response)
  serverIsRuning(): string {
    return '🚀 O servidor está rodando...';
  }
}
