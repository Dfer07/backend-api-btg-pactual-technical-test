import { Injectable } from '@nestjs/common';
import { INotificationService, NotificationParams } from '../domain/notification.service.interface';
import { NotificationType } from '../../../common/enums/project.enums';

@Injectable()
export class SmsNotificationService implements INotificationService {
  async sendSubscriptionNotification(params: NotificationParams, preference: NotificationType): Promise<string | null> {
    if (preference !== NotificationType.SMS) return null;

    const message = `BTG Pactual: Te has suscrito al fondo ${params.fundName} por COP $${params.amount.toLocaleString()}.`;
    
    console.log(
      `\n--- [SMS SIMULADO] ---\n` +
      `Para: ${params.userPhone}\n` +
      `Mensaje: "${message}"\n` +
      `----------------------\n`
    );

    return message;
  }
}
