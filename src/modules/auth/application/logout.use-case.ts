import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../../users/domain/user.repository.interface';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(IUserRepository)
    private userRepository: IUserRepository,
  ) {}

  /**
   * Realiza el cierre de sesión invalidando el refresh token en base de datos.
   * 
   * @param userId ID del usuario
   */
  async execute(userId: string) {
    await this.userRepository.updateRefreshToken(userId, null);
    
    return {
      message: 'Cierre de sesión exitoso.',
    };
  }
}
