import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Render envía el tráfico a través de Cloudflare: sin esto req.ip sería la IP del proxy (compartida por
  // todos los usuarios) y el límite de peticiones sería global. Con 1 salto de confianza, req.ip es la
  // IP real que Cloudflare agrega al final de X-Forwarded-For; lo que el cliente escriba antes se ignora.
  app.set('trust proxy', 1);

  // Cabeceras de seguridad (HSTS, X-Content-Type-Options, etc.). crossOriginResourcePolicy en
  // 'cross-origin' porque las imágenes de /uploads las consume el frontend desde otro dominio.
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

  // Esto activa la validación automática en todos tus endpoints usando los DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina datos extra que el usuario envíe y que no estén en el DTO
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true } // Lanza error si el usuario envía datos no permitidos
  }));
  app.enableCors({
    origin: 'https://ecommerce-frontend-proyecto.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
