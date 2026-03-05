import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../domain/user.repository.interface';
import { NotificationType } from '../../../common/enums/project.enums';

@Injectable()
export class UpdateNotificationPreferenceUseCase {
  constructor(
    @Inject(IUserRepository)
    private userRepository: IUserRepository,
  ) {}

  async execute(userId: string, preference: NotificationType) {
    await this.userRepository.updateNotificationPreference(userId, preference);
    return { success: true, preference };
  }
}
