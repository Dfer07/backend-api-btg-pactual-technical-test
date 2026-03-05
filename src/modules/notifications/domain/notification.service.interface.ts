import { NotificationType } from '../../../common/enums/project.enums';

export interface NotificationParams {
  userEmail: string;
  userPhone: string;
  userName: string;
  fundName: string;
  amount: number;
  transactionId?: string;
  date?: string;
}

export interface INotificationService {
  sendSubscriptionNotification(params: NotificationParams, preference: NotificationType): Promise<string | null>;
}

export const INotificationService = Symbol('INotificationService');
