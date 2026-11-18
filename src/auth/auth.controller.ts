import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto, ResetPasswordDto, VerificarEmailDto } from './dto/token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    
    return this.authService.login(loginDto);
  }
  @Post('register')
  async register(@Body() data: RegisterDto) {
    // Llamamos a la función register que modificamos antes en el service
    return this.authService.register(data);
  }
  // Endpoint para que el Frontend mande el token a validar
  @Post('verificar-email')
  async verificarEmail(@Body() body: VerificarEmailDto) {
    return this.authService.verificarEmail(body.token);
  }
  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body.email);
  }
  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body.token, body.nuevaPassword);
  }
}