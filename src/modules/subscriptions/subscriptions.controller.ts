import { Controller, Post, Get, Body, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SubscribeToFundUseCase } from './application/subscribe-to-fund.use-case';
import { CancelSubscriptionUseCase } from './application/cancel-subscription.use-case';
import { ListActiveSubscriptionsUseCase } from './application/list-active-subscriptions.use-case';
import { SubscribeDto, CancelSubscriptionDto } from './dto/subscriptions.dto';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(
    private subscribeToFundUseCase: SubscribeToFundUseCase,
    private cancelSubscriptionUseCase: CancelSubscriptionUseCase,
    private listActiveSubscriptionsUseCase: ListActiveSubscriptionsUseCase,
  ) {}

  @Post('subscribe')
  @HttpCode(HttpStatus.OK)
  async subscribe(@Req() req: any, @Body() dto: SubscribeDto) {
    return this.subscribeToFundUseCase.execute(req.user.userId, dto.fundId);
  }

  @Post('cancel')
  @HttpCode(HttpStatus.OK)
  async cancel(@Req() req: any, @Body() dto: CancelSubscriptionDto) {
    return this.cancelSubscriptionUseCase.execute(req.user.userId, dto.fundId);
  }

  @Get('active')
  async listActive(@Req() req: any) {
    return this.listActiveSubscriptionsUseCase.execute(req.user.userId);
  }
}
