import { Subscription } from './subscription.entity';

export interface ISubscriptionRepository {
  save(subscription: Subscription): Promise<void>;
  findByUserId(userId: string): Promise<Subscription[]>;
  findActiveByUserIdAndFundId(userId: string, fundId: string): Promise<Subscription | null>;
  update(subscription: Subscription): Promise<void>;
}

export const ISubscriptionRepository = Symbol('ISubscriptionRepository');
