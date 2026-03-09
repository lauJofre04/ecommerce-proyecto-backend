import { IsString, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del producto es obligatorio' })
  nombre: string;

  @IsString()
  @IsOptional() // Esto significa que no es obligatorio enviar una descripción
  descripcion?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'El precio no puede ser negativo' })
  precio: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stockDisponible?: number;

  @IsNumber()
  @IsNotEmpty()
  categoriaId: number; // Necesitamos saber a qué categoría pertenece
}