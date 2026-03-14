import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    // Configuramos el "cartero" con los datos de tu .env
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // Usamos Gmail
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // 1. Correo de Verificación de Cuenta
  async enviarCorreoVerificacion(email: string, nombre: string, token: string) {
    const urlVerificacion = `${process.env.FRONTEND_URL}/verificar-email?token=${token}`;

    const mailOptions = {
      from: `"Tech Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '¡Bienvenido a Tech Store! Verifica tu cuenta 🚀',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #2563EB; text-align: center;">¡Hola ${nombre}!</h2>
          <p style="font-size: 16px; color: #333;">Gracias por registrarte en Tech Store. Para empezar a comprar, necesitamos que verifiques tu cuenta haciendo clic en el siguiente botón:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${urlVerificacion}" style="background-color: #10B981; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 5px; font-size: 16px;">
              Verificar mi cuenta
            </a>
          </div>
          <p style="font-size: 14px; color: #666;">Si no creaste esta cuenta, podés ignorar este correo.</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Correo de verificación enviado a:', email);
    } catch (error) {
      console.error('Error al enviar el correo:', error);
    }
  }

  // 2. Correo de Recuperación de Contraseña
  async enviarCorreoRecuperacion(email: string, nombre: string, token: string) {
    const urlRecuperacion = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const mailOptions = {
      from: `"Tech Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Recuperación de Contraseña 🔒',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #E11D48; text-align: center;">Recuperar Contraseña</h2>
          <p style="font-size: 16px; color: #333;">Hola ${nombre}, hemos recibido una solicitud para cambiar tu contraseña. Hacé clic en el botón de abajo para crear una nueva:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${urlRecuperacion}" style="background-color: #2563EB; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 5px; font-size: 16px;">
              Cambiar mi Contraseña
            </a>
          </div>
          <p style="font-size: 14px; color: #666;">Este enlace expirará en 1 hora. Si no solicitaste esto, ignorá el correo y tu contraseña seguirá siendo la misma.</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Correo de recuperación enviado a:', email);
    } catch (error) {
      console.error('Error al enviar el correo de recuperación:', error);
    }
  }
}