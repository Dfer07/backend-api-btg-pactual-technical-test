import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../../users/domain/user.repository.interface';

@Injectable()
export class AdminListUsersUseCase {
  constructor(
    @Inject(IUserRepository)
    private userRepository: IUserRepository,
  ) {}

  async execute() {
    const users = await this.userRepository.findAll();
    return users.map(({ passwordHash, ...user }) => user);
  }
}
