import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  morgan.token('time', () => {
    const date = new Date();
    return date.toTimeString().split(' ')[0]; // Retorna apenas a hora
  });

  app.use(morgan('[:method :url :status :time]'));

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie'], // Adicione esta linha
  });

  await app.listen(3003);
}
bootstrap();
