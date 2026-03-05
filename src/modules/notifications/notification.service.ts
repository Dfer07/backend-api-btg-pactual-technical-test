import { Injectable } from '@nestjs/common';
import { INotificationService, NotificationParams } from './domain/notification.service.interface';
import { EmailNotificationService } from './infrastructure/email-notification.service';
import { SmsNotificationService } from './infrastructure/sms-notification.service';
import { NotificationType } from '../../common/enums/project.enums';

@Injectable()
export class NotificationService implements INotificationService {
  constructor(
    private readonly emailService: EmailNotificationService,
    private readonly smsService: SmsNotificationService,
  ) {}

  /**
   * Delega el envío de la notificación a la estrategia correspondiente.
   * 
   * @param params Datos de la notificación
   * @param preference Preferencia del usuario (EMAIL | SMS)
   * @returns El mensaje generado (especialmente para SMS) o null
   */
  async sendSubscriptionNotification(
    params: NotificationParams, 
    preference: NotificationType
  ): Promise<string | null> {
    console.log(`[NOTIFICATION] Procesando notificación. Preferencia detectada: ${preference} para ${params.userEmail}`);
    if (preference === NotificationType.SMS) {
      return this.smsService.sendSubscriptionNotification(params, preference);
    }
    return this.emailService.sendSubscriptionNotification(params, preference);
  }
}
