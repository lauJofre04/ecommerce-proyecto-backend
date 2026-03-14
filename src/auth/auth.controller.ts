import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    
    return this.authService.login(loginDto);
  }
  @Post('register')
  async register(@Body() data: any) { 
    // Llamamos a la función register que modificamos antes en el service
    return this.authService.register(data);
  }
  // Endpoint para que el Frontend mande el token a validar
  @Post('verificar-email')
  async verificarEmail(@Body('token') token: string) {
    if (!token) {
      throw new BadRequestException('No se proporcionó un token de verificación');
    }
    return this.authService.verificarEmail(token);
  }
}