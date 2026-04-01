import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class MigrationService {
  private readonly logger = new Logger(MigrationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async migrateImagesToCloudinary() {
    this.logger.log('Iniciando migración de imágenes a Cloudinary...');

    try {
      // 1. Obtenemos todos los productos que tienen imagenUrl
      const productos = await this.prisma.producto.findMany({
        where: {
          imagenUrl: {
            not: null,
          },
        },
      });

      this.logger.log(`Encontrados ${productos.length} productos con imágenes`);

      if (productos.length === 0) {
        return {
          success: true,
          message: 'No hay imágenes para migrar',
          migratedCount: 0,
        };
      }

      let migratedCount = 0;
      const errors: any[] = [];

      // 2. Iteramos sobre cada producto
      for (const producto of productos) {
        try {
          // Verificamos si la imagenUrl ya es un link de Cloudinary
          if (producto.imagenUrl.startsWith('http')) {
            this.logger.log(
              `Producto ${producto.id} - Ya tiene URL de Cloudinary: ${producto.imagenUrl}`,
            );
            continue;
          }

          // 3. Construimos la ruta del archivo local
          const filePath = join(
            process.cwd(),
            'uploads',
            producto.imagenUrl,
          );

          // 4. Verificamos que el archivo existe
          if (!existsSync(filePath)) {
            this.logger.warn(
              `Archivo no encontrado para producto ${producto.id}: ${filePath}`,
            );
            errors.push({
              productoId: producto.id,
              error: 'Archivo no encontrado',
              fileName: producto.imagenUrl,
            });
            continue;
          }

          // 5. Leemos el archivo
          const fileBuffer = readFileSync(filePath);

          // 6. Subimos a Cloudinary
          this.logger.log(
            `Subiendo imagen del producto ${producto.id} (${producto.imagenUrl}) a Cloudinary...`,
          );
          const cloudinaryResult: any = await this.cloudinaryService.uploadImage(
            fileBuffer,
            producto.imagenUrl,
          );

          // 7. Actualizamos la BD con la URL de Cloudinary
          await this.prisma.producto.update({
            where: { id: producto.id },
            data: { imagenUrl: cloudinaryResult.secure_url },
          });

          migratedCount++;
          this.logger.log(
            `✓ Producto ${producto.id} migrado exitosamente`,
          );
        } catch (error) {
          this.logger.error(
            `Error migrando producto ${producto.id}: ${error.message}`,
          );
          errors.push({
            productoId: producto.id,
            error: error.message,
            fileName: producto.imagenUrl,
          });
        }
      }

      const result = {
        success: true,
        message: `Migración completada. ${migratedCount} de ${productos.length} imágenes migradas exitosamente`,
        migratedCount,
        totalCount: productos.length,
        errors,
      };

      this.logger.log(result.message);
      return result;
    } catch (error) {
      this.logger.error(`Error crítico en migración: ${error.message}`);
      return {
        success: false,
        message: `Error en la migración: ${error.message}`,
        migratedCount: 0,
      };
    }
  }
}
