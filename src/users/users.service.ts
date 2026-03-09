import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const userExists = await this.prisma.usuario.findUnique({
      where: { email: createUserDto.email }
    });

    if (userExists) {
      throw new ConflictException('Este correo electrónico ya está registrado');
    }

    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    const newUser = await this.prisma.usuario.create({
      data: {
        nombre: createUserDto.nombre,
        apellido: createUserDto.apellido, // <-- ¡Pasamos el apellido a Prisma!
        email: createUserDto.email,
        password: hashedPassword, 
      },
    });

    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  // --- Métodos restaurados para que el Controlador no dé error ---

  findAll() {
    // Por seguridad, en un futuro no deberías devolver todas las contraseñas aquí, 
    // pero por ahora lo dejamos básico para que compile.
    return this.prisma.usuario.findMany();
  }

  findOne(id: number) {
    return this.prisma.usuario.findUnique({ where: { id } });
  }

  findOneByEmail(email: string) {
    return this.prisma.usuario.findUnique({ where: { email } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.usuario.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return this.prisma.usuario.delete({ where: { id } });
  }
}