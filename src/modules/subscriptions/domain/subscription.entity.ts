import { SubscriptionStatus } from '../../../common/enums/project.enums';

export class Subscription {
  constructor(
    public readonly userId: string,
    public readonly fundId: string,
    public readonly subscriptionId: string,
    public readonly amount: number,
    public status: SubscriptionStatus,
    public readonly subscribedAt: string,
    public cancelledAt: string | null,
  ) {}

  static create(userId: string, fundId: string, subscriptionId: string, amount: number): Subscription {
    return new Subscription(
      userId,
      fundId,
      subscriptionId,
      amount,
      SubscriptionStatus.ACTIVE,
      new Date().toISOString(),
      null,
    );
  }

  cancel() {
    this.status = SubscriptionStatus.CANCELLED;
    this.cancelledAt = new Date().toISOString();
  }
}
