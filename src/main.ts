import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Esto activa la validación automática en todos tus endpoints usando los DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina datos extra que el usuario envíe y que no estén en el DTO
    forbidNonWhitelisted: true, // Lanza error si el usuario envía datos no permitidos
  }));
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
