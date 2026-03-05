import { CancelSubscriptionUseCase } from './cancel-subscription.use-case';
import { NotFoundException } from '@nestjs/common';

describe('CancelSubscriptionUseCase', () => {
  let useCase: CancelSubscriptionUseCase;
  let mockSubRepo: any;
  let mockUserRepo: any;
  let mockFundRepo: any;
  let mockTransRepo: any;
  let mockNotifier: any;

  beforeEach(() => {
    mockSubRepo = { update: jest.fn(), findActiveByUserIdAndFundId: jest.fn() };
    mockUserRepo = { findById: jest.fn(), updateBalance: jest.fn() };
    mockFundRepo = { findById: jest.fn() };
    mockTransRepo = { save: jest.fn() };
    mockNotifier = { sendCancellationNotification: jest.fn() };

    useCase = new CancelSubscriptionUseCase(
      mockSubRepo,
      mockUserRepo,
      mockFundRepo,
      mockTransRepo,
      mockNotifier,
    );
  });

  it('debe cancelar una suscripción exitosamente y devolver el saldo', async () => {
    const userId = 'user-1';
    const fundId = 'fund-1';
    const activeSub = { 
      userId, 
      fundId, 
      amount: 75000, 
      status: 'ACTIVE',
      cancel: jest.fn() 
    };
    const fund = { fundId, name: 'Eco Fund' };
    const user = { userId, balance: 25000, fullName: 'Test', email: 't@t.com', phone: '123' };

    mockSubRepo.findActiveByUserIdAndFundId.mockResolvedValue(activeSub);
    mockFundRepo.findById.mockResolvedValue(fund);
    mockUserRepo.findById.mockResolvedValue(user);

    const result = await useCase.execute(userId, fundId);

    // Verificamos que se haya actualizado con el estado CANCELLED
    expect(mockSubRepo.update).toHaveBeenCalled();
    const updatedSub = mockSubRepo.update.mock.calls[0][0];
    expect(updatedSub.status).toBe('CANCELLED');
    
    expect(mockUserRepo.updateBalance).toHaveBeenCalledWith(userId, 100000);
    expect(mockTransRepo.save).toHaveBeenCalled();
    expect(mockNotifier.sendCancellationNotification).toHaveBeenCalled();
    expect(result.message).toContain('exitosa');
  });

  it('debe lanzar NotFoundException si no hay suscripción activa', async () => {
    mockSubRepo.findActiveByUserIdAndFundId.mockResolvedValue(null);
    await expect(useCase.execute('u1', 'f1')).rejects.toThrow(NotFoundException);
  });
});
