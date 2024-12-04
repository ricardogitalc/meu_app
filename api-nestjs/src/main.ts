import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as session from 'express-session';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

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

  app.use(
    session({
      secret:
        '913849b8ec4c43a364215fe0a3075984f17ee3083a8722264b0804feb27a39f3',
      resave: false,
      saveUninitialized: false,
    }),
  );

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
      'x-login-token',
      'x-register-token',
      'x-refresh-token',
    ],
    exposedHeaders: ['set-cookie'],
  });

  await app.listen(process.env.PORT ?? 3003);
}
bootstrap();
