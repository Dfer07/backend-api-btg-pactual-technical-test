import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { GetMeUseCase } from './application/get-me.use-case';
import { UpdateNotificationPreferenceUseCase } from './application/update-notification-preference.use-case';
import { IUserRepository } from './domain/user.repository.interface';
import { DynamoUserRepository } from './infrastructure/dynamo-user.repository';

@Module({
  controllers: [UsersController],
  providers: [
    GetMeUseCase,
    UpdateNotificationPreferenceUseCase,
    {
      provide: IUserRepository,
      useClass: DynamoUserRepository,
    },
  ],
  exports: [IUserRepository],
})
export class UsersModule {}
