import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ListFundsUseCase } from './application/list-funds.use-case';

@Controller('funds')
@UseGuards(JwtAuthGuard)
export class FundsController {
  constructor(private listFundsUseCase: ListFundsUseCase) {}

  @Get()
  async findAll() {
    return this.listFundsUseCase.execute();
  }
}
