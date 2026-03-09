import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  // Inyectamos la base de datos igual que hicimos en Productos
  constructor(private prisma: PrismaService) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.categoria.create({
      data: createCategoryDto,
    });
  }

  findAll() {
    return this.prisma.categoria.findMany({
      // Un detalle Pro: Al pedir las categorías, también traemos la lista de productos que pertenecen a cada una
      include: {
        productos: true, 
      }
    });
  }

  findOne(id: number) {
    return this.prisma.categoria.findUnique({
      where: { id },
      include: {
        productos: true,
      }
    });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.categoria.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  remove(id: number) {
    return this.prisma.categoria.delete({
      where: { id },
    });
  }
}