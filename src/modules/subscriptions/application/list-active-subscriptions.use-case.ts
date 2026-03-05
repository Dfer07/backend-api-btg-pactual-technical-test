import { Injectable, Inject } from '@nestjs/common';
import { ISubscriptionRepository } from '../domain/subscription.repository.interface';
import { SubscriptionStatus } from '../../../common/enums/project.enums';

@Injectable()
export class ListActiveSubscriptionsUseCase {
  constructor(
    @Inject(ISubscriptionRepository) private subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(userId: string) {
    const allSubs = await this.subscriptionRepository.findByUserId(userId);
    return allSubs.filter(sub => sub.status === SubscriptionStatus.ACTIVE);
  }
}
