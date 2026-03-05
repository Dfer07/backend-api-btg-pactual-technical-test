import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { ISubscriptionRepository } from '../domain/subscription.repository.interface';
import { IUserRepository } from '../../users/domain/user.repository.interface';
import { IFundRepository } from '../../funds/domain/fund.repository.interface';
import { ITransactionRepository } from '../../transactions/domain/transaction.repository.interface';
import { INotificationService } from '../../notifications/domain/notification.service.interface';
import { Transaction } from '../../transactions/domain/transaction.entity';
import { TransactionType, SubscriptionStatus } from '../../../common/enums/project.enums';
import { v4 as uuidv4 } from 'uuid';
import { Subscription } from '../domain/subscription.entity';

@Injectable()
export class CancelSubscriptionUseCase {
  constructor(
    @Inject(ISubscriptionRepository) private subscriptionRepository: ISubscriptionRepository,
    @Inject(IUserRepository) private userRepository: IUserRepository,
    @Inject(IFundRepository) private fundRepository: IFundRepository,
    @Inject(ITransactionRepository) private transactionRepository: ITransactionRepository,
    @Inject(INotificationService) private notificationService: INotificationService,
  ) {}

  /**
   * Cancela una suscripción activa y devuelve el monto al saldo del usuario.
   * Regla: Al cancelar se retorna exactamente el monto vinculado.
   * 
   * @param userId ID del usuario
   * @param fundId ID del fondo a cancelar
   */
  async execute(userId: string, fundId: string) {
    // 1. Validar suscripción activa
    const activeSubData = await this.subscriptionRepository.findActiveByUserIdAndFundId(userId, fundId);
    if (!activeSubData) {
      throw new NotFoundException('No tienes una suscripción activa a este fondo');
    }

    // Rehidratar entidad
    const activeSub = new Subscription(
      activeSubData.userId,
      activeSubData.fundId,
      activeSubData.subscriptionId,
      activeSubData.amount,
      activeSubData.status,
      activeSubData.subscribedAt,
      activeSubData.cancelledAt
    );

    // 2. Validar fondo (para nombre desnormalizado) y usuario
    const fund = await this.fundRepository.findById(fundId);
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    // 3. Ejecutar negocio
    const returnedAmount = activeSub.amount;
    const newBalance = user.balance + returnedAmount;
    
    activeSub.cancel();
    
    const transaction = Transaction.create(
      userId,
      uuidv4(),
      TransactionType.CANCELACION,
      fundId,
      fund?.name || 'Fondo desconocido',
      returnedAmount,
      user.balance,
      newBalance,
    );

    // Persistir
    await this.userRepository.updateBalance(userId, newBalance);
    await this.subscriptionRepository.update(activeSub);
    await this.transactionRepository.save(transaction);

    // 4. No se notifica en cancelación por requerimiento
    
    return {
      message: `Cancelación de suscripción al fondo ${fund?.name} exitosa`,
      returnedAmount,
      sms: null,
    };
  }
}
