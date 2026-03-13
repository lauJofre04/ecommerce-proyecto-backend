import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Patch, Param } from '@nestjs/common';
import { UpdateOrdenDto } from './dto/update-ordene.dto';
import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { OrdenesService } from './ordenes.service';
import { CreateOrdenDto } from './dto/create-ordene.dto';
import { AuthGuard } from '../auth/auth.guard'; // Importamos nuestro guardia

@Controller('ordenes')
export class OrdenesController {
  constructor(private readonly ordenesService: OrdenesService) {}

  @Post()
  @UseGuards(AuthGuard) // ¡Candado puesto! Solo usuarios logueados pueden comprar
  create(@Req() request, @Body() createOrdenDto: CreateOrdenDto) {
    // El AuthGuard se encargó de poner los datos del token aquí adentro.
    // Recuerda que en el AuthService guardamos el ID del usuario bajo la propiedad "sub"
    const usuarioId = request.user.sub; 

    // Le pasamos el ID seguro y el carrito de compras al servicio
    return this.ordenesService.create(usuarioId, createOrdenDto);
  }

  @Get()
  @UseGuards(AuthGuard) // Exigimos que el usuario esté logueado
  findAll(@Req() request) {
    // Extraemos la identidad del comprador desde su Token JWT
    const usuarioId = request.user.sub; 
    
    // Le pedimos al servicio que busque solo las órdenes de este usuario
    return this.ordenesService.findAllByUser(usuarioId);
  }
  @Patch(':id/estado')
  @UseGuards(AuthGuard, RolesGuard) // ¡Solo logueados y que pasen el filtro de rol!
  @Roles('ADMIN')                   // ¡Exigimos que sea ADMIN!
  updateEstado(@Param('id') id: string, @Body() updateOrdenDto: UpdateOrdenDto) {
    return this.ordenesService.updateEstado(+id, updateOrdenDto);
  }
  // GET: Traer todas las órdenes (idealmente protegido con un AdminGuard)
  @Get('todas')
  findAllTodas() {
    return this.ordenesService.findAll();
  }

  
}
