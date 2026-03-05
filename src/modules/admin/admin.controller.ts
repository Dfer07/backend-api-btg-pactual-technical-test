import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/project.enums';
import { AdminListUsersUseCase } from './application/admin-list-users.use-case';
import { AdminListTransactionsUseCase } from './application/admin-list-transactions.use-case';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(
    private adminListUsersUseCase: AdminListUsersUseCase,
    private adminListTransactionsUseCase: AdminListTransactionsUseCase,
  ) {}

  @Get('users')
  async listUsers() {
    return this.adminListUsersUseCase.execute();
  }

  @Get('transactions')
  async listTransactions() {
    return this.adminListTransactionsUseCase.execute();
  }
}
