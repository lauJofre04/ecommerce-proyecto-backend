import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    // 1. Buscamos al usuario por su email
    const user = await this.usersService.findOneByEmail(loginDto.email);
    
    // Si no existe, lanzamos un error 401. 
    // Nota: El mensaje es genérico por seguridad, para no darle pistas a los atacantes.
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 2. Comparamos la contraseña en texto plano (del DTO) con el hash guardado en MySQL
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 3. ¡Login exitoso! Armamos el "payload" (la info que viajará dentro de la pulsera VIP)
    // Usualmente solo viaja el ID del usuario y su email. NUNCA contraseñas.
    const payload = { email: user.email, sub: user.id, rol:  user.rol};

    // 4. Firmamos el token y lo devolvemos junto con algunos datos básicos del usuario
    return {
      access_token: await this.jwtService.signAsync(payload),
      usuario: {
        nombre: user.nombre,
        email: user.email
      }
    };
  }
}