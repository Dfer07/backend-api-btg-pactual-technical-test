import { User } from './user.entity';

export interface IUserRepository {
  save(user: User): Promise<void>;
  findById(userId: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  updateBalance(userId: string, newBalance: number): Promise<void>;
  updateNotificationPreference(userId: string, preference: string): Promise<void>;
  updateRefreshToken(userId: string, hash: string | null): Promise<void>;
  findAll(): Promise<User[]>;
}

export const IUserRepository = Symbol('IUserRepository');
