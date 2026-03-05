import { Injectable, Inject } from '@nestjs/common';
import { IFundRepository } from '../domain/fund.repository.interface';

@Injectable()
export class ListFundsUseCase {
  constructor(
    @Inject(IFundRepository)
    private fundRepository: IFundRepository,
  ) {}

  async execute() {
    return this.fundRepository.findAll();
  }
}
