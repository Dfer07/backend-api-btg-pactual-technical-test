import { Injectable, BadRequestException, ConflictException, Inject, NotFoundException } from '@nestjs/common';
import { ISubscriptionRepository } from '../domain/subscription.repository.interface';
import { IUserRepository } from '../../users/domain/user.repository.interface';
import { IFundRepository } from '../../funds/domain/fund.repository.interface';
import { ITransactionRepository } from '../../transactions/domain/transaction.repository.interface';
import { INotificationService } from '../../notifications/domain/notification.service.interface';
import { Subscription } from '../domain/subscription.entity';
import { Transaction } from '../../transactions/domain/transaction.entity';
import { TransactionType } from '../../../common/enums/project.enums';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SubscribeToFundUseCase {
  constructor(
    @Inject(ISubscriptionRepository) private subscriptionRepository: ISubscriptionRepository,
    @Inject(IUserRepository) private userRepository: IUserRepository,
    @Inject(IFundRepository) private fundRepository: IFundRepository,
    @Inject(ITransactionRepository) private transactionRepository: ITransactionRepository,
    @Inject(INotificationService) private notificationService: INotificationService,
  ) {}

  /**
   * Vincula un usuario a un fondo.
   * Regla 1: Saldo suficiente (mínimo del fondo).
   * Regla 2: No suscrito previamente de forma activa.
   * Regla 3: Mensaje error exacto si falta saldo.
   * 
   * @param userId ID del usuario
   * @param fundId ID del fondo
   */
  async execute(userId: string, fundId: string) {
    // 1. Validar fondos
    const fund = await this.fundRepository.findById(fundId);
    if (!fund) throw new NotFoundException('Fondo no encontrado');

    // 2. Validar suscripción activa
    const activeSub = await this.subscriptionRepository.findActiveByUserIdAndFundId(userId, fundId);
    if (activeSub) throw new ConflictException('Ya tienes una suscripción activa a este fondo');

    // 3. Validar saldo
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (user.balance < fund.minimumAmount) {
      throw new BadRequestException(`No tiene saldo disponible para vincularse al fondo ${fund.name}`);
    }

    // 4. Ejecutar negocio
    const newBalance = user.balance - fund.minimumAmount;
    const subscriptionId = uuidv4();
    const transactionId = uuidv4();

    // Crear entidades
    const subscription = Subscription.create(userId, fundId, subscriptionId, fund.minimumAmount);
    const transaction = Transaction.create(
      userId,
      transactionId,
      TransactionType.APERTURA,
      fundId,
      fund.name,
      fund.minimumAmount,
      user.balance,
      newBalance,
    );

    // Persistir (En una implementación real esto debería ser una transacción de DB)
    await this.userRepository.updateBalance(userId, newBalance);
    await this.subscriptionRepository.save(subscription);
    await this.transactionRepository.save(transaction);

    // 5. Notificar y capturar mensaje (para SMS)
    const notificationMessage = await this.notificationService.sendSubscriptionNotification({
      userEmail: user.email,
      userPhone: user.phone,
      userName: user.fullName,
      fundName: fund.name,
      amount: fund.minimumAmount,
      transactionId: transactionId,
      date: new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' }),
    }, user.notificationPreference);

    return {
      message: `Suscripción al fondo ${fund.name} exitosa`,
      subscriptionId,
      transactionId,
      sms: notificationMessage,
    };
  }
}
