import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; // Importamos el módulo
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: 'MI_SECRETO_SUPER_SEGURO_123', // En producción, esto se guarda en el archivo .env
      signOptions: { expiresIn: '1d' }, // El token será válido por 1 día
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}