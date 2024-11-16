import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  morgan.token('time', () => {
    const date = new Date();
    return date.toTimeString().split(' ')[0]; // Retorna apenas a hora
  });

  app.use(morgan('[:method :url :status :time]'));

  app.enableCors();

  await app.listen(3003);
}
bootstrap();
