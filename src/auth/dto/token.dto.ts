import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

// Siempre texto: evita que lleguen objetos (por ejemplo { "not": "" }) a las consultas de Prisma
export class VerificarEmailDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  token: string;
}

export class ForgotPasswordDto {
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  token: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(72, { message: 'La contraseña no puede superar los 72 caracteres' })
  nuevaPassword: string;
}
