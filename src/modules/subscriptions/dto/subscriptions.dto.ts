import { IsNotEmpty, IsString } from 'class-validator';

export class SubscribeDto {
  @IsString({ message: 'ID de fondo inválido' })
  @IsNotEmpty()
  fundId!: string;
}

export class CancelSubscriptionDto {
  @IsString({ message: 'ID de fondo inválido' })
  @IsNotEmpty()
  fundId!: string;
}
