import { Module } from '@nestjs/common';
import { INotificationService } from './domain/notification.service.interface';
import { NotificationService } from './notification.service';
import { EmailNotificationService } from './infrastructure/email-notification.service';
import { SmsNotificationService } from './infrastructure/sms-notification.service';

@Module({
  providers: [
    EmailNotificationService,
    SmsNotificationService,
    {
      provide: INotificationService,
      useClass: NotificationService,
    },
  ],
  exports: [INotificationService],
})
export class NotificationModule {}
