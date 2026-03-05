import { Fund } from './fund.entity';

export interface IFundRepository {
  findAll(): Promise<Fund[]>;
  findById(fundId: string): Promise<Fund | null>;
}

export const IFundRepository = Symbol('IFundRepository');
