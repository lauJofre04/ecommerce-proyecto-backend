import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard'; // <-- Nuevo
import { Roles } from '../auth/roles.decorator';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AuthGuard,RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('file')) // <-- REVISÁ QUE DIGA 'file'
  async create(
    @UploadedFile() file: Express.Multer.File, 
    @Body() createProductDto: CreateProductDto
  ) {
    
    
    return this.productsService.create(createProductDto);
  }
  @Post(':id/imagen') // <-- ¡ESTO es lo que faltaba!
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        cb(null, `${req.params.id}-${uniqueSuffix}${ext}`);
      }
    })
  }))


  subirImagen(
    @Param('id') id: string, 
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('Asegúrate de enviar un archivo de imagen.');
    }
    return this.productsService.actualizarImagen(+id, file.filename);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard,RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        cb(null, `prod-${uniqueSuffix}${ext}`);
      }
    })
  }))
  update(
    @Param('id') id: string, 
    @UploadedFile() file: Express.Multer.File, 
    @Body() updateProductDto: any 
  ) {
    if (file) {
      updateProductDto.imageName = file.filename;
    }

    // --- MAGIA: Convertimos los strings del FormData a Números ---
    if (updateProductDto.precio) {
      updateProductDto.precio = Number(updateProductDto.precio);
    }
    if (updateProductDto.stockDisponible) {
      updateProductDto.stockDisponible = Number(updateProductDto.stockDisponible);
    }
    if (updateProductDto.categoriaId) {
      updateProductDto.categoriaId = Number(updateProductDto.categoriaId);
    }

    return this.productsService.update(+id, updateProductDto);
  }
  @Delete(':id')
  @UseGuards(AuthGuard,RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
