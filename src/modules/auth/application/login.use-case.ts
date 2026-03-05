import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { IUserRepository } from '../../users/domain/user.repository.interface';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(IUserRepository)
    private userRepository: IUserRepository,
    private jwtService: JwtService,
  ) {}

  /**
   * Autentica un usuario y retorna tokens de acceso.
   * Regla de negocio: Validar credenciales y retornar { accessToken, refreshToken, user }.
   * 
   * @param dto Credenciales (email, password)
   * @returns Tokens y datos del usuario
   * @throws UnauthorizedException si las credenciales son inválidas
   */
  async execute(dto: any) {
    const user = await this.userRepository.findByEmail(dto.email);
    
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { userId: user.userId, email: user.email, role: user.role };
    
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: {
        userId: user.userId,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        balance: user.balance,
        notificationPreference: user.notificationPreference,
      },
    };
  }
}
