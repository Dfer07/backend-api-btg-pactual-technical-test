import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetTransactionHistoryUseCase } from './application/get-transaction-history.use-case';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private getTransactionHistoryUseCase: GetTransactionHistoryUseCase) {}

  @Get('history')
  async getHistory(@Req() req: any) {
    return this.getTransactionHistoryUseCase.execute(req.user.userId);
  }
}
