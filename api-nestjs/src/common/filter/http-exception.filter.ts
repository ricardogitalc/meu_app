import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from '@nestjs/common';
import { HttpExceptionResponse } from '../interface/http-exception.interface';

@Catch()
export class HttpExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Erro interno do servidor';

    const errorResponse: HttpExceptionResponse = {
      statusCode: status,
      path: request.url,
      error: HttpStatus[status],
      message: this.getErrorMessage(message),
    };

    // Log estruturado
    this.logger.error({
      ...errorResponse,
    });

    response.status(status).json(errorResponse);
  }

  private getErrorMessage(message: any): string | string[] {
    if (typeof message === 'string') {
      return message;
    }
    if (message?.message) {
      return Array.isArray(message.message)
        ? message.message
        : [message.message];
    }
    return ['Um erro inesperado ocorreu'];
  }
}
