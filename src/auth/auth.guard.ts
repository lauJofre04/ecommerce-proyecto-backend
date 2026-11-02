import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Interceptamos la petición HTTP que está llegando
    const request = context.switchToHttp().getRequest();
    
    // 2. Buscamos el token en los encabezados (Headers)
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('No tienes permiso para entrar aquí. Falta el token.');
    }
    
    try {
      // 3. Verificamos que el token sea auténtico y no haya sido alterado
      // El secret es el configurado en AuthModule (JWT_SECRET)
      const payload = await this.jwtService.verifyAsync(token);
      
      // 4. Si todo está bien, pegamos los datos del usuario (el payload) en la request
      // para que el Controlador sepa quién está haciendo la petición
      request['user'] = payload;
      
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
    
    return true; // ¡Adelante, la puerta está abierta!
  }

  // Función auxiliar para extraer el token del formato "Bearer eyJhb..."
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}