import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Redis } from 'ioredis';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Configuração do Redis global
  const redis = new Redis({
    host: configService.get('REDIS_HOST'),
    port: configService.get('REDIS_PORT'),
  });

  // Testar conexão com Redis
  redis.on('connect', () => {
    logger.log('🚀 Conexão com Redis estabelecida');
  });

  redis.on('error', (err) => {
    logger.error('Erro na conexão com Redis:', err);
  });

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addTag('API')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const fs = require('fs');
  fs.writeFileSync('./swagger.json', JSON.stringify(document, null, 2), 'utf8');

  SwaggerModule.setup('api', app, document);

  morgan.token('time', () => {
    const date = new Date();
    return date.toTimeString().split(' ')[0];
  });

  app.use(morgan('[:method :url :status :time]'));
  app.use(helmet());
  app.use(compression());

  app.useLogger(new Logger('debug'));

  app.enableCors({
    origin: configService.get('FRONTEND_URL'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'loginToken',
      'registerToken',
    ],
    exposedHeaders: ['set-cookie'],
  });

  const port = 3003;
  await app.listen(port);
  logger.log(`🚀 O servidor está rodando: http://localhost:${port}`);
}
bootstrap();
