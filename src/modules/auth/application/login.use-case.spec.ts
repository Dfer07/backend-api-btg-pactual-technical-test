import { LoginUseCase } from './login.use-case';
import { IUserRepository } from '../../users/domain/user.repository.interface';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockJwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
    } as any;

    mockJwtService = {
      sign: jest.fn(),
    } as any;

    loginUseCase = new LoginUseCase(mockUserRepository, mockJwtService);
  });

  it('debe autenticar exitosamente con credenciales válidas', async () => {
    const password = 'password123';
    const passwordHash = await bcrypt.hash(password, 12);
    const user = {
      userId: 'uuid',
      email: 'test@example.com',
      passwordHash,
      role: 'CLIENT',
      fullName: 'Test',
      phone: '123',
      balance: 500000,
      notificationPreference: 'EMAIL',
    };

    mockUserRepository.findByEmail.mockResolvedValue(user as any);
    mockJwtService.sign.mockReturnValue('mock-token');

    const result = await loginUseCase.execute({ email: user.email, password });

    expect(result).toHaveProperty('accessToken');
    expect(result.user.email).toBe(user.email);
  });

  it('debe lanzar UnauthorizedException si las credenciales son inválidas', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(loginUseCase.execute({ email: 'wrong@test.com', password: '123' }))
      .rejects.toThrow(UnauthorizedException);
  });
});
