import { SubscribeToFundUseCase } from './subscribe-to-fund.use-case';
import { ISubscriptionRepository } from '../domain/subscription.repository.interface';
import { IUserRepository } from '../../users/domain/user.repository.interface';
import { IFundRepository } from '../../funds/domain/fund.repository.interface';
import { ITransactionRepository } from '../../transactions/domain/transaction.repository.interface';
import { INotificationService } from '../../notifications/domain/notification.service.interface';
import { BadRequestException, ConflictException } from '@nestjs/common';

describe('SubscribeToFundUseCase', () => {
  let useCase: SubscribeToFundUseCase;
  let mockSubRepo: any;
  let mockUserRepo: any;
  let mockFundRepo: any;
  let mockTransRepo: any;
  let mockNotifier: any;

  beforeEach(() => {
    mockSubRepo = { save: jest.fn(), findActiveByUserIdAndFundId: jest.fn() };
    mockUserRepo = { findById: jest.fn(), updateBalance: jest.fn() };
    mockFundRepo = { findById: jest.fn() };
    mockTransRepo = { save: jest.fn() };
    mockNotifier = { sendSubscriptionNotification: jest.fn() };

    useCase = new SubscribeToFundUseCase(
      mockSubRepo,
      mockUserRepo,
      mockFundRepo,
      mockTransRepo,
      mockNotifier,
    );
  });

  it('debe suscribirse exitosamente si el usuario tiene saldo suficiente', async () => {
    const userId = 'user-1';
    const fundId = 'fund-1';
    const fund = { fundId, name: 'Test Fund', minimumAmount: 50000 };
    const user = { userId, balance: 100000, fullName: 'Test', email: 't@t.com', phone: '123' };

    mockFundRepo.findById.mockResolvedValue(fund);
    mockUserRepo.findById.mockResolvedValue(user);
    mockSubRepo.findActiveByUserIdAndFundId.mockResolvedValue(null);

    const result = await useCase.execute(userId, fundId);

    expect(mockUserRepo.updateBalance).toHaveBeenCalledWith(userId, 50000);
    expect(mockSubRepo.save).toHaveBeenCalled();
    expect(mockTransRepo.save).toHaveBeenCalled();
    expect(mockNotifier.sendSubscriptionNotification).toHaveBeenCalled();
    expect(result.message).toContain('exitosa');
  });

  it('debe lanzar BadRequestException si el saldo es insuficiente', async () => {
    const userId = 'user-1';
    const fundId = 'fund-1';
    const fund = { fundId, name: 'Expensive Fund', minimumAmount: 75000 };
    const user = { userId, balance: 50000 };

    mockFundRepo.findById.mockResolvedValue(fund);
    mockUserRepo.findById.mockResolvedValue(user);
    mockSubRepo.findActiveByUserIdAndFundId.mockResolvedValue(null);

    await expect(useCase.execute(userId, fundId)).rejects.toThrow(
      'No tiene saldo disponible para vincularse al fondo Expensive Fund'
    );
  });

  it('debe lanzar ConflictException si ya está suscrito', async () => {
    const userId = 'user-1';
    const fundId = 'fund-1';
    mockFundRepo.findById.mockResolvedValue({ fundId, name: 'Test' }); // Mock necesario
    mockSubRepo.findActiveByUserIdAndFundId.mockResolvedValue({ status: 'ACTIVE' });

    await expect(useCase.execute(userId, fundId)).rejects.toThrow(ConflictException);
  });
});
