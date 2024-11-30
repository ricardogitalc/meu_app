import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  morgan.token('time', () => {
    const date = new Date();
    return date.toTimeString().split(' ')[0];
  });

  app.use(morgan('[:method :url :status :time]'));
  app.use(helmet());
  app.use(compression());

  app.enableCors({
    origin: configService.get('FRONTEND_URL'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie'],
  });

  const port = 3003;
  await app.listen(port);
  logger.log(`🚀 O servidor está rodando: http://localhost:${port}`);
}
bootstrap();
