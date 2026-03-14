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
  async verificarEmail(@Body('token') token: string) { // <-- Importante que diga 'token' aquí
    if (!token) {
      throw new BadRequestException('No se proporcionó un token');
    }
    return this.authService.verificarEmail(token);
  }
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }
  @Post('reset-password')
  async resetPassword(@Body() body: any) {
    // Extraemos el token y la nueva contraseña del body que nos mandará Angular
    const { token, nuevaPassword } = body;
    
    if (!token || !nuevaPassword) {
      throw new BadRequestException('Faltan datos para restablecer la contraseña.');
    }

    return this.authService.resetPassword(token, nuevaPassword);
  }
}