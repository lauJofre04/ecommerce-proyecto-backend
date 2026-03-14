import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt'; 
import { randomBytes } from 'crypto';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 1. Buscamos al usuario en la base de datos
    const usuario = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 2. Comparamos la contraseña con bcrypt
    const isPasswordValid = await bcrypt.compare(password, usuario.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 👇 3. ¡EL NUEVO CANDADO! Chequeamos si verificó el mail
    if (!usuario.isVerified) {
      throw new UnauthorizedException('Por favor, verificá tu correo electrónico antes de iniciar sesión. Revisá tu bandeja de entrada o spam.');
    }

    // 4. Si pasó todas las pruebas, le generamos el token JWT
    const payload = { sub: usuario.id, email: usuario.email, rol: usuario.rol };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  async register(data: any) { // (Usá tu DTO acá si lo tenías)
    
    // 1. Verificamos que el email no exista
    const usuarioExistente = await this.prisma.usuario.findUnique({
      where: { email: data.email },
    });

    if (usuarioExistente) {
      throw new BadRequestException('El email ya está registrado');
    }

    // 2. Hasheamos la contraseña y generamos el token secreto de 64 caracteres
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const verificationToken = randomBytes(32).toString('hex'); 

    // 3. Creamos el usuario en la BD como "No verificado"
    const nuevoUsuario = await this.prisma.usuario.create({
      data: {
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        password: hashedPassword,
        rol: 'CLIENTE',
        // Guardamos el token y lo marcamos como falso
        isVerified: false,
        verificationToken: verificationToken, 
      },
    });

    // 4. Disparamos el correo (No usamos 'await' acá para que el sistema responda rápido al frontend mientras el mail viaja de fondo)
    this.mailService.enviarCorreoVerificacion(
      nuevoUsuario.email, 
      nuevoUsuario.nombre, 
      verificationToken
    );

    // 5. Retornamos un mensaje de éxito sin devolver el JWT todavía (porque no puede entrar hasta verificar)
    return { 
      message: 'Registro exitoso. Por favor, revisá tu bandeja de entrada o spam para verificar tu cuenta.' 
    };
  }
  async verificarEmail(token: string) {
    // Buscamos a quién le pertenece este código
    const usuario = await this.prisma.usuario.findFirst({
      where: { verificationToken: token },
    });

    if (!usuario) {
      throw new BadRequestException('El enlace es inválido o ya expiró.');
    }

    // Si lo encontramos, lo actualizamos a verificado y borramos el token para que no se re-use
    await this.prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        isVerified: true,
        verificationToken: null,
      },
    });

    return { message: '¡Cuenta verificada con éxito! Ya podés iniciar sesión.' };
  }
  async forgotPassword(email: string) {
    const usuario = await this.prisma.usuario.findUnique({ where: { email } });

    // Si el usuario no existe, le decimos que todo ok de todas formas.
    // Esto es por seguridad, para que un hacker no pueda adivinar qué mails están registrados.
    if (!usuario) {
      return { message: 'Si el correo existe en nuestro sistema, te enviaremos un enlace de recuperación.' };
    }

    // Generamos un token aleatorio y seguro
    const resetToken = randomBytes(32).toString('hex');
    
    // Le damos 1 hora de vida (Date.now() + 1 hora en milisegundos)
    const resetPasswordExpires = new Date(Date.now() + 3600000);

    // Guardamos el token en la base de datos
    await this.prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetPasswordExpires,
      },
    });

    // Mandamos el mail
    await this.mailService.enviarCorreoRecuperacion(usuario.email, usuario.nombre, resetToken);

    return { message: 'Si el correo existe en nuestro sistema, te enviaremos un enlace de recuperación.' };
  }
  async resetPassword(token: string, nuevaPassword: string) {
    // 1. Buscamos un usuario que tenga este token EXACTO y que la fecha de expiración sea MAYOR a la fecha actual (gt = greater than)
    const usuario = await this.prisma.usuario.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gt: new Date() }, 
      },
    });

    if (!usuario) {
      throw new BadRequestException('El enlace es inválido o ya expiró.');
    }

    // 2. Encriptamos la nueva contraseña (igual que en el registro)
    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);

    // 3. Actualizamos la base de datos: guardamos la nueva clave y "limpiamos" el token para que no se pueda volver a usar
    await this.prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    return { message: 'Contraseña actualizada con éxito.' };
  }
}
