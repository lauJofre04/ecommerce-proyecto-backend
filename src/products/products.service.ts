import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';

const POR_PAGINA_DEFECTO = 12;
const MAX_POR_PAGINA = 100;

@Injectable()
export class ProductsService {
  // 1. Inyectamos tu servicio de base de datos
  constructor(private prisma: PrismaService) {}

  create(createProductDto: CreateProductDto) {
    // Forzamos a que Prisma reciba números puros
    return this.prisma.producto.create({
      data: {
        ...createProductDto,
        categoriaId: Number(createProductDto.categoriaId),
        precio: Number(createProductDto.precio),
        stockDisponible: Number(createProductDto.stockDisponible),
      },
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    const dataToUpdate: any = { ...updateProductDto };

    // Convertimos solo lo que nos mandan a actualizar
    if (dataToUpdate.categoriaId) dataToUpdate.categoriaId = Number(dataToUpdate.categoriaId);
    if (dataToUpdate.precio) dataToUpdate.precio = Number(dataToUpdate.precio);
    if (dataToUpdate.stockDisponible) dataToUpdate.stockDisponible = Number(dataToUpdate.stockDisponible);

    return this.prisma.producto.update({
      where: { id: Number(id) },
      data: dataToUpdate,
    });
  }

  // Sin parámetros devuelve el arreglo completo (compatible con el frontend actual).
  // Con `page` y/o `limit` devuelve una página: { data, total, page, limit, totalPages }.
  async findAll(page?: number, limit?: number) {
    const include = { categoria: true }; // JOIN con la tabla de Categorías
    const orderBy = { id: 'asc' as const }; // orden estable entre páginas

    if (page === undefined && limit === undefined) {
      return this.prisma.producto.findMany({ include, orderBy });
    }

    const paginaActual = Math.max(1, Math.trunc(page ?? 1) || 1);
    const tamano = Math.min(MAX_POR_PAGINA, Math.max(1, Math.trunc(limit ?? POR_PAGINA_DEFECTO) || POR_PAGINA_DEFECTO));

    const [total, data] = await Promise.all([
      this.prisma.producto.count(),
      this.prisma.producto.findMany({ include, orderBy, skip: (paginaActual - 1) * tamano, take: tamano }),
    ]);

    return { data, total, page: paginaActual, limit: tamano, totalPages: Math.max(1, Math.ceil(total / tamano)) };
  }

  findOne(id: number) {
    return this.prisma.producto.findUnique({
      where: { id },
      include: {
        categoria: true,
      }
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