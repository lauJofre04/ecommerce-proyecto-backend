import { Controller, Post, Body } from '@nestjs/common';
import { MercadoPagoConfig, Preference } from 'mercadopago';

// 1. Configuramos el cliente con tu Access Token (el de la foto)
const client = new MercadoPagoConfig({ 
  accessToken: 'APP_USR-5147918904495304-031318-180b715f8e4a7c4ca899972dbf95e7d6-3264812537' // Pegá acá el token de la imagen
});

@Controller('payments')
export class PaymentsController {

  @Post('create-preference')
  async createPreference(@Body() items: any[]) {
    try {
      const preference = new Preference(client);

      // 2. Mapeamos los productos del carrito al formato de Mercado Pago
      // En payments.controller.ts

    const result = await preference.create({
        body: {
          items: items.map(item => ({
            id: item.id?.toString() || '1',
            title: item.nombre,
            unit_price: Number(item.precio),
            quantity: 1,
            currency_id: 'ARS'
          })),
          back_urls: {
            success: "http://localhost:4200/perfil",
            failure: "http://localhost:4200/carrito",
            pending: "http://localhost:4200/perfil"
          },
          /*auto_return: "approved"*/
        }
      });

      // 4. Devolvemos el link de pago (init_point)
      return { init_point: result.init_point };
      
    } catch (error) {
      console.error('Error creando preferencia:', error);
      throw error;
    }
  }
}