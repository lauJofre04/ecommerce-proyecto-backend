import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  
  // Inyectamos el servicio que acabamos de crear
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-preference')
  async createPreference(@Body() body: { ordenId: number, items: any[] }) {
    // Angular ahora tiene que mandarte el ID de la orden junto con los items
    return this.paymentsService.createPreference(body.ordenId, body.items);
  }

  // 👇 LA RUTA QUE ESCUCHA A MERCADO PAGO
  @Post('webhook')
  @HttpCode(HttpStatus.OK) // MP exige que le respondamos rápido con un 200 OK
  async webhook(@Body() body: any) {
    return this.paymentsService.handleWebhook(body);
  }
}