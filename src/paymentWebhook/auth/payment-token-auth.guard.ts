import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentTokenAuth implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['x-webhook-token'];
    const validToken = this.configService.get<string>('PAYMENT_AUTH_TOKEN');

    if (token !== validToken) {
      throw new UnauthorizedException('Invalid webhook token');
    }

    return true;
  }
}
