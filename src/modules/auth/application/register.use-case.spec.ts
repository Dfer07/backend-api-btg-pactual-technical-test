import { RegisterUseCase } from './register.use-case';
import { IUserRepository } from '../../users/domain/user.repository.interface';
import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('RegisterUseCase', () => {
  let registerUseCase: RegisterUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockJwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    mockUserRepository = {
      save: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      updateBalance: jest.fn(),
      updateNotificationPreference: jest.fn(),
      findAll: jest.fn(),
    } as any;

    mockJwtService = {
      sign: jest.fn(),
    } as any;

    registerUseCase = new RegisterUseCase(mockUserRepository, mockJwtService);
  });

  it('debe registrar un usuario exitosamente con saldo inicial de 500,000', async () => {
    const dto = {
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test User',
      phone: '+573001234567',
    };

    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockJwtService.sign.mockReturnValue('mock-token');

    const result = await registerUseCase.execute(dto);

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(dto.email);
    expect(mockUserRepository.save).toHaveBeenCalled();
    const savedUser = mockUserRepository.save.mock.calls[0][0];
    expect(savedUser.email).toBe(dto.email);
    expect(savedUser.balance).toBe(500000); // Regla de negocio
    expect(await bcrypt.compare(dto.password, savedUser.passwordHash)).toBe(true);
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
    expect(result.user.email).toBe(dto.email);
  });

  it('debe lanzar ConflictException si el email ya existe', async () => {
    const dto = {
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test User',
      phone: '+573001234567',
    };

    mockUserRepository.findByEmail.mockResolvedValue({ email: 'test@example.com' } as any);

    await expect(registerUseCase.execute(dto)).rejects.toThrow(ConflictException);
  });
});
