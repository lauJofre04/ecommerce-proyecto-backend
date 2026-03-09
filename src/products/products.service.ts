import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  // 1. Inyectamos tu servicio de base de datos
  constructor(private prisma: PrismaService) {}

  create(createProductDto: CreateProductDto) {
    return this.prisma.producto.create({
      // Usamos "as any" temporalmente hasta que configuremos bien el DTO
      data: createProductDto, 
    });
  }

  findAll() {
    return this.prisma.producto.findMany({
      include: {
        categoria: true, // ¡Magia! Hace un JOIN automático con la tabla de Categorías
      }
    });
  }

  findOne(id: number) {
    return this.prisma.producto.findUnique({
      where: { id },
      include: {
        categoria: true,
      }
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.prisma.producto.update({
      where: { id },
      data: updateProductDto,
    });
  }

  remove(id: number) {
    return this.prisma.producto.delete({
      where: { id },
    });
  }
  async actualizarImagen(id: number, nombreArchivo: string) {
    // Verificamos que el producto exista
    const producto = await this.prisma.producto.findUnique({ where: { id } });
    if (!producto) {
      throw new NotFoundException(`El producto con ID ${id} no existe.`);
    }

    // Actualizamos el campo imagenUrl
    return this.prisma.producto.update({
      where: { id },
      data: { imagenUrl: nombreArchivo },
    });
  }
}