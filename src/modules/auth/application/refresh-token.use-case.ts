import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { IUserRepository } from '../../users/domain/user.repository.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(IUserRepository)
    private userRepository: IUserRepository,
    private jwtService: JwtService,
  ) {}

  /**
   * Renueva el accessToken usando un refreshToken válido.
   * 
   * @param refreshToken Token de refresco
   * @returns Nuevo accessToken
   * @throws UnauthorizedException si el token es inválido o el usuario no existe
   */
  async execute(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.userRepository.findById(payload.userId);
      
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      const newPayload = { userId: user.userId, email: user.email, role: user.role };
      return {
        accessToken: this.jwtService.sign(newPayload),
      };
    } catch (e) {
      throw new UnauthorizedException('Token de refresco inválido o expirado');
    }
  }
}
