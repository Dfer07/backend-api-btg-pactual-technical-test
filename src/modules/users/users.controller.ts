import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetMeUseCase } from './application/get-me.use-case';
import { UpdateNotificationPreferenceUseCase } from './application/update-notification-preference.use-case';
import { UpdateNotificationPreferenceDto } from './dto/users.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private getMeUseCase: GetMeUseCase,
    private updateNotificationPreferenceUseCase: UpdateNotificationPreferenceUseCase,
  ) {}

  @Get('me')
  async getMe(@Req() req: any) {
    return this.getMeUseCase.execute(req.user.userId);
  }

  @Patch('me/notification-preference')
  async updateNotificationPreference(@Req() req: any, @Body() dto: UpdateNotificationPreferenceDto) {
    return this.updateNotificationPreferenceUseCase.execute(req.user.userId, dto.notificationPreference);
  }
}
