import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la categoría es obligatorio' })
  nombre: string;

  @IsString()
  @IsOptional() // La descripción no es obligatoria según tu base de datos
  descripcion?: string;
}
