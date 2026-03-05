import { Injectable, ConflictException, Inject } from '@nestjs/common';
import { IUserRepository } from '../../users/domain/user.repository.interface';
import { User } from '../../users/domain/user.entity';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(IUserRepository)
    private userRepository: IUserRepository,
    private jwtService: JwtService,
  ) {}

  /**
   * Registra un nuevo usuario tipo CLIENT con saldo inicial de 500,000 COP.
   * Valida que el email no esté en uso.
   * Regla de negocio: Saldo inicial 500k.
   * 
   * @param dto Datos del registro
   * @returns Tokens de acceso y usuario (sin passwordHash)
   * @throws ConflictException si el email ya existe
   */
  async execute(dto: any) {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = User.create(
      uuidv4(),
      dto.email,
      dto.fullName,
      dto.phone,
      passwordHash,
      dto.notificationPreference,
    );

    await this.userRepository.save(user);

    const payload = { userId: user.userId, email: user.email, role: user.role };
    
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }), // Simplificado para la prueba
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
