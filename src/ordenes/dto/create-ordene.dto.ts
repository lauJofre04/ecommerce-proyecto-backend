import { IsArray, IsInt, Min, ValidateNested, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

// 1. Definimos cómo debe verse cada producto en el carrito
export class DetalleOrdenDto {
  @IsInt({ message: 'El ID del producto debe ser un número entero' })
  productoId: number;

  @IsInt()
  @Min(1, { message: 'La cantidad mínima es 1' })
  cantidad: number;
}

// 2. Definimos cómo se ve la orden completa (Un arreglo de los detalles de arriba)
export class CreateOrdenDto {
  @IsArray()
  @ArrayNotEmpty({ message: 'La orden no puede estar vacía' })
  @ValidateNested({ each: true }) // Valida cada elemento dentro del arreglo
  @Type(() => DetalleOrdenDto)    // Le dice a NestJS qué forma tiene cada elemento
  detalles: DetalleOrdenDto[];
}
