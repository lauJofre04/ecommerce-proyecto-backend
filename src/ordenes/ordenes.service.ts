import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateOrdenDto } from './dto/create-ordene.dto';
import { PrismaService } from '../prisma/prisma.service'; // Asegúrate de que la ruta coincida con tu proyecto
import { UpdateOrdenDto } from './dto/update-ordene.dto';

@Injectable()
export class OrdenesService {
  constructor(private prisma: PrismaService) {}

  async create(usuarioId: number, createOrdenDto: CreateOrdenDto) {
    return this.prisma.$transaction(async (tx) => {
      let totalCalculado = 0;
      
      // 1. DECLARAMOS EL ARREGLO AQUÍ AFUERA
      const detallesParaGuardar: {
        productoId: number;
        cantidad: number;
        precioUnitario: number;
      }[] = [];

      // 2. EMPIEZA EL BUCLE (¡Una sola vez!)
      for (const item of createOrdenDto.detalles) {
        
        const producto = await tx.producto.findUnique({
          where: { id: item.productoId },
        });

        if (!producto) {
          throw new NotFoundException(`El producto con ID ${item.productoId} no existe.`);
        }

        if (producto.stockDisponible < item.cantidad) {
          throw new BadRequestException(
            `No hay stock suficiente para el producto: ${producto.nombre}. Stock actual: ${producto.stockDisponible}`,
          );
        }

        // Calculamos y sumamos
        const precioCongelado = Number(producto.precio); 
        totalCalculado += precioCongelado * item.cantidad;

        // Metemos el renglón al arreglo
        detallesParaGuardar.push({
          productoId: producto.id,
          cantidad: item.cantidad,
          precioUnitario: precioCongelado, 
        });

        // Descontamos stock
        await tx.producto.update({
          where: { id: producto.id },
          data: {
            stockDisponible: {
              decrement: item.cantidad,
            },
          },
        });
      }

      // 3. CREAMOS LA ORDEN
      const nuevaOrden = await tx.orden.create({
        data: {
          usuarioId: usuarioId,
          total: totalCalculado,
          detalles: {
            create: detallesParaGuardar, 
          },
        },
        include: {
          detalles: true, 
        },
      });

      return nuevaOrden;
    });
  }
  
  async findAll() {
    return this.prisma.orden.findMany({
      include: {
        usuario: { select: { nombre: true, email: true, apellido: true } }, // Clave para que el admin sepa de quién es
        detalles: {
          include: { producto: true },
        },
      },
      orderBy: {
        fechaOrden: 'desc',
      },
    });
  }
  // (Puedes dejar los demás métodos findAll, findOne vacíos por ahora)
  async findAllByUser(usuarioId: number) {
    return this.prisma.orden.findMany({
      where: {
        usuarioId: usuarioId, // Filtramos solo por el dueño del token
      },
      include: {
        detalles: {
          include: {
            producto: true, // ¡Traemos toda la info del producto comprado!
          },
        },
      },
      orderBy: {
        fechaOrden: 'desc', // Ordenamos para ver las compras más recientes primero
      },
    });
  }
  async updateEstado(id: number, updateOrdenDto: UpdateOrdenDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Buscamos la orden original
      const orden = await tx.orden.findUnique({
        where: { id },
        include: { detalles: true }, // Necesitamos saber qué compró para devolverlo
      });

      if (!orden) {
        throw new NotFoundException(`La orden con ID ${id} no existe.`);
      }

      // 2. Si el admin la cancela (y no estaba cancelada ya), DEVOLVEMOS EL STOCK
      if (updateOrdenDto.estado === 'CANCELADA' && orden.estado !== 'CANCELADA') {
        for (const item of orden.detalles) {
          await tx.producto.update({
            where: { id: item.productoId },
            data: {
              stockDisponible: { increment: item.cantidad }, // Prisma suma automáticamente
            },
          });
        }
      }

      // 3. (Extra PRO) Si la orden estaba cancelada y el admin se equivocó y la vuelve a activar
      if (orden.estado === 'CANCELADA' && updateOrdenDto.estado !== 'CANCELADA') {
        for (const item of orden.detalles) {
          await tx.producto.update({
            where: { id: item.productoId },
            data: {
              stockDisponible: { decrement: item.cantidad }, // Volvemos a restar
            },
          });
        }
      }

      // 4. Guardamos el nuevo estado en la orden
      return tx.orden.update({
        where: { id },
        data: { estado: updateOrdenDto.estado },
      });
    });
  }
}