import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; // Importamos el módulo
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../mail/mail.module';
import { getJwtSecret } from './jwt-secret';

@Module({
  imports: [
    UsersModule,
    MailModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        secret: getJwtSecret(), // viene de la variable de entorno JWT_SECRET
        signOptions: { expiresIn: '1d' }, // El token será válido por 1 día
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}