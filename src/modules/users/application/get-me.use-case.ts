import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IUserRepository } from '../domain/user.repository.interface';

@Injectable()
export class GetMeUseCase {
  constructor(
    @Inject(IUserRepository)
    private userRepository: IUserRepository,
  ) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
