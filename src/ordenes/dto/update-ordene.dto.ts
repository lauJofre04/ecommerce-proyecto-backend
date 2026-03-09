import { IsEnum } from 'class-validator';
import { EstadoOrden } from '@prisma/client'; // Importamos el enum directo de Prisma

export class UpdateOrdenDto {
  @IsEnum(EstadoOrden, { message: 'El estado debe ser PENDIENTE, PAGADA o CANCELADA' })
  estado: EstadoOrden;
}