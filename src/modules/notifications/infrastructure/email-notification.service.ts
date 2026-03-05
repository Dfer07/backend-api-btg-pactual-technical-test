import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { INotificationService, NotificationParams } from '../domain/notification.service.interface';
import { NotificationType } from '../../../common/enums/project.enums';
import { getSubscriptionEmailTemplate } from './templates/subscription-email.template';

@Injectable()
export class EmailNotificationService implements INotificationService {
  private readonly logger = new Logger(EmailNotificationService.name);
  private readonly transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('mail.host'),
      port: this.configService.get<number>('mail.port'),
      secure: true, // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('mail.user'),
        pass: this.configService.get<string>('mail.pass'),
      },
    });
  }

  async sendSubscriptionNotification(params: NotificationParams, preference: NotificationType): Promise<string | null> {
    if (preference !== NotificationType.EMAIL) return null;

    const fromEmail = this.configService.get<string>('mail.user');
    const frontendUrl = this.configService.get<string>('app.frontendUrl');
    
    const html = getSubscriptionEmailTemplate({
      userName: params.userName,
      fundName: params.fundName,
      amount: params.amount,
      transactionId: params.transactionId || '---',
      date: params.date || new Date().toLocaleString(),
      dashboardUrl: `${frontendUrl}/dashboard`
    });
    
    console.log(`[MAIL] Intentando enviar email desde ${fromEmail} hacia ${params.userEmail}`);

    try {
      await this.transporter.sendMail({
        from: `"BTG Pactual" <${fromEmail}>`,
        to: params.userEmail,
        subject: 'Confirmación de Suscripción | BTG Pactual',
        html: html,
      });
      console.log(`[MAIL] Email enviado exitosamente a ${params.userEmail}`);
    } catch (error: any) {
      console.error(`[MAIL ERROR] No se pudo enviar el email: ${error.message}`);
      this.logger.error(`Error enviando email de suscripción: ${error.message}`);
    }

    return null;
  }
}
