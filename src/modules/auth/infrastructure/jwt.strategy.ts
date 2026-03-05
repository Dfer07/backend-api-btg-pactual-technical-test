import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { IUserRepository } from '../../users/domain/user.repository.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @Inject(IUserRepository)
    private userRepository: IUserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('app.jwtSecret'),
    });
  }

  async validate(payload: any) {
    const user = await this.userRepository.findById(payload.userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no válido');
    }
    return { 
      userId: user.userId, 
      email: user.email, 
      role: user.role,
      notificationPreference: user.notificationPreference // Necesario para NotificationModule strategy factory
    };
  }
}
