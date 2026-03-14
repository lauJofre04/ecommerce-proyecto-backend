import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { PrismaService } from '../prisma/prisma.service'; // Asegurate de que la ruta sea correcta

@Injectable()
export class PaymentsService {
  private client: MercadoPagoConfig;

  constructor(private prisma: PrismaService) {
    // Inicializamos Mercado Pago una sola vez acá
    this.client = new MercadoPagoConfig({ 
      accessToken: process.env.MPACCESS_TOKEN! 
    });
  }

  async createPreference(ordenId: number, items: any[]) {
    const preference = new Preference(this.client);

      const result = await preference.create({
      body: {
        // Mapeamos los ítems
        items: items.map(item => ({
          id: item.id?.toString() || item.productoId?.toString() || '1',
          title: item.nombre || 'Producto sin nombre',
          unit_price: Number(item.precio),
          // 👇 ACÁ ESTÁ LA CLAVE: Si item.cantidad no existe, le clavamos un 1
          quantity: Number(item.cantidad) || 1, 
          currency_id: 'ARS'
        })),
        back_urls: {
          success: "http://localhost:4200/perfil",
          failure: "http://localhost:4200/carrito",
          pending: "http://localhost:4200/perfil"
        },
        // 👇 EL DNI DE LA ORDEN: MP nos va a devolver este ID
        external_reference: ordenId.toString(), 
        
        // 👇 ACÁ AVISARÁ MP (Reemplazá con tu ngrok actual cuando lo levantes)
        notification_url: "https://bausond-hermelinda-hyperphysical.ngrok-free.dev/payments/webhook"
      }
    });

    return { init_point: result.init_point };
  }

  // 👇 EL WEBHOOK QUE RECIBE EL AVISO DE MP
  // DENTRO DE handleWebhook(body: any)
    // 👇 EL WEBHOOK FINAL (Versión Producción/Real)
  async handleWebhook(body: any) {
    console.log('🔔 ¡Recibí un aviso de Mercado Pago!', body);

    // Mercado Pago manda avisos por muchas cosas, solo nos importan los pagos
    if (body.type === 'payment') {
      try {
        const payment = new Payment(this.client);
        // 1. Le preguntamos a MP si este pago es de verdad y está aprobado
        const paymentData = await payment.get({ id: body.data.id });

        if (paymentData.status === 'approved') {
          // 2. Recuperamos el ID de tu orden (el DNI que le mandamos antes)
          const ordenId = Number(paymentData.external_reference);

          // 3. Actualizamos la orden a PAGADA
          const orden = await this.prisma.orden.update({
            where: { id: ordenId },
            data: { estado: 'PAGADA' },
            include: { detalles: true } // Traemos los detalles para el stock
          });

          // 4. Restamos el stock de cada producto
          for (const detalle of orden.detalles) {
            await this.prisma.producto.update({
              where: { id: detalle.productoId },
              data: { stockDisponible: { decrement: detalle.cantidad } }
            });
          }
          
          console.log(`✅ ¡ÉXITO! Orden ${ordenId} pagada y stock descontado.`);
        }
      } catch (error) {
        console.error('❌ Error validando el pago con MP:', error);
      }
    }
    
    // 5. Siempre hay que responder 200 OK rápido para que MP no se enoje
    return { success: true };
  }
}