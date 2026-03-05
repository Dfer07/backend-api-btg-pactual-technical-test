import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { IUserRepository } from '../../users/domain/user.repository.interface';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(IUserRepository)
    private userRepository: IUserRepository,
    private jwtService: JwtService,
  ) {}

  /**
   * Renueva el accessToken y rota el refreshToken usando un token válido.
   * Valida el hash persistido para evitar ataques de replay.
   * 
   * @param refreshToken Token de refresco
   * @returns Nuevo par de tokens
   */
  async execute(providedRefreshToken: string) {
    try {
      console.log(`[REFRESH] Intentando refrescar token...`);
      const payload = this.jwtService.verify(providedRefreshToken);
      console.log(`[REFRESH] Payload verificado para usuario: ${payload.userId}`);
      
      const user = await this.userRepository.findById(payload.userId);
      
      if (!user) {
        console.log(`[REFRESH] Usuario ${payload.userId} no encontrado`);
        throw new UnauthorizedException('Acceso denegado');
      }

      console.log(`[REFRESH] Hash en DB: ${user.refreshTokenHash ? 'Presente' : 'AUSENTE'}`);

      if (!user.refreshTokenHash) {
        throw new UnauthorizedException('Acceso denegado');
      }

      // Validar contra el hash guardado (pre-hash con SHA256 para bypass bcrypt 72-byte limit)
      const providedSha = crypto.createHash('sha256').update(providedRefreshToken).digest('hex');
      const isValid = await bcrypt.compare(providedSha, user.refreshTokenHash);
      console.log(`[REFRESH] Comparación bcrypt: ${isValid ? 'VÁLIDA' : 'INVÁLIDA'}`);

      if (!isValid) {
        console.log(`[REFRESH] ¡DETECCION DE REUTILIZACION! Invalidando sesión para usuario: ${user.userId}`);
        await this.userRepository.updateRefreshToken(user.userId, null);
        throw new UnauthorizedException('Token de refresco inválido o reutilizado');
      }

      // Generar nuevo par (Rotación de Refresh Token)
      const newPayload = { userId: user.userId, email: user.email, role: user.role };
      const newAccessToken = this.jwtService.sign(newPayload);
      const newRefreshToken = this.jwtService.sign(newPayload, { expiresIn: '7d' });

      // Guardar nuevo hash
      const newRefreshTokenSha = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
      const newHash = await bcrypt.hash(newRefreshTokenSha, 10);
      console.log(`[REFRESH] Guardando nuevo hash para usuario: ${user.userId}`);
      await this.userRepository.updateRefreshToken(user.userId, newHash);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (e) {
      console.error(`[REFRESH ERROR] ${(e as any).message}`);
      if (e instanceof UnauthorizedException) throw e;
      throw new UnauthorizedException('Token de refresco inválido o expirado');
    }
  }
}
