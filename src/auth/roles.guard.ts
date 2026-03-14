import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Miramos si la ruta tiene el decorador @Roles (ej: @Roles('ADMIN'))
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // Si no tiene el decorador, es una ruta pública para cualquier logueado
    if (!requiredRoles) {
      return true;
    }
    
    // 2. Obtenemos al usuario que el AuthGuard pegó en la request
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    // --- MICRÓFONOS OCULTOS PARA DEBUGGEAR ---
    
    
    // --
    // 3. Comparamos el rol del token con los roles requeridos
    if (!user || !requiredRoles.includes(user.rol)) {
      throw new ForbiddenException('Acceso denegado. Se requieren permisos de administrador.');
    }
    
    return true; // ¡Es administrador, déjalo pasar!
  }
}