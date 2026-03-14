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
        id: user.id,      // <-- ¡ESTE ES EL PASE QUE FALTABA! ⚽
        nombre: user.nombre,
        apellido: user.apellido, // Aprovechá y mandá el apellido también
        email: user.email,
        direccion: user.direccion, // Mandamos los campos nuevos
        ciudad: user.ciudad,
        provincia: user.provincia,
        codigoPostal: user.codigoPostal
      }
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
}
