import { UserRole, NotificationType } from '../../../common/enums/project.enums';

export class User {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly fullName: string,
    public readonly phone: string,
    public readonly passwordHash: string,
    public readonly role: UserRole,
    public notificationPreference: NotificationType,
    public balance: number,
    public readonly createdAt: string,
    public updatedAt: string,
  ) {}

  static create(
    id: string, 
    email: string, 
    fullName: string, 
    phone: string, 
    passwordHash: string,
    notificationPreference: NotificationType = NotificationType.EMAIL
  ): User {
    const now = new Date().toISOString();
    return new User(
      id,
      email,
      fullName,
      phone,
      passwordHash,
      UserRole.CLIENT,
      notificationPreference,
      500000,
      now,
      now,
    );
  }
}
