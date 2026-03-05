import { IsEnum, IsNotEmpty } from 'class-validator';
import { NotificationType } from '../../../common/enums/project.enums';

export class UpdateNotificationPreferenceDto {
  @IsEnum(NotificationType, { message: 'Tipo de notificación inválido. Debe ser EMAIL o SMS' })
  @IsNotEmpty()
  notificationPreference!: NotificationType;
}
